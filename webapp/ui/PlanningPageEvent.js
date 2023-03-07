sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.PlanningPageEvent", {
    metadata: {
      properties: {
        eventType:{
          type: "string",
          bindable: true,
          defaultValue: ""
        },
        color: {
          type: "string",
          bindable: true,
        },
        text: {
          type: "string",
          bindable: true,
        },
        height: {
          type: "sap.ui.core.CSSSize",
          bindable: true,
          defaultValue: "25px",
        },
        hasPast: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        hasFuture: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        hasOverflow: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        rowIndex:{
          type: "int",
          bindable: true,
          defaultValue: 0
        },
        rowSpan:{
          type: "int",
          bindable: true,
          defaultValue: 1
        }
      },
      aggregations: {},
      events: {},
    },
    renderer: function (oRM, oControl) {
      var bPast = oControl.getHasPast();
      var bFuture = oControl.getHasFuture();
      var bOVerflow = oControl.getHasOverflow();
      var iRow = oControl.getRowIndex();
      var iSpan = oControl.getRowSpan();
      oRM.openStart("div", oControl); //Main
      oRM
        .class("spp-cal-event-wrap")
        .class("spp-allday")
        .class("spp-solid-bar")
        .class("spp-past-event");

      if(bOVerflow){
        oRM.class("spp-overflow");
      }else{
        bPast ? oRM.class("spp-continues-past") : null;
        bFuture ? oRM.class("spp-continues-future") : null;
      }
      
      var w = (function(s) {
        if(s === 1){
          return "14.29%";
        }else{
          return (14.29 * s).toString() + "%";
        }
      })(iSpan);
      
      if(!bPast && bFuture){
        oRM.style("width", `${w}`);
      }else{
        oRM.style("width", `${w}`);
        oRM.style("top", `${((iRow+1) * 22 + 3).toString() + "px"}`);
      }

      //--Render day class
      oRM.class(oControl.getColor());
      //--Render day class
      oRM.attr("role", "presentation");
      oRM.openEnd();

      //--Render event
      oRM.openStart("div").class("spp-cal-event");
      oRM.style("height", oControl.getHeight());
      oRM.attr("role", "presentation");
      oRM.openEnd();

      //--Render event icon--//
      oRM
        .openStart("i")
        .class("spp-cal-event-icon")
        .class("spp-icon")
        .class("spp-fw-icon")
        .class("spp-icon-circle");
      oRM.openEnd();
      oRM.close("i");
      //--Render event icon--//

      //--Render event body--//
      oRM
        .openStart("div")
        .class("spp-cal-event-body")
        .attr("role", "presentation")
        .openEnd();

      //--Render event description--//
      oRM
        .openStart("div")
        .class("spp-cal-event-desc")
        .attr("role", "presentation")
        .openEnd();
      oRM.text(oControl.getText());
      oRM.close("div");
      //--Render event description--//

      oRM.close("div");
      //--Render event body--//

      oRM.close("div");
      //--Render event

      oRM.close("div");
    },
  });
});
