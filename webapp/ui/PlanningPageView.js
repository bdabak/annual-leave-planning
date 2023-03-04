sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.PlanningPageView", {
    metadata: {
      properties: {
        hidden: {
          type: "boolean",
          bindable: true,
          defaultValue: true,
        },
        tabIndex: {
          type: "string",
          bindable: true,
        },
        navigationActive: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
      },
      aggregations: {
        content: {
          type: "sap.ui.core.Control",
          multiple: false,
        },
      },
      events: {
        swiped: {
          parameters: {
            direction: {
              type: "string",
            },
          },
        },
      },
    },
    renderer: function (oRM, oControl) {
      oRM.openStart("div");
      oRM.writeControlData(oControl);
      oRM
        .class("spp-widget")
        .class("spp-container")
        .class("spp-panel")
        .class("spp-eventrenderer")
        .class("spp-responsive")
        .class("spp-calendarmixin")
        .class("spp-daycellcollecter")
        .class("spp-daycellrenderer")
        .class("spp-yearview")
        .class("spp-touch")
        .class("spp-vbox")
        .class("spp-ltr")
        .class("spp-card-item")
        .class("spp-legacy-inset")
        .class("spp-first-visible-child")
        .class("spp-last-visible-child");

      if (sap.ui.Device.system.phone) {
        oRM.class("spp-responsive-small");
      } else if (sap.ui.Device.system.tablet) {
        oRM.class("spp-responsive-medium");
      } else if (sap.ui.Device.system.desktop) {
        oRM.class("spp-responsive-large");
      }
      if (oControl.getHidden()) {
        oRM.class("spp-hidden");
      }
      oRM.openEnd();
      oRM.openStart("div"); //Sub div
      oRM
        .class("spp-hbox")
        .class("spp-box-center")
        .class("spp-panel-body-wrap")
        .class("spp-yearview-body-wrap");
      oRM.openEnd();
      oRM.renderControl(oControl.getContent());
      oRM.close("div"); //Sub div
      oRM.close("div");
    },
    onswipeleft: function () {
      if (!this.getNavigationActive()) {
        return;
      }
      this.fireSwiped({
        direction: "L",
      });
    },
    onswiperight: function () {
      if (!this.getNavigationActive()) {
        return;
      }
      this.fireSwiped({
        direction: "R",
      });
    },
  });
});
