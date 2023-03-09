sap.ui.define(
  [
    "sap/ui/core/Control",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (Control, eventUtilities) {
    "use strict";

    return Control.extend(
      "com.thy.ux.annualleaveplanning.ui.PageViewContainer",
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
              type: "com.thy.ux.annualleaveplanning.ui.PageView",
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
            o.transitionEffect,
            o.direction
          );
        },
        renderer: function (oRM, oControl) {
          oRM.openStart("div", oControl); //Main
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

        setActiveView: function (tabIndex, finishCallback, withTransition, d) {
          var that = this;
          var fnActivate = function () {
            that.setActiveWithPromise(tabIndex, d).then(function () {
              if (finishCallback && typeof finishCallback === "function")
                finishCallback();
            });
          };

          if (!withTransition) {
            fnActivate();
          } else {
            this.transitionEffect(d);
            setTimeout(fnActivate, 50);
          }
        },

        setActiveWithPromise: function (tabIndex, d) {
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
                    .removeClass("spp-slide-right")
                    .removeClass("spp-slide-left")
                    .removeClass("spp-hidden")
                    .addClass("spp-active-view")
                    .addClass(d === "L" ? "spp-slide-left" : "spp-slide-right");

                  ok = true;
                }
              } else {
                if (!oView.$().hasClass("spp-hidden")) {
                  oView
                    .$()
                    .removeClass("spp-slide-right")
                    .removeClass("spp-slide-left")
                    .removeClass("spp-active-view")
                    .addClass("spp-hidden");
                }
              }
            });
            resolve(ok);
          });
        },

        transitionEffect: function (d) {
          var aViews = this.getAggregation("views");
          $.each(aViews, function (i, oView) {
            if (oView.getTabIndex() === "-1") {
              oView
                .$()
                .removeClass("spp-hidden")
                .addClass("spp-active-view")
                .addClass(d === "L" ? "spp-slide-left" : "spp-slide-right");
            } else {
              oView
                .$()
                .removeClass("spp-active-view")
                .removeClass("spp-slide-right")
                .removeClass("spp-slide-left")
                .addClass("spp-hidden");
            }
          });
        },
      }
    );
  }
);
