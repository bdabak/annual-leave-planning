sap.ui.define(["sap/ui/core/Control"], function (Control) {
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
      events: {},
    },
    init: function(){

    },
    renderer: function (oRM, oControl) {
      oRM.openStart("div");
      oRM.writeControlData(oControl);
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
        this.destroyContent();
    },
    ontap: function(oEvent){
        if($(oEvent.target).hasClass("sap-float-overlay")){
            this.close();
        }
    }
  });
});
