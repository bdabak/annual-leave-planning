sap.ui.define(["sap/ui/core/Control","com/thy/ux/annualleaveplanning/ui/CalendarWeek"], function (Control,
	Week) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.CalendarWeeks", {
    metadata: {
      properties: {
        draggable: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        month:{
          type: "object",
          bindable: true,
        },
        mode: {
          type: "string",
          bindable: true,
          defaultValue: ""
        },
        datePicker:{
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
        items: {
          type: "com.thy.ux.annualleaveplanning.ui.CalendarWeek",
          multiple: true,
          singularName:"item"
        }
      },
      events: {},
    },
    renderer: function (oRM, oControl) {
      var m = oControl.getMonth();
      var year = m.year;
      var mode = oControl.getMode();
      var dP = oControl.getDatePicker();
      var s = oControl.getSelectedDate();
      oRM.openStart("div").class("spp-weeks-container").class("notranslate");
      if (oControl.getDraggable()) {
        oRM.class("spp-draggable").class("spp-droppable");
      }
      oRM.openEnd();
      $.each(m.weeks, function (i, w) {
        var d = _.filter(m.days, { week: w });
        var y = new Week({
          week: w,
          year: year,
          days: d,
          mode: mode,
          datePicker: dP,
          selectedDate: s
        });
        oControl.addAggregation("items", y);
        oRM.renderControl(y);
      });
      oRM.close("div");
    },
  });
});
