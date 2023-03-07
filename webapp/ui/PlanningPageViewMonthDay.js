sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageEventContainer",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageEvent",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
  ],
  function (Control, EventContainer, Event, dateUtilities) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PlanningPageViewMonthDay",
      {
        metadata: {
          properties: {
            day: {
              type: "object",
              bindable: true,
            },
            eventDuration: {
              type: "int",
              bindable: true,
              defaultValue: 0,
            },
          },
          aggregations: {
            eventContainer: {
              type: "com.thy.ux.annualleaveplanning.ui.PlanningPageEventContainer",
              multiple: false,
            },
          },
          events: {},
        },
        init: function () {
          var c = new EventContainer();
          this.setAggregation("eventContainer", c);
        },
        renderer: function (oRM, oControl) {
          var e = oControl.getDay();
          oRM.openStart("div", oControl); //Day
          oRM
            // .class("spp-day-name")
            .class("spp-calendar-cell")
            .class("spp-cal-empty-cell")
            .class(e.dayOfWeek > 4 ? "spp-weekend" : "spp-weekday")
            .class(e.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day")
            .class("spp-day-of-week-" + e.dayOfWeek);
          if (!e.sameMonth) {
            oRM.class("spp-other-month");
          }
          if (e.sameMonth && e.isToday) {
            oRM.class("spp-today");
          }
          if (e.dayOfWeek === "0") {
            oRM.class("spp-first-visible-cell");
          }
          oRM.attr("data-date", e.date);
          oRM.openEnd();

          oRM.openStart("div"); // Day cell header
          oRM.class("spp-cal-cell-header");
          oRM.openEnd();

          if (e.dayOfWeek === "0") {
            oRM.openStart("div");
            // oRM.class("spp-week-num");
            oRM.openEnd();
            // oRM.text(e.week);
            oRM.close("div");
          }

          oRM.openStart("div"); // Day name
          oRM.class("spp-day-name").class("spp-day-num");
          oRM.openEnd();
          oRM.text(e.day);
          oRM.close("div"); // Day name

          oRM.close("div"); // Day cell header

          //--Event container
          oControl._renderEvents(oRM);
          //--Event container

          oRM.close("div"); // Day
        },

        _renderEvents: function (oRM) {
          var c = this.getAggregation("eventContainer");
          var d = this.getDay();
          var a = dateUtilities.getDayAttributes(d.date) || null;

          c.destroyAggregation("events");

          $.each(a, function (i, e) {
            var n = new Event({
              eventType: "holiday",
              color: "spp-cal-color-deep-orange",
              text: e.holiday.text,
              height: "20px",
              hasPast: e.hasPast,
              hasFuture: e.hasFuture,
              hasOverflow: e.hasOverflow,
              rowIndex: e.rowIndex,
              rowSpan: e.rowSpan,
            });
            c.addAggregation("events", n);
          });

          oRM.renderControl(c);
        },
        createEvent: function (d, a) {
          var c = this.getAggregation("eventContainer");
          var l = a.length;
          if (this.getEventDuration() !== l) {
            c.destroyAggregation("events", true);
            var i = a.indexOf(d);
            var m = moment(d, "YYYY-MM-DD");
            var o = parseInt(m.format("E"), 10);

            var calcOverflow = function (i, s) {
              if (i === 0 || s === 1) {
                return false;
              } else {
                if (s === 1) {
                  return false;
                } else {
                  return true;
                }
              }
            };

            var calcSpan = function (i, s, l) {
              if (i !== 0 && s !== 1) {
                return 1;
              } else {
                if (s === 7 || i === l - 1) {
                  return 1;
                }
                var r = l - i + s - 1;
                if (r >= 7) {
                  var r = 7;
                }
                return r - s + 1;
              }
            };

            var calcFuture = function(i,s,a){
              
              var mB = moment(a[i], "YYYY-MM-DD");
              var mE = moment(a[a.length - 1], "YYYY-MM-DD");

              if(i===0 || s === 1){
                console.log(i,s,mB, mE, mB.week(),mE.week());
                return mB.week() !== mE.week()
              }else{
                return false;
              }
            };

            var n = new Event({
              eventType: "createEvent",
              color: "spp-cal-color-blue",
              text: "New Event",
              height: "20px",
              hasPast: i > 0,
              hasFuture: calcFuture(i,o,a),
              hasOverflow: calcOverflow(i, o),
              rowIndex: 0,
              rowSpan: calcSpan(i, o, l),
            });
            c.addAggregation("events", n);
            this.setProperty("eventDuration",l, true);
          }
        },
      }
    );
  }
);
