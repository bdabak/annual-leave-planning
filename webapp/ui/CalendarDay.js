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
          selectedDate: {
            type: "string",
            bindable: true,
          },
          nullCell: {
            type: "boolean",
            bindable: true,
            defaultValue: false
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
        var rO = e.sameMonth;
        var c = oControl
          .getAggregation("_cell")
          .setDay(e.day)
          .setDatePicker(dP);
        

        oRM.openStart("div", oControl); //Main
        if (!rO) {
          c.setDay(null);
          c.setDatePicker(null);
          oControl.setProperty("nullCell", true, true);
          oRM
          .class("spp-day-name")
          .class("spp-calendar-cell")
          .class("spp-cal-null-cell");
        }else{
          if (!bSelectable) {
            oRM.class("spp-past-date");
          }

          oRM
            .class("spp-day-name")
            .class("spp-calendar-cell")
            .class("spp-day-of-week-" + e.dayOfWeek);
          if (!e.sameMonth) {
            oRM.class("spp-other-month");
          }

          if (s && s === e.date) {
            oRM.class("spp-active-day").class("spp-selected-date");
          }

          if (e.sameMonth && e.isToday) {
            oRM.class("spp-today");
          }

          if (dP) {
            oRM
              .class(e.dayOfWeek > 4 ? "spp-weekend" : "spp-weekday")
              .class(
                e.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day"
              );
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
        }

        
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

        if (p) {
          var v = dateUtilities.getEventTypeVisible(
            p.LegendAttributes.LegendGroupKey,
            p.LegendAttributes.LegendItemKey
          );

          if (!v) {
            return null;
          }

          return p?.LegendAttributes?.EventColor;
        }

        p = dateUtilities.checkDatePlanned(d);

        if (p) {
          var y = dateUtilities.getEventTypeVisible(
            p.LegendAttributes.LegendGroupKey,
            p.LegendAttributes.LegendItemKey
          );

          if (!y) {
            return null;
          }
          return p?.LegendAttributes?.EventColor;
        }

        var h = dateUtilities.checkDateHoliday(d);

        if (!h) {
          return null;
        } else {

          var z = dateUtilities.getEventTypeVisible(
            h.LegendAttributes.LegendGroupKey,
            h.LegendAttributes.LegendItemKey
          );

          if (!z) {
            return null;
          }
          return h?.LegendAttributes?.EventColor;
        }
      },

      _callDayInfo: function(e,m){
       
        if (this.getDatePicker() || this.getNullCell()) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        
        var c = this.getDay();
        var bSelectable = dateUtilities.checkDateIsSelectable(c.date);

        if(!bSelectable){
          return;
        }
        

        var d = this.getDay().date;
        var a = dateUtilities.getDayAttributes(d, false) || [];

      //  console.log(a);
        if ( a.length > 0 && eventUtilities.getMergeEventStatus()) {
          var z = _.find(a, ["mergable", true]);
          if(z){
            var oEventObject = {
              EventId: z.eventId,
              EventType: z.eventType,
              LeaveType: z.leaveType,
              Deletable: false
            };
            eventUtilities.publishEvent("PlanningCalendar", "MergeEvent", _.clone(oEventObject));
          }
          return;
        }

        if(m){
          if (!a || a.length === 0 || eventUtilities.getSelectEventStatus()) {
            eventUtilities.publishEvent("PlanningCalendar", "SelectEventDate", {
              Element: this.$(),
              Date: d,
            });
            return;
          }
        }
        if(m === false && a.length>0){
          eventUtilities.publishEvent("PlanningCalendar", "DisplayEventWidget", {
            Element: this.$(),
            Day: a,
          });
        }
      },
      oncontextmenu: function(e){
        this._callDayInfo(e, false);
      },

      ontap: function (e) {
        this._callDayInfo(e, true);
      },
    });
  }
);
