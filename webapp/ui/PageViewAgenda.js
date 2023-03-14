/*global Swal*/
sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/AgendaRow",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (Control, AgendaRow, dateUtilities, eventUtilities) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.PageViewAgenda", {
      metadata: {
        properties: {
          period: {
            type: "object",
            bindable: true,
          },
          emptyText:{
            type: "string",
            bindable: true,
            defaultValue: ""
          }
        },
        aggregations: {
          rows: {
            type: "com.thy.ux.annualleaveplanning.ui.AgendaRow",
            multiple: true,
            singularNamr: "row"
          }
        },
        events: {},
      },

      init: function () {
        // eventUtilities.subscribeEvent(
        //   "PlanningCalendar",
        //   "PeriodChanged",
        //   this.onPeriodChanged,
        //   this
        // );
      },

      fetchPeriodAgenda: function(){
        var that = this;
        var m = sap.ui.Device.system.phone;
        var t = 0;
        var eL = dateUtilities.getDayAttributesWithinPeriod(this.getPeriod(), "Y");
        this.destroyAggregation("rows");
        $.each(eL, function(i,r ){
          var eH = (31 * r.eventList.length) + 43;
          if(m){
            eH = eH + 49;
          }
          var oRow = new AgendaRow({
            rowInfo: r,
            height: eH,
            top: t
          });
          t = t + eH;
          that.addAggregation("rows", oRow);
        });
      },

      renderer: function (oRM, oControl) {
        oControl.fetchPeriodAgenda();
        oRM.openStart("div", oControl); //Main
        oRM.class("spp-grid-panel-body");
        oRM.attr("role", "grid");

        oRM.style("--event-height", "25px")
           .style("--arrow-width","calc(var(--event-height) / 3)")
           .style("--arrow-margin","calc(var(--event-height) / -3)")
           .style("min-height","10em")
           .style("--week-length","7");

        oRM.openEnd();

        //--Header--//
        oControl.renderHeader(oRM);
        //--Header--//

        //--Body--//
        oControl.renderBody(oRM, oControl);
        //--Body--//

        oRM.close("div");
      },

      renderHeader: function (oRM) {
        oRM.openStart("header"); //Header
        oRM.class("spp-grid-header-container").class("spp-hidden");
        oRM.attr("role", "row");
        oRM.openEnd();

        oRM.openStart("div");
        oRM.class("spp-yscroll-pad");
        oRM.attr("role", "presentation");
        oRM.openEnd();
        oRM.openStart("div");
        oRM.class("spp-yscroll-pad-sizer");
        oRM.attr("role", "presentation");
        oRM.openEnd();
        oRM.close("div");
        oRM.close("div");

        oRM.close("header"); //Header
      },
      renderBody: function (oRM, oControl) {
        var aRows = oControl.getAggregation("rows") || [];
        oRM
          .openStart("div") //Body
          .class("spp-grid-body-container")
          .class("spp-widget-scroller")
          .class("spp-resize-monitored")
          .class("spp-vertical-overflow");
          if(aRows.length === 0){
            oRM.class("spp-grid-empty");
          }

          oRM.style("overflow-y", "auto");
        oRM.attr("role", "presentation");
        oRM.openEnd();
        
        oRM
          .openStart("div")
          .class("spp-grid-vertical-scroller")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-ltr")
          .class("spp-single-child")
          .class("spp-resize-monitored")
          .style("--event-row-spacing", "8px")
          .style("height", "1600px") //TODO - Calculate
          .attr("role", "presentation");
        oRM.openEnd();

        oRM
          .openStart("div")
          .class("spp-grid-subgrid")
          .class("spp-grid-subgrid-normal")
          .class("spp-widget")
          .class("spp-subgrid")
          .class("spp-resize-monitored")
          .class("spp-ltr")
          .class("spp-widget-scroller")
          .class("spp-hide-scroll")
          .class("spp-first-visible-child")
          .class("spp-last-visible-child");
          oRM.style("flex","1 1 0%")
          .style("overflow-x","auto");
        oRM.openEnd();


        if(aRows.length === 0){
          //--Empty content text--//
          oRM
          .openStart("div")
          .class("spp-empty-text")
          .openEnd();
          oRM.text(oControl.getEmptyText());
          oRM.close("div");
          //--Empty content text--//
        }else{
          $.each(aRows, function(i,oRow){
            oRM.renderControl(oRow);
          });
        }
        oRM.close("div");
        oRM.close("div");
        oRM.close("div"); //Body
      },
    });
  }
);
