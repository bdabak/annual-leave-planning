sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/FormFieldTrigger",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidget",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
  ],
  function (Control, FieldTrigger, DatePickerWidget, dateUtilities) {
    "use strict";
    var _firstRender = false;
    return Control.extend("com.thy.ux.annualleaveplanning.ui.FormDatePicker", {
      metadata: {
        properties: {
          value: {
            type: "string",
            bindable: true,
          },
          referenceDate: {
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
          role: {
            type: "string",
            bindable: true,
            defaultValue: "presentation",
          },
          editable: {
            type: "boolean",
            bindable: true,
            defaultValue: true,
          },
        },
        aggregations: {
          dateTrigger: {
            type: "com.thy.ux.annualleaveplanning.ui.FormFieldTrigger",
            multiple: false,
          },
          datePickerWidget: {
            type: "com.thy.ux.annualleaveplanning.ui.DatePickerWidget",
            multiple: false,
          },
        },

        associations: {
          // datePickerWidget: {
          //   type: "com.thy.ux.annualleaveplanning.ui.DatePickerWidget",
          //   multiple: false,
          // },
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
        var that = this;
        var dT = new FieldTrigger({
          icon: "spp-icon-calendar",
          alignEnd: true,
          press: this.toggleDatePicker.bind(this),
        });
        this.setAggregation("dateTrigger", dT);
      },

      createDatePicker: function(){
        var that =  this;
        var d = this.getValue() || this.getReferenceDate() || null;
        var p;

        if (!d) {
          p = dateUtilities.getToday();
          d = dateUtilities.convertPeriodToDate(p);
        } else {
          p = dateUtilities.convertDateToPeriod(d);
        }

        var dP = new DatePickerWidget({
          floating: true,
          period: p,
          select: function (e) {
            var d = e.getParameter("selectedDate");
            that.setValue(d);
            dP.setVisible(false);
          },
          selectedDate: d,
          elementPosition: null,
          visible: false,
        });

        this.setAggregation("datePickerWidget", dP); 
        
        return dP;

      },  
      renderDatePicker: function (oRM) {
        var dP = this.getAggregation("datePicker") || null;
        if (!dP) {
          dP = this.createDatePicker();
        }
        oRM.renderControl(dP);
      },

      registerDatePickerWidget: function (c) {
        this.setAssociation("datePickerWidget", c.getId());
      },

      handleValueSelection: function (v) {
        this.setValue(dateUtilities.formatDate(v));
        this.closeDatePicker();
      },

      closeDatePicker: function () {
        var dP = this.getAggregation("datePickerWidget");

        if (dP.getVisible()) {
          dP.setVisible(false);
          // this.getParent().setProperty("opened", false);
        }
        // var a = this.getAssociation("datePickerWidget", null);
        // if (a) {
        //   var c = $("#" + a).control();
        //   if (c && c.length > 0) {
        //     c[0].destroy();
        //     this._dateSelectionActive = false;
        //     this.removeAssociation("datePickerWidget", a, true);
        //   }
        // }
        // this._dateSelectionActive = false;
      },

      openDatePicker: function () {
        var dP = this.getAggregation("datePickerWidget");

        if (!dP.getVisible()) {
          dP.setVisible(true);
          // this.getParent().setProperty("opened", true);
        }

        
        // if (!this._dateSelectionActive) {
        //   this.closeDatePicker();
        //   this._dateSelectionActive = true;
        //   this.fireSelectDate({
        //     targetField: this.getParent(),
        //     sourceField: this,
        //     period: dateUtilities.convertDateToPeriod(this.getValue()),
        //   });
        // }
      },

      toggleDatePicker: function () {
        var dP = this.getAggregation("datePickerWidget");

        if(!dP){
          return;
        }

        if (dP.getVisible()) {
          this.closeDatePicker();
        } else {
          this.openDatePicker();
        }
      },
      /**
       * @override
       */
      onAfterRendering: function() {
        Control.prototype.onAfterRendering.apply(this, arguments);
        
        if(!this._firstRender){
          this._firstRender = true;
        }
      
      },
      renderer: function (oRM, oControl) {
        var bEditable = oControl.getEditable();
        oRM.openStart("div", oControl);
        oRM.class("spp-field-inner");
        oRM.openEnd();

        //--Input--//
        oRM.openStart("input");
        oRM.class("spp-input-focus");
        oRM.attr("type", oControl.getType());
        oRM.attr("name", oControl.getName());
        oRM.attr("autocomplete", oControl.getAutoComplete());
        oRM.attr("role", oControl.getRole());
        oControl.getValue() ? oRM.attr("value", oControl.getValue()) : null;
        oRM.attr("disabled", !bEditable);
        oRM.openEnd();
        oRM.close("input"); //Main
        //--Input--//

        if (bEditable) {
          oRM.renderControl(oControl.getAggregation("dateTrigger"));
          // oRM.renderControl(oControl.getAggregation("datePickerWidget"));
          oControl.renderDatePicker(oRM);
        }

        oRM.close("div"); //Main
      },
      onfocusin: function (e) {
        if ($(e.target).hasClass("spp-input-focus")) {
          if (this.getEditable()) {
            this.openDatePicker();
          }
        }
      },
    });
  }
);
