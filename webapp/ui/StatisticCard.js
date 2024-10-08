/*global tippy */

sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.StatisticCard", {
    metadata: {
      properties: {
        theme: {
          type: "string",
          bindable: true,
          defaultValue: "primary",
        },
        title: {
          type: "string",
          bindable: true,
        },
        tooltip: {
          type: "string",
          bindable: true,
          defaultValue: null,
        },
        value: {
          type: "string",
          bindable: true,
        },
        subvalue: {
          type: "string",
          bindable: true,
          defaultValue: null,
        },
        title2: {
          type: "string",
          bindable: true,
        },
        value2: {
          type: "string",
          bindable: true,
        },
        subvalue2: {
          type: "string",
          bindable: true,
          defaultValue: null,
        },
        valueFontSize: {
          type: "string",
          bindable: true,
          defaultValue: "normal",
        },
      },
      aggregations: {
        eventContainer: {
          type: "com.thy.ux.annualleaveplanning.ui.AgendaEventContainer",
          multiple: false,
        },
      },
      events: {},
    },
    init: function () {
      //--Set periods and default view mode
      // this.setMode("Y");
      // this.setPeriod(dateUtilities.getCurrentYear());

      var sLibraryPath = jQuery.sap.getModulePath(
        "com.thy.ux.annualleaveplanning"
      ); //get the server location of the ui library
      jQuery.sap.includeStyleSheet(
        sLibraryPath + "/ui/css/StatisticCard.css"
        // sLibraryPath + "/ui/css/ThemeIstanbul.css"
      );
    },
    renderer: function (oRM, oControl) {
      oRM
        .openStart("div", oControl) //--Main
        .class("spp-stat-card")
        .openEnd();
      oRM
        .openStart("div") //--Wrapper
        .class("spp-stat-card-wrap")
        .class(`spp-stat-card-${oControl.getTheme()}`)
        .openEnd();

      if (!oControl.getTitle2()) {
        oControl._renderOneColumn(oRM);
      } else {
        oControl._renderTwoColumns(oRM);
      }

      oRM.close("div");
      oRM.close("div"); //--Main
    },

    _renderTwoColumns: function (oRM) {
      var t1 = this.getTitle();
      var v1 = this.getValue();

      var t2 = this.getTitle2() || null;
      var v2 = this.getValue2() || null;
      oRM.openStart("div").class("spp-stat-card-grid").openEnd();

      //Grid 1.1
      oRM
        .openStart("h4")
        .class("spp-stat-card-title")
        .openEnd()
        .text(t1)
        .close("h4");

      // Separator
      oRM
        .openStart("div")
        .class("spp-stat-card-grid-sep-col")
        .openEnd()
        .openStart("div")
        .class("spp-stat-card-grid-sep")
        .openEnd()
        .close("div")
        .close("div");

      //Grid 1.2
      oRM
        .openStart("h4")
        .class("spp-stat-card-title")
        .openEnd()
        .text(t2)
        .close("h4");

      //Grid 2.1
      oRM
        .openStart("div")
        .class("spp-stat-card-value")
        .openEnd()
        .text(v1)
        .close("div");
      //Grid 2.2
      oRM
        .openStart("div")
        .class("spp-stat-card-value")
        .openEnd()
        .text(v2)
        .close("div");

      oRM.close("div");
    },
    _renderOneColumn: function (oRM) {
      var t1 = this.getTitle();
      var v1 = this.getValue();
      var s1 = this.getSubvalue();
      var bTooltip = this.getTooltip() || null;

      //--Content header--//
      oRM.openStart("h4").class("spp-stat-card-title");
      if (bTooltip) {
        oRM.class("spp-stat-card-title-has-tooltip");
      }
      oRM.openEnd().text(t1).close("h4");
      //--Content header--//
      //--Statistic value--//
      oRM
        .openStart("div")
        .class("spp-stat-card-value")
        .class(`spp-stat-card-value-${this.getValueFontSize()}`)
        .openEnd();
      oRM.text(v1);
      oRM.close("div");
      if (s1 !== null) {
        oRM.openStart("div").class("spp-stat-card-sub-value").openEnd();
        oRM.text(s1);
        oRM.close("div");
      }
      //--Statistic value--//
    },
    onmouseover: function () {
      var sTooltip = this.getTooltip() || null;
      var oRef = this.getDomRef();

      if (sTooltip && !this.tooltipShown) {
        this._callTippy(oRef, sTooltip);
      }
    },
    _callTippy: function (oRef, sTooltip) {
      var that = this;

      var createTippy = () => {
        return tippy(oRef, {
          content: "<span style='font-size:11px;'>" + sTooltip + "</span>",
          delay: [0, 50],
          maxWidth: oRef?.offsetWidth + 25,
          placement: "bottom",
          allowHTML: true,
          animation: "scale",
          inertia: true,
          theme: "material",
          onShow: function () {
            that.tooltipShown = true;
          },
          onDestroy: function () {
            that.tooltipShown = false;
          },
          onClickOutside: function () {
            that.tooltipShown = false;
          },
          onHide: function () {
            that.tooltipShown = false;
          },
          onUntrigger: function () {
            that.tooltipShown = false;
          },
        });
      };

      if (this.oTippyInstance) {
        this.oTippyInstance.destroy();
        this.oTippyInstance = null;
      }
      this.oTippyInstance = createTippy();
    },
  });
});
