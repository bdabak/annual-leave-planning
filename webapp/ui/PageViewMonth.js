sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/CalendarWeekdaysRow",
    "com/thy/ux/annualleaveplanning/ui/CalendarWeeks",
    "com/thy/ux/annualleaveplanning/ui/CalendarWeek",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
    "com/thy/ux/annualleaveplanning/utils/lodash",
  ],
  function (Control, WeekdaysRow, Weeks, MonthWeek, dateUtilities, eventUtilities, lodashJS) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PageViewMonth",
      {
        metadata: {
          properties: {
            year: {
              type: "int",
              bindable: true,
            },
            month: {
              type: "int",
              bindable: true,
            },
            rerender: {
              type: "string",
              bindable: true,
            }
          },
          aggregations: {
            // weeks: {
            //   type: "com.thy.ux.annualleaveplanning.ui.CalendarWeek",
            //   multiple: true,
            //   singularName: "week",
            // },
            _weeks:{
              type: "com.thy.ux.annualleaveplanning.ui.CalendarWeeks",
              multiple: false,
            },
            _weekdaysRow:{
              type: "com.thy.ux.annualleaveplanning.ui.CalendarWeekdaysRow",
              multiple: false,
            }
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

          var wR = new WeekdaysRow({
            dayFormat: "ddd"
          });
          this.setAggregation("_weekdaysRow", wR);

          var wL = new Weeks({
            draggable: true,
            mode: "M"
          });
          this.setAggregation("_weeks", wL);
        },

        renderer: function (oRM, oControl) {
          oRM.openStart("div", oControl); //Month
          oRM
            .class("spp-widget")
            .class("spp-container")
            .class("spp-view")
            .class("spp-panel")
            .class("spp-calendarpanel")
            .class("spp-eventrenderer")
            .class("spp-responsive")
            .class("spp-calendarmixin")
            .class("spp-daycellcollecter")
            .class("spp-daycellrenderer")
            .class("spp-monthview")
            .class("spp-vbox")
            .class("spp-ltr")
            .class("spp-card-item")
            .class("spp-resize-monitored")
            .class("spp-first-visible-child")
            .class("spp-last-visible-child");

          if (sap.ui.Device.system.phone) {
            oRM.class("spp-responsive-small");
          } else if (sap.ui.Device.system.tablet) {
            oRM.class("spp-responsive-medium");
          } else if (sap.ui.Device.system.desktop) {
            oRM.class("spp-responsive-large");
          }

          oRM.style("--event-height", "20px");
          oRM.style("--arrow-width", "calc(var(--event-height) / 3)");
          oRM.style("--arrow-margin", "calc(var(--event-height) / -3)");
          oRM.style("--week-length", "7");
          oRM.style("min-height", "485px)");

          oRM.openEnd();
          oRM.openStart("div"); //Month View Body Wrapper
          oRM
            .class("spp-hbox")
            .class("spp-box-center")
            .class("spp-panel-body-wrap")
            .class("spp-monthview-body-wrap");
          oRM.openEnd();
          oRM.openStart("div"); //Month View Content
          oRM
            .class("spp-panel-content")
            .class("spp-calendarpanel-content")
            .class("spp-eventrenderer-content")
            .class("spp-responsive-content")
            .class("spp-calendarmixin-content")
            .class("spp-daycellcollecter-content")
            .class("spp-daycellrenderer-content")
            .class("spp-monthview-content")
            .class("spp-box-center")
            .class("spp-content-element")
            .class("spp-auto-container")
            .class("spp-ltr")
            .class("spp-no-visible-children")
            .class("spp-flex-column");
          oRM.openEnd();

          //--Weekdays
          oControl.renderWeekDays(oRM);
          //--Weekdays

          //--Render calendar days
          oControl.renderWeeks(oRM);
          //--Render calendar days

          oRM.close("div"); ////Month View Content
          oRM.close("div"); // Month View Body Wrapper
          oRM.close("div"); //Month View
        },


        renderWeekDays: function (oRM) {
          var wR = this.getAggregation("_weekdaysRow");
          oRM.renderControl(wR);
        },  
        // renderWeekDays_: function (oRM) {
        //   oRM.openStart("div"); //Row
        //   oRM.class("spp-calendar-row").class("spp-calendar-weekdays");
        //   oRM.openEnd();

        //   //--Week number cell
        //   oRM.openStart("div"); //Row
        //   oRM.class("spp-week-number-cell");
        //   oRM.openEnd();
        //   oRM.close("div"); // Row
        //   //--Week number cell

        //   for (var i = 1; i < 8; i++) {
        //     oRM.openStart("div");
        //     oRM.class("spp-calendar-day-header");
        //     if (i > 5) {
        //       oRM.class("spp-weekend");
        //       oRM.class("spp-nonworking-day");
        //     }
        //     oRM.openEnd();
        //     oRM.text(moment().day(i).format("ddd"));
        //     oRM.close("div");
        //   }

        //   //--Scroll sizer
        //   oRM.openStart("div").class("spp-yscroll-pad").openEnd(); //Scroll sizer
        //   oRM
        //     .openStart("div")
        //     .class("spp-yscroll-pad-sizer")
        //     .openEnd()
        //     .close("div"); // Scroll pad sizer
        //   oRM.close("div"); // Scroll sizer
        //   //--Scroll sizer

        //   oRM.close("div"); // Row
        // },
        
        renderWeeks: function (oRM) {
          var oControl = this;
          var m = dateUtilities.getMonthData(
            oControl.getYear(),
            oControl.getMonth()
          );
          var wL = oControl.getAggregation("_weeks");
          wL.destroyAggregation("items");
          wL.setMonth(_.cloneDeep(m));
          oRM.renderControl(wL);
        },
        // renderWeeks_: function (oRM) {
        //   var oControl = this;
        //   var m = dateUtilities.getMonthData(
        //     oControl.getYear(),
        //     oControl.getMonth()
        //   );

        //   oRM
        //     .openStart("div")
        //     .class("spp-weeks-container")
        //     .class("notranslate")
        //     .class("spp-draggable")
        //     .class("spp-droppable");
        //   oRM.openEnd();
        //   $.each(m.weeks, function (i, w) {
        //     var d = _.filter(m.days, { week: w });

        //     var y = new MonthWeek({
        //       week: w,
        //       year: oControl.getYear(),
        //       days: d,
        //     });

        //     oControl.addAggregation("weeks", y);
        //     oRM.renderControl(y);
        //   });
        //   oRM.close("div");
        // },
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
            t.hasClass("spp-cal-event-bar-container") &&
            !t.hasClass("spp-other-month")
          ) {
           
            var n = t.parents(".spp-past-date");
            if(n.length>0){
              this._refreshCellStates();
              return;
            }

            var s = t.parents(".spp-weeks-container");

            if (s.length === 0) {
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
                "touchend.spp-cal-event-bar-container touchcancel.spp-cal-event-bar-container mouseup.spp-cal-event-bar-container",
                this._touchEndProxy
              );
              $(document).on(
                "touchmove.spp-cal-event-bar-container mousemove.spp-cal-event-bar-container",
                this._touchMoveProxy
              );
            }

            s.addClass("spp-draggable-active").addClass(
              "spp-draggable-started"
            );

            var c = t.parents(".spp-calendar-cell");

            c.addClass("spp-editing").addClass("spp-editing-start");
          }
        },
        _ontouchmove: function (e) {
          if (e.isMarked("delayedMouseEvent")) {
            return;
          }

          e.preventDefault();
          var t = $(e.target);

          if (t && t.hasClass("spp-cal-event-bar-container")) {
            if (!this._dragStarted) {
              this._refreshCellStates();
              return;
            }

            if (this._currentElementId === t.attr("id")) {
              return;
            }

            this._currentElementId = _.clone(t.attr("id"));

            var b = $(".spp-editing-start");
            $(".spp-editing-end")
              .removeClass("spp-editing")
              .removeClass("spp-editing-end");

            var s = t.parents(".spp-calendar-cell");
            s.addClass("spp-editing").addClass("spp-editing-end");

            // console.log(this._currentElementId);
            // console.log(t.attr("id"));

            var dates =
              dateUtilities.findDatesBetweenTwoDates(
                b.data("date"),
                s.data("date")
              ) || [];

            if (dates.length === 0) {
              this._refreshCellStates();
              return;
            }

            this._createCalendarEvent(dates);
          } else {
            return;
          }
        },

        _createCalendarEvent: function (dates) {
          var t = this.$();
          $.each(dates, function (i, d) {
            var c = t
              .find(`.spp-calendar-cell[data-date="${d}"]`)
              .first()
              .control();
            if (c[0]) {
              c[0].createEvent(d, dates);
            }
          });
        },

        _ontouchend: function (e) {
          if (e.isMarked("delayedMouseEvent")) {
            return;
          }
          e.preventDefault();
          var b = $(".spp-editing-start");
          var s = $(".spp-editing-end");
          var r = $(".spp-editing-start").find(".spp-is-creating").first();

          var dates =
            dateUtilities.findDatesBetweenTwoDates(
              b.data("date"),
              s.data("date")
            ) || [];

          if (dates.length === 0) {
            this._refreshCellStates();
            return;
          }

          eventUtilities.publishEvent("PlanningCalendar", "CreateEvent", {
            Element: r,
            Period: {
              StartDate: b.data("date"),
              EndDate: s.data("date"),
            },
          });

          //Unbind events
          this._unbindTouchEvents();

          if (!this._dragStarted) {
            this._refreshCellStates();
            return;
          }

          $(".spp-draggable-active, .spp-draggable-started").removeClass(
            "spp-draggable-active spp-draggable-started"
          );
        },

        _refreshCellStates: function () {
          $(".spp-is-creating").each(function (i, e) {
            var c = $(e).control();
            if (c && c.length > 0) {
              try{
                c[0].destroy();
              }catch(x){
                
              }
            }
          });
          this._currentElementId = null;
          this._dragStarted = false;
          $(".spp-calendar-cell")
            .removeClass("spp-editing")
            .removeClass("spp-editing-start")
            .removeClass("spp-editing-end");
          $(".spp-draggable-active, .spp-draggable-started").removeClass(
            "spp-draggable-active spp-draggable-started"
          );
          this._unbindTouchEvents();
        },
        _unbindTouchEvents: function () {
          $(document).off(
            "touchend.spp-cal-event-bar-container touchcancel.spp-cal-event-bar-container mouseup.spp-cal-event-bar-container",
            this._touchEndProxy
          );
          $(document).off(
            "touchmove.spp-cal-event-bar-container mousemove.spp-cal-event-bar-container",
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
      }
    );
  }
);
