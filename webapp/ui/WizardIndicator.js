sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.WizardIndicator", {
    metadata: {
      properties: {
        active: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
      },
      aggregations: {},
      events: {},
    },
    init: function () {},
    renderer: function (oRM, oControl) {
      oRM
        .openStart("span", oControl) //--Indicator item
        .class("spp-wizard-indicator");
      oControl.getActive() ? oRM.class("active") : null;
      oRM.openEnd().close("span"); //--Indicator item
    },
  });
});
