sap.ui.define([
	"sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageViewYearDay"
], function(
	Control,
    YearDay
) {
	"use strict";

	return Control.extend("com.thy.ux.annualleaveplanning.ui.PlanningPageViewYearWeek", {
        metadata: {
            properties: {
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
                    type: "com.thy.ux.annualleaveplanning.ui.PlanningPageViewYearDay",
                    multiple: true
                }
            },
            events: {},
          },
        renderer: function(oRM, oControl){
            var days = oControl.getDays();
            var w = oControl.getWeek();

            oRM.openStart("div");
            oRM.writeControlData(oControl);
            oRM.class("spp-calendar-week");
            oRM.attr("data-week", w);
            oRM.openEnd();

            //--Week Number
            oRM.openStart("button");
            oRM.class("spp-week-number-cell");
            oRM.openEnd();
            oRM.text(w);
            oRM.close("button");
            //--Week Number

            $.each(days, function(i, d){
                var y = new YearDay({
                    day: d
                });
                oControl.addAggregation("cells", y);
                oRM.renderControl(y);
            });

            oRM.close("div");
        }   
	});
});