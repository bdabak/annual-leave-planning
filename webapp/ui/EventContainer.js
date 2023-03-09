sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.EventContainer",
    {
      metadata: {
        properties: {
          widget: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
        },
        aggregations: {
          events: {
            type: "com.thy.ux.annualleaveplanning.ui.Event",
            multiple: true,
            singularName: "event",
          },
          newEvent: {
            type: "com.thy.ux.annualleaveplanning.ui.Event",
            multiple: false,
          }
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        var bWidget = oControl.getWidget();
        oRM.openStart("div", oControl); //Main
        oRM.class("spp-cal-event-bar-container");

        if (bWidget) {
          oRM
            .class("spp-widget")
            .class("spp-box-item")
            .class("spp-first-visible-child")
            .class("spp-contains-focus");
        }
        oRM.openEnd();

        //--Only new event--//
        oRM.renderControl(oControl.getNewEvent());
        //--Only new event--//

        $.each(oControl.getEvents(), function (i, e) {
          oRM.renderControl(e);
        });
        oRM.close("div");
      },
    }
  );
});
