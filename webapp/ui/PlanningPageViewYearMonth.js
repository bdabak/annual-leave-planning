/*global moment,_*/
sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageViewYearWeek",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/lodash",
  ],
  function (Control, YearWeek, dateUtilities, lodashJS) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PlanningPageViewYearMonth",
      {
        metadata: {
          properties: {
            year: {
              type: "int",
              bindable: true,
            },
            month: {
              type: "int",
              bindable: true,
            },
          },
          aggregations: {
            weeks: {
              type:"com.thy.ux.annualleaveplanning.ui.PlanningPageViewYearWeek",
              multiple: true
            }
          },
          events: {},
        },
        init: function () {},
        renderer: function (oRM, oControl) {
          var m = dateUtilities.getMonthData(
            oControl.getYear(),
            oControl.getMonth()
          );

          oRM.openStart("div");
          oRM.writeControlData(oControl);
          oRM.class("spp-yearview-month");
          oRM.openEnd();

          //--Month Name
          oRM.openStart("button");
          oRM.class("spp-yearview-month-name");
          oRM.openEnd();
          oRM.text(m.monthName + " " + m.year);
          oRM.close("button");
          //--Month Name

          //--Day names
          oControl.renderDayNames(oRM);
          //--Day names

          //--Render dates
          oControl.renderDates(oRM, oControl, m);
          //--Render dates

          oRM.close("div");
        },
        renderDates: function (oRM, oControl, m) {
          $.each(m.weeks, function (i, w) {
            var d = _.filter(m.days, { week: w });

            var y = new YearWeek({
              week: w,
              days: d
            });

            oControl.addAggregation("weeks", y);
            oRM.renderControl(y);

            // oRM.openStart("div");
            // oRM.class("spp-calendar-week");
            // oRM.attr("data-week", w);
            // oRM.openEnd();

            // //--Week Number
            // oRM.openStart("button");
            // oRM.class("spp-week-number-cell");
            // oRM.openEnd();
            // oRM.text(w);
            // oRM.close("button");
            // //--Week Number

            // $.each(d, function (i, e) {
            //   oRM.openStart("div");
            //   oRM
            //     .class("spp-day-name")
            //     .class("spp-calendar-cell")
            //     .class("spp-cal-empty-cell")
            //     .class(e.dayOfWeek > 4 ? "spp-weekend" : "spp-weekday")
            //     .class(
            //       e.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day"
            //     )
            //     .class("spp-day-of-week-" + e.dayOfWeek);
            //   if(!e.sameMonth){
            //     oRM.class("spp-other-month");
            //   }
            //   if(e.sameMonth && e.isToday){
            //     oRM.class("spp-today");
            //   }

            //   oRM.attr("data-date", e.date);
            //   oRM.openEnd();
            //   oRM.openStart("div");
            //   oRM.class("spp-calendar-cell-inner");
            //   oRM.openEnd();
            //   oRM.text(e.day);

            //   oRM.close("div");
            //   oRM.close("div");
            // });

            // oRM.close("div");
          });
        },
        renderDayNames: function (oRM) {
          oRM.openStart("div");
          oRM.class("spp-calendar-week").class("spp-calendar-weekdays");
          oRM.openEnd();
          for (var i = 0; i < 8; i++) {
            oRM.openStart("div");
            if (i === 0) {
              oRM.class("spp-week-number-cell");
            } else {
              oRM.class("spp-yearview-weekday-cell");
              if (i > 5) {
                oRM.class("spp-nonworking-day");
              }
            }
            oRM.openEnd();
            if (i > 0) {
              oRM.text(moment().day(i).format("dd"));
            }
            oRM.close("div");
          }
          oRM.close("div");
        },

        onmousedown: function(){

        }
      }
    );
  }
);
