sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageLegend",
    {
      metadata: {
        properties: {},
        aggregations: {
          items: {
            type: "com.thy.ux.annualleaveplanning.ui.PlanningPageLegendItem",
            multiple: true,
            singularName: "item",
          },
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        oRM.openStart("ul", oControl); //Main
        oRM
          .class("spp-widget")
          .class("spp-list")
          .class("spp-resourcefilter")
          .class("spp-multiselect")
          .class("spp-last-visible-child")
          .class("spp-widget-scroller")
          .class("spp-resize-monitored");
        oRM.openEnd();
        $.each(oControl.getItems(), function(i,l){
            oRM.renderControl(l);
        });
        oRM.close("ul"); //Main
      },
    }
  );
});
