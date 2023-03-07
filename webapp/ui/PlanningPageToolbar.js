sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageToolbar",
    {
      metadata: {
        properties: {},
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
        oRM.openStart("div", oControl); //Toolbar
        oRM
          .class("spp-box-center")
          .class("spp-toolbar-content")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-hbox")
          .class("spp-overflow");
        oRM.openEnd();

        $.each(oControl.getItems(), function (i, c) {
          oRM.renderControl(c);
        });

        oRM.close("div"); //Toolbar
      },
    }
  );
});
