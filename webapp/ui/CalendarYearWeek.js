sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/CalendarDay",
  ],
  function (Control, Day) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.CalendarYearWeek",
      {
        metadata: {
          properties: {
            week: {
              type: "string",
              bindable: true,
            },
            showWeekNumber:{
              type: "string",
              bindable: true,
              defaultValue: false
            },
            days: {
              type: "object",
              bindable: true,
            },
          },
          aggregations: {
            cells: {
              type: "com.thy.ux.annualleaveplanning.ui.CalendarDay",
              multiple: true,
            },
          },
          events: {},
        },
        renderer: function (oRM, oControl) {
          var days = oControl.getDays();
          var w = oControl.getWeek();
          
          oRM.openStart("div", oControl); //Main
          oRM.class("spp-calendar-week");
          oRM.attr("data-week", w);
          oRM.openEnd();

          if(oControl.getShowWeekNumber()){
            //--Week Number
            oRM.openStart("button");
            oRM.class("spp-week-number-cell");
            oRM.openEnd();
            oRM.text(w);
            oRM.close("button");
            //--Week Number
          }

          $.each(days, function (i, d) {
            var y = new Day({
              day: d,
            });
            oControl.addAggregation("cells", y);
            oRM.renderControl(y);
          });

          oRM.close("div");
        },
      }
    );
  }
);
