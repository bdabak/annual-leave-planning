sap.ui.define([
	"sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageViewMonthDay"
], function(
	Control,
    MonthDay
) {
	"use strict";

	return Control.extend("com.thy.ux.annualleaveplanning.ui.PlanningPageViewMonthWeek", {
        metadata: {
            properties: {
              year: {
                type: "string",
                bindable: true,
              },
              week: {
                type: "string",
                bindable: true,
              },
              days: {
                type: "object",
                bindable: true,
              }
            },
            aggregations: {
                cells: {
                    type: "com.thy.ux.annualleaveplanning.ui.PlanningPageViewMonthDay",
                    multiple: true
                }
            },
            events: {},
          },
        renderer: function(oRM, oControl){
            var days = oControl.getDays();
            var w = oControl.getWeek();
            var y = oControl.getYear();

            oRM.openStart("div", oControl); //Main
            oRM.class("spp-calendar-row");
            oRM.class("spp-calendar-week");
            oRM.attr("data-week", y + "," + w);
            oRM.openEnd();

            //--Week Number
            oRM.openStart("div");
            oRM.class("spp-week-number-cell");
            oRM.openEnd();
            oRM.text(w);
            oRM.close("div");
            //--Week Number

            oRM.openStart("div");
            oRM.class("spp-calendar-days");
            oRM.openEnd();
            $.each(days, function(i, d){
                var y = new MonthDay({
                    day: d
                });
                oControl.addAggregation("cells", y);
                oRM.renderControl(y);
            });
            oRM.close("div");
            oRM.close("div");
        }   
	});
});