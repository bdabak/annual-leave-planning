sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PickerListWidgetItem",
    {
      metadata: {
        properties: {
          icon: {
            type: "string",
            bindable: true,
          },
          key: {
            type: "string",
            bindable: true,
            defaultValue: "",
          },
          value: {
            type: "string",
            bindable: true,
            defaultValue: "",
          },
          selected: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
        },
        aggregations: {},
        events: {},
      },

      renderer: function (oRM, oControl) {
        var c = oControl.getIcon() || null;
        var k = oControl.getKey();
        var v = oControl.getValue();
        var s = oControl.getSelected() || false;
        oRM.openStart("li", oControl); //Item
        oRM.class("spp-list-item");
        if (s) {
          oRM.class("spp-selected");
        }
        oRM.attr("data-key", k);
        oRM.attr("data-value", v);
        oRM.attr("role", "option");
        oRM.openEnd();
        //--Item content--//
        if (c) {
          oRM.openStart("div"); //Item
          oRM.class("spp-icon");
          oRM.class("spp-icon-square");
          c ? oRM.class(c) : null;
          oRM.openEnd();
          oRM.close("div"); //Item
        }
        //--Item content--//
        //--Item text--//
        oRM.text(v);
        //--Item text--//
        oRM.close("li"); //Item
      },

      ontap: function (e) {
        if (
          $(e.target).hasClass("spp-list-item") ||
          $(e.target).hasClass("spp-icon")
        ) {
          // this.setSelected(true);
          this.getParent().itemSelected(this);
        }
      },
      onmouseover: function(){
        this.$().addClass("spp-active");
      },
      onmouseout: function(){
        this.$().removeClass("spp-active");
      }
    }
  );
});
