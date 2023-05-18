sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (Control, eventUtilities) {
    "use strict";
    var dragInfo = {
      clientX: null,
      clientY: null,
      prevClientX: null,
      prevClientY: null,
      dragStarted: false
    };
    return Control.extend("com.thy.ux.annualleaveplanning.ui.Modal", {
      metadata: {
        properties: {},
        aggregations: {
          content: {
            type: "sap.ui.core.Control",
            multiple: false,
          },
          subContent: {
            type: "sap.ui.core.Control",
            multiple: false,
          },
        },
        events: {},
      },
      init: function () {},
      renderer: function (oRM, oControl) {
        var c = oControl.getContent();
        oRM.openStart("div", oControl); //Main
        oRM
          .class("spp-float-root")
          .class("spp-outer")
          .class("spp-overlay-scrollbar");
        if (sap.ui.Device.browser.chrome) {
          oRM.class("spp-chrome");
        } else if (sap.ui.Device.browser.firefox) {
          oRM.class("spp-firefox");
        } else if (sap.ui.Device.browser.safari) {
          oRM.class("spp-safari");
        }
        if (c) {
          oRM.class("spp-float-overlay");
        }
        oRM.openEnd();

        var c = oControl.getContent(); 
        if(c){
          oRM.renderControl(c);
        }

        var s = oControl.getSubContent() || null; 
        if(s){
          oRM.renderControl(s);
        }
       

        oRM.close("div");
      },
      open: function (oContent) {
        this.setAggregation("content", oContent);
      },

      openSub: function (oSubContent) {
        this.destroyAggregation("subContent");
        this.setAggregation("subContent", oSubContent)
      },
      destroyContent: function () {
        this.getSubContent() ? this.destroyAggregation("subContent") : null;
        this.getContent() ? this.destroyAggregation("content") : null;
      },
      close: function () {
        
        var s = this.getContent() || null;

        if (s && typeof s?.cancel === "function") {
          s?.cancel();
        }

        this.destroyAggregation("subContent");

        var c = this.getContent() || null;

        if (c && typeof c?.cancel === "function") {
          c?.cancel();
        }

        this.destroyAggregation("content");

        eventUtilities.publishEvent("PlanningCalendar", "ModalClosed", null);

      },
      ontap: function (oEvent) {
        if ($(oEvent.target).hasClass("spp-float-overlay")) {
          this.close();
        }
      },

    });
  }
);
