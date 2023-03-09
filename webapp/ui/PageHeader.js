sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PageHeader",
    {
      metadata: {
        properties: {},
        aggregations: {
          toolbar: {
            type: "com.thy.ux.annualleaveplanning.ui.Toolbar",
            multiple: false,
          },
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Main
        oRM
          .class("spp-widget")
          .class("spp-container")
          .class("spp-toolbar")
          .class("spp-touch")
          .class("spp-calendar-toolbar")
          .class("spp-dock-top")
          .class("spp-top-toolbar")
          .class("spp-hbox")
          .class("spp-resize-monitored");
        oRM.openEnd();

        oRM.renderControl(oControl.getToolbar());
        oRM.close("div"); //Main
      },
    }
  );
});
