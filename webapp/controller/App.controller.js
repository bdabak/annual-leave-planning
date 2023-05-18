sap.ui.define(
  ["./BaseController", "com/thy/ux/annualleaveplanning/utils/event-utilities"],
  function (BaseController, eventUtilities) {
    "use strict";

    return BaseController.extend(
      "com.thy.ux.annualleaveplanning.controller.App",
      {
        onInit() {
          eventUtilities.initiate();
        },
      }
    );
  }
);
