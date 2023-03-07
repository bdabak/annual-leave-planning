sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageMenuItem",
    {
      metadata: {
        properties: {
          key: {
            type: "string",
            bindable: true,
          },
          value: {
            type: "string",
            bindable: true,
          },
          selected: {
            type: "boolean",
            bindable: true,
          },
          firstChild:{
            type: "boolean",
            bindable: true,
            defaultValue: false
          },
          lastChild:{
            type: "boolean",
            bindable: true,
            defaultValue: false
          }
        },
        aggregations: {},
        events: {},
      },
      renderer: function (oRM, oControl) {
        var bSelected = oControl.getSelected();
        oRM.openStart("div", oControl); //Menu Item
        oRM
          .class("spp-widget")
          .class("spp-menuitem");
        
        if(oControl.getFirstChild()){
          oRM.class("spp-first-visible-child");
        }
        if(oControl.getLastChild()){
          oRM.class("spp-last-visible-child");
        }
          
        oRM.attr("role", "menuitemcheckbox");
        oRM.openEnd("div");

        oRM.openStart("i"); // Icon
        oRM.class("spp-menuitem-icon").class("spp-fw-icon");

        oRM.class(
          bSelected ? "spp-icon-radio-checked" : "spp-icon-radio-unchecked"
        );
        oRM.openEnd();
        oRM.close("i"); // Menu body wrapper
        oRM.openStart("span"); // Icon
        oRM.class("spp-menu-text");
        oRM.attr("role", "presentation");
        oRM.openEnd();
        oRM.text(oControl.getValue());
        oRM.close("span"); // Menu

        

        oRM.close("div"); // Menu Item
      },

      ontap: function () {
        this.getParent().setSelectedItem(this);
      },
    }
  );
});
