sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageFormLabel",
    {
      metadata: {
        properties: {
            text: {
                type: "string",
                bindable: true
            },
            for: {
                type: "string",
                bindable: true
            }
        },
        aggregations: {
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        oRM.openStart("label", oControl); //Main
        oRM
          .class("spp-label")
          .class("spp-align-start");
        oRM.attr("for", oControl.getFor());
        oRM.openEnd();
        oRM.text(oControl.getText());
        oRM.close("label"); //Main
      },
    }
  );
});
