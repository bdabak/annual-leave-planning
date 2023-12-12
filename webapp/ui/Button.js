/*global tippy */
sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.Button",
    {
      metadata: {
        properties: {
          icon: {
            type: "string",
            bindable: true,
          },
          iconButton: {
            type: "boolean",
            bindable: true,
            defaultValue: false
          },
          label: {
            type: "string",
            bindable: true,
          },
          raised:{
            type: "boolean",
            bindable: true,
            defaultValue: false
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
          solid:{
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          tool: {
            type: "boolean",
            bindable: true,
            defaultValue: false
          },
          iconAlignEnd: {
            type: "boolean",
            bindable: true,
            defaultValue: false
          },
          invisible: {
            type: "boolean",
            bindable: true,
            defaultValue: false
          },
          enabled: {
            type: "boolean",
            bindable: true,
            defaultValue: true
          },
          floating:{
            type: "boolean",
            bindable: true,
            defaultValue: false
          },
          tooltip:{
            type: "string",
            bindable: true,
            defaultValue: null
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
        
        
       bEnabled ?   oRM.openStart("button", oControl) : 
       oRM.openStart("div", oControl)
          .style("display", "inline-block")
          .style("flex", "1")
          .openEnd()
          .openStart("button")
          .style("width", "100%"); //Control


        oRM.class("spp-widget");
        
        if(bInvisible){
          oRM.class("spp-invisible");
        }

        if(!bEnabled){
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
          if(!bSolid){
            oRM.class("spp-transparent");
          }
        }

        if(bRaised){
          oRM.class("spp-raised");
        }

        if (bHasIcon) {
          if(bIconButton){
            oRM.class("spp-icon")
               .class(sIcon);
          }else{
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

        if(bFloating){
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
        if(this.getEnabled()){
          oEvent.preventDefault();
          this.firePress();
        }
        return;
      },
      onmouseover: function(){
        var bTooltip = this.getTooltip() || null;
        var that = this;
        var oRef = this.getDomRef();
        
        if(bTooltip && !this.tooltipShown){
          tippy(oRef,{
            content: "<span style='font-size:15px;'>" + bTooltip + "</span>", 
            delay: [0,50],
            // maxWidth: oRef?.offsetWidth-25,
            placement: 'left',
            allowHTML: true,
            animation:"scale",
            inertia: true,
            theme: "material-light",
            onShow: function(){
              that.tooltipShown = true; 
            },
            onDestroy: function() {
              that.tooltipShown = false; 
            },
            onClickOutside: function() {
              that.tooltipShown = false; 
            }
          });
        };
      },
      onmouseout: function(){
        //this._tooltipPopover?.close();
      }
    }
  );
});
