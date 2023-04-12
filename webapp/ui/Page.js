sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/sweetalert",
  ],
  function (Control, dateUtilities, SwalJS) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.Page", {
      metadata: {
        properties: {
          mode: {
            type: "string",
            bindable: true,
            defaultValue: "Y",
          },
          tabIndex: {
            type: "string",
            bindable: true,
            defaultValue: "0",
          },
          period: {
            type: "object",
            bindable: true,
          },
        },
        aggregations: {
          header: {
            type: "com.thy.ux.annualleaveplanning.ui.PageHeader",
            multiple: false,
          },
          content: {
            type: "com.thy.ux.annualleaveplanning.ui.PageContent",
            multiple: false,
          },
          footer: {
            type: "com.thy.ux.annualleaveplanning.ui.PageFooter",
            multiple: false,
          },
          modal: {
            type: "com.thy.ux.annualleaveplanning.ui.Modal",
            multiple: false,
          },
        },
        events: {},
      },
      /**
       * Events
       */
      init: function () {
        var sLibraryPath = jQuery.sap.getModulePath(
          "com.thy.ux.annualleaveplanning"
        ); //get the server location of the ui library
        jQuery.sap.includeStyleSheet(
          sLibraryPath + "/ui/css/ThemeMaterial.css"
          // sLibraryPath + "/ui/css/ThemeIstanbul.css"
        );

        jQuery.sap.includeStyleSheet(sLibraryPath + "/ui/css/Animate.css");

        //--Initialize moment locale
        dateUtilities.initializeMoment();
      },

      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Control
        oRM.class("spp"); //smod-planning-page
        oRM.openEnd();

        oRM.openStart("div"); //Main Page
        oRM.class("spp-page");
        oRM.openEnd();

        oRM.openStart("div"); //Container
        oRM
          .class("spp-widget")
          .class("spp-container")
          .class("spp-panel")
          .class("spp-responsive")
          .class("spp-calendar")
          .class("spp-touch")
          .class("spp-panel-has-top-toolbar")
          .class("spp-vbox")
          .class("spp-calendar-nav-toolbar")
          .class("spp-outer")
          .class("spp-touch-events")
          .class("spp-overlay-scrollbar")
          .class("spp-cal-day")
          .class("spp-cal-week")
          .class("spp-cal-month")
          .class("spp-cal-year")
          .class("spp-cal-agenda")
          .class("spp-calendardrag")
          .class("spp-eventedit")
          .class("spp-eventtooltip")
          .class("spp-legacy-inset")
          .class("spp-resize-monitored");

        if (sap.ui.Device.system.phone) {
          oRM.class("spp-responsive-small");
        } else if (sap.ui.Device.system.tablet) {
          oRM.class("spp-responsive-medium");
        } else if (sap.ui.Device.system.desktop) {
          oRM.class("spp-responsive-large");
        }

        if (sap.ui.Device.browser.safari) {
          oRM.class("spp-safari");
        } else if (sap.ui.Device.browser.chrome) {
          oRM.class("spp-chrome");
        } else if (sap.ui.Device.browser.firefox) {
          oRM.class("spp-firefox");
        }

        oRM.openEnd();

        oRM.openStart("div"); //Panel
        oRM
          .class("spp-vbox")
          .class("spp-box-center")
          .class("spp-panel-body-wrap")
          .class("spp-calendar-body-wrap");
        oRM.openEnd();

        //--RenderHeader
        oRM.renderControl(oControl.getAggregation("header"));
        //--RenderHeader

        //--RenderContent
        oRM.renderControl(oControl.getAggregation("content"));
        //--RenderContent

        //--RenderContent
        if (oControl.getAggregation("footer")) {
          oRM.renderControl(oControl.getAggregation("footer"));
        }
        //--RenderContent

        oRM.close("div"); //Panel

        oRM.close("div"); //Container

        oRM.close("div"); //Main Page

        oRM.renderControl(oControl.getAggregation("modal"));

        oRM.close("div"); //Control
      },
    });
  }
);
