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
    createEventId: function() { 
      var d = new Date().getTime();//Timestamp
      var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
      var g = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16;//random number between 0 and 16
          if(d > 0){//Use timestamp until depleted
              r = (d + r)%16 | 0;
              d = Math.floor(d/16);
          } else {//Use microseconds since page-load if supported
              r = (d2 + r)%16 | 0;
              d2 = Math.floor(d2/16);
          }
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });

      return g.replaceAll("-", "").toUpperCase();
  }
  };
});
