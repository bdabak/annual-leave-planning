sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.Menu", {
    metadata: {
      properties: {
        styles: {
          type: "object",
          multiple: true,
        },
      },
      aggregations: {
        items: {
          type: "com.thy.ux.annualleaveplanning.ui.MenuItem",
          multiple: true,
          singularName: "item",
        },
      },
      events: {
        itemSelected: {
          parameters: {
            selectedItem: {
              type: "object",
            },
          },
        },
      },
      defaultAggregation: "items"
    },

    renderer: function (oRM, oControl) {
      var aStyles = oControl.getStyles() || new Map();

      oRM.openStart("div", oControl); //Main
      oRM
        .class("spp-widget")
        .class("spp-container")
        .class("spp-panel")
        .class("spp-popup")
        .class("spp-menu")
        .class("spp-floating")
        .class("spp-vbox")
        .class("spp-panel-has-tools")
        .class("spp-outer")
        .class("spp-overlay-scrollbar")
        .class("spp-resize-monitored")
        .class("spp-focus-trapped")
        .class("spp-using-keyboard")
        .class("spp-contains-focus")
        .class("spp-aligned-below")
        .class("spp-animate-top");
        
      if (sap.ui.Device.browser.chrome) {
        oRM.class("spp-chrome");
      } else if (sap.ui.Device.browser.firefox) {
        oRM.class("spp-firefox");
      } else if (sap.ui.Device.browser.safari) {
        oRM.class("spp-safari");
      }

      oRM.attr("tabindex", "0").attr("aria-modal", false);

      if (aStyles && aStyles?.size > 0) {
        aStyles.forEach((value, key) => {
          oRM.style(key, value);
        });
      }
      oRM.openEnd();

      oRM.openStart("div"); // Menu body wrapper
      oRM
        .class("spp-hbox")
        .class("spp-box-center")
        .class("spp-panel-body-wrap")
        .class("spp-menu-body-wrap");
      oRM.openEnd();

      oRM.openStart("div"); // Menu
      oRM
        .class("spp-panel-content")
        .class("spp-popup-content")
        .class("spp-menu-content")
        .class("spp-box-center")
        .class("spp-content-element")
        .class("spp-auto-container")
        .class("spp-widget-scroller")
        .class("spp-resize-monitored")
        .class("spp-flex-column");
      oRM.attr("role", "menu");
      oRM.style("overflow", "hidden");
      oRM.openEnd();

      $.each(oControl.getItems(), function (i, item) {
        oRM.renderControl(item);
      });

      oRM.close("div"); // Menu

      oRM.close("div"); // Menu body wrapper

      oRM.close("div");
    },

    setSelectedItem: function (item) {
      this.unselectItem();
      item.setSelected(true);
      this.fireItemSelected({
        selectedItem: _.cloneDeep(item)
      });
    },
    unselectItem: function () {
      $.each(this.getItems(), function (i, item) {
        item.setSelected(false);
      });
    },
  });
});
