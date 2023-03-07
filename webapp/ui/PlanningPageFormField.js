sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.annualleaveplanning.ui.PlanningPageFormField",
    {
      metadata: {
        properties: {
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
          fieldType: {
            type: "string",
            bindable: true,
            defaultValue: "textfield"
          },
          labelBefore: {
            type: "boolean",
            bindable: true,
            defaultValue: true,
          },
          containsFocus: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          empty: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          noHint: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
        },
        aggregations: {
          label: {
            type: "com.thy.ux.annualleaveplanning.ui.PlanningPageFormLabel",
            multiple: false,
          },
          field: {
            type: "sap.ui.core.Control",
            multiple: false,
          },
        },
        events: {},
      },
      renderer: function (oRM, oControl) {
        var t = oControl.getFieldType();
        var bLabel = oControl.getLabel() || null;

        oRM.openStart("div", oControl); //Main
        oRM.class("spp-widget").class("spp-field");

        //--Variable class names
        oRM.class(t !== "" ? `spp-${t}` : `spp-textfield`);

        bLabel ? oRM.class("spp-has-label") : null;
        oControl.getLabelBefore() ? oRM.class("spp-label-before") : null;
        oControl.getFirstChild() ? oRM.class("spp-first-visible-child") : null;
        oControl.getLastChild() ? oRM.class("spp-last-visible-child") : null;
        oControl.getEmpty() ? oRM.class("spp-empty") : null;
        oControl.getLastChild() ? oRM.class("spp-last-visible-child") : null;
        oControl.getNoHint() ? oRM.class("spp-field-no-hint") : null;

        oRM.openEnd();

        //--Label--//
        oRM.renderControl(oControl.getLabel());
        //--Label--//

        //--Field--//
        oRM.renderControl(oControl.getField());
        //--Field--//

        oRM.close("div"); //Main
      },
    }
  );
});
