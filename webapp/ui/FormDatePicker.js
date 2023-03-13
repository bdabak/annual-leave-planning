sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/FormFieldTrigger",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidget",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
  ],
  function (Control, FieldTrigger, DatePickerWidget, dateUtilities) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.FormDatePicker", {
      metadata: {
        properties: {
          value: {
            type: "string",
            bindable: true,
          },
          type: {
            type: "string",
            bindable: true,
            defaultValue: "text",
          },
          name: {
            type: "string",
            bindable: true,
          },
          autoComplete: {
            type: "string",
            bindable: true,
            defaultValue: "off",
          },
          placeHolder: {
            type: "string",
            bindable: true,
            defaultValue: "",
          },
          role: {
            type: "string",
            bindable: true,
            defaultValue: "presentation",
          },
        },
        aggregations: {
          dateTrigger: {
            type: "com.thy.ux.annualleaveplanning.ui.FormFieldTrigger",
            multiple: false,
          },
        },

        associations: {
          datePickerWidget: {
            type: "com.thy.ux.annualleaveplanning.ui.FormFieldTrigger",
            multiple: false,
          },
        },

        events: {
          selectDate: {
            sourceField: {
              type: "object",
            },
            handleSelection: {
              type: "function",
            },
            period: {
              type: "object",
            },
          },
        },
      },

      init: function () {
        var dT = new FieldTrigger({
          icon: "spp-icon-calendar",
          alignEnd: true,
          press: this.toggleDatePicker.bind(this),
        });
        this.setAggregation("dateTrigger", dT);
      },

      registerDatePickerWidget: function (c) {
        this.setAssociation("datePickerWidget", c.getId());
      },

      handleValueSelection: function (v) {
        this.setValue(dateUtilities.formatDate(v));
        this.closeDatePicker();
      },

      closeDatePicker: function () {
        var a = this.getAssociation("datePickerWidget", null);
        if (a) {
          var c = $("#" + a).control();
          if (c && c.length > 0) {
            c[0].destroy();
            this._dateSelectionActive = false;
            this.removeAssociation("datePickerWidget", a, true);
          }
        }
        this._dateSelectionActive = false;
      },

      openDatePicker: function () {
        if (!this._dateSelectionActive) {
          this.closeDatePicker();
          this._dateSelectionActive = true;
          this.fireSelectDate({
            targetField: this.getParent(),
            sourceField: this,
            period: dateUtilities.convertDateToPeriod(this.getValue()),
          });
        }
      },

      toggleDatePicker: function () {
        if (this._dateSelectionActive) {
          this.closeDatePicker();
        } else {
          this.openDatePicker();
        }
      },
      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl);
        oRM.class("spp-field-inner");
        oRM.openEnd();

        //--Input--//
        oRM.openStart("input");
        oRM.attr("type", oControl.getType());
        oRM.attr("name", oControl.getName());
        oRM.attr("autocomplete", oControl.getAutoComplete());
        oRM.attr("placeholder", oControl.getPlaceHolder());
        oRM.attr("role", oControl.getRole());
        oRM.attr("value", oControl.getValue());
        oRM.openEnd();
        oRM.close("input"); //Main
        //--Input--//

        // $.each(oControl.getAggregation("triggers"), function(i,t){
        //     oRM.renderControl(t);
        // });
        oRM.renderControl(oControl.getAggregation("dateTrigger"));

        oRM.close("div"); //Main
      },
      onfocusin: function () {
        this.openDatePicker();
      },
    });
  }
);
