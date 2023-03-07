sap.ui.define([
	"sap/ui/core/Control"
], function(
	Control
) {
	"use strict";

	return Control.extend("com.thy.ux.annualleaveplanning.ui.PlanningPageFormInput", {
        metadata: {
            properties: {
              value:{
                type:"string",
                bindable: true
              },
              type:{
                type:"string",
                bindable: true,
                defaultValue: "text"
              },
              name:{
                type:"string",
                bindable: true
              },
              autoComplete:{
                type:"string",
                bindable: true,
                defaultValue: "off"
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
                triggers:{
                    type:"com.thy.ux.annualleaveplanning.ui.PlanningPageFormFieldTrigger",
                    multiple: true,
                    singularName: "trigger"
                }
            },
            events: {},
          },
          renderer: function (oRM, oControl) {
            oRM.openStart("div", oControl);
            oRM.class("spp-field-inner");
            oRM.openEnd();
            
            //--Input--//
            oRM.openStart("input");
            oRM.attr("type", oControl.getType());
            oRM.attr("name", oControl.getName());
            oRM.attr("autocomplete", oControl.getAutoComplete());
            oRM.attr("placeholder", oControl.getPlaceHolder());
            oRM.attr("role", oControl.getRole());
            oRM.openEnd();
            oRM.close("input"); //Main
            //--Input--//

            $.each(oControl.getAggregation("triggers"), function(i,t){
                oRM.renderControl(t);
            });

            oRM.close("div"); //Main
        }
    });
});