/*global setTimeout*/
sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/m/Dialog"
    ],
    function (Controller) {
      "use strict";
  
      return Controller.extend("com.thy.ux.annualleaveplanning.controller.BaseController", {
        onInit: function () {},
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
  
        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          var oModel =  this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);

          return oModel;
        },
  
        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },
  
        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
  
        getText: function (sText, aParam = []) {
          return this.getResourceBundle().getText(sText, aParam);
        },
  
        openBusyFragment: function (sTextCode, aMessageParameters) {
          var oDialog = this._getBusyFragment();
          var that = this;
          if (sTextCode) {
            oDialog.setText(this.getText(sTextCode, aMessageParameters));
          } else {
            oDialog.setText(this.getText("pleaseWait", [] ));
          }
  
          setTimeout(function () {
            oDialog.open();
          }, 100);
        },
  
        closeBusyFragment: function () {
          var oDialog = this._getBusyFragment();
          var that = this;
          var _close = function () {
            oDialog.close();
          };
          setTimeout(_close, 500);
        },
  
       /**
       * Convenience method for calling 
       * @public
       * @returns {ConfirmationDialog} the router for this component
       */
        callConfirmDialog: function (
          sTitle,
          sDialogType,
          sState,
          sConfirmation,
          oBeginButtonProp,
          oEndButtonProp
        ) {
          
        },
       /**
       * Convenience method for get generic Busy fragment
       * @private
       * @returns {com.thy.ux.annualleaveplanning.ui.BusyDialog} the router for this component
       */
        _getBusyFragment: function () {
            if (!this.oBusyDialog) {
              this.oBusyDialog = sap.ui.xmlfragment(
                "com.thy.ux.annualleaveplanning.view.fragment.GenericBusyDialog",
                this
              );
    
              this.getView().addDependent(this.oBusyDialog);
            } else {
              this.oBusyDialog.close();
            }
    
            return this.oBusyDialog;
          },
      });
    }
  );
  