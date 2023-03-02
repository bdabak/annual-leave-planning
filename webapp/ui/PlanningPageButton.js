sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageButton",
    {
      metadata: {
        properties: {
          icon: {
            type: "string",
            bindable: true,
          },
          label: {
            type: "string",
            bindable: true,
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
        var bHasIcon = sIcon ? true : false;
        var bHasLabel = sLabel ? true : false;
        var bHasTooltip = sTooltip ? true : false;
        var bSelected = oControl.getSelected() || false;
        var bGroupButton = oControl.getGroupButton() || false;
        var sTooltipAriaId = "spp-button-" + oControl.getId() + "-aria-desc-el";
        var bFirstChild = oControl.getFirstChild() || false;
        var bLastChild = oControl.getLastChild() || false;
        var aClassList = oControl.getClassList() || [];
        var aAttributes = oControl.getAttributes() || [];

        oRM.openStart("button"); //Button
        oRM.writeControlData(oControl);
        oRM.class("spp-widget").class("spp-button");

        //--Conditional classes
        if (!bGroupButton) {
          oRM.class("spp-box-item");
        }

        if (bHasLabel) {
          oRM.class("spp-text");
        } else {
          oRM.class("spp-borderless").class("spp-transparent");
        }
        if (bHasIcon) {
          oRM.class("spp-icon-align-start");
        }
        if (bSelected) {
          oRM.class("spp-pressed");
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

        oRM.openEnd();

        if (bHasIcon) {
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

        oRM.close("button"); //Button
      },
      ontap: function (oEvent) {
        oEvent.preventDefault();

        this.firePress();
      },
    }
  );
});
