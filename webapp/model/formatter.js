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
      var r = oFloatFormat.format(f);

      r = r.replaceAll(",00","");
      return r;
    },

    decidePlanApproveStatus: function (e, p, t, c) {
      if (!e || p === null || p === undefined || t === null || t === undefined) {
        return false;
      }

      if(c !== "" && c !== null && c !== undefined){
        // console.log(c);
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

    // getLeaveTypeVisible: function(t,e,h){
    //   if(t && t === '0010'){
    //     return true;
    //   }
    //   console.log(t,e,h);
    //   if(e?.New && h?.PlanningEnabled){
    //     return true;
    //   }

    //   return false;
    // },
    checkAddSplitVisible: function (s = [], r) {
      var v = _.filter(s, ["Visible", true]);
      return v.length < 5;
    },
    checkRemoveSplitVisible: function (s = [], r) {
      var v = _.filter(s, ["Visible", true]);
      return v.length > 2;
    },
    convertGuidToChar: function(g){
      var c = g;

      c = c.replaceAll("-","").toUpperCase();

      return c;
    }
  };
});
