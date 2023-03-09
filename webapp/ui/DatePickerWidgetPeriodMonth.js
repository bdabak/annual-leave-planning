sap.ui.define(
  [
    "sap/ui/core/Control",
  ],
  function (Control) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetPeriodMonth",
      {
        metadata: {
          properties: {
            month: {
              type: "string",
              bindable: true,
              defaultValue: "",
            },
          },
          aggregations: {},
          events: {
            press: {},
          },
        },
        init: function () {},
        renderer: function (oRM, oControl) {
          oRM
            .openStart("div", oControl)
            .class("spp-widget")
            .class("spp-field")
            .class("spp-textfield")
            .class("spp-pickerfield")
            .class("spp-combo")
            .class("spp-readonlycombo")
            .class("spp-datepicker-monthfield")
            .class("spp-not-editable")
            .class("spp-first-visible-child")
            .openEnd();
          oRM.openStart("div").class("spp-field-inner").openEnd(); //--Inner
          oRM
            .openStart("div") //--Comboo
            .attr("role", "combobox")
            .attr("aria-haspopup", "listbox")
            .attr("autocomplete", "off")
            .attr("type", "text")
            .openEnd()
            .text(oControl.getMonth());
          oRM.close("div"); //Combo
          oRM.close("div"); //Inner
          oRM.close("div"); //Main
        },
        ontap: function (e) {
          if ($(e.target).hasClass("spp-combo")) {
            this.firePress();
          }
        },
      }
    );
  }
);
