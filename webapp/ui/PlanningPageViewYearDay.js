sap.ui.define([
	"sap/ui/core/Control"
], function(
	Control
) {
	"use strict";

	return Control.extend("com.thy.ux.annualleaveplanning.ui.PlanningPageViewYearDay", {
        metadata: {
            properties: {
              day: {
                type: "object",
                bindable: true,
              }
            },
            aggregations: {
            },
            events: {},
          },
        renderer: function(oRM, oControl){
            var e = oControl.getDay();
            oRM.openStart("div");
            oRM.writeControlData(oControl);
              oRM
                .class("spp-day-name")
                .class("spp-calendar-cell")
                .class("spp-cal-empty-cell")
                .class(e.dayOfWeek > 4 ? "spp-weekend" : "spp-weekday")
                .class(
                  e.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day"
                )
                .class("spp-day-of-week-" + e.dayOfWeek);
              if(!e.sameMonth){
                oRM.class("spp-other-month");
              }
              if(e.sameMonth && e.isToday){
                oRM.class("spp-today");
              }

              oRM.attr("data-date", e.date);
              oRM.openEnd();
              oRM.openStart("div");
              oRM.class("spp-calendar-cell-inner");
              oRM.openEnd();
              oRM.text(e.day);

              oRM.close("div");
              oRM.close("div");
        }   
	});
});