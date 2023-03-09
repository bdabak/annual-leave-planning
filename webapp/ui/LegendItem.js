sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.LegendItem",
    {
      metadata: {
        properties: {
          color: {
            type: "string",
            bindable: true,
          },
          text: {
            type: "string",
            bindable: true,
            defaultValue: ""
          },
        },
        aggregations: {},
        events: {},
      },
      renderer: function (oRM, oControl) {
        var c = oControl.getColor();
        var l = oControl.getText();
        oRM.openStart("li", oControl); //Item
        oRM.class("spp-list-item");
        oRM.attr("role", "option");
        oRM.openEnd();
        //--Item content--//
        oRM.openStart("div"); //Item
        oRM.class("spp-icon");
        c ? oRM.class(c) : null;
        oRM.attr("role", "option");
        oRM.openEnd();
        oRM.close("div"); //Item
        //--Item content--//
        //--Item text--//
        oRM.text(l);
        //--Item text--//
        oRM.close("li"); //Item
      },
    }
  );
});
