sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (Control, dateUtilities, eventUtilities) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PlanningPagePeriod",
      {
        metadata: {
          properties: {
            mode: {
              type: "string",
              bindable: true,
              defaultValue: "Y",
            },
            period: {
              type: "object",
              bindable: true,
            },
            refresh:{
              type: "string",
              bindable: true,
            }
          },
          aggregations: {},
          events: {},
        },
        init: function () {
          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "PeriodChanged",
            this.onPeriodChanged,
            this
          );

          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "ViewChangeCompleted",
            this.onPostViewChange,
            this
          );
        },
  
        onPostViewChange: function (c, e, o) {
          
          var r = false;
          var bPeriodChanged = this.checkPeriodChanged(o.mode, o.period);
          var bModeChanged = this.getMode() !== o.mode;
          if(bModeChanged || bPeriodChanged){
            if(o && o.hasOwnProperty("mode") && bModeChanged){
              this.setProperty("mode",o.mode, true);
              r = true;
            }
            if(o && o.hasOwnProperty("period") && bPeriodChanged){
              this.setProperty("period", o.period, true)
              r = true;
            }
            if(r){
              this.setRefresh(new Date().getTime());
            }
          }
        },

        onPeriodChanged: function (c, e, o) {
          var bPeriodChanged = this.checkPeriodChanged(o.mode, o.period);
          var bModeChanged = this.getMode() !== o.mode;
          if( bModeChanged || bPeriodChanged ){
            if(bPeriodChanged && o.fnCallback){
              o.fnCallback();
            }
            bModeChanged ? this.setProperty("mode",o.mode, true) : null;
            bPeriodChanged ? this.setProperty("period", o.period, true) : null;
            this.setRefresh(new Date().getTime());
          }
        },

        checkPeriodChanged: function(m,p){
          var x = this.getPeriod();
          switch(m){
            case "Y":
              return x.year !== p.year;    
            case "M": 
              return x.year !== p.year || x.month !== p.month ;
            default:
              return false;
          }
        },

        renderer: function (oRM, oControl) {
          oRM.openStart("div", oControl); //Period
          oRM
            .class("spp-html")
            .class("spp-widget")
            .class("spp-calendar-view-desc")
            .class("spp-box-item");
          oRM.openEnd();
          oRM.openStart("span"); //Period text
          oRM.class("spp-calendar-view-desc-text");
          oRM.openEnd();
          oRM.text(dateUtilities.formatPeriodText(oControl.getPeriod(), oControl.getMode()));
          oRM.close("span"); //Period text
          oRM.close("div"); //Period
        },
      }
    );
  }
);
