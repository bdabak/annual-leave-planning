sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageSidebar",
    {
      metadata: {
        properties: {
          hidden: {
            type: "boolean",
            bindable: true,
            defaultValue: true,
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
      renderer: function (oRM, oControl) {
        oRM.openStart("div"); //Side Bar
        oRM.writeControlData(oControl);
        oRM
          .class("spp-widget")
          .class("spp-container")
          .class("spp-panel")
          .class("spp-responsive")
          .class("spp-sidebar")
          .class("spp-panel-has-bottom-toolbar")
          .class("spp-panel-collapsible-inline")
          .class("spp-vbox")
          .class("spp-panel-collapsible")
          .class("spp-panel-has-tools")
          // .class("spp-has-datepicker")
          .class("spp-sidebar-left")
          .class("spp-panel-collapse-left")
          .class("spp-first-visible-child")
          .class("spp-responsive-large");
        if (oControl.getHidden()) {
          oRM.class("spp-collapsed");
        } else {
          oRM.class("spp-expanded");
        }
        oRM.openEnd();

        oRM.openStart("div"); //Side Bar Content
        oRM
          .class("spp-vbox")
          .class("spp-box-center")
          .class("spp-panel-body-wrap")
          .class("spp-sidebar-body-wrap");
        oRM.openEnd();
        oRM.text("Sidebar...");

        oRM.close("div"); //Side Bar Content

        oRM.close("div"); //Side Bar
      },
      toggleState: function () {
        if(this.$().hasClass("spp-collapsed")){
          this.$().removeClass("spp-collapsed").addClass("spp-expanded");
          this.setProperty("hidden", false, false);
        }else{
          this.$().removeClass("spp-expanded").addClass("spp-collapsed");
          this.setProperty("hidden", true, false);
        }
      },
    }
  );
});
