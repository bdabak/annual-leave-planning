sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.PageSidebar", {
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
      var bHidden = oControl.getHidden();
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
        .class("spp-panel-has-datepicker")
        .class("spp-sidebar-left")
        .class("spp-panel-collapse-left")
        .class("spp-first-visible-child");

      if (sap.ui.Device.system.desktop) {
        oRM.class("spp-panel-collapsible-inline").class("spp-responsive-large");
        if (bHidden) {
          oRM.class("spp-collapsed");
        } else {
          oRM.class("spp-expanded");
        }
      } else if (sap.ui.Device.system.tablet) {
        oRM
          .class("spp-panel-collapsible-overlay")
          .class("spp-collapsed")
          .class("spp-responsive-medium");
        if (!bHidden) {
          oRM.class("spp-panel-overlay-revealed");
        }
        oRM.style("clip-path", "inset(0px -244.5px 0px 0px)");
      } else if (sap.ui.Device.system.phone) {
        oRM
          .class("spp-panel-collapsible-overlay")
          .class("spp-collapsed")
          .class("spp-responsive-small");
        if (!bHidden) {
          oRM.class("spp-panel-overlay-revealed");
        }
        oRM.style("clip-path", "inset(0px -244.5px 0px 0px)");
      }

      oRM.openEnd();

      //--Mobil or tablet
      if (!sap.ui.Device.system.desktop) {
        oRM
          .openStart("div")
          .class("spp-panel-overlay-header-top")
          .class("spp-panel-overlay-left")
          .class("spp-vbox")
          .class("spp-panel-overlay")
          .class("spp-box-center")
          .class("spp-panel-collapse-size-locker")
          .style("width", "231px")
          .style("height", "0px")
          .style("min-height", "100%")
          .openEnd();
      }

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
        .style("overflow-y", "auto")
        .openEnd();
      $.each(oControl.getItems(), function (i, l) {
        oRM.renderControl(l);
      });
      oRM.close("div");
      //--Side bar content--//

      oRM.close("div"); //Side bar body wrap
      //--Side bar body wrap--//

      if (!sap.ui.Device.system.desktop) {
        oRM.close("div"); //Side Bar
      }

      oRM.close("div"); //Side Bar
    },
    toggleState: function () {
      var bHidden = this.getHidden();
      if (!sap.ui.Device.system.desktop) {
        if(bHidden){
          this.$().addClass("spp-panel-overlay-revealed");
        }else{
          this.$().removeClass("spp-panel-overlay-revealed");
        }
      }else{
        if(bHidden){
          this.$().removeClass("spp-collapsed").addClass("spp-expanded");
        }else{
          this.$()
          .removeClass("spp-expanded")
          .addClass("spp-collapsed"); 
        }
      }
      this.setProperty("hidden", !bHidden, true);
    },
  });
});
