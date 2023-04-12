sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.PageFooter", {
    metadata: {
      properties: {
        active: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
      },
      aggregations: {
        buttons: {
          type: "com.thy.ux.annualleaveplanning.ui.Button",
          multiple: true,
          singularName: false,
        },
      },
      events: {},
    },
    /**
     * @override
     */

    renderer: function (oRM, oControl) {
      var buttons = oControl.getButtons();
      var bActive = oControl.getActive();

      oRM.openStart("div", oControl); //Main
      oRM
        .class("spp-page-footer")
        .class(bActive ? "spp-page-footer-active" : "spp-page-footer-hidden");
      oRM.openEnd();

      oRM.openStart("span").openEnd().close("span"); //Invisible element
      oRM.openStart("div").class("spp-page-footer-buttons").openEnd();
      $.each(buttons, function (i, b) {
        oRM.renderControl(b);
      });
      oRM.close("div");

      oRM.close("div"); //Main
    },
  });
});
