sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.CalendarDayInner",
    {
      metadata: {
        properties: {
          day: {
            type: "string",
            bindable: true,
          },
          datePicker:{
            type: "boolean",
            bindable: true,
            defaultValue: false
          }
        },
        aggregations: {},
        events: {},
      },
      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Main
        oRM.class(oControl.getDatePicker() ? "spp-datepicker-cell-inner" : "spp-calendar-cell-inner");
        oRM.openEnd();

        oRM.text( oControl.getDay());
        oRM.close("div");
      },
    }
  );
});
