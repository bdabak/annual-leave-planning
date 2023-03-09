sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.CalendarYearDayInner",
    {
      metadata: {
        properties: {
          day: {
            type: "string",
            bindable: true,
          },
        },
        aggregations: {},
        events: {},
      },
      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Main
        oRM.class("spp-calendar-cell-inner");
        oRM.openEnd();
        oRM.text(oControl.getDay());
        oRM.close("div");
      },
    }
  );
});
