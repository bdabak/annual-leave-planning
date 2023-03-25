sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.SplitRow", {
    metadata: {
      properties: {
        title: {
          type: "string",
          bindable: true,
        },
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
      oRM.close("div");
    },
  });
});
