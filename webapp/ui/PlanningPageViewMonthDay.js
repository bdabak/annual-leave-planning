sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageViewMonthDay",
    {
      metadata: {
        properties: {
          day: {
            type: "object",
            bindable: true,
          },
        },
        aggregations: {},
        events: {},
      },
      renderer: function (oRM, oControl) {
        var e = oControl.getDay();
        oRM.openStart("div"); // Day
        oRM.writeControlData(oControl);
        oRM
          // .class("spp-day-name")
          .class("spp-calendar-cell")
          .class("spp-cal-empty-cell")
          .class(e.dayOfWeek > 4 ? "spp-weekend" : "spp-weekday")
          .class(e.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day")
          .class("spp-day-of-week-" + e.dayOfWeek);
        if (!e.sameMonth) {
          oRM.class("spp-other-month");
        }
        if (e.sameMonth && e.isToday) {
          oRM.class("spp-today");
        }
        if (e.dayOfWeek === "0") {
          oRM.class("spp-first-visible-cell");
        }
        oRM.attr("data-date", e.date);
        oRM.openEnd();

        oRM.openStart("div"); // Day cell header
        oRM.class("spp-cal-cell-header");
        oRM.openEnd();

        if (e.dayOfWeek === "0") {
          oRM.openStart("div");
          oRM.class("spp-week-num");
          oRM.openEnd();
          oRM.text(e.week);
          oRM.close("div");
        }

        oRM.openStart("div"); // Day name
        oRM.class("spp-day-name").class("spp-day-num");
        oRM.openEnd();
        oRM.text(e.day);
        oRM.close("div"); // Day name

        oRM.close("div"); // Day cell header

        oRM.openStart("div"); // Cal event container
        oRM.class("spp-cal-event-bar-container");
        oRM.openEnd();
        oRM.close("div"); // // Cal event container

        oRM.close("div"); // Day
      },
    }
  );
});
