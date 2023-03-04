sap.ui.define(
  [
    "sap/ui/core/Control",
    "sap/ui/core/CustomData",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageHeader",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageToolbar",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageToolbarSpacer",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageButtonGroup",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageButton",
    "com/thy/ux/annualleaveplanning/ui/PlanningPagePeriod",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageContent",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageSidebar",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageViewContainer",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageView",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageViewYear",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageViewMonth",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageModal",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageMenu",
    "com/thy/ux/annualleaveplanning/ui/PlanningPageMenuItem",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  function (
    Control,
    CustomData,
    Header,
    Toolbar,
    Spacer,
    ButtonGroup,
    Button,
    Period,
    PageContent,
    Sidebar,
    ViewContainer,
    View,
    ViewYear,
    ViewMonth,
    Modal,
    Menu,
    MenuItem,
    dateUtilities,
    eventUtilities
  ) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.PlanningPage", {
      metadata: {
        properties: {
          mode: {
            type: "string",
            bindable: true,
            defaultValue: "Y",
          },
          tabIndex: {
            type: "string",
            bindable: true,
            defaultValue: "0",
          },
          period: {
            type: "object",
            bindable: true,
          },
        },
        aggregations: {
          _header: {
            type: "com.thy.ux.annualleaveplanning.ui.PlanningPageHeader",
            multiple: false,
          },
          _content: {
            type: "com.thy.ux.annualleaveplanning.ui.PlanningPageContent",
            multiple: false,
          },
          _modal: {
            type: "com.thy.ux.annualleaveplanning.ui.PlanningPageModal",
            multiple: false,
          },
        },
        events: {},
      },
      /**
       * Events
       */
      init: function () {
        //--Set periods and default view mode
        this.setMode("Y");
        this.setPeriod(dateUtilities.getCurrentYear());

        var sLibraryPath = jQuery.sap.getModulePath(
          "com.thy.ux.annualleaveplanning"
        ); //get the server location of the ui library
        jQuery.sap.includeStyleSheet(sLibraryPath + "/ui/PlanningPage.css");

        //--Create header
        var h = new Header({
          toolbar: this._renderToolbar(),
        });
        this.setAggregation("_header", h);

        //--Create content
        var c = this._renderContent();
        this.setAggregation("_content", c);

        //--Create model
        var m = new Modal();
        this.setAggregation("_modal", m);
      },

      renderer: function (oRM, oControl) {
        oRM.openStart("div"); //Control
        oRM.writeControlData(oControl);
        oRM.class("spp"); //smod-planning-page
        oRM.openEnd();

        oRM.openStart("div"); //Main Page
        oRM.class("spp-page");
        oRM.openEnd();

        oRM.openStart("div"); //Container
        oRM
          .class("spp-widget")
          .class("spp-container")
          .class("spp-panel")
          .class("spp-responsive")
          .class("spp-calendar")
          .class("spp-touch")
          .class("spp-panel-has-top-toolbar")
          .class("spp-vbox")
          .class("spp-calendar-nav-toolbar")
          .class("spp-outer")
          .class("spp-mac")
          .class("spp-touch-events")
          .class("spp-overlay-scrollbar")
          .class("spp-safari")
          .class("spp-cal-day")
          .class("spp-cal-week")
          .class("spp-cal-month")
          .class("spp-cal-year")
          .class("spp-cal-agenda")
          .class("spp-calendardrag")
          .class("spp-eventedit")
          .class("spp-eventtooltip")
          .class("spp-legacy-inset")
          .class("spp-resize-monitored");

        if (sap.ui.Device.system.phone) {
          oRM.class("spp-responsive-small");
        } else if (sap.ui.Device.system.tablet) {
          oRM.class("spp-responsive-medium");
        } else if (sap.ui.Device.system.desktop) {
          oRM.class("spp-responsive-large");
        }

        oRM.openEnd();

        oRM.openStart("div"); //Panel
        oRM
          .class("spp-vbox")
          .class("spp-box-center")
          .class("spp-panel-body-wrap")
          .class("spp-calendar-body-wrap");
        oRM.openEnd();

        //--RenderHeader
        oRM.renderControl(oControl.getAggregation("_header"));
        //--RenderHeader

        //--RenderContent
        oRM.renderControl(oControl.getAggregation("_content"));
        //--RenderContent

        oRM.close("div"); //Panel

        oRM.close("div"); //Container

        oRM.close("div"); //Main Page

        oRM.renderControl(oControl.getAggregation("_modal"));

        oRM.close("div"); //Control
      },

      _renderContent: function () {
        return new PageContent({
          sidebar: this._renderSidebar(),
          viewContainer: this._renderViews(),
        });
      },
      _renderSidebar: function () {
        return new Sidebar();
      },
      _renderViews: function () {
        return new ViewContainer({
          views: [
            new View({
              content: new ViewYear({
                year: parseInt(this.getPeriod().year),
              }),
              tabIndex: "0",
              hidden: false,
              navigationActive: true,
              swiped: this._handlePeriodSwipe.bind(this)
            }),
            new View({
              content: new ViewMonth({
                year: parseInt(this.getPeriod().year),
                month: parseInt(this.getPeriod().month),
              }),
              tabIndex: "1",
              hidden: true,
              navigationActive: true,
              swiped: this._handlePeriodSwipe.bind(this)
            }),
            new View({
              content: new sap.m.Text({ text: "Ajanda" }),
              tabIndex: "2",
              hidden: true,
            }),
            new View({
              content: new sap.m.VBox({
                height:"100%",
                width: "100%"
              }),
              tabIndex: "-1",
              hidden: false,
            }).addStyleClass("spp-hidden-view"),
          ],
        });
      },
      _handlePeriodSwipe: function(e){
        var d = e.getParameter("direction") || null;
        if(!d){
          return
        }
        d === "L" ? this._handleNavigateNextPeriod() : d === "R" ? this._handleNavigatePrevPeriod() : null; 
      },
      _renderButtonGroup: function () {
        var that = this;
        this._oButtonGroup = new ButtonGroup({
          visible: "{= !${device>/system/phone} }",
          buttons: [
            new Button({
              firstChild: true,
              label: "YIL",
              selected: true,
              groupButton: true,
              press: that._handleViewChange.bind(that),
            })
              .addCustomData(
                new CustomData({
                  key: "tab-index",
                  value: "0",
                  writeToDom: true,
                })
              )
              .addCustomData(
                new CustomData({
                  key: "view-mode",
                  value: "Y",
                  writeToDom: true,
                })
              ),
            new Button({
              firstChild: false,
              lastChild: false,
              groupButton: true,
              label: "AY",
              selected: false,
              press: that._handleViewChange.bind(that),
            })
              .addCustomData(
                new CustomData({
                  key: "tab-index",
                  value: "1",
                  writeToDom: true,
                })
              )
              .addCustomData(
                new CustomData({
                  key: "view-mode",
                  value: "M",
                  writeToDom: true,
                })
              ),
            new Button({
              firstChild: false,
              lastChild: true,
              groupButton: true,
              label: "AJANDA",
              selected: false,
              press: that._handleViewChange.bind(that),
            })
              .addCustomData(
                new CustomData({
                  key: "tab-index",
                  value: "2",
                  writeToDom: true,
                })
              ).addCustomData(
                new CustomData({
                  key: "view-mode",
                  value: "A",
                  writeToDom: true,
                })
              ),
          ],
        });
        return this._oButtonGroup;
      },
      _renderToolbar: function () {
        var that = this;
        return new Toolbar({
          items: [
            new Button({
              icon: "spp-icon-menu",
              firstChild: true,
              classList: ["spp-sidebar-toggle"],
              attributes: [
                {
                  name: "data-ref",
                  value: "toggleSideBar",
                },
              ],
              press: function () {
                that.getAggregation("_content").getSidebar().toggleState();
              },
            }),
            new Button({
              icon: "spp-icon-calendar-day",
              label: "Bugün",
              classList: ["spp-calendar-today-button", "spp-cal-nav-item"],
              press: function () {
                that._handlePeriodChange("T");
              },
            }).addCustomData(
              new CustomData({
                key: "ref",
                value: "todayButton",
                writeToDom: true,
              })
            ),
            new Button({
              icon: "spp-icon-previous",
              classList: ["spp-cal-nav-item"],
              tooltip: "Önceki dönem",
              press: this._handleNavigatePrevPeriod.bind(this),
            }).addCustomData(
              new CustomData({
                key: "ref",
                value: "prevButton",
                writeToDom: true,
              })
            ),
            new Button({
              icon: "spp-icon-next",
              classList: ["spp-cal-nav-item"],
              tooltip: "Sonraki dönem",
              press: this._handleNavigateNextPeriod.bind(this)
            }).addCustomData(
              new CustomData({
                key: "ref",
                value: "nextButton",
                writeToDom: true,
              })
            ),
            new Period({
              period: that.getPeriod(),
              mode: that.getMode(),
            }),
            new Spacer(),
            new Button({
              icon: "spp-icon-calendar-days",
              classList: ["spp-cal-nav-item"],
              tooltip: "Görünüm",
              press: function (e) {
                that._openModelViewMenu(e, this);
              },
              visible: "{device>/system/phone}"
            }),
            this._renderButtonGroup(),
          ],
        });
      },

      _handleNavigateNextPeriod: function(){
        this._handlePeriodChange("N");
      },
      _handleNavigatePrevPeriod: function(){
        this._handlePeriodChange("P");
      },

      _openModelViewMenu(e, r) {
        var that = this;
        var i = this.getTabIndex();
        var o = $(r.getDomRef());
        if(!o){
          return;
        }
        var cO = o.offset();
        var cH = o.outerHeight();
        var wW = $(window).width();

        var w = 120;
        var x = cO.left - ( w - o.outerWidth());
        var y = cO.top + cH ;
        var aStyles = new Map([
          ["width", `${w}px`],
          ["transform", `matrix(1, 0, 0, 1, ${x}, ${y})`],
        ]);
        var oContent = new Menu({
          items: [
            new MenuItem({
              key: "Y",
              value: "Yıl",
              selected: i === "0",
              firstChild: true,
            }).addCustomData(
              new CustomData({
                key: "tab-index",
                value: "0",
                writeToDom: true,
              })
            ).addCustomData(
              new CustomData({
                key: "view-mode",
                value: "Y",
                writeToDom: true,
              })
            ),
            new MenuItem({
              key: "M",
              value: "Ay",
              selected: i === "1",
            }).addCustomData(
              new CustomData({
                key: "tab-index",
                value: "1",
                writeToDom: true,
              })
            ).addCustomData(
              new CustomData({
                key: "view-mode",
                value: "M",
                writeToDom: true,
              })
            ),
            new MenuItem({
              key: "A",
              value: "Ajanda",
              selected: i === "2",
              lastChild: true,
            }).addCustomData(
              new CustomData({
                key: "tab-index",
                value: "2",
                writeToDom: true,
              })
            ).addCustomData(
              new CustomData({
                key: "view-mode",
                value: "A",
                writeToDom: true,
              })
            ),
          ],
          styles: aStyles,
          itemSelected: function(e){
            var i = e.getParameter("selectedItem");
            that._getModal().close();
            that._handleViewChange(null, i);
          }
        });
        this._getModal().openBy(oContent);
      },

      _getModal: function () {
        return this.getAggregation("_modal");
      },
      
      _handleViewChange: function (e, c = null) {
        var that = this;
        var s = e ? e.getSource() : c;
        if(!s){
          return;
        }
        var i = s.data("tab-index");
        var m = s.data("view-mode");
        var d = "right"; //by default animate from right direction 

        if(this.getTabIndex() < i){
          d = "R";
        }else{  
          d = "L";
        }

        this.setProperty("tabIndex", i, true);
        this.setProperty("mode", m, true);



        this._publishViewChanged(
          jQuery.proxy(that._handleViewChangeCompleted, that),
          false,
          d
        );
      },
      _handleViewChangeCompleted: function () {
        var i = this.getTabIndex();
        var p = this.getPeriod();
        var m = this.getMode();
        eventUtilities.publishEvent("PlanningCalendar", "ViewChangeCompleted", {
          period: { ...p },
          mode: m,
          tabIndex: i,
        });
      },
      _handlePeriodChange: function (b) {
        var p = this.getPeriod();
        var x = {...p};
        var m = this.getMode();
        var that = this;
        switch (b) {
          case "T": //Today
            p = dateUtilities.getToday();
            break;
          case "N": //Next period
            p = dateUtilities.getNextPeriod(p, m);
            break;
          case "P": //Previous period
            p = dateUtilities.getPrevPeriod(p, m);
            break;
        }

        var d = dateUtilities.decidePeriodChangeDirection(x,p);

        this.setProperty("period", p, true);

        this._publishPeriodChanged(
          jQuery.proxy(that._publishViewChanged, that, null, true, d)
        );
      },

      _publishPeriodChanged: function (fnCb) {
        var p = this.getPeriod();
        var m = this.getMode();
        eventUtilities.publishEvent("PlanningCalendar", "PeriodChanged", {
          period: { ...p },
          mode: m,
          fnCallback: fnCb,
        });
      },

      _publishViewChanged: function (fnCb, e, d) {
        var i = this.getTabIndex();
        eventUtilities.publishEvent("PlanningCalendar", "ViewChanged", {
          tabIndex: i,
          transitionEffect: e,
          direction: d,
          fnCallback: fnCb ? fnCb : null,
        });
      },
    });
  }
);
