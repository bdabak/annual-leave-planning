sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.CalendarWeekdaysRow",
    {
      metadata: {
        properties: {
          dayFormat: {
            type: "string",
            bindable: true,
            defaultValue: "dd"
          },
        },
        aggregations: {
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        oRM
          .openStart("div", oControl) //Row
          .class("spp-calendar-row")
          .class("spp-calendar-weekdays")
          .openEnd();

        //--Week number cell
        oRM
          .openStart("div") //Row
          .class("spp-week-number-cell")
          .openEnd();
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
          oRM.text(moment().day(i).format(oControl.getDayFormat()));
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
});
