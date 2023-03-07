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
          items: {
            type: "sap.ui.core.Control",
            multiple: true,
            singularName: "item",
          },
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Sidebar
        oRM
          .class("spp-widget")
          .class("spp-container")
          .class("spp-panel")
          .class("spp-responsive")
          .class("spp-sidebar")
          .class("spp-panel-has-bottom-toolbar")
          .class("spp-vbox")
          .class("spp-panel-collapsible")
          .class("spp-panel-has-tools")
          .class("spp-sidebar-left")
          .class("spp-panel-collapse-left")
          .class("spp-first-visible-child");

        if (sap.ui.Device.system.desktop) {
          oRM
            .class("spp-panel-collapsible-inline")
            .class("spp-responsive-large");
        } else if (sap.ui.Device.system.tablet) {
          oRM
            .class("spp-panel-collapsible-overlay")
            .class("spp-collapsed")
            .class("spp-responsive-medium");
        } else if (sap.ui.Device.system.phone) {
          oRM
            .class("spp-panel-collapsible-overlay")
            .class("spp-collapsed")
            .class("spp-responsive-small");
          oRM.style("clip-path", "inset(0px -244.5px 0px 0px)");
        }

        if (oControl.getHidden()) {
          oRM.class("spp-collapsed");
        } else {
          oRM.class("spp-expanded");
        }
        oRM.openEnd();

        //--Side bar body wrap--//
        oRM
          .openStart("div")
          .class("spp-vbox")
          .class("spp-box-center")
          .class("spp-panel-body-wrap")
          .class("spp-sidebar-body-wrap")
          .openEnd(); // Side bar body wrap

        //--Side bar content--//
        oRM
          .openStart("div")
          .class("spp-panel-content")
          .class("spp-responsive-content")
          .class("spp-sidebar-content")
          .class("spp-box-center")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-widget-scroller")
          .class("spp-resize-monitored")
          .class("spp-flex-column")
          .openEnd();
        $.each(oControl.getItems(), function (i, l) {
          oRM.renderControl(l);
        });
        oRM.close("div");
        //--Side bar content--//

        oRM.close("div"); //Side bar body wrap
        //--Side bar body wrap--//

        oRM.close("div"); //Side Bar
      },
      toggleState: function () {
        if (this.$().hasClass("spp-collapsed")) {
          this.$().removeClass("spp-collapsed").addClass("spp-expanded");
          this.setProperty("hidden", false, false);
          if (this.$().hasClass("spp-panel-collapsible-overlay")) {
            this.$().addClass("spp-overlay-revealed");
          }
        } else {
          this.$()
            .removeClass("spp-expanded")
            .removeClass("spp-overlay-revealed")
            .addClass("spp-collapsed");
          this.setProperty("hidden", true, false);
        }
      },
    }
  );
});
