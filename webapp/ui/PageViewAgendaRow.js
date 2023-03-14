sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.PageViewAgendaRow", {
    metadata: {
      properties: {
        date: {
          type: "object",
          bindable: true,
        },
      },
      aggregations: {},
      events: {},
    },
    renderer: function (oRM, oControl) {
      var d = dateUtilities.getDayAttribute(oControl.getDate());
      oRM
        .openStart("div", oControl) //Main
        .class("spp-grid-row")
        .class("spp-cal-agenda-grid-row")
        .attr("role", "row")
        .openEnd()
        .openStart("div")
        .class("spp-grid-cell")
        .class("spp-calendar-cell")
        .class("spp-agendacolumn-cell")
        .class("spp-sticky-cell");

      // TODO
      // .class("spp-day-of-week-0")
      // .class("spp-nonworking-day");

      oRM.attr("role", "gridcell").openEnd();

      //--Left content
      oControl.renderDate(oRM,oControl, d);
      //--Left content

      //--Right content
      oControl.renderEvents(oRM,oControl, d);
      //--Right content

      oRM.close("div").close("div");
    },

    renderEvents: function (oRM, oControl, d) {

    },
    renderDate: function (oRM, oControl, d) {
      oRM
        .openStart("div") //Date
        .class("spp-day-name")
        .class("spp-cal-agenda-date")
        .attr("role", "presentation")
        .openEnd();

      //--Date no
      oRM
        .openStart("div") //Date
        .class("spp-cal-agenda-date-date-number")
        .attr("role", "presentation")
        .openEnd();
      //TODO date no
      oRM.close("div");
      //--Date no

      //--Date text--//
      oRM
        .openStart("div") //Date
        .class("spp-cal-agenda-date-date-text")
        .attr("role", "presentation")
        .openEnd();
      oRM
        .openStart("div") //Date
        .openEnd();
      //TODO Day text
      oRM.close("div");

      oRM
        .openStart("div") //Date
        .openEnd();
      //TODO Month year
      oRM.close("div");

      oRM.close("div");
      //--Date text--//

      oRM.close("div");
    },
  });
});
