sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/ui/Button",
    "com/thy/ux/annualleaveplanning/ui/WizardIndicatorContainer",
    "com/thy/ux/annualleaveplanning/ui/WizardIndicator",
  ],
  function (Control, Button, WizardIndicatorContainer, WizardIndicator) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.Wizard", {
      metadata: {
        properties: {
          title: {
            type: "string",
            bindable: true,
          },
        },
        aggregations: {
          steps: {
            type: "com.thy.ux.annualleaveplanning.ui.WizardStep",
            multiple: true,
            singularName: "step",
          },
          _prevButton: {
            type: "com.thy.ux.annualleaveplanning.ui.Button",
            multiple: false,
          },
          _indicatorContainer: {
            type: "com.thy.ux.annualleaveplanning.ui.WizardIndicatorContainer",
            multiple: false,
          },
          _nextButton: {
            type: "com.thy.ux.annualleaveplanning.ui.Button",
            multiple: false,
          },
        },
        events: {},
      },
      init: function () {
        var sLibraryPath = jQuery.sap.getModulePath(
          "com.thy.ux.annualleaveplanning"
        );
        jQuery.sap.includeStyleSheet(sLibraryPath + "/ui/css/Wizard.css");

        var pB = new Button({
          icon: "spp-icon-previous",
          label: "Önceki",
          press: this.handlePrevStep.bind(this),
        });
        this.setAggregation("_prevButton", pB);

        var pB = new Button({
          icon: "spp-icon-next",
          label: "Sonraki",
          press: this.handleNextStep.bind(this),
          iconAlignEnd: true,
        });
        this.setAggregation("_nextButton", pB);

        var iC = new WizardIndicatorContainer();
        this.setAggregation("_indicatorContainer", iC);
      },
      setStates: function (i) {
        var steps = this.getAggregation("steps");
        var indicators = this.getAggregation(
          "_indicatorContainer"
        ).getIndicators();

        var steps = this.getAggregation("steps");
        if (i === 0) {
          this.getAggregation("_prevButton").setInvisible(true);
        } else {
          this.getAggregation("_prevButton").setInvisible(false);
        }

        if (i === steps.length - 1) {
          this.getAggregation("_nextButton")
            .setLabel("Kaydet")
            .setIcon("spp-fa-save")
            .setIconAlignEnd(false);
        } else {
          this.getAggregation("_nextButton")
            .setLabel("İleri")
            .setIcon("spp-icon-next")
            .setIconAlignEnd(true);
        }

        $.each(steps, function (j, s) {
          if (i === j) {
            s.setActive(true);
          } else {
            s.setActive(false);
          }
        });
        $.each(indicators, function (x, e) {
          if (i === x) {
            e.setActive(true);
          } else {
            e.setActive(false);
          }
        });
      },
      handlePrevStep: function () {
        var aI = this._getActiveStep();
        if (aI === 0) {
          return;
        }

        var pI = aI - 1;

        this.setStates(pI);
      },
      handleNextStep: function () {
        var steps = this.getAggregation("steps");
        var aI = this._getActiveStep();

        if (aI === steps.length - 1) {
          this.submitWizard();
          return;
        }

        var nI = aI + 1;

        this.setStates(nI);
      },
      submitWizard: function () {
        Swal.fire({
          backdrop: false,
          showConfirmButton: true,
          html: "Everything is fine!",
          icon: "success",
          confirmButtonColor: "#d33",
        });
      },
      renderer: function (oRM, oControl) {
        oRM
          .openStart("div", oControl) //--Main
          .class("spp-wizard")
          .openEnd();

        //--Content
        oRM.openStart("div").class("spp-wizard-content").openEnd();
        //--Wizard steps--//
        $.each(oControl.getSteps(), function (i, s) {
          oRM.renderControl(s);
        });
        //--Wizard steps--//

        oRM.close("div");
        //--Content

        //--Wizard footer--//
        oControl.renderFooter(oRM);
        //--Wizard footer--//

        oRM.close("div"); //--Main
      },
      renderFooter: function (oRM) {
        var aI = this._getActiveStep();
        var steps = this.getSteps();
        oRM
          .openStart("div") //--Footer
          .class("spp-wizard-footer")
          .openEnd();

        //--Prev Button--//
        var pB = this.getAggregation("_prevButton");
        // pB.setVisible(aI > 0);
        oRM.renderControl(pB);
        //--Prev Button--//

        //--Wizard Step Indicator--//
        var iC = this.getAggregation("_indicatorContainer");
        iC.destroyAggregation("indicators");
        $.each(steps, function (i, s) {
          var e = new WizardIndicator({
            active: s.getActive(),
          });
          iC.addAggregation("indicators", e);
        });
        oRM.renderControl(iC);
        //--Wizard Step Indicator--//

        //--Next Button--//
        var nB = this.getAggregation("_nextButton");
        nB.setLabel(aI === steps.length - 1 ? "Kaydet" : "Sonraki");
        oRM.renderControl(nB);
        //--Next Button--//

        oRM.close("div"); //--Footer
      },
      _getActiveStep: function () {
        var aI = -1;
        $.each(this.getSteps(), function (i, s) {
          if (s.getActive()) {
            aI = i;
            return false;
          }
        });
        return aI;
      },
    });
  }
);
