sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageButton",
  ],
  function (Control, Button) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PlanningPageDialogHeader",
      {
        metadata: {
          properties: {
            title: {
              type: "string",
              bindable: true,
            },
          },
          aggregations: {
            _spacer: {
              type: "com.thy.ux.annualleaveplanning.ui.PlanningPageButton",
              multiple: false,
            },
            _endButton: {
              type: "com.thy.ux.annualleaveplanning.ui.PlanningPageButton",
              multiple: false,
            },
          },
          events: {
            closed: {},
          },
        },
        init: function () {
          var s = new Button({
            tool: true,
            classList: [
              "spp-popup-expand",
              "spp-align-end",
              "spp-icon",
              "spp-hidden",
            ],
          });
          this.setAggregation("_spacer", s);
          var c = new Button({
            tool: true,
            classList: ["spp-popup-close", "spp-align-end", "spp-icon"],
            press: function () {
              this.fireClosed();
            }.bind(this),
          });
          this.setAggregation("_endButton", c);
        },
        renderer: function (oRM, oControl) {
          oRM.openStart("header", oControl);
          oRM
            .class("spp-dock-top")
            .class("spp-panel-header")
            .class("spp-popup-header")
            .class("spp-eventeditor-header");
          oRM.openEnd();

          //-Title-//
          oRM.openStart("div");
          oRM.class("spp-align-start").class("spp-header-title");
          oRM.openEnd();
          oRM.text(oControl.getTitle());
          oRM.close("div");
          //-Title-//

          //--Spacer--//
          oRM.renderControl(oControl.getAggregation("_spacer"));
          //--Spacer--//

          //--Button Close--//
          oRM.renderControl(oControl.getAggregation("_endButton"));
          //--Button Close--//

          oRM.close("header"); //Main
        },
      }
    );
  }
);
