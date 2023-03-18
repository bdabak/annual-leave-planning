sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.PickerListWidget", {
    metadata: {
      properties: {
        multiselect: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        elementPosition: {
          type: "object",
          bindable: true,
          defaultValue: null,
        },
        visible: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
      },
      aggregations: {
        items: {
          type: "com.thy.ux.annualleaveplanning.ui.PickerListWidgetItem",
          multiple: true,
          singularName: "item",
        },
      },
      events: {
        select: {
          item: {
            type: "com.thy.ux.annualleaveplanning.ui.PickerListWidgetItem",
          },
        },
      },
    },
    onAfterRendering: function () {
      Control.prototype.onAfterRendering.apply(this, arguments);

      var oEP = this.getElementPosition() || null;

      if (!oEP) {
        return;
      }

      var t = this.$();
      var eO = t.offset();
      var eOH = t.outerHeight();
      var eOW = t.outerWidth();
      var cW = $(window);
      var x, y, w;
      var alignment;

      //   var tH = oEP.offset.top;
      //   var bH = cW.height() - (oEP.offset.top + oEP.outerHeight);

      //   if (tH > bH) {
      //     y = oEP.offset.top - eOH - 10;
      //     alignment = "spp-aligned-above";
      //   } else {
      //     alignment = "spp-aligned-below";
      y = oEP.outerHeight + 2;
      w = oEP.outerWidth;

      //   }

      //   var fX = oEP.offset.left + eOW;

      //   if (fX > cW.width()) {
      //     x = oEP.offset.left - (fX - cW.width());
      //   } else {
      //     x = oEP.offset.left;
      //   }

      var s = `max-height: 324px; hidden auto; min-height: 0px; transform: matrix(1, 0, 0, 1, 0, ${y}); width: ${w}px`;

      //max-height: 324px; overflow: ;
      // var s = `transform: translate(${x}px, ${y}px);`;

      t.removeAttr("style").attr("style", s);

      this.addStyleClass("spp-animate-fly-down");
    },
    open: function (e) {
      var s = $(e.getDomRef());

      var oEP = {
        offset: s.offset(),
        outerHeight: s.outerHeight(),
        outerWidth: s.outerWidth(),
      };

      this.setProperty("elementPosition", oEP, true);

      this.setVisible(true);
    },
    close: function () {
      this.setVisible(false);
      this.removeStyleClass("spp-animate-fly-down");
    },
    renderer: function (oRM, oControl) {
      var bMulti = oControl.getMultiselect();
      var bVis = oControl.getVisible() || false;
      oRM.openStart("ul", oControl); //Main
      oRM
        .class("spp-floating-combo-picker")
        .class("spp-widget")
        .class("spp-list")
        .class("spp-floating")
        .class("spp-widget-scroller")
        .class("spp-overlay-scrollbar")
        .class("spp-outer")
        .class("spp-resourcecombo-picker")
        .class("spp-combo-picker")
        .class("spp-resize-monitored")
        .class("spp-show-event-color");

      if (!bVis) oRM.class("spp-hidden");

      bMulti ? oRM.class("spp-multiselect") : null;
      oRM.attr("role", "listbox");
      oRM.openEnd();
      $.each(oControl.getItems(), function (i, l) {
        oRM.renderControl(l);
      });
      oRM.close("ul"); //Main
    },
    itemSelected: function (item) {
      var multi = this.getMultiselect();
      var aI = this.getItems();

      if (!multi) {
        $.each(aI, function (j, i) {
          i.setSelected(false);
        });
        item.setSelected(true);

        this.fireSelect({
          item: item,
        });

        var p = this.getParent();

        if (p && p?.setSelected) {
          p.setSelected(item.getKey(), item.getValue(), item.getIcon());
        }
      } else {
        item.setSelected(true);
      }
    },
  });
});
