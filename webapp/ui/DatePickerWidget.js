sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidgetHeader",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidgetContent",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (
    Control,
    WidgetHeader,
    WidgetContent,
    dateUtilities,
    eventUtilities
  ) {
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
            shared: {
              type: "boolean",
              bindable: true,
              defaultValue: false,
            },
            callerElement:{
              type: "object",
              bindable: true,
              defaultValue: null
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

          if (!this._firstRender) {
            this._firstRender = true;
          }

          if (!this.getFloating()) {
            return;
          }

          var t = this.$();

          if (this.getShared()) {
            var oEP = this.getElementPosition() || null;

            if (!oEP) {
              return;
            }

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
              // y = oEP.offset.top + oEP.outerHeight + 5;
              y = oEP.offset.top;
            }

            var fX = oEP.offset.left + eOW;

            if (fX > cW.width()) {
              x = oEP.offset.left - (fX - cW.width());
            } else {
              x = oEP.offset.left;
            }

            var s = `transform: translate(${x}px, ${y}px); position:fixed !important; z-index:22;`;

            t.removeAttr("style").attr("style", s);
          } else {
           
            var x, y;

            x = 0;
            y = 40;
            var s = `transform: translate(${x}px, ${y}px);`;

            t.removeAttr("style").attr("style", s);
          }
        },
        /**
         * @override
         */
        onBeforeRendering: function () {
          Control.prototype.onBeforeRendering.apply(this, arguments);

          if (!this._firstBeforeRender) {
            this._firstBeforeRender = true;
            /* Subscribe Event Handlers */
            if (this.getShared()) {
              eventUtilities.subscribeEvent(
                "PlanningCalendar",
                "ToggleDatePicker",
                this._handleToggleDatePicker,
                this
              );
            }

            if (this.getShared()) {
              eventUtilities.subscribeEvent(
                "PlanningCalendar",
                "CloseDatePicker",
                this._handleCloseDatePicker,
                this
              );
            }

            if (this.getShared()) {
              eventUtilities.subscribeEvent(
                "PlanningCalendar",
                "ModalClosed",
                this._handleHideDatePicker,
                this
              );
            }
          }
        },
        init: function () {
          var wH = new WidgetHeader({
            periodChange: this.onPeriodChange.bind(this),
          });
          this.setAggregation("_widgetHeader", wH);

          var wC = new WidgetContent();
          this.setAggregation("_widgetContent", wC);
        },
        _handleCloseDatePicker: function(c,e,o){
          var c = this.getCallerElement();
          var n = o.Element;

          if(c === n){
            this._handleHideDatePicker();
          }
        },
        _handleToggleDatePicker: function(c,e,o){

          var c = this.getCallerElement();
          var n = o.Element;

          if(c !== n){
            this._handleHideDatePicker();
          }

          if(this.getVisible()){
            this._handleHideDatePicker();
          }else{
            this._handleOpenDatePicker(o);
          }
          

        },
        _handleHideDatePicker: function () {
          this.setVisible(false);
          this.setCallerElement(null);
          this.setPeriod(null);
          this.setSelectedDate(null);
        },
        _handleOpenDatePicker: function (o) {
          var d = o.Element.getValue() || null;
          var r = o.Element.getReferenceDate() || null;
          var p;
          
          if (!r && !d) {
            p = dateUtilities.getToday();
            d = dateUtilities.convertPeriodToDate(p);
          } else {
            p = r ? dateUtilities.convertDateToPeriod(r) : dateUtilities.convertDateToPeriod(d);
          }

          this.setPeriod(p);
          this.setSelectedDate(d);
          this.setCallerElement(o.Element);

          var r = o.Element.$();

          var eP = {
            offset: { ...r.offset() },
            outerHeight: r.outerHeight(),
            outerWidth: r.outerWidth(),
          };

          this.setElementPosition(eP);

          // var dP = new DatePickerWidget({
          //   floating: true,
          //   period: p,
          //   select: function (e) {
          //     var d = e.getParameter("selectedDate");
          //     that.setValue(d);
          //     that.fireChanged({
          //       date: d
          //     });
          //     dP.setVisible(false);
          //   },
          //   selectedDate: d,
          //   elementPosition: null,
          //   visible: false,
          // });

          this.setVisible(true);
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

          if (!p) {
            p = dateUtilities.getToday();
          }

          // if (!s) {
          //   s = dateUtilities.convertPeriodToDate(p);
          // }

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
              this.getCallerElement().handleValueSelection(dateUtilities.formatDate(c.data("date")));
              this._handleHideDatePicker();
              // this.setSelectedDate(dateUtilities.formatDate(c.data("date")));
              // if (this.getFloating()) {
              //   this.fireSelect({
              //     selectedDate: c.data("date"),
              //   });
              // }
            }
          }
        },
      }
    );
  }
);
