sap.ui.define(["./moment", "./lodash"], function (momentJS, lodashJS) {
  "use strict";
  var _holidayCalendar = {};
  return {
    formatDate: function(d){
      //--Init momentJS
      this.initializeMoment();
      
      var m = moment(d, "YYYYMMDD"); 

      return m.format("DD.MM.YYYY");
    },
    convertDateToPeriod: function(d){
      //--Init momentJS
      this.initializeMoment();
      
      var m = moment(d, "YYYY-MM-DD"); 

      return this.getPeriod(m);
    },
    convertPeriodToDate: function(p){
      //--Init momentJS
      this.initializeMoment();
      
      var m = moment(p.year + "-" + p.month + "-" + p.day, "YYYY-MM-DD");

      return m.format("YYYY-MM-DD");
    },
    getMonthData: function (y, m) {
      //--Init momentJS
      this.initializeMoment();

      var m = y.toString() + "-" + m.toString().padStart(2, "0");
      var o = moment(m, "YYYY-MM"); // Get moment object of month
      var s = moment(o).startOf("month").weekday(0);
      var e = moment(o).endOf("month").weekday(6);

      if (moment.duration(e.diff(s)).asWeeks() <= 5) {
        e.add(1, "week");
      }

      var oMonth = {
        monthName: o.format("MMMM"),
        year: o.format("YYYY"),
        weeks: [],
        days: [],
      };

      while (s.isSameOrBefore(e)) {
        if (oMonth.weeks.indexOf(s.week(), 0) === -1) {
          oMonth.weeks.push(s.week());
        }
        oMonth.days.push({
          week: s.week(),
          date: s.format("YYYY-MM-DD"),
          dayOfWeek: s.format("e"),
          sameMonth: s.format("YYYY-MM") === o.format("YYYY-MM"),
          isToday: moment().isSame(s, "day"),
          year: s.format("YYYY"),
          month: s.format("MM"),
          day: s.format("D"),
        });
        s.add(1, "d");
      }

      return oMonth;
    },

    getToday: function () {
      return this.getPeriod(moment());
    },

    getCurrentYear: function () {
      return this.getPeriod(moment(new Date()).startOf("year"));
    },

    getCurrentMonth: function () {
      return this.getPeriod(moment(new Date()).startOf("month"));
    },

    getNextPeriod: function (p, a) {
      var m = moment(p.year + "-" + p.month + "-" + p.day, "YYYY-MM-DD");

      switch (a) {
        case "Y":
          m.add(1, "y");
          break;
        case "M":
          m.add(1, "M");
          break;
      }

      return this.getPeriod(m);
    },

    getPrevPeriod: function (p, a) {
      var m = moment(p.year + "-" + p.month + "-" + p.day, "YYYY-MM-DD");

      switch (a) {
        case "Y":
          m.subtract(1, "y");
          break;
        case "M":
          m.subtract(1, "M");
          break;
      }

      return this.getPeriod(m);
    },

    getPeriod: function (m) {
      return {
        year: m.format("YYYY"),
        month: m.format("MM"),
        day: m.format("DD"),
      };
    },
    formatPeriodText: function (p, a) {
      //--Init momentJS
      this.initializeMoment();
      var m = moment(p.year + "-" + p.month + "-" + p.day, "YYYY-MM-DD");
      switch (a) {
        case "Y":
          return m.format("YYYY");
        case "M":
          return m.format("MMMM YYYY");
        case "m":
          return m.format("MMMM");
      }
    },

    initializeMoment: function () {
      moment.locale("tr");
      moment().isoWeekday(1); // Monday
      moment.updateLocale("tr", {
        week: {
          dow: 1,
        },
      });
    },

    decidePeriodChangeDirection: function (o, n) {
      var oP = moment(o.year + "-" + o.month + "-" + o.day, "YYYY-MM-DD");
      var nP = moment(n.year + "-" + n.month + "-" + n.day, "YYYY-MM-DD");
      return oP.isAfter(nP) ? "L" : oP.isBefore(nP) ? "R" : "";
    },

    findDatesBetweenTwoDates: function (b, e) {
      var startDate = moment(b, "YYYY-MM-DD").clone(),
        dates = [],
        endDate = moment(e, "YYYY-MM-DD").clone();

      while (startDate.isSameOrBefore(endDate)) {
        dates.push(startDate.format("YYYY-MM-DD"));
        startDate.add(1, "d");
      }
      return dates;
    },

    setHolidayCalendar: function (h) {
      this._holidayCalendar = _.cloneDeep(h);
    },
    checkDateHoliday: function (d) {
      var m = moment(d, "YYYY-MM-DD");
      var y = m.format("YYYY");

      //--Search in variable holidays
      var v = _.find(this._holidayCalendar.holidayList[y], {
        month: m.format("MM"),
        day: m.format("DD"),
      });
      if (!v) {
        return null;
      }
      return {
        text: v.text,
        type: v.type,
      };
    },
    getDayAttributes: function (d) {
      var m = moment(d, "YYYY-MM-DD");
      var y = m.format("YYYY");
      var l = [];
      var e = {};
      var that = this;
      var o = parseInt(m.format("E"), 10);

      var calcSpan = function (i, s, sT) {
        if (i !== 0 && s !== 1) {
          return 1;
        } else {
          if (s === 7 || i === sT.length - 1) {
            return 1;
          }
          var r = sT.length - i + s - 1;
          if (r >= 7) {
            var r = 7;
          }
          return r - s + 1;
        }
      };

      var calcOverflow = function (i, s, sT) {
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

      //--Search in holidays
      var hL =
        _.filter(this._holidayCalendar.holidayList[y], {
          month: m.format("MM"),
          day: m.format("DD"),
        }) || [];
      if (hL.length > 0) {
        $.each(hL, function (i, h) {
          var s = _.find(that._holidayCalendar.holidayInfo, [
            "id",
            h.belongsTo,
          ]);
          if (s) {
            var sT = _.filter(that._holidayCalendar.holidayList[y], [
              "belongsTo",
              h.belongsTo,
            ]);
            var sI = _.findIndex(sT, {
              month: m.format("MM"),
              day: m.format("DD"),
              belongsTo: h.belongsTo,
            });

            var aT = _.filter(that._holidayCalendar.holidayList[y], {
              month: m.format("MM"),
              day: m.format("DD"),
            });
            var aI = _.findIndex(aT, {
              id: h.id,
            });

            e = {
              title: m.format("MMMM, ddd DD"),
              holiday: { ...s },
              hasPast: sI > 0,
              hasFuture: sI < sT.length - 1,
              hasOverflow: calcOverflow(sI, o, sT),
              rowIndex: aI,
              rowSpan: calcSpan(sI, o, sT),
            };
            l.push(e);
          }
        });
      }

      return l;
    },
  };
});
