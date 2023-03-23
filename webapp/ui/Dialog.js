sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.Dialog",
    {
      metadata: {
        properties: {
          attributes: {
            type: "object",
            bindable: true,
            defaultValue: [],
          },
          styles: {
            type: "object",
            bindable: true,
            defaultValue: [],
          },
          classList: {
            type: "object",
            bindable: true,
            defaultValue: [],
          },
          elementPosition: {
            type: "object",
            bindable: true,
            defaultValue: null,
          },
          headerDockTop:{
            type:"boolean",
            bindable: true,
            defaultValue: false
          },
          alignment:{
            type: "string",
            bindable: true,
            defaultValue: "center"
          },
          showPointer:{
            type:"boolean",
            bindable: true,
            defaultValue: false
          },
          animate: {
            type:"boolean",
            bindable: true,
            defaultValue: false
          }
        },
        aggregations: {
          header: {
            type: "com.thy.ux.annualleaveplanning.ui.DialogHeader",
            multiple: false,
          },
          content: {
            type: "sap.ui.core.Control",
            multiple: false,
          },
        },
        events: {
          closed:{

          },
          cancelled:{

          }
        },
      },

      /**
       * @override
       */
      onAfterRendering: function () {
        Control.prototype.onAfterRendering.apply(this, arguments);
        var oEP = this.getElementPosition() || null;
        var sAlign = this.getAlignment() || null;

        // this.addStyleClass("animate__animated");
        // this.addStyleClass("animate__fadeInDown");

        if (!oEP || sAlign !== "auto") {
          return;
        }

        var t = this.$();
        var aStyles = this.getStyles();

        var eO = t.offset();
        var eOH = t.outerHeight();
        var eOW = t.outerWidth();
        var cW = $(window);
        var x,y;
        var alignment;
        var bTop =false;
        

        var tH = oEP.offset.top;
        var bH = cW.height() - ( oEP.offset.top + oEP.outerHeight);

        if(tH > bH){
          alignment = "spp-aligned-above";
          y = oEP.offset.top - eOH - 6;
          bTop = true;
        }else{
          alignment = "spp-aligned-below";
          y = oEP.offset.top + oEP.outerHeight + 6 ;
          bTop = false;
        }

        var fX =  oEP.offset.left + oEP.outerWidth / 2 + eOW / 2;

        if(fX > cW.width()){
          x = oEP.offset.left + oEP.outerWidth / 2 - eOW / 2 - (fX - cW.width());
        }else{
          x = oEP.offset.left + oEP.outerWidth / 2 - eOW / 2;
          if(x<0){
            x = 5;
          }
        }

        aStyles.set("transform", `matrix(1, 0, 0, 1, ${x}, ${y})`);
        var s = "";
        if (aStyles && aStyles?.size > 0) {
          aStyles.forEach((value, key) => {
            var a = `${key}:${value};`;
            s === "" ? s = a : s = s + " "  + a;
          });
        }
        t.removeAttr("style").attr("style",s);

        //--Add alignment class
        this.addStyleClass(alignment);

        //--Align anchor
        if(!bTop){
          $(".spp-anchor").removeClass("spp-anchor-bottom").addClass("spp-anchor-top");
        }else{
          $(".spp-anchor").removeClass("spp-anchor-top").addClass("spp-anchor-bottom");
        }
        var xA = eOW / 2 - 10;
        $(".spp-anchor").removeAttr("style").attr("style", `transform:translateX(${xA}px)`);

        
      },
      renderer: function (oRM, oControl) {
        var oHeader = oControl.getAggregation("header") || null;
        var oContent = oControl.getAggregation("content");
        var aStyles = oControl.getStyles();
        var aClassList = oControl.getClassList();
        var bDockTop = oControl.getHeaderDockTop();
        var sAlign = oControl.getAlignment() || null;

        oRM.openStart("div", oControl); //Main
        oRM
          .class("spp-widget")
          .class("spp-container")
          .class("spp-panel")
          .class("spp-popup")
          .class("spp-floating")
          

          .class("spp-header-dock-top")
          .class("spp-panel-has-bottom-toolbar")
          .class("spp-vbox")
          .class("spp-panel-has-tools")
          .class("spp-outer")
          .class("spp-overlay-scrollbar")
          .class("spp-resize-monitored")
          .class("spp-focus-trapped")
          .class("spp-anchored")
          .class("spp-using-keyboard")
          .class("spp-contains-focus");          

        //--Variable classes
        if (sap.ui.Device.browser.chrome) {
          oRM.class("spp-chrome");
        } else if (sap.ui.Device.browser.firefox) {
          oRM.class("spp-firefox");
        } else if (sap.ui.Device.browser.safari) {
          oRM.class("spp-safari");
        }
        if (oHeader) {
          oRM.class("spp-panel-has-header");  
        }
        if(bDockTop){
          oRM.class("spp-header-dock-top");
        }

        $.each(aClassList, function (i, cn) {
          oRM.class(cn);
        });

        //--Variable attributes
        $.each(oControl.getAttributes(), function (i, oAttr) {
          oRM.attr(oAttr.name, oAttr.value);
        });

        oRM.attr("role", "dialog");

        if (aStyles && aStyles?.size > 0) {
          aStyles.forEach((value, key) => {
            oRM.style(key, value);
          });
        }

        if(sAlign){
          oRM.class(`spp-popup-align-${sAlign}`); 
        }

        if(oControl.getAnimate()){
          oRM.class("animate__animated")
          .class("animate__pulse");
        }
       

        oRM.openEnd();

        //-Header-//
        oRM.renderControl(oHeader);
        //-Header-//

        //-Content-//
        oRM.renderControl(oContent);
        //-Content-//

        if(oControl.getShowPointer()){
          //--Render Pointer--//
          oControl._renderPointer(oRM);
          //--Render Pointer--//
        }

        oRM.close("div"); //Main
      },

      _renderPointer: function(oRM){
        oRM.openStart("div"); //Pointer
        oRM.class("spp-anchor");
        
        oRM.openEnd();

        //---SVG---//
        oRM.openStart("svg"); //SVG
        oRM.class("spp-pointer-el");
        oRM.attr("version", "1.1");
        oRM.attr("height", "8");
        oRM.attr("width", "16");
        oRM.attr("role", "presentation");
        oRM.openEnd();

        //--Defs
        oRM.openStart("defs"); //Defs
        oRM.attr("role", "presentation");
        oRM.openEnd();

        //--Filter
        oRM.openStart("filter"); //filter
        oRM.attr("id", "spp-calendar-1-event-editor-shadow-filter");
        oRM.attr("role", "presentation");
        oRM.openEnd();

        //--Shadow
        oRM.openStart("feDropShadow"); //feDropShadow
        oRM.attr("dx", "0");
        oRM.attr("dy", "-1");
        oRM.attr("stdDeviation", "1");
        oRM.attr("flood-opacity", "0.2");
        oRM.attr("role", "presentation");
        oRM.openEnd();

        oRM.close("feDropShadow"); //feDropShadow
        //--Shadow
        oRM.close("filter"); //filter
        //--Filter

        oRM.close("defs"); //Defs
        //--Defs

        //--Path
        oRM.openStart("path"); //path
        oRM.attr("filter", "url(#spp-calendar-1-event-editor-shadow-filter)");
        oRM.attr("role", "presentation");
        oRM.attr("d", "M0,8L8,0.5L16,8");
        // oRM.attr("fill", "rgb(255, 245, 230)");
        oRM.attr("fill", "rgb(33, 150, 243)");
        oRM.openEnd();
        oRM.close("path"); //path
        //--Path


        oRM.close("svg"); //SVG
        //---SVG---//

        oRM.close("div"); //Pointer
      },
      close: function(){
        this.fireClosed();
      },
      cancel: function(){
        this.fireCancelled();
      }
    }
  );
});
