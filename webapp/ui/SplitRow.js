sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.SplitRow", {
    metadata: {
      properties: {
        title: {
          type: "string",
          bindable: true,
        },
        watermark:{
          type: "boolean",
          bindable: true,
          defaultValue: false
        }
      },
      aggregations: {
        content: {
          type: "sap.ui.core.Control",
          multiple: true,
        },
      },
      events: {},
    },
    renderer: function (oRM, oControl) {
      oRM.openStart("div", oControl).class("spp-split-row").openEnd();
      oRM.openStart("div").class("spp-split-row-title").openEnd();
      oRM.text(oControl.getTitle());
      oRM.close("div");
      oRM.openStart("div").class("spp-split-row-content").openEnd();
      $.each(oControl.getContent(), function (i, c) {
        oRM.renderControl(c);
      });
      oRM.close("div");
      if(oControl.getWatermark()){
        oRM.openStart("div")
           .class("spp-split-row-watermark")
           .openEnd()
           .openStart("i")
           .class("spp-icon")
           .class("spp-fa-trash-can")
           .openEnd()
           .close("i")
           .close("div");
      }
      oRM.close("div");
    },
  });
});
