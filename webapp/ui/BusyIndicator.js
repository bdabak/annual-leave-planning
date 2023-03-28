sap.ui.define([
	"sap/ui/core/Control"
], function(
	Control
) {
	"use strict";

	return Control.extend("com.thy.ux.annualleaveplanning.ui.BusyIndicator", {
       
        renderer: function(oRM, oControl){

            oRM.openStart("div", oControl)
               .class("spp-busy-ripple")
               .openEnd()
               .openStart("div").openEnd().close("div")
               .openStart("div").openEnd().close("div")
               .close("div");
            
        }
	});
});