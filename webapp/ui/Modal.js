sap.ui.define(["sap/ui/core/Control","com/thy/ux/annualleaveplanning/utils/event-utilities",], function (Control,eventUtilities) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.Modal", {
    metadata: {
      properties: {},
      aggregations: {
        content: {
          type: "sap.ui.core.Control",
          multiple: true,
        },
      },
      events: {
      },
    },
    init: function(){

    },
    renderer: function (oRM, oControl) {
      var c = oControl.getContent(); 
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
      if(c && c.length>0){
        oRM.class("spp-float-overlay");
      } 
      oRM.openEnd();
      // oControl.getContent() ? oRM.renderControl(oControl.getContent()) : null;
      $.each(c, function(i,e){
        oRM.renderControl(e);
      });
      
      oRM.close("div");
    },
    openBy: function(oContent){
        this.addAggregation("content", oContent);
    },
    destroyContent: function(){
        this.getContent() ? this.destroyAggregation("content") : null;
    },
    close: function(){
        var aC =  this.getContent() || [];
        if(aC.length > 0){
          $.each(aC, function(i,c){
            if(typeof c?.cancel === "function"){
              c?.cancel();
            }
          });
        }
        this.destroyAggregation("content");
    },
    ontap: function(oEvent){
        if($(oEvent.target).hasClass("spp-float-overlay")){
            this.close();
        }
    }
  });
});
