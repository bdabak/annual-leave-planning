sap.ui.define(
  ["sap/ui/core/Control", "com/thy/ux/annualleaveplanning/ui/FormFieldTrigger"],
  function (Control, FieldTrigger) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.FormComboBox", {
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
          type: {
            type: "string",
            bindable: true,
            defaultValue: "text",
          },
          name: {
            type: "string",
            bindable: true,
          },
          autoComplete: {
            type: "string",
            bindable: true,
            defaultValue: "off",
          },
          placeHolder: {
            type: "string",
            bindable: true,
            defaultValue: "",
          },
          role: {
            type: "string",
            bindable: true,
            defaultValue: "combobox",
          },
          icon: {
            type: "string",
            bindable: true,
            defaultValue: null,
          },
          expanded: {
            type: "boolean",
            bindable: false,
            defaultValue: false,
          },
        },
        aggregations: {
          comboTrigger: {
            type: "com.thy.ux.annualleaveplanning.ui.FormFieldTrigger",
            multiple: false,
          },
          comboPicker: {
            type: "com.thy.ux.annualleaveplanning.ui.PickerListWidget",
            multiple: false,
          },
        },
        events: {
         
        },
      },
      init: function () {
        var cT = new FieldTrigger({
          icon: "spp-icon-picker",
          alignEnd: true,
          press: this.togglePicker.bind(this),
        });
        this.setAggregation("comboTrigger", cT);
      },

      togglePicker: function () {
        var e = this.getExpanded();
        if (!e) {
          this.getComboPicker().open(this);
          this.setProperty("expanded", true, true);
          this.getParent().setProperty("opened", true);
        } else {
          this.getComboPicker().close();
          this.setProperty("expanded", false, true);
          this.getParent().setProperty("opened", false);
        }
      },

      renderer: function (oRM, oControl) {
        var bIcon = oControl.getIcon();
        var k = oControl.getKey() || "";
        var v = oControl.getValue() || "";
        oRM.openStart("div", oControl);
        oRM.class("spp-field-inner");
        oRM.openEnd();

        //--Icon--//
        if (bIcon && bIcon !== "") {
          oRM.openStart("div");
          oRM
            .class("spp-icon")
            .class("spp-resource-icon")
            .class("spp-icon-square")
            .class(bIcon);
          oRM.attr("role", "presentation");
          oRM.openEnd();
          oRM.close("div");
        }
        //--Icon--//

        //--Input--//
        oRM.openStart("input");
        oRM.attr("type", oControl.getType());
        oRM.attr("name", oControl.getName());
        oRM.attr("autocomplete", oControl.getAutoComplete());
        oRM.attr("placeholder", oControl.getPlaceHolder());
        oRM.attr("role", "combobox");
        oRM.attr("aria-haspopup", "listbox");
        oRM.attr("aria-autocomplete", "list");
        oRM.attr("data-key", k);
        oRM.attr("data-value", v);
        oRM.attr("value", v);
        oRM.openEnd();
        oRM.close("input");
        //--Input--//

        //--Trigger--//
        oRM.renderControl(oControl.getAggregation("comboTrigger"));
        //--Trigger--//

        //--ComboList--//
        oRM.renderControl(oControl.getAggregation("comboPicker"));
        //--ComobList--//

        oRM.close("div"); //Main
      },

      setSelected: function(k,v, i){
        this.setKey(k);
        this.setValue(v);
        this.setIcon(i);

        this.getComboPicker().close();
        this.setProperty("expanded", false, true);
        this.getParent().setProperty("opened", false);
      },

      onfocusin:function(){
        var e = this.getExpanded();
        if (!e) {
          this.getComboPicker().open(this);
          this.setProperty("expanded", true, true);
          this.getParent().setProperty("opened", true);
        }
      },
      onfocusout:function(){
        var e = this.getExpanded();
        // if (e){
        //   this.getComboPicker().close();
        //   this.setProperty("expanded", false, true);
        //   this.getParent().setProperty("opened", false);
        // }
      }
    });
  }
);
