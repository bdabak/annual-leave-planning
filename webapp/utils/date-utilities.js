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

    getAnnualLeaves: function () {
      return this.getProxyModelProperty("/annualLeaves");
    },

    formatDate: function (d) {
      var m = moment(d, "DD.MM.YYYY");

      return m.format("DD.MM.YYYY");
    },
    convertDateToPeriod: function (d) {
      var m;
      if(d === null || d === undefined){
         m = moment(new Date());
      }else{
         m = moment(d, "DD.MM.YYYY");
      }

      return this.getPeriod(m);
    },
    convertPeriodToDate: function (p) {
      var m = moment(p.day + "." + p.month + "." + p.year, "DD.MM.YYYY");

      return m.format("DD.MM.YYYY");
    },
    getMonthData: function (y, m) {
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
    checkAnnualVisible: function () {
      var s = _.find(this.getProxyModelProperty("/page/legend"), [
        "type",
        "annual",
      ]);

      if (s && s?.selected) {
        return true;
      } else {
        return false;
      }
    },

    getEventColor: function (t) {
      var s = _.find(this.getProxyModelProperty("/page/legend"), ["type", t]);

      if (s && s?.design) {
        return s.design;
      } else {
        return "spp-unknown";
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

      //--Search in planned leaves
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

    checkDateAnnual: function (d) {
      if (!this.checkAnnualVisible()) {
        return;
      }

      var m = moment(d, "DD.MM.YYYY");

      //--Search in annual leaves
      var pL = _.find(this.getAnnualLeaves(), function (l, i) {
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
      var eSD =
        this.getProxyModelProperty("/page/header/entitlementDate") || null;
      if (eSD) {
        var s = moment(eSD);
        var e = s.clone().add(1, "y");
      }
      var m = moment(d, "DD.MM.YYYY");
      var t = moment(new Date());

      return m.isAfter(t, "day") && m.isBetween(s, e, undefined, "[)");
    },

    getDayAttributesWithinPeriod: function (p, o) {
      var m = moment(p.day + "." + p.month + "." + p.year, "DD.MM.YYYY");
      var s, e;
      if (o === "Y") {
        s = m.clone().startOf("year");
        e = m.clone().endOf("year");
      } else {
        s = m.clone().startOf("month");
        e = m.clone().endOf("month");
      }
      var a = [];

      while (s.isSameOrBefore(e)) {
        var l = this.getDayAttributes(s, true) || [];
        if (l.length > 0) {
          a.push({
            date: s.format("DD.MM.YYYY"),
            dayOfWeek: s.format("e"),
            day: s.format("DD"),
            dayText: s.format("dddd"),
            month: s.format("MM"),
            monthText: s.format("MMM"),
            year: s.format("YYYY"),
            eventList: _.cloneDeep(l),
          });
        }
        s.add(1, "d");
      }

      return a;
    },

    getEventsWithinPeriod: function () {
      var that = this;
      var p = this.getProxyModelProperty("/page/period") || null;
      var eSD =
        this.getProxyModelProperty("/page/header/entitlementDate") || null;
      if (eSD) {
        var sP = moment(eSD);
        sP.year(p.year);
        var eP = sP.clone().add(1, "y");
      }

      var eL = [];

      var _checkEventLiesWithinPeriod = function (s, e) {
        var sM = moment(s);
        var eM = moment(e);
        var lwp = false;

        if (eM.isBefore(sP) || sM.isAfter(eP)) {
          return false;
        }

        if (
          sM.isBetween(sP, eP, undefined, "[]") ||
          eM.isBetween(sP, eP, undefined, "[]") ||
          (sM.isAfter(sP) && eM.isSameOrBefore(eP)) ||
          (sM.isBefore(eP) && eM.isSameOrAfter(eP))
        ) {
          return true;
        }

        // while (sM.isSameOrBefore(eM)) {
        //   if(sM.isBetween(sP,eP, undefined, "[]")){
        //     lwp = true;
        //     break;
        //   }
        //   sM.add(1, "d");
        // }

        return lwp;
      };

      //--List annual leaves
      if (this.checkAnnualVisible()) {
        var aC = that.getEventColor("annual");
        $.each(this.getAnnualLeaves(), function (i, c) {
          var l = _checkEventLiesWithinPeriod(c.startDate, c.endDate);
          if (l) {
            var sD = moment(c.startDate);
            var eD = moment(c.endDate);
            var e = {
              eventId: c.eventId,
              type: "annual",
              color: aC,
              text: "Yıllık izin",
              startDate: {
                date: sD.format("DD.MM.YYYY"),
                dayOfWeek: sD.format("e"),
                day: sD.format("DD"),
                dayText: sD.format("dddd"),
                month: sD.format("MM"),
                monthText: sD.format("MMM"),
                year: sD.format("YYYY"),
              },
              endDate: {
                date: eD.format("DD.MM.YYYY"),
                dayOfWeek: eD.format("e"),
                day: eD.format("DD"),
                dayText: eD.format("dddd"),
                month: eD.format("MM"),
                monthText: eD.format("MMM"),
                year: eD.format("YYYY"),
              },
            };

            eL.push(e);
          }
        });
      }

      //--List plans
      if (this.checkPlannedVisible()) {
        var pC = that.getEventColor("planned");
        $.each(this.getPlannedLeaves(), function (i, c) {
          var l = _checkEventLiesWithinPeriod(c.startDate, c.endDate);
          if (l) {
            var sD = moment(c.startDate);
            var eD = moment(c.endDate);
            var e = {
              eventId: c.eventId,
              type: "planned",
              color: pC,
              text: "Planlı izin",
              startDate: {
                date: sD.format("DD.MM.YYYY"),
                dayOfWeek: sD.format("e"),
                day: sD.format("DD"),
                dayText: sD.format("dddd"),
                month: sD.format("MM"),
                monthText: sD.format("MMM"),
                year: sD.format("YYYY"),
              },
              endDate: {
                date: eD.format("DD.MM.YYYY"),
                dayOfWeek: eD.format("e"),
                day: eD.format("DD"),
                dayText: eD.format("dddd"),
                month: eD.format("MM"),
                monthText: eD.format("MMM"),
                year: eD.format("YYYY"),
              },
            };

            eL.push(e);
          }
        });
      }

      //--List holidays
      if (this.checkHolidaysVisible()) {
      }

      return eL;
    },

    getDayAttributes: function (d, a = false) {
      var m = moment.isMoment(d) ? d.clone() : moment(d, "DD.MM.YYYY");
      var y = m.clone().format("YYYY");
      var l = [];
      var e = {};
      var that = this;
      var o = parseInt(m.format("E"), 10);

      var calcSpan = function (i, s, sT) {
        if (a) {
          return 1;
        }
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
        if (a) {
          return false;
        }
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
        if (a) {
          if (i === sT.length - 1) {
            return false;
          }
          return true;
        }

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
              m: m,
              eventId: c.eventId,
              title: m.format("MMMM, ddd DD"),
              type: "planned",
              color: pC,
              text: "Planlı izin",
              hasPast: !p.start,
              hasFuture: a
                ? p.index < pL.length - 1
                  ? true
                  : false
                : p.index === 0
                ? pL.length === 1
                  ? false
                  : p.week === pL[pL.length - 1].week
                  ? false
                  : true
                : p.index === pL.length - 1
                ? false
                : true,
              hasOverflow: a
                ? false
                : p.index === 0 || p.day === 1
                ? false
                : true,
              rowIndex: 0,
              rowSpan: a
                ? 1
                : p.index !== 0 && p.day !== 1
                ? 1
                : p.day === 7 || p.index === pL.length - 1
                ? 1
                : pL.length - p.index + p.day - 1 > 7
                ? 7
                : pL.length - p.index,
              startDate: moment(c.startDate).format("DD MMM"),
              endDate: moment(c.endDate).format("DD MMM"),
            };
            l.push(e);
          } else {
            return true;
          }
        });
      }

      //--Search in annual leaves
      if (this.checkAnnualVisible()) {
        var pC = that.getEventColor("annual");
        $.each(this.getAnnualLeaves(), function (i, c) {
          if (
            m.isBetween(moment(c.startDate), moment(c.endDate), undefined, "[]")
          ) {
            var pL = findDatesBetweenPeriod(c.startDate, c.endDate);

            var p = _.find(pL, ["date", m.toDate()]);
            if (!p) {
              return true;
            }
            e = {
              eventId: c.eventId,
              m: m,
              title: m.format("MMMM, ddd DD"),
              type: "annual",
              color: pC,
              text: "Yıllık izin",
              hasPast: !p.start,
              hasFuture: a
                ? p.index < pL.length - 1
                  ? true
                  : false
                : p.index === 0
                ? pL.length === 1
                  ? false
                  : p.week === pL[pL.length - 1].week
                  ? false
                  : true
                : p.index === pL.length - 1
                ? false
                : true,
              hasOverflow: a
                ? false
                : p.index === 0 || p.day === 1
                ? false
                : true,
              rowIndex: 0,
              rowSpan: a
                ? 1
                : p.index !== 0 && p.day !== 1
                ? 1
                : p.day === 7 || p.index === pL.length - 1
                ? 1
                : pL.length - p.index + p.day - 1 > 7
                ? 7
                : pL.length - p.index,
              startDate: moment(c.startDate).format("DD MMM"),
              endDate: moment(c.endDate).format("DD MMM"),
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
                eventId: null,
                m: m,
                title: m.format("MMMM, ddd DD"),
                type: "holiday",
                color: hC,
                text: s.text,
                hasPast: sI > 0,
                hasFuture: calcHasFuture(sI, sT, y),
                hasOverflow: calcOverflow(sI, o, sT),
                rowIndex: a ? 0 : aI,
                rowSpan: calcSpan(sI, o, sT),
                startDate: moment(
                  sT[0].day + "." + sT[0].month + "." + y,
                  "DD.MM.YYYY"
                ).format("DD MMM"),
                endDate: moment(
                  sT[sT.length - 1].day +
                    "." +
                    sT[sT.length - 1].month +
                    "." +
                    y,
                  "DD.MM.YYYY"
                ).format("DD MMM"),
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
