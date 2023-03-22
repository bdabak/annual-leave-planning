sap.ui.define(
  ["sap/ui/core/Control"],
  function (Control) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.DialogContent", {
      metadata: {
        properties: {},
        aggregations: {
          content: {
            type: "sap.ui.core.Control",
            multiple: false,
          },
        },
        events: {
          closed: {},
        },
      },
      init: function () {},
      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl);
        oRM
          .class("spp-hbox")
          .class("spp-box-center")
          .class("spp-panel-body-wrap")
          .class("spp-overflowpopup-body-wrap");
        oRM.openEnd();

        //-Wrapper-//
        oRM.openStart("div");
        oRM
          .class("spp-panel-content")
          .class("spp-popup-content")
          .class("spp-overflowpopup-content")
          .class("spp-box-center")
          .class("spp-vbox")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-single-child")
          .class("spp-widget-scroller")
          .class("spp-resize-monitored")
          .class("spp-flex-column")
          .class("spp-draggable")
          .style("overflow-y","auto")
          .openEnd();

        //--Content--//
        oRM.renderControl(oControl.getAggregation("content"));
        //--Content--//

        oRM.close("div");
        //-Wrapper-//

        oRM.close("div"); //Main
      },
    });
  }
);
