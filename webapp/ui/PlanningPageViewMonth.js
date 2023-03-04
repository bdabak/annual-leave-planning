sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageViewMonthWeek",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
    "com/thy/ux/annualleaveplanning/utils/lodash",
  ],
  function (Control, MonthWeek, dateUtilities, eventUtilities, lodashJS) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PlanningPageViewMonth",
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
          },
          aggregations: {
            weeks: {
              type: "com.thy.ux.annualleaveplanning.ui.PlanningPageViewMonthWeek",
              multiple: true,
              singularName: "week",
            },
          },
          events: {},
        },

        init: function () {
          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "PeriodChanged",
            this.onPeriodChanged,
            this
          );
        },

        onPeriodChanged: function (c, e, o) {
          var p = o.period;
          if (
            this.getYear() === parseInt(p.year, 10) &&
            this.getMonth() === parseInt(p.month, 10)
          ) {
            return;
          }
          var y = parseInt(p.year, 10);
          var m = parseInt(p.month, 10);
          if (y) {
            this.setProperty("year", y, true);
          }
          if (m) {
            this.setProperty("month", m, false);
          }
        },

        renderer: function (oRM, oControl) {
          oRM.openStart("div"); //Month View
          oRM.writeControlData(oControl);
          oRM
            .class("spp-widget")
            .class("spp-container")
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
          oControl.renderWeeks(oRM, oControl);
          //--Render calendar days

          oRM.close("div"); ////Month View Content
          oRM.close("div"); // Month View Body Wrapper
          oRM.close("div"); //Month View
        },

        renderWeeks: function (oRM, oControl) {
          var m = dateUtilities.getMonthData(
            oControl.getYear(),
            oControl.getMonth()
          );

          oRM
            .openStart("div")
            .class("spp-weeks-container")
            .class("notranslate")
            .class("spp-draggable")
            .class("spp-droppable");
          oRM.openEnd();
          $.each(m.weeks, function (i, w) {
            var d = _.filter(m.days, { week: w });

            var y = new MonthWeek({
              week: w,
              year: oControl.getYear(),
              days: d,
            });

            oControl.addAggregation("weeks", y);
            oRM.renderControl(y);
          });
          oRM.close("div");
        },

        renderWeekDays: function (oRM) {
          oRM.openStart("div"); //Row
          oRM.class("spp-calendar-row").class("spp-calendar-weekdays");
          oRM.openEnd();

          //--Week number cell
          oRM.openStart("div"); //Row
          oRM.class("spp-week-number-cell");
          oRM.openEnd();
          oRM.close("div"); // Row
          //--Week number cell

          for (var i = 1; i < 8; i++) {
            oRM.openStart("div");
            oRM.class("spp-calendar-day-header");
            if (i > 5) {
              oRM.class("spp-weekend");
              oRM.class("spp-nonworking-day");
            }
            oRM.openEnd();
            oRM.text(moment().day(i).format("ddd"));
            oRM.close("div");
          }

          //--Scroll sizer
          oRM.openStart("div").class("spp-yscroll-pad").openEnd(); //Scroll sizer
          oRM
            .openStart("div")
            .class("spp-yscroll-pad-sizer")
            .openEnd()
            .close("div"); // Scroll pad sizer
          oRM.close("div"); // Scroll sizer
          //--Scroll sizer

          oRM.close("div"); // Row
        },
      }
    );
  }
);
