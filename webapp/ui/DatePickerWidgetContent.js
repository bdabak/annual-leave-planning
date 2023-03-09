sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/CalendarWeekdaysRow",
    "com/thy/ux/annualleaveplanning/ui/CalendarWeeks",
    "com/thy/ux/annualleaveplanning/utils/date-utilities"
  ],
  function (Control, WeekdaysRow, Weeks, dateUtilities) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetContent",
      {
        metadata: {
          properties: {
            period:{
              type: "object",
              bindable: true
            },
            selectedDate:{
              type: "string",
              bindable: true
            }
          },
          aggregations: {
            _weekdaysRow: {
              type: "com.thy.ux.annualleaveplanning.ui.CalendarWeekdaysRow",
              multiple: false,
            },
            _weeks: {
              type: "com.thy.ux.annualleaveplanning.ui.CalendarWeeks",
              multiple: false,
            },
          },
          events: {
            select: {
              parameters: {
                selectedDate: {
                  type: "object",
                },
              },
            },
          },
        },
        init: function () {
          var wR = new WeekdaysRow({
            dayFormat: "dd",
          });
          this.setAggregation("_weekdaysRow", wR);

          var wL = new Weeks({
            draggable: false,
            datePicker: true
          });
          this.setAggregation("_weeks", wL);
        },
        renderer: function (oRM, oControl) {
          oRM
            .openStart("div", oControl) //Month

            .class("spp-panel-content")
            .class("spp-calendarpanel-content")
            .class("spp-datepicker-content")
            .class("spp-schedulerdatepicker-content")
            .class("spp-eventrenderer-content")
            .class("spp-calendardatepicker-content")
            .class("spp-box-center")
            .class("spp-content-element")
            .class("spp-auto-container")
            .class("spp-no-visible-children")
            .class("spp-flex-column")
            .openEnd();
          

          //--Weekdays
          oControl.renderWeekDays(oRM);
          //--Weekdays

          //--Render calendar days
          oControl.renderWeeks(oRM);
          //--Render calendar days

          // oRM.close("div"); ////Month View Content
          // oRM.close("div"); // Month View Body Wrapper
          oRM.close("div"); //Month View
        },
        renderWeekDays: function (oRM) {
          var wR = this.getAggregation("_weekdaysRow");
          oRM.renderControl(wR);
        },  

        
        renderWeeks: function (oRM) {
          var oControl = this;
          var p = oControl.getPeriod();
          var s = oControl.getSelectedDate() || null;
          var m = dateUtilities.getMonthData(
            p.year,
            p.month
          );
          var wL = oControl.getAggregation("_weeks");

          wL.setMonth(_.cloneDeep(m));
          wL.setSelectedDate(_.cloneDeep(s));
          oRM.renderControl(wL);
        },
      }
    );
  }
);
