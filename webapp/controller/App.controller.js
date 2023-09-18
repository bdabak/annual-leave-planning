sap.ui.define(
  ["./BaseController", "com/thy/ux/annualleaveplanning/utils/event-utilities"],
  function (BaseController, eventUtilities) {
    "use strict";

    return BaseController.extend(
      "com.thy.ux.annualleaveplanning.controller.App",
      {
        onInit() {
          eventUtilities.initiate();

          //--Add custom icons
          sap.ui.core.IconPool.addIcon("tr", "flagfont", "smodflag", "e905");
          sap.ui.core.IconPool.addIcon("en", "flagfont", "smodflag", "e900");
       
        },
      }
    );
  }
);
