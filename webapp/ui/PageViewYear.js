/*global Swal*/
sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/CalendarYearMonth",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
    "com/thy/ux/annualleaveplanning/utils/sweetalert",
  ],
  function (Control, YearMonth, dateUtilities, eventUtilities, SwalJS) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.PageViewYear", {
      metadata: {
        properties: {
          year: {
            type: "int",
            bindable: true,
          },
          entitlementDate: {
            type: "object",
            bindable: "true",
          },
        },
        aggregations: {
          months: {
            type: "com.thy.ux.annualleaveplanning.ui.CalendarYearMonth",
            multiple: true,
            singularName: "month",
          },
        },
        events: {},
      },

      init: function () {
        //--Register event
        eventUtilities.subscribeEvent(
          "PlanningCalendar",
          "CreateEventCancelled",
          this._handleCreateEventCancelled,
          this
        );
        //--Register event
      },

      renderer: function (oRM, oControl) {
        var eD = oControl.getEntitlementDate();
        var m = moment(eD);
        var l = m.clone();
        oRM.openStart("div", oControl); //Main
        oRM
          .class("spp-panel-content")
          .class("spp-view")
          .class("spp-eventrenderer-content")
          .class("spp-responsive-content")
          .class("spp-calendarmixin-content")
          .class("spp-daycellcollecter-content")
          .class("spp-daycellrenderer-content")
          .class("spp-yearview-content")
          .class("spp-box-center")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-ltr")
          .class("spp-show-events-heatmap")
          .class("spp-no-visible-children")
          .class("spp-widget-scroller")
          .class("spp-resize-monitored")
          .class("spp-draggable")
          .class("spp-droppable");

        oRM.style("overflow-y", "auto");
        oRM.openEnd();

        var aMonths = [];
        l.year(oControl.getYear());
        var monthCount = 12;
        if (l.format("D") !== "1") {
          monthCount = 13;
        }
        for (var m = 1; m <= monthCount; m++) {
          var oMonth = new YearMonth({
            year: l.format("YYYY"),
            month: l.format("M"),
          });
          aMonths.push(oMonth);
          oRM.renderControl(oMonth);
          oControl.addAggregation("months", oMonth);
          l.add(1, "M");
        }

        oRM.close("div");
      },
      ontouchstart: function (e) {
        if (e.which == 2 || e.which == 3) {
          this._refreshCellStates();
          return;
        }
        this._refreshCellStates();
        e.preventDefault();
        var t = $(e.target);
        if (
          t &&
          t.hasClass("spp-calendar-cell-inner") &&
          !t.hasClass("spp-other-month")
        ) {
          var s = t
            .parent(".spp-calendar-cell.spp-cal-empty-cell")
            .not(".spp-past-date");

          if (!s.length > 0) {
            this._refreshCellStates();
            return;
          }

          if (!this._touchEndProxy) {
            this._touchEndProxy = $.proxy(this._ontouchend, this);
          }
          if (!this._touchMoveProxy) {
            this._touchMoveProxy = $.proxy(this._ontouchmove, this);
          }

          e.setMarked();

          // The if (Device.support.touch) is removed and both mouse and touch events are supported always
          if (!this._dragStarted) {
            this._dragStarted = true;
            $(document).on(
              "touchend.spp-calendar-cell touchcancel.spp-calendar-cell mouseup.spp-calendar-cell",
              this._touchEndProxy
            );
            $(document).on(
              "touchmove.spp-calendar-cell mousemove.spp-calendar-cell",
              this._touchMoveProxy
            );
          }

          s.addClass("spp-editing");
        }
      },
      _ontouchmove: function (e) {
        if (e.isMarked("delayedMouseEvent")) {
          return;
        }

        e.preventDefault();
        var t = $(e.target);

        if (t && t.hasClass("spp-calendar-cell-inner")) {
          if (!this._dragStarted) {
            this._refreshCellStates();
            return;
          }

          if (this._currentElementId === t.attr("id")) {
            return;
          }

          this._currentElementId = _.clone(t.attr("id"));

          var b = $(".spp-editing");
          var s = t.parent(".spp-calendar-cell");

          var p = this.$();
          if (!p.length > 0) {
            this._refreshCellStates();
            return;
          }
          p.addClass("spp-draggable-active").addClass("spp-draggable-started");

          $(".spp-calendar-cell").removeClass("spp-cal-tentative-event");

          var dates =
            dateUtilities.findDatesBetweenTwoDates(
              b.data("date"),
              s.data("date")
            ) || [];

          if (dates.length === 0) {
            this._refreshCellStates();
            return;
          }

          dates.forEach(function (n) {
            $(`.spp-calendar-cell[data-date='${n}']`).addClass(
              "spp-cal-tentative-event"
            );
          });
        } else {
          return;
        }
      },
      _ontouchend: function (e) {
        if (e.isMarked("delayedMouseEvent")) {
          return;
        }
        e.preventDefault();

        //Unbind events
        this._unbindTouchEvents();

        if (!this._dragStarted) {
          this._refreshCellStates();
          return;
        }

        var p = this.$();
        if (!p.length > 0) {
          this._refreshCellStates();
          return;
        }
        p.removeClass("spp-draggable-active").removeClass(
          "spp-draggable-started"
        );

        $(".spp-cal-tentative-event")
          // .not(".spp-other-month")
          .addClass("spp-create-event-active");
          // .addClass("spp-create-event-active");
        $(".spp-cal-tentative-event").removeClass("spp-cal-tentative-event");

        var b = $(".spp-editing");
        if (!b.length > 0) {
          this._refreshCellStates();
          return;
        }
        var d = $(".spp-day-name.spp-create-event-active");
        // var d = $(".spp-datepicker-1-to-3-events");

        if (d && d?.length > 1) {
          var startDate = d.first().data("date");
          var endDate = d.last().data("date");
          eventUtilities.publishEvent("PlanningCalendar", "CreateEvent", {
            Element: b,
            Period: {
              StartDate: startDate,
              EndDate: endDate,
            },
          });
        } else {
          this._refreshCellStates();
        }
      },
      _refreshCellStates: function () {
        this._dragStarted = false;
        $(".spp-calendar-cell")
          .removeClass("spp-editing")
          .removeClass("spp-cal-tentative-event")
          .removeClass("spp-create-event-active")
          .removeClass("spp-datepicker-1-to-3-events");
        this._unbindTouchEvents();
      },
      _unbindTouchEvents: function () {
        $(document).off(
          "touchend.spp-calendar-cell touchcancel.spp-calendar-cell mouseup.spp-calendar-cell",
          this._touchEndProxy
        );
        $(document).off(
          "touchmove.spp-calendar-cell mousemove.spp-calendar-cell",
          this._touchMoveProxy
        );
      },

      _handleCreateEventCancelled: function (e,o,p) {
        this._refreshCellStates();
        if(p.showAlert){
        Swal.fire({
          position: "bottom",
          icon: "info",
          title: "İşlem iptal edildi",
          showConfirmButton: false,
          toast: true,
          timer: 2000,  
        });
      }
      },
    });
  }
);
