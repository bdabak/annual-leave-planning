sap.ui.define(
  [
    "sap/ui/core/Control",
    "sap/m/ActionSheet",
    "sap/m/ResponsivePopover",
    "sap/ui/layout/VerticalLayout",
    "com/thy/ux/annualleaveplanning/ui/Button",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (
    Control,
    ActionSheet,
    Popover,
    VerticalLayout,
    Button,
    eventUtilities
  ) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.Event", {
      metadata: {
        properties: {
          eventId: {
            type: "string",
            bindable: true,
            defaultValue: "",
          },
          eventType: {
            type: "string",
            bindable: true,
            defaultValue: "",
          },
          leaveType: {
            type: "string",
            bindable: true,
            defaultValue: null,
          },
          startDate: {
            type: "string",
            bindable: true,
            defaultValue: null,
          },
          endDate: {
            type: "string",
            bindable: true,
            defaultValue: null,
          },
          color: {
            type: "string",
            bindable: true,
          },
          text: {
            type: "string",
            bindable: true,
          },
          height: {
            type: "sap.ui.core.CSSSize",
            bindable: true,
            defaultValue: "25px",
          },
          hasPast: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          hasFuture: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          hasOverflow: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          rowIndex: {
            type: "int",
            bindable: true,
            defaultValue: 0,
          },
          rowSpan: {
            type: "int",
            bindable: true,
            defaultValue: 1,
          },
          forAgenda: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          editable: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          splittable: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          deletable: {
            type: "boolean",
            bindable: true,
            defaultValue: false,
          },
          duration: {
            type: "string",
            bindable: true,
            defaultValue: null,
          },
        },
        aggregations: {},
        events: {},
      },
      renderer: function (oRM, oControl) {
        var bPast = oControl.getHasPast();
        var bEvent = oControl.getEventType();
        var bFuture = oControl.getHasFuture();
        var bOVerflow = oControl.getHasOverflow();
        var sEventId = oControl.getEventId() || null;
        var iRow =
          oControl.getParent()?.getEvents()?.length > 0
            ? oControl.getParent()?.getEvents()?.length - 1
            : 0 || 0;
        var iSpan = oControl.getRowSpan();
        var bAgenda = oControl.getForAgenda();
        oRM.openStart("div", oControl); //Main
        oRM
          .class("spp-cal-event-wrap")
          .class("spp-allday")
          .class("spp-solid-bar")
          .class("spp-past-event");

        if (bEvent === "newEvent") {
          oRM.class("spp-is-creating");
        }

        if (bOVerflow) {
          oRM.class("spp-overflow");
        } else {
          bPast ? oRM.class("spp-continues-past") : null;
          bFuture ? oRM.class("spp-continues-future") : null;
        }

        var w = (function (s) {
          if (s === 1) {
            return "14.29%";
          } else {
            var l = 14.29 * s;
            l = l > 100 ? 100 : l;
            return l.toString() + "%";
          }
        })(iSpan);

        if (!bAgenda) {
          if (!bPast && bFuture) {
            oRM.style("width", `${w}`);
            oRM.style("top", `${((iRow + 1) * 22 + 3).toString() + "px"}`);
          } else {
            oRM.style("width", `${w}`);
            oRM.style("top", `${((iRow + 1) * 22 + 3).toString() + "px"}`);
          }
        } else {
          oRM.style("min-width", "250px");
        }
        //--Render day class
        oRM.class(oControl.getColor());
        //--Render day class
        oRM.attr("role", "presentation");
        if (sEventId) {
          oRM.attr("data-event-id", sEventId);
        }
        oRM.openEnd();

        //--Render event
        oRM.openStart("div").class("spp-cal-event");
        oRM.style("height", oControl.getHeight());
        if (bAgenda) {
          oRM.style("justify-content", "center");
        }
        oRM.attr("role", "presentation");
        oRM.openEnd();

        //--Render event icon--//
        oRM
          .openStart("i")
          .class("spp-cal-event-icon")
          .class("spp-icon")
          .class("spp-fw-icon")
          .class("spp-icon-circle");
        oRM.openEnd();
        oRM.close("i");
        //--Render event icon--//

        //--Render event body--//
        oRM
          .openStart("div")
          .class("spp-cal-event-body")
          .attr("role", "presentation")
          .openEnd();

        //--Render event description--//
        oRM
          .openStart("div")
          .class("spp-cal-event-desc")
          .attr("role", "presentation");

        oRM.openEnd();

        oRM.text(oControl.getText());

        if (oControl.getDuration()) {
          oRM
            .openStart("span")
            .class("spp-cal-event-duration")
            .openEnd()
            .text(`(${oControl.getDuration()})`)
            .close("span");
        }

        oRM.close("div");
        //--Render event description--//

        oRM.close("div");
        //--Render event body--//

        oRM.close("div");
        //--Render event

        oRM.close("div");
      },
      ontap: function () {
        var bEditable = this.getEditable();
        var bSplittable = this.getSplittable();
        var bDeletable = this.getDeletable();

        if (!bEditable && !bDeletable && !bSplittable) {
          return;
        }
        var that = this;
        var eventId = this.getProperty("eventId");
        var eventType = this.getProperty("eventType");
        var leaveType = this.getProperty("leaveType");
        var oEventObject = {
          EventId: eventId,
          EventType: eventType,
          LeaveType: leaveType,
          Deletable: bDeletable,
        };

        if (!this._actionSheet) {
          var b = [];
          var c = [];

          if (bEditable) {
            b.push(
              new sap.m.Button({
                text: that
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("editAction"),
                icon: "sap-icon://edit",
                press: function () {
                  eventUtilities.publishEvent("PlanningCalendar", "EditEvent", _.clone(oEventObject));
                },
              })
            );

            c.push(
              new Button({
                icon: "spp-fa-pen",
                label: that
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("editAction"),
                solid: true,
                press: function () {
                  that._actionSheet.close();
                  eventUtilities.publishEvent("PlanningCalendar", "EditEvent",  _.clone(oEventObject));
                },
              })
            );
          }

          if (bSplittable) {
            b.push(
              new sap.m.Button({
                text: that
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("splitAction"),
                icon: "sap-icon://screen-split-two",
                press: function () {
                  eventUtilities.publishEvent(
                    "PlanningCalendar",
                    "SplitEvent",
                    _.clone(oEventObject)
                  );
                },
              })
            );
            c.push(
              new Button({
                icon: "spp-fa-arrows-turn-to-dots",
                label: that
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("splitAction"),
                solid: true,
                press: function () {
                  that._actionSheet.close();
                  eventUtilities.publishEvent(
                    "PlanningCalendar",
                    "SplitEvent",
                    _.clone(oEventObject)
                  );
                },
              }).addStyleClass("spp-indigo")
            );
          }

          if (bDeletable) {
            b.push(
              new sap.m.Button({
                text: that
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("deleteAction"),
                icon: "sap-icon://delete",
                type: "Reject",
                press: function () {
                  eventUtilities.publishEvent(
                    "PlanningCalendar",
                    "DeleteEvent",
                    _.clone(oEventObject)
                  );
                },
              })
            );
            c.push(
              new Button({
                icon: "spp-fa-trash",
                label: that
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("deleteAction"),
                solid: true,
                press: function () {
                  that._actionSheet.close();
                  eventUtilities.publishEvent(
                    "PlanningCalendar",
                    "DeleteEvent",
                    _.clone(oEventObject)
                  );
                },
              }).addStyleClass("spp-red")
            );
          }

          this._actionSheet = new ActionSheet({
            buttons: b,
            afterClose: function () {
              that._actionSheet.destroy();
              that._actionSheet = null;
            },
          }).addStyleClass("spp-actionsheet");

          this._actionSheet = new Popover({
            showHeader: false,
            afterClose: function () {
              that._actionSheet.destroy();
              that._actionSheet = null;
            },
            showArrow: true,
            placement: "Auto",
            content: new VerticalLayout({
              width: "100%",
              content: c,
            }),
          }).addStyleClass("spp-actionsheet");

          this._actionSheet.openBy(this);
        }
      },
    });
  }
);
