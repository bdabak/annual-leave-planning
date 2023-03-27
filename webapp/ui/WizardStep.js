sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.WizardStep", {
    metadata: {
      properties: {
        title: {
          type: "string",
          bindable: true,
        },
        active: {
          type: "boolean",
          bindable: true,
          defaultValue: false
        }
      },
      aggregations: {
        content: {
          type: "sap.ui.core.Control",
          multiple: false
        }
      },
      events: {},
    },
    init: function () {
    
    },
    /**
     * @override
     */
    onAfterRendering: function() {
      Control.prototype.onAfterRendering.apply(this, arguments);
      if(!this.getActive()) this.removeStyleClass("active").removeStyleClass("animate__animated").removeStyleClass("animate__fadeInRight");
      setTimeout(function(){
        if(this.getActive()) {
          this.addStyleClass("active").addStyleClass("animate__animated").addStyleClass("animate__fadeInRight").addStyleClass("animate__faster");
        }
      }.bind(this),50);
    },
    renderer: function (oRM, oControl) {
      oRM
        .openStart("div", oControl) //--Main
        .class("spp-wizard-step");
      oRM.openEnd();
      
      oRM.renderControl(oControl.getContent());

      oRM.close("div"); //--Main
    },
  });
});
