sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, dateUtilities) {
    "use strict";

    return Controller.extend(
      "com.thy.ux.annualleaveplanning.controller.PlanView",
      {
        onInit: function () {
          var oViewModel = new JSONModel({});

          var holidayCalendar = {
            holidayList: {
              2023: [
                {
                  id: 1,
                  month: "01",
                  day: "01",
                  text: "Yılbaşı tatili",
                  type: "1",
                  belongsTo: "JAN01",
                },
                {
                  id: 2,
                  month: "04",
                  day: "20",
                  text: "Ramazan Bayram Arefesi",
                  type: "2",
                  belongsTo: "RAM",
                },
                {
                  id: 3,
                  month: "04",
                  day: "21",
                  text: "Ramazan Bayramı",
                  type: "1",
                  belongsTo: "RAM",
                },
                {
                  id: 4,
                  month: "04",
                  day: "22",
                  text: "Ramazan Bayramı",
                  type: "1",
                  belongsTo: "RAM",
                },
                {
                  id: 5,
                  month: "04",
                  day: "23",
                  text: "Ramazan Bayramı",
                  type: "1",
                  belongsTo: "RAM",
                },
                {
                  id: 51,
                  month: "04",
                  day: "24",
                  text: "Ramazan Bayramı",
                  type: "1",
                  belongsTo: "RAM",
                },
                {
                  id: 6,
                  month: "04",
                  day: "23",
                  text: "Ulusal Egemenlik ve Çocuk Bayramı",
                  type: "1",
                  belongsTo: "APR23",
                },
                {
                  id: 61,
                  month: "05",
                  day: "01",
                  text: "Emek ve Dayanışma Günü",
                  belongsTo: "MAY01",
                },
                {
                  id: 7,
                  month: "05",
                  day: "19",
                  text: "Atatürk'ü Anma Gençlik ve Spor Bayramı",
                  type: "1",
                  belongsTo: "MAY19",
                },
                {
                  id: 8,
                  month: "07",
                  day: "15",
                  text: "Demokrasi ve Millî Birlik Günü",
                  type: "1",
                  belongsTo: "JUL15",
                },
                {
                  id: 9,
                  month: "06",
                  day: "27",
                  text: "Kurban Bayram Arefesi",
                  type: "2",
                  belongsTo: "SAC",
                },
                {
                  id: 10,
                  month: "06",
                  day: "28",
                  text: "Kurban Bayramı",
                  type: "1",
                  belongsTo: "SAC",
                },
                {
                  id: 11,
                  month: "06",
                  day: "29",
                  text: "Kurban Bayramı",
                  type: "1",
                  belongsTo: "SAC",
                },
                {
                  id: 12,
                  month: "06",
                  day: "30",
                  text: "Kurban Bayramı",
                  type: "1",
                  belongsTo: "SAC",
                },
                {
                  id: 13,
                  month: "07",
                  day: "01",
                  text: "Kurban Bayramı",
                  type: "1",
                  belongsTo: "SAC",
                },
                {
                  id: 14,
                  month: "08",
                  day: "30",
                  text: "Zafer Bayramı",
                  type: "1",
                  belongsTo: "AUG30",
                },
                {
                  id: 15,
                  month: "10",
                  day: "28",
                  text: "Cumhuriyet Bayramı Arefesi",
                  type: "2",
                  belongsTo: "OCT28",
                },
                {
                  id: 16,
                  month: "10",
                  day: "29",
                  text: "Cumhuriyet Bayramı",
                  type: "1",
                  belongsTo: "OCT29",
                },
                {
                  id: 17,
                  month: "12",
                  day: "31",
                  text: "Yılbaşı Arefesi",
                  type: "2",
                  belongsTo: "DEC31",
                },
              ],
            },

            holidayInfo: [
              { id: "RAM", text: "Ramazan Bayramı 2023" },
              { id: "SAC", text: "Kurban Bayramı 2023" },
              { id: "JAN01", text: "Yılbaşı tatili 2023" },
              { id: "APR23", text: "Ulusal Egemenlik ve Çocuk Bayramı" },
              { id: "MAY01", text: "Emek ve Dayanışma Günü" },
              { id: "MAY19", text: "Atatürk'ü Anma Gençlik ve Spor Bayramı" },
              { id: "JUL15", text: "Demokrasi ve Millî Birlik Günü" },
              { id: "AUG30", text: "Zafer Bayramı" },
              { id: "OCT28", text: "Cumhuriyet Bayramı Arefesi" },
              { id: "OCT29", text: "Cumhuriyet Bayramı" },
              { id: "DEC31", text: "Yılbaşı Arefesi" },
            ],
          };

          dateUtilities.setHolidayCalendar(_.cloneDeep(holidayCalendar));
        },
      }
    );
  }
);
