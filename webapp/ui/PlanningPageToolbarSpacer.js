sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageToolbarSpacer",
    {
      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Spacer
        oRM.class("spp-widget").class("spp-toolbar-fill").class("spp-box-item");
        oRM.openEnd();
        oRM.close("div");
      },
    }
  );
});
