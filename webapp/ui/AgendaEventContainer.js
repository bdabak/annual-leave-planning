sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.AgendaEventContainer",
    {
      metadata: {
        properties: {},
        aggregations: {
          events: {
            type: "com.thy.ux.annualleaveplanning.ui.Event",
            multiple: true,
            singularName: "event",
          },
        },
        events: {},
      }, 
      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Main
        oRM.class("spp-cal-event-bar-container");
        oRM.openEnd();

        $.each(oControl.getEvents(), function (i, e) {
          oRM.openStart("div"); //Agenda Row
          oRM.class("spp-cal-agenda-event-row");
          oRM.openEnd();
          oRM.openStart("div"); //Event Time
          oRM.class("spp-cal-eventlist-event-time");
          oRM.openEnd();
          oRM.text("Btş: " + e.getEndDate());
          oRM.close("div"); //Event time
          oRM.renderControl(e);
          oRM.close("div"); //Agenda Row
        });
        
        oRM.close("div");
      },
    }
  );
});
