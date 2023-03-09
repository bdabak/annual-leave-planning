sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.EventEditor",
    {
      metadata: {
        properties: {},
        aggregations: {
          items: {
            type: "sap.ui.core.Control",
            multiple: true,
          },
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
          .class("spp-vbox")
          .class("spp-box-center")
          .class("spp-panel-body-wrap")
          .class("spp-eventeditor-body-wrap");
        oRM.openEnd();

        //--Panel content-//
        oRM.openStart("div"); //Main
        oRM
          .class("spp-panel-content")
          .class("spp-popup-content")
          .class("spp-eventeditor-content")
          .class("spp-box-center")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-widget-scroller")
          .class("spp-resize-monitored")
          .class("spp-flex-row");
        oRM.style("overflow-y", "auto");
        oRM.openEnd();
        $.each(oControl.getItems(), function (i, c) {
          oRM.renderControl(c);
        });
        oRM.close("div");
        //--Panel content-//
        //--Panel toolbar wrapper-//
        oRM.openStart("div"); //Toolbar
        oRM
          .class("spp-widget")
          .class("spp-container")
          .class("spp-toolbar")
          .class("spp-dock-bottom")
          .class("spp-bottom-toolbar")
          .class("spp-hbox")
          .class("spp-resize-monitored");
        oRM.openEnd();
        oRM.renderControl(oControl.getToolbar());
        oRM.close("div"); //Toolbar
        //--Panel toolbar wrapper-//

        oRM.close("div"); //Main
      },
    }
  );
});
