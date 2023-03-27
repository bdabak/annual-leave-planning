sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.WizardIndicatorContainer",
    {
      metadata: {
        properties: {
        },
        aggregations: {
          indicators: {
            type: "com.thy.ux.annualleaveplanning.ui.WizardIndicator",
            multiple: true,
            singularName: "indicator",
          },
        },
        events: {},
      },
      init: function () {},
      renderer: function (oRM, oControl) {
        oRM
          .openStart("div", oControl) //--Indicator container
          .class("spp-wizard-indicator-container")
          .openEnd();
        $.each(oControl.getIndicators(), function (i, e) {
          oRM.renderControl(e);
        });
        oRM.close("div"); //--Indicator container
      },
    }
  );
});
