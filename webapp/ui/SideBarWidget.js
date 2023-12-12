/*global tippy */

sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.SideBarWidget", {
    metadata: {
      properties: {
        title: {
          type: "string",
          bindable: true,
        },
        icon: {
          type: "string",
          bindable: true,
          defaultValue: null,
        },
      },
      aggregations: {
        content: {
          type: "sap.ui.core.Control",
          multiple: false,
        },
      },
      events: {},
    },
    init: function () {
      var sLibraryPath = jQuery.sap.getModulePath(
        "com.thy.ux.annualleaveplanning"
      ); //get the server location of the ui library
      jQuery.sap.includeStyleSheet(sLibraryPath + "/ui/css/SideBarWidget.css");
    },
    renderer: function (oRM, oControl) {
      var sIcon = oControl.getIcon();
      var sTitle = oControl.getTitle();

      oRM
        .openStart("div", oControl) //--Main
        .class("spp-side-bar-widget")
        .openEnd();

      //--Title
      if (sTitle) {
        oRM
          .openStart("div") //--Wrapper
          .class("spp-side-bar-widget-title")
          .openEnd();

        if (sIcon) {
          oRM
            .openStart("i")
            .class("spp-icon")
            .class(sIcon)
            .openEnd()
            .close("i");
        }
        oRM.text(sTitle).close("div");
      }

      //--Content
      oRM
          .openStart("div") //--Wrapper
          .class("spp-side-bar-widget-content")
          .openEnd()
          .renderControl(oControl.getContent())
          .close("div"); //--Content

      oRM.close("div"); //--Main
    },
  });
});
