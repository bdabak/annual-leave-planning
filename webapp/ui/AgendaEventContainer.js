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
          
          oRM.renderControl(e);


          if(e.getRejected() || (e.getErrorMessage() !== "" &&  e.getErrorMessage() !== null)){
            var bR = e.getRejected();
            
            var sR = oControl
            .getModel("i18n")
            .getResourceBundle()
            .getText("planRejected");

            var sM = bR ? " ".concat(sR) : " ".concat(e.getErrorMessage());

            oRM.openStart("div"); //Event Time
            oRM.class("spp-cal-rejected-event");
            oRM.openEnd();
            oRM.openStart("span"); //Event Time
            oRM.class("spp-fa").class("spp-fa-circle-exclamation");
            oRM.openEnd();
            oRM.text(sM);
            oRM.close("span"); //Event time
            oRM.close("div"); //Event time
  
          }
          oRM.close("div"); //Agenda Row
         
        });
        
        oRM.close("div");
      },
    }
  );
});
