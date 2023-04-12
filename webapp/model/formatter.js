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
      if (!e || !p || !t) {
        return false;
      }
      try {
        if (p < t) {
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return false;
      }
    },
  };
});
