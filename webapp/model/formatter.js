sap.ui.define([], function () {
  "use strict";
  return {
    suppressZeroDecimal: function (f) {
      var oFormatOptions = {
        minFractionDigits: 0,
        maxFractionDigits: 2,
        groupingEnabled: false,
        decimalSeparator: ",",
        preserveDecimals: true,
      };

      var oFloatFormat =
        sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);

      return oFloatFormat.format(f);
    },

    decidePlanApproveStatus: function (e, p, t) {
      if (!e || p === null || p === undefined || t === null || t === undefined) {
        return false;
      }
      try {
        if(parseFloat(p) <= 0){
          return false;
        }
        
        if (parseFloat(p) < parseFloat(t)) {
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return false;
      }
    },

    getLeaveTypeVisible: function(t,e,h){
      if(t && t === '0010'){
        return true;
      }



      if(e?.New && h?.PlanningEnabled){
        return true;
      }

      return false;
    }
  };
});
