/*global Swal*/

sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/CalendarYearDayInner",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
    "com/thy/ux/annualleaveplanning/utils/sweetalert",
  ],
  function (Control, Day, dateUtilities, eventUtilities, SwalJS) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.CalendarYearDay",
      {
        metadata: {
          properties: {
            day: {
              type: "object",
              bindable: true,
            },
            enabled: {
              type: "boolean",
              bindable: true,
              defaultValue: true,
            },
          },
          aggregations: {
            _cell: {
              type: "com.thy.ux.annualleaveplanning.ui.CalendarYearDayInner",
              multiple: false,
            },
          },
          events: {},
        },
        init: function () {
          var c = new Day();
          this.setAggregation("_cell", c);
        },
        renderer: function (oRM, oControl) {
          var e = oControl.getDay();
          var c = oControl.getAggregation("_cell").setDay(e.day);
          oRM.openStart("div", oControl); //Main
          oRM
            .class("spp-day-name")
            .class("spp-calendar-cell")

            .class("spp-day-of-week-" + e.dayOfWeek);
          if (!e.sameMonth) {
            oRM.class("spp-other-month");
          }

          if (e.sameMonth && e.isToday) {
            oRM.class("spp-today");
          }

          var s = oControl._getDayClass(e.date);

          if (s) {
            oRM.class(s);
          } else {
            oRM
              .class("spp-cal-empty-cell")
              .class(e.dayOfWeek > 4 ? "spp-weekend" : "spp-weekday")
              .class(
                e.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day"
              );
          }

          oRM.attr("data-date", e.date);
          oRM.openEnd();
          oRM.renderControl(c);
          oRM.close("div");
        },
        _getViewComponent: function () {
          var p = this.getParent()?.getParent()?.getParent();

          return (p && p.$()) || null;
        },
        _getDayClass: function (d) {
          var h = dateUtilities.checkDateHoliday(d);

          if (!h) {
            return null;
          }

          if (h.type === "1") {
            return "spp-holiday-all-day";
          }
          if (h.type === "2") {
            return "spp-holiday-half-day";
          }
        },
        ontap: function () {
          var d = this.getDay().date;
          var a = dateUtilities.getDayAttributes(d) || null;
          if(!a){
            return;
          }
          eventUtilities.publishEvent(
            "PlanningCalendar",
            "DisplayEventWidget",
            {
              element: this.$(),
              day: a,
            }
          );
        },
      }
    );
  }
);
