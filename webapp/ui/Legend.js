sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.Legend",
    {
      metadata: {
        properties: {},
        aggregations: {
          items: {
            type: "com.thy.ux.annualleaveplanning.ui.LegendItem",
            multiple: true,
            singularName: "item",
          },
        },
        events: {
          legendSelectionChanged: {

          }
        },
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

          oRM
          // .style("flex", "1 1 auto")
             .style("min-height","110px")
             .style("overflow","hidden auto");


        oRM.openEnd();
        $.each(oControl.getItems(), function(i,l){
            oRM.renderControl(l);
        });
        oRM.close("ul"); //Main
      },
    }
  );
});
