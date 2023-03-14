/*global Swal*/
sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (Control, dateUtilities, eventUtilities) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.PageViewAgenda", {
      metadata: {
        properties: {
          period: {
            type: "object",
            bindable: true,
          },
          emptyText:{
            type: "string",
            bindable: true,
            defaultValue: ""
          }
        },
        aggregations: {},
        events: {},
      },

      init: function () {},

      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Main
        oRM.class("spp-grid-panel-body");
        oRM.attr("role", "grid");
        oRM.openEnd();

        //--Header--//
        oControl.renderHeader(oRM);
        //--Header--//

        //--Body--//
        oControl.renderBody(oRM, oControl);
        //--Body--//

        oRM.close("div");
      },

      renderHeader: function (oRM) {
        oRM.openStart("header"); //Header
        oRM.class("spp-grid-header-container").class("spp-hidden");
        oRM.attr("role", "row");
        oRM.openEnd();

        oRM.openStart("div");
        oRM.class("spp-yscroll-pad");
        oRM.attr("role", "presentation");
        oRM.openEnd();
        oRM.openStart("div");
        oRM.class("spp-yscroll-pad-sizer");
        oRM.attr("role", "presentation");
        oRM.openEnd();
        oRM.close("div");
        oRM.close("div");

        oRM.close("header"); //Header
      },
      renderBody: function (oRM, oControl) {
        oRM
          .openStart("div") //Body
          .class("spp-grid-body-container")
          .class("spp-widget-scroller")
          .class("spp-resize-monitored")
          .class("spp-vertical-overflow");
        oRM.attr("role", "presentation");
        oRM.openEnd();

        oRM
          .openStart("div")
          .class("spp-grid-vertical-scroller")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-ltr")
          .class("spp-single-child")
          .class("spp-resize-monitored")
          .style("--event-row-spacing", "8px")
          .style("height", "1600px") //TODO - Calculate
          .attr("role", "presentation");
        oRM.openEnd();

        oRM
          .openStart("div")
          .class("spp-grid-subgrid")
          .class("spp-grid-subgrid-normal")
          .class("spp-widget")
          .class("spp-subgrid")
          .class("spp-resize-monitored")
          .class("spp-ltr")
          .class("spp-widget-scroller")
          .class("spp-hide-scroll")
          .class("spp-first-visible-child")
          .class("spp-last-visible-child");
        oRM.openEnd();

        //--Empty content text--//
        oRM
        .openStart("div")
        .class("spp-empty-text")
        .openEnd();
        oRM.text(oControl.getEmptyText());
        oRM.close("div");
        //--Empty content text--//

        oRM.close("div");
        oRM.close("div");
        oRM.close("div"); //Body
      },
    });
  }
);
