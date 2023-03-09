sap.ui.define(
  [
    "sap/ui/core/Control",
  ],
  function (Control) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetPeriodYear",
      {
        metadata: {
          properties: {
            year: {
              type: "string",
              bindable: true,
              defaultValue:""
            },
          },
          aggregations: {},
          events: {
            press:{

            }
          },
        },
        init: function () {},
        renderer: function (oRM, oControl) {
          oRM
            .openStart("button", oControl) //--Year button
            .class("spp-widget")
            .class("spp-button")
            .class("spp-datepicker-yearbutton")
            .class("spp-last-visible-child")
            .class("spp-text")
            .attr("role", "presentation")
            .attr("data-ref","yearButton")
            .openEnd();
          //--Year Label
          oRM
            .openStart("label",) //--Year button
            .attr("role", "presentation") 
            .openEnd();
            oRM.text(oControl.getYear());
            oRM.close("label")
          //--Year Label
          oRM.close("button"); //--Year button
        },
        ontap: function(e){
          if($(e.target).hasClass("spp-datepicker-yearbutton")){
            this.firePress();
          }
        }
      }
    );
  }
);
