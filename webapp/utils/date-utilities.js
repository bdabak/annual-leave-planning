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
      return this.getProxyModelProperty("/HolidayCalendar");
    },

    getPlannedLeaves: function () {
      return this.getProxyModelProperty("/PlannedLeaves");
    },

    getAnnualLeaves: function () {
      return this.getProxyModelProperty("/AnnualLeaves");
    },

    formatDate: function (d) {
      var m = moment(d, "DD.MM.YYYY").hour(3);

      return m.format("DD.MM.YYYY");
    },
    convertDateToPeriod: function (d) {
      var m;
      if (d === null || d === undefined) {
        m = moment(new Date());
      } else {
        m = moment(d, "DD.MM.YYYY");
      }

      return this.getPeriod(m);
    },
    convertPeriodToDate: function (p) {
      var m = moment(p.day + "." + p.month + "." + p.year, "DD.MM.YYYY");

      return m.format("DD.MM.YYYY");
    },

    convertPeriodToDateObject: function (p) {
      var m = moment(p.day + "." + p.month + "." + p.year, "DD.MM.YYYY").hour(
        3
      );
      var d = m.toDate();

      return d;
    },

    calculateOffsetDate: function (d, o, y) {
      var m = moment(d);

      o === "+" ? m.add(y, "y").subtract(1, "d") : m.subtract(y, "y");

      return m.toDate();
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
      if (!d) {
        return null;
      }

      var m = moment(d, "DD.MM.YYYY").hour(3);
      var d = m.toDate();

      return d;
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
      var s = _.find(this.getProxyModelProperty("/Page/LegendGroup"), [
        "DataSource",
        "HL",
      ]);

      if (s && s?.Selected) {
        return true;
      } else {
        return false;
      }
    },

    checkPlannedVisible: function () {
      // var s = _.find(this.getProxyModelProperty("/Page/LegendGroup"), [
      //   "DataSource",
      //   "PL",
      // ]);

      // if (s && s?.Selected) {
      //   return true;
      // } else {
      //   return false;
      // }

      var s = _.filter(this.getProxyModelProperty("/Page/LegendGroup"), [
        "DataSource",
        "PL",
      ]);

      var v = false;

      $.each(s, function(i,e){
        if(e.Selected){
          v = true;
          return false;
        }
      });
     
      return v;
    },
    checkAnnualVisible: function () {
      var s = _.filter(this.getProxyModelProperty("/Page/LegendGroup"), [
        "DataSource",
        "AL",
      ]);

      var v = false;

      $.each(s, function(i,e){
        if(e.Selected){
          v = true;
          return false;
        }
      });
     
      return v;
    },

    getEventColor: function (t) {
      // var s = _.find(this.getProxyModelProperty("/Page/Legend"), ["Type", t]);

      // if (s && s?.Design) {
      //   return s.Design;
      // } else {
      //   return "spp-unknown";
      // }
    },

    checkDateHoliday: function (d) {
      if (!this.checkHolidaysVisible()) {
        return;
      }

      var m = moment(d, "DD.MM.YYYY");
      var y = m.format("YYYY");

      //--Search in variable holidays
      var v = _.find(this.getHolidayCalendar()?.HolidayList[y], {
        Month: m.format("MM"),
        Day: m.format("DD"),
      });
      if (!v) {
        return null;
      }
      return v;
    },
    checkDatePlanned: function (d) {
      if (!this.checkPlannedVisible()) {
        return;
      }

      var m = moment(d, "DD.MM.YYYY");
      m.hour(3);

      //--Search in planned leaves
      var pL = _.find(this.getPlannedLeaves(), function (l, i) {
        if (
          m.isBetween(moment(l.StartDate), moment(l.EndDate), undefined, "[]")
        ) {
          return true;
        }
      });

      if (!pL) {
        return null;
      }
      return pL;
    },

    // getLegendAttributes: function (s, e) {
    //   var g = this.getProxyModelProperty("/Page/LegendGroup") || [];

    //   if (g.length === 0) {
    //     return null;
    //   }

    //   var r = _.filter(g, ["DataSource", s]) || [];

    //   if (r.length === 0) {
    //     return null;
    //   }

    //   var f;

    //   switch (s) {
    //     case "HL":
    //       return r[0].LegendItemSet[0];
    //     case "PL":
    //       $.each(r, function (i, l) {
    //         f =
    //           _.find(l.LegendItemSet, {
    //             EventType: e.LeaveType,
    //             EventStatus: e.LeaveStatus,
    //           }) || null;
    //         if (f !== null) {
    //           return false;
    //         }
    //       });

    //       return f;
    //     case "AL":
    //       $.each(r, function (i, l) {
    //         f =
    //           _.find(l.LegendItemSet, function(y){
    //             if(y.EventStatus.includes(";")){
    //               var z = y.EventStatus.split(";") ;
    //               return z.includes(e.StatusCode);
    //             }else{
    //               return y.EventStatus === e.StatusCode;
    //             }
    //           }) || null;
    //         if (f !== null) {
    //           return false;
    //         }
    //       });

    //       return f;

    //     default:
    //       return null;
    //   }
    // },

    checkDateAnnual: function (d) {
      if (!this.checkAnnualVisible()) {
        return;
      }

      var m = moment(d, "DD.MM.YYYY").hour(3);

      //--Search in annual leaves
      var pL = _.find(this.getAnnualLeaves(), function (l, i) {
        if (
          m.isBetween(moment(l.StartDate), moment(l.EndDate), undefined, "[]")
        ) {
          return true;
        }
      });

      if (!pL) {
        return null;
      }
      return pL;
    },

    checkDateIsSelectable: function (d) {
      var eSD =
        this.getProxyModelProperty("/Page/Header/QuotaAccrualBeginDate") ||
        null;
      if (eSD) {
        var s = moment(eSD);
        var e = s.clone().add(1, "y");
      }
      var m = moment(d, "DD.MM.YYYY").hour(3);
      var t = moment(new Date());

      return m.isAfter(t, "day");
      // return m.isAfter(t, "day") && m.isBetween(s, e, undefined, "[)");
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
      var p = this.getProxyModelProperty("/Page/Period") || null;
      var eSD =
        this.getProxyModelProperty("/Page/Header/QuotaAccrualBeginDate") ||
        moment(new Date()).hour(3).startOf("month").toDate();
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

        return lwp;
      };

      //--List annual leaves
      if (this.checkAnnualVisible()) {
        // var aC = that.getEventColor("annual");
        $.each(this.getAnnualLeaves(), function (i, c) {
          var l = _checkEventLiesWithinPeriod(c.StartDate, c.EndDate);
          if (l) {
            var sD = moment(c.StartDate);
            var eD = moment(c.EndDate);
            var v = that.getEventTypeVisible(c.LegendAttributes.LegendGroupKey, c.LegendAttributes.LegendItemKey );

            if(!v){
              return true;
            }
            var e = {
              eventId: c.EventId,
              eventType: c.LegendAttributes.LegendGroupKey + "_" + c.LegendAttributes.LegendItemKey,
              color: c.LegendAttributes.EventColor,
              text: c.LegendAttributes.LegendItemCount > 1 ? c.LegendAttributes.LegendGroupName + "-" + c.LegendAttributes.LegendItemName : c.LegendAttributes.LegendGroupName,
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
              duration: c.Kaltg,     
              editable: c.LegendAttributes.Editable,
              splittable: c.LegendAttributes.Splittable,
              deletable: c.LegendAttributes.Deletable,
            };

            eL.push(e);
          }
        });
      }

      //--List plans
      if (this.checkPlannedVisible()) {
        // var pC = that.getEventColor("planned");
        $.each(this.getPlannedLeaves(), function (i, c) {
          var l = _checkEventLiesWithinPeriod(c.StartDate, c.EndDate);
          if (l) {
            var sD = moment(c.StartDate);
            var eD = moment(c.EndDate);
            var v = that.getEventTypeVisible(c.LegendAttributes.LegendGroupKey, c.LegendAttributes.LegendItemKey );

            if(!v){
              return true;
            }
            var e = {
              eventId: c.EventId,
              eventType: c.LegendAttributes.LegendGroupKey + "_" + c.LegendAttributes.LegendItemKey,
              color: c.LegendAttributes.EventColor,
              text: c.LegendAttributes.LegendItemCount > 1 ? c.LegendAttributes.LegendGroupName + "-" + c.LegendAttributes.LegendItemName : c.LegendAttributes.LegendGroupName,
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
              duration: c.UsedQuota,
              editable: c.LegendAttributes.Editable,
              splittable: c.LegendAttributes.Splittable,
              deletable: c.LegendAttributes.Deletable,
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

    getEventTypeVisible:function(g,i){  
      var lg = this.getProxyModelProperty("/Page/LegendGroup") || [];

      if(lg.length === 0){
        return false;
      }

      var a = _.find(lg, ["LegendGroupKey", g]) || null;

      if(!a){
        return false;
      }

      if(a.LegendItemSet.length === 1){
        return a.Selected;
      }else{
        var b = _.find(a.LegendItemSet, ["LegendItemKey", i]) || null;
        if(!b){
          return false;
        }

        return b.Selected;
      }

    },

    getDayAttributes: function (d, a = false) {
      var m = moment.isMoment(d)
        ? d.clone().hour(3)
        : moment(d, "DD.MM.YYYY").hour(3);
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
            sT[sT.length - 1].Day + "." + sT[sT.length - 1].Month + "." + y,
            "DD.MM.YYYY"
          );
          var b = moment(sT[0].Day + "." + sT[0].Month + "." + y, "DD.MM.YYYY");
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

      //--Search in annual leaves
      if (this.checkAnnualVisible()) {
        // var pC = that.getEventColor("annual");
        $.each(this.getAnnualLeaves(), function (i, c) {
          if (
            m.isBetween(moment(c.StartDate), moment(c.EndDate), undefined, "[]")
          ) {
            var pL = findDatesBetweenPeriod(c.StartDate, c.EndDate);

            var p = _.find(pL, ["date", m.toDate()]);
            if (!p) {
              return true;
            }

            var v = that.getEventTypeVisible(c.LegendAttributes.LegendGroupKey, c.LegendAttributes.LegendItemKey );

            if(!v){
              return true;
            }

            e = {
              m: m,
              eventId: c.EventId,
              // eventType: "annual",
              eventType: c.LegendAttributes.LegendGroupKey + "_" + c.LegendAttributes.LegendItemKey,
              title: m.format("MMMM, ddd DD"),
              color: c.LegendAttributes.EventColor,
              text: c.LegendAttributes.LegendItemCount > 1 ? c.LegendAttributes.LegendGroupName + "-" + c.LegendAttributes.LegendItemName : c.LegendAttributes.LegendGroupName,
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
              duration: c.Kaltg,
              editable: c.LegendAttributes.Editable,
              splittable: c.LegendAttributes.Splittable,
              deletable: c.LegendAttributes.Deletable,
            };
            l.push(e);
          } else {
            return true;
          }
        });
      }

      //--Search in plans
      if (this.checkPlannedVisible()) {
        // var pC = that.getEventColor("planned");
        $.each(this.getPlannedLeaves(), function (i, c) {
          if (
            m.isBetween(moment(c.StartDate), moment(c.EndDate), undefined, "[]")
          ) {
            var pL = findDatesBetweenPeriod(c.StartDate, c.EndDate);

            var p = _.find(pL, ["date", m.toDate()]);
            if (!p) {
              return true;
            }
            var v = that.getEventTypeVisible(c.LegendAttributes.LegendGroupKey, c.LegendAttributes.LegendItemKey );

            if(!v){
              return true;
            }

            e = {
              m: m,
              eventId: c.EventId,
              // eventType: "planned",
              eventType: c.LegendAttributes.LegendGroupKey + "_" + c.LegendAttributes.LegendItemKey,
              title: m.format("MMMM, ddd DD"),
              color: c.LegendAttributes.EventColor,
              text: c.LegendAttributes.LegendItemCount > 1 ? c.LegendAttributes.LegendGroupName + "-" + c.LegendAttributes.LegendItemName : c.LegendAttributes.LegendGroupName,
              hasPast: !p.start,
              hasFuture: a
                ? p.index < pL.length - 1
                  ? true
                  : false
                : p.index === 0 || p.day === 1
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
              startDate: moment(c.StartDate).format("DD MMM"),
              endDate: moment(c.EndDate).format("DD MMM"),
              duration: c.UsedQuota,
              editable: c.LegendAttributes.Editable,
              splittable: c.LegendAttributes.Splittable,
              deletable: c.LegendAttributes.Deletable,
            };
            l.push(e);
          } else {
            return true;
          }
        });
      }

      //--Search in holidays
      if (this.checkHolidaysVisible()) {
        // var hC = that.getEventColor("holiday");

        var hL =
          _.filter(this.getHolidayCalendar()?.HolidayList[y], {
            Month: m.format("MM"),
            Day: m.format("DD"),
          }) || [];
        if (hL.length > 0) {
          $.each(hL, function (i, h) {
            var s = _.find(that.getHolidayCalendar().HolidayInfo, [
              "HolidayGroupId",
              h.HolidayGroupId,
            ]);
            if (s) {
              var sT = _.filter(that.getHolidayCalendar().HolidayList[y], [
                "HolidayGroupId",
                h.HolidayGroupId,
              ]);
              var sI = _.findIndex(sT, {
                Month: m.format("MM"),
                Day: m.format("DD"),
                HolidayGroupId: h.HolidayGroupId,
              });

              var aT = _.filter(that.getHolidayCalendar().HolidayList[y], {
                Month: m.format("MM"),
                Day: m.format("DD"),
              });
              var aI = _.findIndex(aT, {
                HolidayId: h.HolidayId,
              });

              e = {
                m: m,
                eventId: null,
                // eventType: "holiday",
                eventType: h.LegendAttributes.LegendGroupKey,
                title: m.format("MMMM, ddd DD"),
                color: h.LegendAttributes.EventColor,
                text: s.HolidayGroupText,
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
                duration: null,
                editable: false,
                splittable: false,
                deletable: false
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
