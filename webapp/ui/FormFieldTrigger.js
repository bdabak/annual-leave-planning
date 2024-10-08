sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.FormFieldTrigger",
    {
      metadata: {
        properties: {
          icon: {
            type: "string",
            bindable: true,
          },
          alignEnd: {
            type: "boolean",
            bindable: true,
            defaultValue: true,
          },
        },
        aggregations: {},
        events: {
            press:{

            }
        },
      },
      renderer: function (oRM, oControl) {
        var i = oControl.getIcon();
        var e = oControl.getAlignEnd();
        oRM.openStart("div", oControl);
        oRM
        .class("spp-widget")
        .class("spp-fieldtrigger");
        if(i){
            oRM.class("spp-icon");
            oRM.class(i);
        }
        e ? oRM.class("spp-align-end") : null ;
        oRM.openEnd();
        oRM.close("div"); //Main
      },
      ontap: function(e){
        e.preventDefault();
        if($(e.target).hasClass("spp-fieldtrigger")){
          this.firePress();
        }

      }
    }
  );
});
