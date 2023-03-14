sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.Event", {
    metadata: {
      properties: {
        eventType: {
          type: "string",
          bindable: true,
          defaultValue: "",
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
        rowIndex: {
          type: "int",
          bindable: true,
          defaultValue: 0,
        },
        rowSpan: {
          type: "int",
          bindable: true,
          defaultValue: 1,
        },
        endDate: {
          type: "string",
          bindable: true,
          defaultValue: null,
        },
        forAgenda: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
      },
      aggregations: {},
      events: {},
    },
    renderer: function (oRM, oControl) {
      var bPast = oControl.getHasPast();
      var bEvent = oControl.getEventType();
      var bFuture = oControl.getHasFuture();
      var bOVerflow = oControl.getHasOverflow();
      var iRow =
        oControl.getParent()?.getEvents()?.length > 0
          ? oControl.getParent()?.getEvents()?.length - 1
          : 0 || 0;
      var iSpan = oControl.getRowSpan();
      var bAgenda = oControl.getForAgenda();
      oRM.openStart("div", oControl); //Main
      oRM
        .class("spp-cal-event-wrap")
        .class("spp-allday")
        .class("spp-solid-bar")
        .class("spp-past-event");

      if (bEvent === "newEvent") {
        oRM.class("spp-is-creating");
      }

      if (bOVerflow) {
        oRM.class("spp-overflow");
      } else {
        bPast ? oRM.class("spp-continues-past") : null;
        bFuture ? oRM.class("spp-continues-future") : null;
      }

      var w = (function (s) {
        if (s === 1) {
          return "14.29%";
        } else {
          var l = 14.29 * s;
          l = l > 100 ? 100 : l;
          return l.toString() + "%";
        }
      })(iSpan);

      if (!bAgenda) {
        if (!bPast && bFuture) {
          oRM.style("width", `${w}`);
          oRM.style("top", `${((iRow + 1) * 22 + 3).toString() + "px"}`);
        } else {
          oRM.style("width", `${w}`);
          oRM.style("top", `${((iRow + 1) * 22 + 3).toString() + "px"}`);
        }
      } else {
        oRM.style("min-width", "150px");
      }
      //--Render day class
      oRM.class(oControl.getColor());
      //--Render day class
      oRM.attr("role", "presentation");
      oRM.openEnd();

      //--Render event
      oRM.openStart("div").class("spp-cal-event");
      oRM.style("height", oControl.getHeight());
      if (bAgenda) {
        oRM.style("justify-content", "center");
      }
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
        .attr("role", "presentation");
      
      oRM.openEnd();

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
