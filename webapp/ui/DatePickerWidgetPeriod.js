sap.ui.define(
  [
    "sap/ui/core/Control",
  ],
  function (Control) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetPeriod",
      {
        metadata: {
          properties: {

          },
          aggregations: {
            monthPicker:{
              type: "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetPeriodMonth",
              multiple: false
            },
            yearPicker:{
              type: "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetPeriodYear",
              multiple: false
            }
          },
          events: {},
        },
        init: function () {},
        renderer: function (oRM, oControl) {
          oRM
            .openStart("div", oControl)
            .class("spp-widget").class("spp-container").class("spp-datepicker-title").class("spp-content-element").class("spp-auto-container").class("spp-box-item").class("spp-flex-row")
           
            .openEnd();

          //--Month--//
          oRM.renderControl(oControl.getAggregation("monthPicker"));
          //--Month--//
          // //--Year--//
          oRM.renderControl(oControl.getAggregation("yearPicker"));
          // //--Year--//

          oRM.close("div"); //Main
        },
      }
    );
  }
);
