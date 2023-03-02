sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageContent",
    {
      metadata: {
        properties: {
          planningMode: {
            type: "string",
            bindable: true,
            defaultValue: "Y",
          },
        },
        aggregations: {
          sidebar: {
            type: "com.thy.ux.annualleaveplanning.ui.PlanningPageSidebar",
            multiple: false,
          },
          viewContainer: {
            type: "com.thy.ux.annualleaveplanning.ui.PlanningPageViewContainer",
            multiple: false,
          },
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        oRM.openStart("div"); //Main
        oRM.writeControlData(oControl);
        oRM
          .class("spp-panel-content")
          .class("spp-responsive-content")
          .class("spp-calendar-content")
          .class("spp-box-center")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-flex-row");

        oRM.style("padding", "0px");
        oRM.style("flex-flow", "row nowrap");
        oRM.openEnd();

        //--Sidebar
        oRM.renderControl(oControl.getSidebar());
        //--Sidebar

        //--View Container
        oRM.renderControl(oControl.getViewContainer());
        //--View Container

        oRM.close("div"); //Main
      },
    }
  );
});
