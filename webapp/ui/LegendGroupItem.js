sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.LegendGroupItem", {
    metadata: {
      properties: {
        color: {
          type: "string",
          bindable: true,
        },
        text: {
          type: "string",
          bindable: true,
          defaultValue: "",
        },
        selected: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        partial: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        items: {
          type: "object",
          bindable: true,
          defaultValue: [],
        },
        expanded: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
      },
      aggregations: {
        legend: {
          type: "com.thy.ux.annualleaveplanning.ui.Legend",
          multiple: false,
        },
      },
      events: {},
    },
    renderer: function (oRM, oControl) {
      var c = oControl.getColor();
      var l = oControl.getText();
      var p = oControl.getPartial();
      var items = oControl.getItems();
      var legend = oControl.getLegend();
      var e = oControl.getExpanded();
      oRM.openStart("li", oControl); //Item
      oRM
        .class("spp-list-item")
        .class("spp-list-item-col")
        .class("spp-group-list-item");
      if (oControl.getSelected()) {
        oRM.class("spp-selected");

        oRM.class(p ? "spp-selected-partial" : "spp-selected-full");
      }
      oRM.attr("role", "option");
      oRM.openEnd();
      //--Item content--//
      oRM.openStart("div").class("spp-list-item-header").openEnd();

      oRM.openStart("div").class("spp-list-item-header-title").openEnd();
      //Item Icon
      oRM.openStart("div"); 
      oRM.class("spp-selected-icon");
      oRM.class("spp-icon");
      c ? oRM.class(c) : null;
      oRM.attr("role", "option");
      oRM.openEnd();
      oRM.close("div"); 
      //Item Icon
      //--Item text--//
      oRM.text(l);
      //--Item text--//
      oRM.close("div"); 

      //--Item content--//
      if (items.length > 1) {
        oRM
          .openStart("span") //Item
          .class("spp-list-caret")
          .class("spp-fa")
          // .class(e ? "spp-fa-square-caret-up" : "spp-fa-square-caret-down")
          .class(e ? "spp-fa-chevron-up" : "spp-fa-chevron-down")
          .openEnd()
          .close("span");
      }

      oRM.close("div");

      //--Sub Item--//
      if (items.length > 1 && e) {
        oRM.renderControl(legend);
      }
      //--Sub Item--//

      oRM.close("li"); //Item
    },

    setItemsSelection: function () {
      // var l = this.getLegend();
      // var s = l.getItems();
      var s = this.getItems();
      var u = 0;

      if (s.length > 1) {
        $.each(s, function (i, e) {
          if (!e.Selected) {
            u++;
          }
        });
        if (u === 0) {
          this.setProperty("partial", false, false);
          this.setSelected(true);
        } else if (u === s.length) {
          this.setProperty("partial", false, false);
          this.setSelected(false);
        } else {
          this.setProperty("partial", true, false);
          this.setSelected(true);
        }
      }
    },

    setSubItems: function (state) {
      var s = this.getLegend().getItems();
      $.each(s, function (i, e) {
        e.setSelected(state);
      });
    },

    ontap: function (e) {
      e.stopPropagation();

      if (
        $(e.target).hasClass("spp-list-item-header-title") ||
        $(e.target).hasClass("spp-icon")
      ) {
        var p = this.getProperty("partial");
        var s = this.getProperty("selected");
        if (s) {
          if (p) {
            this.setPartial(false);
            this.setSelected(true);
          } else {
            this.setPartial(false);
            this.setSelected(false);
          }
        } else {
          this.setSelected(true);
        }

        this.setSubItems(this.getSelected());
        this.getParent().fireLegendSelectionChanged();
      }

      if ($(e.target).hasClass("spp-list-caret")) {
        var e = this.getExpanded();
        this.setExpanded(!e);
      }
    },
  });
});
