sap.ui.define([
	"sap/ui/core/Control"
], function(
	Control
) {
	"use strict";

	return Control.extend("com.thy.ux.annualleaveplanning.ui.FormTextArea", {
        metadata: {
            properties: {
              value:{
                type:"string",
                bindable: true
              },
              rows:{
                type:"string",
                bindable: true,
                defaultValue: "3"
              },
              cols:{
                type:"string",
                bindable: true,
                defaultValue: "50"
              },
              name:{
                type:"string",
                bindable: true
              },
              placeHolder:{
                type:"string",
                bindable: true,
                defaultValue: ""
              },
              role:{
                type:"string",
                bindable: true,
                defaultValue: "presentation"
              }
            },
            aggregations: {
              
            },
            events: {},
          },
          renderer: function (oRM, oControl) {
            oRM.openStart("div", oControl);
            oRM.class("spp-field-inner");
            oRM.class("spp-textareafield");
            oRM.openEnd();
            
            //--Textarea--//
            oRM.openStart("textarea");
            oRM.attr("name", oControl.getName());
            oRM.attr("rows", oControl.getRows());
            oRM.attr("cols", oControl.getCols());
            oRM.attr("placeholder", oControl.getPlaceHolder());
            oRM.attr("role", oControl.getRole());
            oRM.openEnd();
            oRM.text(oControl.getValue());
            oRM.close("textarea"); //Main
            //--Textarea--//

            oRM.close("div"); //Main
        },
       
        oninput: function(e){
          e.stopPropagation();
          e.preventDefault();
          this.setProperty("value", $(e.target).val(), true);
        },
       
    });
});