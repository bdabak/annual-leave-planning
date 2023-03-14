sap.ui.define(["./moment", "./lodash"], function (momentJS, lodashJS) {
  "use strict";

  var _planModel = {};
  return {
    setProxyModel: function (m) {
      this._planModel = m;
    },

    getProxyModel: function () {
      return this._planModel;
    },

    getProxyModelProperty: function (p) {
      return this._planModel.getProperty(p);
    },

    getHolidayCalendar: function () {
      return this.getProxyModelProperty("/holidayCalendar");
    },

    getPlannedLeaves: function () {
      return this.getProxyModelProperty("/plannedLeaves");
    },

    formatDate: function (d) {
      //--Init momentJS
      this.initializeMoment();

      var m = moment(d, "DD.MM.YYYY");

      return m.format("DD.MM.YYYY");
    },
    convertDateToPeriod: function (d) {
      //--Init momentJS
      this.initializeMoment();

      var m = moment(d, "DD.MM.YYYY");

      return this.getPeriod(m);
    },
    convertPeriodToDate: function (p) {
      //--Init momentJS
      this.initializeMoment();

      var m = moment(p.day + "." + p.month + "." + p.year, "DD.MM.YYYY");

      return m.format("DD.MM.YYYY");
    },
    getMonthData: function (y, m) {
      //--Init momentJS
      this.initializeMoment();

      var m = m.toString().padStart(2, "0") + "." + y.toString();
      var o = moment(m, "MM.YYYY"); // Get moment object of month
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
          date: s.format("DD.MM.YYYY"),
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
      var m = moment(p.day + "." + p.month + "." + p.year, "DD.MM.YYYY");

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
      var m = moment(p.day + "." + p.month + "." + p.year, "DD.MM.YYYY");

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
      var m = moment(p.day + "." + p.month + "." + p.year, "DD.MM.YYYY");
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
      var oP = moment(o.day + "." + o.month + "." + o.year, "DD.MM.YYYY");
      var nP = moment(n.day + "." + n.month + "." + n.year, "DD.MM.YYYY");
      return oP.isAfter(nP) ? "L" : oP.isBefore(nP) ? "R" : null;
    },

    convertToDate: function (d) {
      var m = moment(d, "DD.MM.YYYY");

      return m.toDate();
    },

    findDatesBetweenTwoDates: function (b, e) {
      var startDate = moment(b, "DD.MM.YYYY").clone(),
        dates = [],
        endDate = moment(e, "DD.MM.YYYY").clone();

      while (startDate.isSameOrBefore(endDate)) {
        dates.push(startDate.format("DD.MM.YYYY"));
        startDate.add(1, "d");
      }
      return dates;
    },

    checkHolidaysVisible: function () {
      //var s = _.find(this._legendSettings, ["type", "holiday"]);
      var s = _.find(this.getProxyModelProperty("/page/legend"), [
        "type",
        "holiday",
      ]);

      if (s && s?.selected) {
        return true;
      } else {
        return false;
      }
    },

    checkPlannedVisible: function () {
      //var s = _.find(this._legendSettings, ["type", "holiday"]);
      var s = _.find(this.getProxyModelProperty("/page/legend"), [
        "type",
        "planned",
      ]);

      if (s && s?.selected) {
        return true;
      } else {
        return false;
      }
    },

    getEventColor: function(t){
      var s = _.find(this.getProxyModelProperty("/page/legend"), [
        "type",
        t,
      ]);

      if(s && s?.design){
        return s.design
      }else{
        return "spp-unknown"
      }
    },

    checkDateHoliday: function (d) {
      if (!this.checkHolidaysVisible()) {
        return;
      }

      var m = moment(d, "DD.MM.YYYY");
      var y = m.format("YYYY");

      //--Search in variable holidays
      var v = _.find(this.getHolidayCalendar()?.holidayList[y], {
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
    checkDatePlanned: function (d) {
      if (!this.checkPlannedVisible()) {
        return;
      }

      var m = moment(d, "DD.MM.YYYY");

      //--Search in variable holidays
      var pL = _.find(this.getPlannedLeaves(), function (l, i) {
        // console.log(m,l);
        if (
          m.isBetween(moment(l.startDate), moment(l.endDate), undefined, "[]")
        ) {
          return true;
        }
      });

      if (!pL) {
        return null;
      }
      return true;
    },

    checkDateIsSelectable: function (d) {
      var m = moment(d, "DD.MM.YYYY");
      var t = moment(new Date());

      return m.isAfter(t, "day");
    },

    getDayAttributes: function (d) {
      var m = moment(d, "DD.MM.YYYY");
      var y = m.clone().format("YYYY");
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

      var calcHasFuture = function (i, sT, y) {
        if (i === 0) {
          if (sT.length === 1) {
            return false;
          }

          var e = moment(
            sT[sT.length - 1].day + "." + sT[sT.length - 1].month + "." + y,
            "DD.MM.YYYY"
          );
          var b = moment(sT[0].day + "." + sT[0].month + "." + y, "DD.MM.YYYY");
          var bW = b.week();
          var eW = e.week();
          if (bW === eW) {
            return false;
          } else {
            return true;
          }
        } else {
          if (i === sT.length - 1) {
            return false;
          } else {
            return true;
          }
        }
      };

      var findDatesBetweenPeriod = function (s, e) {
        var d = [];
        var b = moment(s);
        var c = b.clone();
        var l = moment(e);
        var i = 0;

        while (c.isSameOrBefore(l)) {
          d.push({
            m: c,
            date: c.toDate(),
            week: c.week(),
            day: c.day(),
            start: c.isSame(b),
            end: c.isSame(e),
            index: i,
          });
          c.add(1, "d");
          i++;
        }
        return d;
      };

      //--Search in plans
      if (this.checkPlannedVisible()) {
        var pC = that.getEventColor("planned");
        $.each(this.getPlannedLeaves(), function (i, c) {
          if (
            m.isBetween(moment(c.startDate), moment(c.endDate), undefined, "[]")
          ) {
            var pL = findDatesBetweenPeriod(c.startDate, c.endDate);

            var p = _.find(pL, ["date", m.toDate()]);
            if (!p) {
              return true;
            }
            e = {
              title: m.format("MMMM, ddd DD"),
              type: "planned",
              color: pC,
              text: "Planlı izin",
              hasPast: !p.start,
              hasFuture:
                p.index === 0
                  ? pL.length === 1
                    ? false
                    : p.week === pL[pL.length - 1].week
                    ? false
                    : true
                  : p.index === pL.length - 1
                  ? false
                  : true,
              hasOverflow: p.index === 0 || p.day === 1 ? false : true,
              rowIndex: 0,
              rowSpan:
                p.index !== 0 && p.day !== 1
                  ? 1
                  : p.day === 7 || (p.index === pL.length - 1)
                  ? 1
                  : (pL.length - p.index + p.day - 1) > 7
                  ? 7
                  : pL.length - p.index,
            };
            l.push(e);
          } else {
            return true;
          }
        });
      }

      //--Search in holidays
      if (this.checkHolidaysVisible()) {
        var hC = that.getEventColor("holiday");

        var hL =
          _.filter(this.getHolidayCalendar()?.holidayList[y], {
            month: m.format("MM"),
            day: m.format("DD"),
          }) || [];
        if (hL.length > 0) {
          $.each(hL, function (i, h) {
            var s = _.find(that.getHolidayCalendar().holidayInfo, [
              "id",
              h.belongsTo,
            ]);
            if (s) {
              var sT = _.filter(that.getHolidayCalendar().holidayList[y], [
                "belongsTo",
                h.belongsTo,
              ]);
              var sI = _.findIndex(sT, {
                month: m.format("MM"),
                day: m.format("DD"),
                belongsTo: h.belongsTo,
              });

              var aT = _.filter(that.getHolidayCalendar().holidayList[y], {
                month: m.format("MM"),
                day: m.format("DD"),
              });
              var aI = _.findIndex(aT, {
                id: h.id,
              });

              e = {
                title: m.format("MMMM, ddd DD"),
                type: "holiday",
                color: hC,
                text: s.text,
                hasPast: sI > 0,
                hasFuture: calcHasFuture(sI, sT, y),
                hasOverflow: calcOverflow(sI, o, sT),
                rowIndex: aI,
                rowSpan: calcSpan(sI, o, sT),
              };
              l.push(e);
            }
          });
        }
      }

      return l;
    },
  };
});
