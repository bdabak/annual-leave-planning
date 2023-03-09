sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidgetPeriod",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidgetPeriodMonth",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidgetPeriodYear",
    "com/thy/ux/annualleaveplanning/ui/Toolbar",
    "com/thy/ux/annualleaveplanning/ui/Button",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
  ],
  function (Control, Period,MonthPicker, YearPicker, Toolbar, Button, dateUtilities) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetHeader",
      {
        metadata: {
          properties: {
            period: {
              type: "object",
              bindable: true,
            },
          },
          aggregations: {
            _toolbar: {
              type: "com.thy.ux.annualleaveplanning.ui.Toolbar",
              multiple: false,
            },
          },
          events: {
            periodChange: {
              parameters: {
                direction: {
                  type: "string",
                },
                term: {
                  type: "string",
                }
              }
            } 

          },
        },
        init: function () {},
        renderer: function (oRM, oControl) {
          oRM
            .openStart("div", oControl)
            .class("spp-widget")
            .class("spp-container")
            .class("spp-toolbar")
            .class("spp-dock-top")
            .class("spp-top-toolbar")
            .class("spp-hbox")
           
            .openEnd();

          //--Toolbar--//
          oControl.renderToolbar(oRM);
          //--Toolbar--//

          oRM.close("div"); //Main
        },
        renderToolbar: function (oRM) {

          var o = this.getAggregation("_toolbar");

          var t = new Toolbar({
            hasWrapper: false,
            hasOverflow: false,
            items: [
              new Button({
                icon: "spp-icon-first",
                iconButton: true,
                attributes: [
                  {
                    name: "data-ref",
                    value: "prevYear",
                  },
                ],
                press: $.proxy(this.triggerPeriodChange, this, "-", "Y"),
              }),
              new Button({
                icon: "spp-icon-previous",
                iconButton: true,
                attributes: [
                  {
                    name: "data-ref",
                    value: "prevMonth",
                  },
                ],
                press: $.proxy(this.triggerPeriodChange, this, "-", "M"),
              }),
              new Period({
                monthPicker: new MonthPicker({
                  month: dateUtilities.formatPeriodText(this.getPeriod(), "m"),
                }),
                yearPicker: new YearPicker({
                  year: dateUtilities.formatPeriodText(this.getPeriod(), "Y"),
                }),
              }),
              new Button({
                icon: "spp-icon-next",
                iconButton: true,
                attributes: [
                  {
                    name: "data-ref",
                    value: "nextMonth",
                  },
                ],
                press: $.proxy(this.triggerPeriodChange, this, "+", "M"),
              }),
              new Button({
                icon: "spp-icon-last",
                iconButton: true,
                attributes: [
                  {
                    name: "data-ref",
                    value: "nextYear",
                  },
                ],
                press: $.proxy(this.triggerPeriodChange, this, "+", "Y"),
              }),
            ],
          });
          this.setAggregation("_toolbar", t);
          if(o){
            o.destroy();
          }
          oRM.renderControl(t);
        },

        triggerPeriodChange: function(d,t){
          this.firePeriodChange({direction: d, term: t});
        }
      }
    );
  }
);
