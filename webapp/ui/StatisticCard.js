sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.StatisticCard", {
    metadata: {
      properties: {
        theme: {
          type: "string",
          bindable: true,
          defaultValue: "primary",
        },
        title: {
          type: "string",
          bindable: true,
        },
        value: {
          type: "string",
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
    init: function () {
      //--Set periods and default view mode
      // this.setMode("Y");
      // this.setPeriod(dateUtilities.getCurrentYear());

      var sLibraryPath = jQuery.sap.getModulePath(
        "com.thy.ux.annualleaveplanning"
      ); //get the server location of the ui library
      jQuery.sap.includeStyleSheet(
        sLibraryPath + "/ui/css/StatisticCard.css"
        // sLibraryPath + "/ui/css/ThemeIstanbul.css"
      );
    },
    renderer: function (oRM, oControl) {
      oRM
        .openStart("div", oControl) //--Main
        .class("spp-stat-card")
        .openEnd();
      oRM
        .openStart("div") //--Wrapper
        .class("spp-stat-card-wrap")
        .class(`spp-stat-card-${oControl.getTheme()}`)
        .openEnd();

      //--Content header--//
      oRM.openStart("h4").class("spp-stat-card-title").openEnd();
      oRM.text(oControl.getTitle());
      oRM.close("h4");
      //--Content header--//
      //--Statistic value--//
      oRM.openStart("span").class("spp-stat-card-value").openEnd();
      oRM.text(oControl.getValue());
      oRM.close("span");
      //--Statistic value--//

      oRM.close("div");
      oRM.close("div"); //--Main
    },
  });
});
