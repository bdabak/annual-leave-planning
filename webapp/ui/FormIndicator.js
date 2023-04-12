sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.FormIndicator", {
    metadata: {
      properties: {
        label: {
          type: "string",
          bindable: true,
        },
        value: {
          type: "string",
          bindable: true,
          defaultValue: "--",
        },
        unit: {
          type: "string",
          bindable: true,
        },
        alignment: {
          type: "string",
          bindable: true,
          defaultValue: "H",
        },
      },
      aggregations: {
        triggers: {
          type: "com.thy.ux.annualleaveplanning.ui.FormFieldTrigger",
          multiple: true,
          singularName: "trigger",
        },
      },
      events: {},
    },
    renderer: function (oRM, oControl) {
      oRM
        .openStart("div", oControl)
        .class("spp-widget")
        .class("spp-field")
        .class("spp-indicator")
        .openEnd();

      oRM
        .openStart("div")
        .class("spp-indicator-inner")
        .class(
          oControl.getAlignment() === "H"
            ? "spp-indicator-halign"
            : "spp-indicator-valign"
        )
        .openEnd();

      //--Label--//
      oRM
        .openStart("label")
        .class("spp-indicator-label")
        .openEnd()
        .text(oControl.getLabel())
        .close("label");
      //--Label--//

      //--Value--//
      oRM.openStart("div").class("spp-indicator-value-container").openEnd();

      oRM
        .openStart("span")
        .class("spp-indicator-value")
        .openEnd()
        .text(oControl.getValue())
        .close("span");

      if (oControl.getUnit()) {
        oRM
          .openStart("span")
          .class("spp-indicator-unit")
          .openEnd()
          .text(oControl.getUnit())
          .close("span");
      }
      oRM.close("div");
      //--Value--//

      oRM.close("div");
      oRM.close("div");
    },
  });
});
