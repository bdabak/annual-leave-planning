/*global Swal*/

sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/CalendarDayInner",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (Control, Day, dateUtilities, eventUtilities) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.CalendarDay", {
      metadata: {
        properties: {
          day: {
            type: "object",
            bindable: true,
          },
          enabled: {
            type: "boolean",
            bindable: true,
            defaultValue: true,
          },
          datePicker: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          selectedDate:{
            type: "string",
            bindable: true,
          }
        },
        aggregations: {
          _cell: {
            type: "com.thy.ux.annualleaveplanning.ui.CalendarDayInner",
            multiple: false,
          },
        },
        events: {},
      },
      init: function () {
        var c = new Day();
        this.setAggregation("_cell", c);
      },
      renderer: function (oRM, oControl) {
        var e = oControl.getDay();
        var bSelectable = dateUtilities.checkDateIsSelectable(e.date);
        var dP = oControl.getDatePicker();
        var s = oControl.getSelectedDate();
        var c = oControl
          .getAggregation("_cell")
          .setDay(e.day)
          .setDatePicker(dP);
        oRM.openStart("div", oControl); //Main

        if(!bSelectable){
          oRM.class("spp-past-date");
        }

        oRM
          .class("spp-day-name")
          .class("spp-calendar-cell")
          .class("spp-day-of-week-" + e.dayOfWeek);
        if (!e.sameMonth) {
          oRM.class("spp-other-month");
        }

        if( s && s === e.date ){
          oRM.class("spp-active-day").class("spp-selected-date");
        }

        if (e.sameMonth && e.isToday) {
          oRM.class("spp-today");
        }

        if (dP) {
          oRM
            .class(e.dayOfWeek > 4 ? "spp-weekend" : "spp-weekday")
            .class(e.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day");
        } else {
          var s = oControl._getDayClass(e.date);

          if (s) {
            oRM.class(s);
          } else {
            oRM
              .class("spp-cal-empty-cell")
              .class(e.dayOfWeek > 4 ? "spp-weekend" : "spp-weekday")
              .class(
                e.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day"
              );
          }
        }

        oRM.attr("data-date", e.date);
        oRM.openEnd();
        oRM.renderControl(c);
        oRM.close("div");
      },
      _getViewComponent: function () {
        var p = this.getParent()?.getParent()?.getParent();

        return (p && p.$()) || null;
      },
      _getDayClass: function (d) {

        var p = dateUtilities.checkDateAnnual(d);

        if(p){
          return "spp-annual-leave";
        }

        p = dateUtilities.checkDatePlanned(d);

        if(p){
          return "spp-planned-leave";
        }


        var h = dateUtilities.checkDateHoliday(d);

        if (!h) {
          return null;
        }

        if (h.type === "1") {
          return "spp-holiday-all-day";
        }
        if (h.type === "2") {
          return "spp-holiday-half-day";
        }
      },
      ontap: function () {
        if(this.getDatePicker()){
          return;
        }
        var d = this.getDay().date;
        var a = dateUtilities.getDayAttributes(d) || null;
        if (!a) {
          return;
        }
        eventUtilities.publishEvent("PlanningCalendar", "DisplayEventWidget", {
          element: this.$(),
          day: a,
        });
      },
    });
  }
);
