sap.ui.define(["sap/ui/core/Control",
"com/thy/ux/annualleaveplanning/utils/event-utilities",], function (Control, eventUtilities) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageButtonGroup",
    {
      metadata: {
        properties: {},
        aggregations: {
          buttons: {
            type: "com.thy.ux.annualleaveplanning.ui.PlanningPageButton",
            multiple: true,
            singularName: "button",
          },
        },
        events: {},
      },

      init: function () {
        eventUtilities.subscribeEvent(
          "PlanningCalendar",
          "ViewChangeCompleted",
          this.onPostViewChange,
          this
        );
      },

      onPostViewChange: function (c, e, o) {
        if(o && o.hasOwnProperty("tabIndex")){
          this.setActiveButton(o.tabIndex);
        }
      },

      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Button Group
        oRM
          .class("spp-widget")
          .class("spp-container")
          .class("spp-buttongroup")
          .class("spp-content-element")
          .class("spp-auto-container")
          .class("spp-box-item")
          .class("spp-flex-row")
          .class("spp-last-visible-child");
        oRM.openEnd();

        $.each(oControl.getButtons(), function (i, b) {
          oRM.renderControl(b);
        });
        oRM.close("div"); //Button Group
      },
      
      setActiveButton: function (tabIndex) {
        var aButtons = this.getButtons();

        $.each(aButtons, function (i, oButton) {
          if (oButton.data("tab-index") === tabIndex) {
            oButton.$().addClass("spp-pressed");
          } else {
            oButton.$().removeClass("spp-pressed");
          }
        });
      },
    }
  );
});
