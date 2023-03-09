sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.Toolbar",
    {
      metadata: {
        properties: {
          hasWrapper: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          hasOverflow: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          datePicker: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          }
        },
        aggregations: {
          items: {
            type: "sap.ui.core.Control",
            multiple: true,
            singularName: "item",
          },
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        var bHasWrapper = oControl.getHasWrapper();
        oRM
          .openStart("div", oControl) //Toolbar
          .class("spp-box-center")
          .class("spp-toolbar-content")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-hbox");
          if(oControl.getHasOverflow()){
            oRM.class("spp-overflow");
          }
        oRM.openEnd();

        if (bHasWrapper) {
          oRM
            .openStart("div") //Toolbar wrapper
            .class("spp-box-center")
            .class("spp-toolbar-content")
            .class("spp-content-element")
            .class("spp-auto-container")
            .class("spp-hbox")
            .openEnd();
        }
        $.each(oControl.getItems(), function (i, c) {
          oRM.renderControl(c);
        });
        if (bHasWrapper) {
          oRM.close("div"); //Toolbar wrapper
        }

        oRM.close("div"); //Toolbar
      },
    }
  );
});
