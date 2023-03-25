sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidgetHeader",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidgetContent",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
  ],
  function (Control, WidgetHeader, WidgetContent, dateUtilities) {
    "use strict";
    var _firstRender = false;
    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.DatePickerWidget",
      {
        metadata: {
          properties: {
            floating: {
              type: "boolean",
              bindable: true,
              defaultValue: false,
            },
            period: {
              type: "object",
              bindable: true,
            },
            elementPosition: {
              type: "object",
              bindable: true,
            },
            selectedDate: {
              type: "string",
              bindable: true,
            },
          },
          aggregations: {
            _widgetHeader: {
              type: "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetHeader",
              multiple: false,
            },
            _widgetContent: {
              type: "com.thy.ux.annualleaveplanning.ui.DatePickerWidgetContent",
              multiple: false,
            },
          },
          events: {
            select: {
              parameters: {
                selectedDate: {
                  type: "string",
                },
              },
            },
          },
        },

        /**
         * @override
         */
        onAfterRendering: function () {
         
          Control.prototype.onAfterRendering.apply(this, arguments);

          if(!this._firstRender){
            this._firstRender = true;
            // this.setVisible(false);
          }

          if (!this.getFloating()) {
            return;
          }
          // var oEP = this.getElementPosition() || null;

          // if (!oEP) {
          //   return;
          // }
          var t = this.$();
          var o = t.parent().parent();

          var oEP = {
            offset: { ...o.offset() },
            outerHeight:  o.outerHeight(),
            outerWidth: o.outerWidth(),
          };

          var eO = t.offset();
          var eOH = t.outerHeight();
          var eOW = t.outerWidth();
          var cW = $(window);
          var x, y;

          var tH = oEP.offset.top;
          var bH = cW.height() - (oEP.offset.top + oEP.outerHeight);

          if (tH > bH) {
            y = oEP.offset.top - eOH - 15;
          } else {
            y = oEP.offset.top + oEP.outerHeight + 5;
          }

          var fX = oEP.offset.left + eOW;

          if (fX > cW.width()) {
            x = oEP.offset.left - (fX - cW.width());
          } else {
            x = oEP.offset.left;
          }

          // var s = `transform: translate(${x}px, ${y}px); position:fixed !important; z-index:22;`;
          x=0;
          y=40;
          var s = `transform: translate(${x}px, ${y}px);`;

          t.removeAttr("style").attr("style", s);
        },

        init: function () {
          var wH = new WidgetHeader({
            periodChange: this.onPeriodChange.bind(this),
          });
          this.setAggregation("_widgetHeader", wH);

          var wC = new WidgetContent();
          this.setAggregation("_widgetContent", wC);
        },
        onPeriodChange: function (e) {
          var d = e.getParameter("direction");
          var t = e.getParameter("term");
          var p = this.getPeriod();
         
          switch (d) {
            case "+": //Next period
              p = dateUtilities.getNextPeriod(p, t);
              break;
            case "-": //Previous period
              p = dateUtilities.getPrevPeriod(p, t);
              break;
          }

          this.setProperty("period", p);
        },
        renderer: function (oRM, oControl) {

          var p = oControl.getPeriod() || null;
          var s = oControl.getSelectedDate() || null;

          if (!s || !p) {
            p = dateUtilities.getToday();
            s = dateUtilities.convertPeriodToDate(p);
          }

          // if (!p) {
          //   p = dateUtilities.convertDateToPeriod(s);
          // } 

          //--Set header
          var wH = oControl.getAggregation("_widgetHeader");
          wH.setPeriod(p);

          //--Set content
          var wC = oControl.getAggregation("_widgetContent");
          wC.setPeriod(p);
          wC.setSelectedDate(s);

          oRM
            .openStart("div", oControl) //Main date picker
            .class("spp-widget")
            .class("spp-container")
            .class("spp-panel")
            .class("spp-calendarpanel")
            .class("spp-datepicker")
            .class("spp-schedulerdatepicker")
            .class("spp-eventrenderer")
            .class("spp-calendardatepicker")
            .class("spp-panel-has-top-toolbar")
            .class("spp-vbox");
          if (oControl.getFloating()) {
            oRM
              .class("spp-floating")
              .class("spp-floating-fixed")
              .class("spp-focus-trapped")
              .class("spp-aligned-below")
              .class("spp-outer")
              .class("spp-overlay-scrollbar");
            oRM.attr("role", "dialog");
          } else {
            oRM.attr("role", "grid");
          }
          oRM.openEnd();

          //--Datepicker Container--//
          oRM
            .openStart("div")
            .class("spp-vbox")
            .class("spp-box-center")
            .class("spp-panel-body-wrap")
            .class("spp-calendardatepicker-body-wrap")
            .attr("role", "presentation");
          oRM.openEnd();

          //--Header--//
          oRM.renderControl(wH);
          //--Header--//

          //  //--Content--//
          oRM.renderControl(wC);
          //--Content--//

          oRM.close("div");
          //--Datepicker Container--//

          oRM.close("div"); //Main date picker
        },

        ontap: function (e) {
          e.preventDefault();
          var t = $(e.target);

          if (
            t.hasClass("spp-calendar-cell") ||
            t.hasClass("spp-datepicker-cell-inner")
          ) {
            var c = t.hasClass("spp-datepicker-cell-inner")
              ? t.parent(".spp-calendar-cell")
              : t;
            if (c && c.length === 1) {
              this.setSelectedDate(dateUtilities.formatDate(c.data("date")));
              if (this.getFloating()) {
                this.fireSelect({
                  selectedDate: c.data("date"),
                });
              }
            }
          }
        },
      }
    );
  }
);
