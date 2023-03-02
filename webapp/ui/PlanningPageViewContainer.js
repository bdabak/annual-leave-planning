sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (Control, eventUtilities) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PlanningPageViewContainer",
      {
        metadata: {
          properties: {
            tabIndex: {
              type: "int",
              bindable: true,
            },
          },
          aggregations: {
            views: {
              type: "com.thy.ux.annualleaveplanning.ui.PlanningPageView",
              multiple: true,
            },
          },
          events: {},
        },
        init: function () {
          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "ViewChanged",
            this.onViewChanged,
            this
          );
        },

        onViewChanged: function (c, e, o) {
          this.setActiveView(
            o.tabIndex,
            o.fnCallback,
            o.transitionEffect
          );
        },
        renderer: function (oRM, oControl) {
          oRM.openStart("div");
          oRM.writeControlData(oControl);
          oRM
            .class("spp-widget")
            .class("spp-container")
            .class("spp-calendar-viewcontainer")
            .class("spp-content-element")
            .class("spp-card-container")
            .class("spp-hide-child-headers")
            .class("spp-last-visible-child")
            .class("spp-widget-scroller")
            .class("spp-resize-monitored")
            .class("spp-flex-row");

          oRM
            .style("padding", "0px")
            .style("flex", "1 1 100%")
            .style("overflow-y", "auto");
          oRM.openEnd();

          $.each(oControl.getViews(), function (i, v) {
            oRM.renderControl(v);
          });
          oRM.close("div");
        },

        setActiveView: function (tabIndex, finishCallback, withTransition) {
          var that = this;
          var fnActivate = function () {
            that.setActiveWithPromise(tabIndex).then(function () {
              if (finishCallback && typeof finishCallback === "function") finishCallback();
            });
          };

          if (!withTransition) {
            fnActivate();
          } else {
            this.transitionEffect();
            setTimeout(fnActivate, 100);
          }
        },

        setActiveWithPromise: function (tabIndex) {
          var that = this;
          var ok = false;
          return new Promise(function (resolve, reject) {
            var aViews = that.getAggregation("views");
            $.each(aViews, function (i, oView) {
              if (oView.getTabIndex() === tabIndex) {
                if (oView.$().hasClass("spp-hidden")) {
                  oView
                    .$()
                    .removeClass("spp-hidden")
                    .addClass("spp-active-view");
                  ok = true;
                }
              } else {
                if (!oView.$().hasClass("spp-hidden")) {
                  oView
                    .$()
                    .removeClass("spp-active-view")
                    .addClass("spp-hidden");
                }
              }
            });
            resolve(ok);
          });
        },

        transitionEffect: function () {
          var aViews = this.getAggregation("views");
          $.each(aViews, function (i, oView) {
            if (oView.getTabIndex() === "-1") {
              oView.$().removeClass("spp-hidden").addClass("spp-active-view");
            } else {
              oView.$().removeClass("spp-active-view").addClass("spp-hidden");
            }
          });
        },
      }
    );
  }
);
