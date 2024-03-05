/*global tippy */
sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.annualleaveplanning.ui.Button", {
    metadata: {
      properties: {
        icon: {
          type: "string",
          bindable: true,
        },
        iconButton: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        label: {
          type: "string",
          bindable: true,
        },
        raised: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        firstChild: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        lastChild: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        classList: {
          type: "object",
          bindable: true,
          defaultValue: [],
        },
        attributes: {
          type: "object",
          bindable: true,
          defaultValue: [],
        },
        tooltip: {
          type: "string",
          bindable: true,
        },
        selected: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        groupButton: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        solid: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        tool: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        iconAlignEnd: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        invisible: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        enabled: {
          type: "boolean",
          bindable: true,
          defaultValue: true,
        },
        floating: {
          type: "boolean",
          bindable: true,
          defaultValue: false,
        },
        tooltip: {
          type: "string",
          bindable: true,
          defaultValue: null,
        },
        tooltipDelay: {
          type: "int",
          bindable: true,
          defaultValue: 500,
        },
      },
      aggregations: {},
      events: {
        press: {
          parameters: {},
        },
      },
    },
    renderer: function (oRM, oControl) {
      var sIcon = oControl.getIcon() || null;
      var sLabel = oControl.getLabel() || null;
      var sTooltip = oControl.getTooltip() || null;
      var bTool = oControl.getTool() || false;
      var bHasIcon = sIcon ? true : false;
      var bAlignEnd = oControl.getIconAlignEnd() || false;
      var bIconButton = oControl.getIconButton();
      var bHasLabel = sLabel ? true : false;
      var bHasTooltip = sTooltip ? true : false;
      var bSelected = oControl.getSelected() || false;
      var bGroupButton = oControl.getGroupButton() || false;
      var bSolid = oControl.getSolid() || false;
      var bRaised = oControl.getRaised() || false;
      var sTooltipAriaId = "spp-button-" + oControl.getId() + "-aria-desc-el";
      var bFirstChild = oControl.getFirstChild() || false;
      var bLastChild = oControl.getLastChild() || false;
      var aClassList = oControl.getClassList() || [];
      var aAttributes = oControl.getAttributes() || [];
      var bInvisible = oControl.getInvisible();
      var bEnabled = oControl.getEnabled();
      var bFloating = oControl.getFloating();

      bEnabled
        ? oRM.openStart("button", oControl)
        : oRM
            .openStart("div", oControl)
            .style("display", "inline-block")
            .style("flex", "1")
            .openEnd()
            .openStart("button")
            .style("width", "100%"); //Control

      oRM.class("spp-widget");

      if (bInvisible) {
        oRM.class("spp-invisible");
      }

      if (!bEnabled) {
        oRM.attr("disabled");
        oRM.class("spp-disabled");
      }

      //--Conditional classes
      oRM.class(!bTool ? "spp-button" : "spp-tool");

      if (!bGroupButton) {
        oRM.class("spp-box-item");
      }

      if (bHasLabel) {
        oRM.class("spp-text");
      } else {
        oRM.class("spp-borderless");
        if (!bSolid) {
          oRM.class("spp-transparent");
        }
      }

      if (bRaised) {
        oRM.class("spp-raised");
      }

      if (bHasIcon) {
        if (bIconButton) {
          oRM.class("spp-icon").class(sIcon);
        } else {
          oRM.class(bAlignEnd ? "spp-icon-align-end" : "spp-icon-align-start");
        }
      }
      if (bSelected) {
        oRM.class("spp-pressed").class("spp-contains-focus");
      }
      if (bHasTooltip) {
        oRM.attr("aria-haspopup", "dialog");
        oRM.attr("aria-describedby", sTooltipAriaId);
      }

      if (bFirstChild) {
        oRM.class("spp-first-visible-child");
      }
      if (bLastChild) {
        oRM.class("spp-last-visible-child");
      }

      $.each(aClassList, function (i, cn) {
        oRM.class(cn);
      });

      $.each(aAttributes, function (i, oAttr) {
        oRM.attr(oAttr.name, oAttr.value);
      });

      if (bFloating) {
        oRM.class("spp-floating-button");
      }

      oRM.openEnd();

      if (bHasIcon && !bIconButton) {
        oRM.openStart("i");
        oRM.class("spp-icon");
        oRM.class(sIcon);
        oRM.openEnd();
        oRM.close("i");
      }

      if (bHasLabel) {
        oRM.openStart("label");
        oRM.openEnd();
        oRM.text(sLabel);
        oRM.close("label");
      }
      if (bHasTooltip) {
        oRM.openStart("div");
        oRM.class("spp-aria-desc-element");
        oRM.attr("role", "presentation");
        oRM.attr("id", sTooltipAriaId);
        oRM.openEnd();
        oRM.text(sTooltip);
        oRM.close("div");
      }

      bEnabled ? oRM.close("button") : oRM.close("button").close("div"); //Button
    },
    ontap: function (oEvent) {
      if (this.getEnabled()) {
        oEvent.preventDefault();
        this.firePress();
      }
      return;
    },
    onmouseover: function () {
      var sTooltip = this.getTooltip() || null;
      var that = this;
      var oRef = this.getDomRef();
      var sClass = "query-class-" + this.getId();

      var bExist = $("." + sClass).length > 0;

      if (!bExist) {
        this.tooltipShown = false;
      }

      if (sTooltip && !this.tooltipShown) {
        this._callTippy(oRef, sTooltip, sClass);
      }
    },
    _callTippy: function (oRef, sTooltip, sClass) {
      var that = this;
      var iDelay = this.getTooltipDelay();

      var createTippy = () => {
        return tippy(oRef, {
          content: `<span style='font-size:0.875rem;' class='${sClass}'>${sTooltip}</span>`,
          delay: [0, 50],
          placement: "left",
          allowHTML: true,
          animation: "scale",
          inertia: true,
          theme: "material-light",
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
