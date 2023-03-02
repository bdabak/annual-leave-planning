sap.ui.define(["./moment"], function (momentJS) {
  "use strict";

  return {
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
      var m = moment(p.year + "-" + p.month + "-" + p.day, "YYYY-MM-DD");
      switch (a) {
        case "Y":
          return m.format("YYYY");
        case "M":
          return m.format("MMMM YYYY");
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
  };
});
