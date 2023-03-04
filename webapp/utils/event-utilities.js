sap.ui.define([], function () {
  "use strict";

  return {
    publishEvent: function (c, e, p) {
      var b = sap.ui.getCore().getEventBus();

      b.publish(c, e, p ? p : null);
    },
    subscribeEvent: function (c, e, m, t) {
      var b = sap.ui.getCore().getEventBus();

      b.unsubscribe(c, e, m, t);
      b.subscribe(c, e, m, t);
    },
  };
});
