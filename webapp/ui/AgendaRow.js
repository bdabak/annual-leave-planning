sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/AgendaEventContainer",
    "com/thy/ux/annualleaveplanning/ui/Event",
    "com/thy/ux/annualleaveplanning/model/formatter"
  ],
  function (Control,
	AgendaEventContainer,
	Event,
	formatter) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.AgendaRow", {
      metadata: {
        properties: {
          rowInfo: {
            type: "object",
            bindable: true,
          },
          height: {
            type: "int",
            bindable: true,
          },
          top: {
            type: "int",
            bindable: true,
          },
        },
        aggregations: {
          eventContainer: {
            type: "com.thy.ux.annualleaveplanning.ui.AgendaEventContainer",
            multiple: false,
          },
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        var r = oControl.getRowInfo();
        var h = oControl.getHeight();
        var t = oControl.getTop() || 0;
        oRM
          .openStart("div", oControl) //Main
          .class("spp-grid-row")
          .class("spp-cal-agenda-grid-row")
          .attr("role", "row");

        oRM.style("height", h + "px");
        //t > 0 ? oRM.style("top", t + "px") : null;
        oRM
          .openEnd()
          .openStart("div")
          .class("spp-grid-cell")
          .class("spp-calendar-cell")
          .class("spp-agendacolumn-cell")
          .class("spp-sticky-cell")
          .class(`spp-day-of-week-${r.startDate.dayOfWeek}`)
          .class(
            r.startDate.dayOfWeek > 4 ? "spp-nonworking-day" : "spp-working-day"
          );

        oRM.style("min-width", "60px").style("width", "100px");

        oRM.attr("role", "gridcell").openEnd();

        //--Left content
        oControl.renderDate(oRM, oControl, r);
        //--Left content

        //--Right content
        oControl.renderEvents(oRM, oControl, r);
        //--Right content

        oRM.close("div").close("div");
      },

      renderEvents: function (oRM, oControl, r) {
        oControl.destroyAggregation("eventContainer");
        var eC = new AgendaEventContainer();

        var n = new Event({
          eventId: r.eventId,
          eventType: r.eventType,
          leaveType: r.leaveType,
          color: r.color,
          text: r.text,
          height: "25px",
          hasPast: false,
          hasFuture: false,
          hasOverflow: false,
          rowIndex: 1,
          rowSpan: 1,
          startDate: r.startDate,
          endDate: r.endDate,
          forAgenda: true,
          editable: r.editable,
          splittable: r.splittable,
          mergable: r.mergable,
          deletable: r.deletable,
          rejected: r.rejected,
          duration: formatter.suppressZeroDecimal(r.duration) + " " + this.getModel("i18n").getResourceBundle().getText("days"),
          errorMessage: r?.errorMessage || null
        });

        eC.addAggregation("events", n);

        oControl.setAggregation("eventContainer", eC);
        oRM.renderControl(eC);
      },
      renderDate: function (oRM, oControl, r) {
        oRM
          .openStart("div") //Date
          .class("spp-day-name")
          .class("spp-cal-agenda-date")
          .attr("role", "presentation")
          .openEnd();

        //--Date no
        oRM
          .openStart("div") 
          .class("spp-cal-agenda-date-date-number")
          .attr("role", "presentation")
          .openEnd();
        oRM.text(r.startDate.day);
        oRM.close("div");
        //--Date no

        //--Date text--//
        oRM
          .openStart("div") 
          .class("spp-cal-agenda-date-date-text")
          .attr("role", "presentation")
          .openEnd();

        oRM
          .openStart("div") //Date
          .openEnd();
        oRM.text(r.startDate.monthText + " " + r.startDate.year);
        oRM.close("div");

        oRM
          .openStart("div") //Date
          .openEnd();
        oRM.text(r.startDate.dayText);
        oRM.close("div");

        oRM.close("div");
        //--Date text--//

        // oRM.close("div");

        // oRM
        //   .openStart("div") //Date
        //   .class("spp-day-name")
        //   .class("spp-cal-agenda-date")
        //   .attr("role", "presentation")
        //   .openEnd();

        oRM.openStart("span")
           .class("spp-icon")
           .class("spp-fa-minus")
           .class("sapUiSmallMarginBeginEnd")
           .openEnd()
           .close("span");

        //--Date no
        oRM
          .openStart("div") //Date
          .class("spp-cal-agenda-date-date-number")
          .attr("role", "presentation")
          .openEnd();
        oRM.text(r.endDate.day);
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
        oRM.text(r.endDate.monthText + " " + r.endDate.year);
        oRM.close("div");

        oRM
          .openStart("div") //Date
          .openEnd();
        oRM.text(r.endDate.dayText);
        oRM.close("div");

        oRM.close("div");
        //--Date text--//

        oRM.close("div");
      },

      onmouseover: function () {
        $(this.getDomRef()).addClass("spp-hover");
      },
      onmouseout: function () {
        $(this.getDomRef()).removeClass("spp-hover");
      },
    });
  }
);
