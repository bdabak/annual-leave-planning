sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/CalendarMonthDay",
    "com/thy/ux/annualleaveplanning/ui/CalendarDay",
  ],
  function (Control, MonthDay, Day) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.CalendarWeek", {
      metadata: {
        properties: {
          year: {
            type: "string",
            bindable: true,
          },
          week: {
            type: "string",
            bindable: true,
          },
          days: {
            type: "object",
            bindable: true,
          },
          mode: {
            type: "string",
            bindable: true,
            //Y,M: Year, Month
          },
          datePicker: {
            type: "boolean",
            bindable: true,
            defaultValue: "false"
          },
          selectedDate:{
            type: "string",
            bindable: true,
          }
        },
        aggregations: {
          cells: {
            type: "sap.ui.core.Control",
            multiple: true,
          },
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        var days = oControl.getDays();
        var w = oControl.getWeek();
        var y = oControl.getYear();
        var m = oControl.getMode();
        var dP = oControl.getDatePicker();
        var s = oControl.getSelectedDate();

        oRM.openStart("div", oControl); //Main
        oRM.class("spp-calendar-row");
        oRM.class("spp-calendar-week");
        oRM.attr("data-week", y + "," + w);
        oRM.openEnd();

        //--Week Number
        oRM.openStart("div");
        oRM.class("spp-week-number-cell");
        oRM.openEnd();
        oRM.text(w);
        oRM.close("div");
        //--Week Number

        oRM.openStart("div");
        oRM.class("spp-calendar-days");
        oRM.openEnd();

        $.each(days, function (i, d) {
          if (m === "M") {
            var y = new MonthDay({
              day: d,
            });
          } else {
            var y = new Day({
              day: d,
              datePicker: dP,
              selectedDate: s
            });
          }
          oControl.addAggregation("cells", y);
          oRM.renderControl(y);
        });

        oRM.close("div");
        oRM.close("div");
      },
    });
  }
);
