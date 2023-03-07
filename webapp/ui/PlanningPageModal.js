sap.ui.define(["sap/ui/core/Control","com/thy/ux/annualleaveplanning/utils/event-utilities",], function (Control,eventUtilities) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.PlanningPageModal", {
    metadata: {
      properties: {},
      aggregations: {
        content: {
          type: "sap.ui.core.Control",
          multiple: false,
        },
      },
      events: {
      },
    },
    init: function(){

    },
    renderer: function (oRM, oControl) {
      oRM.openStart("div", oControl); //Main
      oRM
        .class("spp-float-root")
        .class("spp-outer")
        .class("spp-overlay-scrollbar");
      if(sap.ui.Device.browser.chrome){
        oRM
        .class("spp-chrome");
      }else if(sap.ui.Device.browser.firefox){
        oRM
        .class("spp-firefox");
      }else if(sap.ui.Device.browser.safari){
        oRM
        .class("spp-safari");
      }
      if(oControl.getContent()){
        oRM.class("sap-float-overlay");
      } 
      oRM.openEnd();
      oControl.getContent() ? oRM.renderControl(oControl.getContent()) : null;
      oRM.close("div");
    },
    openBy: function(oContent){
        this.destroyContent();
        this.setAggregation("content", oContent);
    },
    destroyContent: function(){
        this.getContent() ? this.destroyAggregation("content") : null;
    },
    close: function(){
        if(typeof this.getContent()?.close === "function"){
          this.getContent()?.close();
        }

        this.destroyContent();
    },
    ontap: function(oEvent){
        if($(oEvent.target).hasClass("sap-float-overlay")){
            this.close();
        }
    }
  });
});
