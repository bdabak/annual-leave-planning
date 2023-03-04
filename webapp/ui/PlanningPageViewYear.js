sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageViewYearMonth",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (Control, YearMonth, eventUtilities) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PlanningPageViewYear",
      {
        metadata: {
          properties: {
            year: {
              type: "int",
              bindable: true,
            },
          },
          aggregations: {
            months: {
              type: "com.thy.ux.annualleaveplanning.ui.PlanningPageViewYearMonth",
              multiple: true,
              singularName: "month",
            },
          },
          events: {},
        },

        init: function () {
          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "PeriodChanged",
            this.onYearChanged,
            this
          );
        },

        onYearChanged: function (c, e, o) {
          var p = o.period;
          if (this.getYear() === p.year) {
            return;
          }
          var y = parseInt(p.year, 10);
          if (y) {
            this.setYear(y);
          }
        },

        renderer: function (oRM, oControl) {
          oRM.openStart("div");
          oRM.writeControlData(oControl);
          oRM
            .class("spp-panel-content")
            .class("spp-eventrenderer-content")
            .class("spp-responsive-content")
            .class("spp-calendarmixin-content")
            .class("spp-daycellcollecter-content")
            .class("spp-daycellrenderer-content")
            .class("spp-yearview-content")
            .class("spp-box-center")
            .class("spp-content-element")
            .class("spp-auto-container")
            .class("spp-ltr")
            .class("spp-show-events-heatmap")
            .class("spp-no-visible-children")
            .class("spp-widget-scroller")
            .class("spp-resize-monitored")
            .class("spp-draggable")
            .class("spp-droppable");
            if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet){
              oRM.style("overflow-y","auto");
            }
          oRM.openEnd();

          var aMonths = [];
          for (var m = 1; m <= 12; m++) {
            var oMonth = new YearMonth({
              year: oControl.getYear(),
              month: m,
            });
            aMonths.push(oMonth);
            oRM.renderControl(oMonth);
            oControl.addAggregation("months", oMonth);
          }

          oRM.close("div");
        },
      }
    );
  }
);
