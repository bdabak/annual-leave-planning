sap.ui.define(
  [
    "sap/ui/core/Control",
    "sap/ui/core/CustomData",
    "com/thy/ux/annualleaveplanning/ui/PageHeader",
    "com/thy/ux/annualleaveplanning/ui/Toolbar",
    "com/thy/ux/annualleaveplanning/ui/ToolbarSpacer",
    "com/thy/ux/annualleaveplanning/ui/ButtonGroup",
    "com/thy/ux/annualleaveplanning/ui/Button",
    "com/thy/ux/annualleaveplanning/ui/Period",
    "com/thy/ux/annualleaveplanning/ui/PageContent",
    "com/thy/ux/annualleaveplanning/ui/PageSidebar",
    "com/thy/ux/annualleaveplanning/ui/Legend",
    "com/thy/ux/annualleaveplanning/ui/LegendItem",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidget",
    "com/thy/ux/annualleaveplanning/ui/PageViewContainer",
    "com/thy/ux/annualleaveplanning/ui/PageView",
    "com/thy/ux/annualleaveplanning/ui/PageViewYear",
    "com/thy/ux/annualleaveplanning/ui/PageViewMonth",
    "com/thy/ux/annualleaveplanning/ui/Modal",
    "com/thy/ux/annualleaveplanning/ui/Menu",
    "com/thy/ux/annualleaveplanning/ui/MenuItem",
    "com/thy/ux/annualleaveplanning/ui/Dialog",
    "com/thy/ux/annualleaveplanning/ui/DialogHeader",
    "com/thy/ux/annualleaveplanning/ui/EventEditor",
    "com/thy/ux/annualleaveplanning/ui/EventContainer",
    "com/thy/ux/annualleaveplanning/ui/Event",
    "com/thy/ux/annualleaveplanning/ui/FormField",
    "com/thy/ux/annualleaveplanning/ui/FormLabel",
    "com/thy/ux/annualleaveplanning/ui/FormInput",
    "com/thy/ux/annualleaveplanning/ui/FormDatePicker",
    "com/thy/ux/annualleaveplanning/ui/FormFieldTrigger",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
    "com/thy/ux/annualleaveplanning/utils/sweetalert",
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
    Legend,
    LegendItem,
    DatePickerWidget,
    ViewContainer,
    View,
    ViewYear,
    ViewMonth,
    Modal,
    Menu,
    MenuItem,
    Dialog,
    DialogHeader,
    EventEditor,
    EventContainer,
    CalEvent,
    Field,
    Label,
    Input,
    DatePicker,
    FieldTrigger,
    dateUtilities,
    eventUtilities,
    SwalJS
  ) {
    "use strict";

    return Control.extend("com.thy.ux.annualleaveplanning.ui.Page", {
      metadata: {
        properties: {
          mode: {
            type: "string",
            bindable: true,
            defaultValue: "Y",
          },
          tabIndex:{
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
          header: {
            type: "com.thy.ux.annualleaveplanning.ui.PageHeader",
            multiple: false,
          },
          content: {
            type: "com.thy.ux.annualleaveplanning.ui.PageContent",
            multiple: false,
          },
          modal: {
            type: "com.thy.ux.annualleaveplanning.ui.Modal",
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
        // this.setMode("Y");
        // this.setPeriod(dateUtilities.getCurrentYear());

        var sLibraryPath = jQuery.sap.getModulePath(
          "com.thy.ux.annualleaveplanning"
        ); //get the server location of the ui library
        jQuery.sap.includeStyleSheet(
          sLibraryPath + "/ui/css/ThemeMaterial.css"
        );

        //--Initialize moment locale
        dateUtilities.initializeMoment();
        
      },

      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl); //Control
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
          .class("spp-touch-events")
          .class("spp-overlay-scrollbar")
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

        if (sap.ui.Device.browser.safari) {
          oRM.class("spp-safari");
        } else if (sap.ui.Device.browser.chrome) {
          oRM.class("spp-chrome");
        } else if (sap.ui.Device.browser.firefox) {
          oRM.class("spp-firefox");
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
        oRM.renderControl(oControl.getAggregation("header"));
        //--RenderHeader

        //--RenderContent
        oRM.renderControl(oControl.getAggregation("content"));
        //--RenderContent

        oRM.close("div"); //Panel

        oRM.close("div"); //Container

        oRM.close("div"); //Main Page

        oRM.renderControl(oControl.getAggregation("modal"));

        oRM.close("div"); //Control
      },

      // _renderContent: function () {
      //   return new PageContent({
      //     sidebar: this._renderSidebar(),
      //     viewContainer: this._renderViews(),
      //   });
      // },
      // _renderSidebar: function () {
      //   return new Sidebar({
      //     items: [
      //       new DatePickerWidget({
      //         period: this.getPeriod()
      //       }),
      //       new Legend({
      //         items: [
      //           new LegendItem({
      //             text: "Resmi tatiller",
      //             color: "spp-sch-foreground-orange",
      //           }),
      //           new LegendItem({
      //             text: "Planlanan izin",
      //             color: "spp-sch-foreground-blue",
      //           }),
      //           new LegendItem({
      //             text: "Yıllık izin",
      //             color: "spp-sch-foreground-green",
      //           }),
      //         ],
      //       }),
            
      //     ],
      //   });
      // },
      // _renderViews: function () {
      //   return new ViewContainer({
      //     views: [
      //       new View({
      //         content: new ViewYear({
      //           year: parseInt(this.getPeriod().year),
      //         }),
      //         tabIndex: "0",
      //         hidden: false,
      //         navigationActive: true,
      //         swiped: this._handlePeriodSwipe.bind(this),
      //       }),
      //       new View({
      //         content: new ViewMonth({
      //           year: parseInt(this.getPeriod().year),
      //           month: parseInt(this.getPeriod().month),
      //         }),
      //         tabIndex: "1",
      //         hidden: true,
      //         navigationActive: true,
      //         swiped: this._handlePeriodSwipe.bind(this),
      //       }),
      //       new View({
      //         content: new sap.m.Text({ text: "Ajanda" }),
      //         tabIndex: "2",
      //         hidden: true,
      //       }),
      //       new View({
      //         content: new sap.m.VBox({
      //           height: "100%",
      //           width: "100%",
      //         }),
      //         tabIndex: "-1",
      //         hidden: false,
      //       }).addStyleClass("spp-hidden-view"),
      //     ],
      //   });
      // },
      // _handlePeriodSwipe: function (e) {
      //   var d = e.getParameter("direction") || null;
      //   if (!d) {
      //     return;
      //   }
      //   switch (d) {
      //     case "L":
      //       this._handleNavigateNextPeriod();
      //       break;
      //     case "R":
      //       this._handleNavigatePrevPeriod();
      //       break;
      //     default:
      //       return;
      //   }
      // },
      // _renderButtonGroup: function () {
      //   var that = this;
      //   this._oButtonGroup = new ButtonGroup({
      //     visible: "{= !${device>/system/phone} }",
      //     buttons: [
      //       new Button({
      //         firstChild: true,
      //         label: "YIL",
      //         selected: true,
      //         groupButton: true,
      //         press: that._handleViewChange.bind(that),
      //       })
      //         .addCustomData(
      //           new CustomData({
      //             key: "tab-index",
      //             value: "0",
      //             writeToDom: true,
      //           })
      //         )
      //         .addCustomData(
      //           new CustomData({
      //             key: "view-mode",
      //             value: "Y",
      //             writeToDom: true,
      //           })
      //         ),
      //       new Button({
      //         firstChild: false,
      //         lastChild: false,
      //         groupButton: true,
      //         label: "AY",
      //         selected: false,
      //         press: that._handleViewChange.bind(that),
      //       })
      //         .addCustomData(
      //           new CustomData({
      //             key: "tab-index",
      //             value: "1",
      //             writeToDom: true,
      //           })
      //         )
      //         .addCustomData(
      //           new CustomData({
      //             key: "view-mode",
      //             value: "M",
      //             writeToDom: true,
      //           })
      //         ),
      //       new Button({
      //         firstChild: false,
      //         lastChild: true,
      //         groupButton: true,
      //         label: "AJANDA",
      //         selected: false,
      //         press: that._handleViewChange.bind(that),
      //       })
      //         .addCustomData(
      //           new CustomData({
      //             key: "tab-index",
      //             value: "2",
      //             writeToDom: true,
      //           })
      //         )
      //         .addCustomData(
      //           new CustomData({
      //             key: "view-mode",
      //             value: "A",
      //             writeToDom: true,
      //           })
      //         ),
      //     ],
      //   });
      //   return this._oButtonGroup;
      // },
      // _renderHeaderToolbar: function () {
      //   var that = this;
      //   return new Toolbar({
      //     items: [
      //       new Button({
      //         icon: "spp-icon-menu",
      //         firstChild: true,
      //         classList: ["spp-sidebar-toggle"],
      //         attributes: [
      //           {
      //             name: "data-ref",
      //             value: "toggleSideBar",
      //           },
      //         ],
      //         press: function () {
      //           that.getAggregation("content").getSidebar().toggleState();
      //         },
      //       }),
      //       new Button({
      //         icon: "spp-icon-calendar-day",
      //         label: "Bugün",
      //         classList: ["spp-calendar-today-button", "spp-cal-nav-item"],
      //         press: function () {
      //           that._handlePeriodChange("T");
      //         },
      //       }).addCustomData(
      //         new CustomData({
      //           key: "ref",
      //           value: "todayButton",
      //           writeToDom: true,
      //         })
      //       ),
      //       new Button({
      //         icon: "spp-icon-previous",
      //         classList: ["spp-cal-nav-item"],
      //         tooltip: "Önceki dönem",
      //         press: this._handleNavigatePrevPeriod.bind(this),
      //       }).addCustomData(
      //         new CustomData({
      //           key: "ref",
      //           value: "prevButton",
      //           writeToDom: true,
      //         })
      //       ),
      //       new Button({
      //         icon: "spp-icon-next",
      //         classList: ["spp-cal-nav-item"],
      //         tooltip: "Sonraki dönem",
      //         press: this._handleNavigateNextPeriod.bind(this),
      //       }).addCustomData(
      //         new CustomData({
      //           key: "ref",
      //           value: "nextButton",
      //           writeToDom: true,
      //         })
      //       ),
      //       new Period({
      //         period: that.getPeriod(),
      //         mode: that.getMode(),
      //       }),
      //       new Spacer(),
      //       new Button({
      //         icon: "spp-icon-calendar-days",
      //         classList: ["spp-cal-nav-item", "spp-has-menu"],
      //         tooltip: "Görünüm",
      //         press: function (e) {
      //           that._openModelViewMenu(e, this);
      //         },
      //         visible: "{device>/system/phone}",
      //         solid: true,
      //       }),
      //       this._renderButtonGroup(),
      //     ],
      //   });
      // },

      // _handleNavigateNextPeriod: function () {
      //   this._handlePeriodChange("N");
      // },
      // _handleNavigatePrevPeriod: function () {
      //   this._handlePeriodChange("P");
      // },

      // _openModelViewMenu(e, r) {
      //   var that = this;
      //   var i = this.getTabIndex();
      //   var o = $(r.getDomRef());
      //   if (!o) {
      //     return;
      //   }
      //   var cO = o.offset();
      //   var cH = o.outerHeight();

      //   var w = 120;
      //   var x = cO.left - (w - o.outerWidth());
      //   var y = cO.top + cH;
      //   var aStyles = new Map([
      //     ["width", `${w}px`],
      //     ["transform", `matrix(1, 0, 0, 1, ${x}, ${y})`],
      //   ]);

      //   o.addClass("spp-contains-focus").addClass("spp-pressed");
      //   var oContent = new Menu({
      //     items: [
      //       new MenuItem({
      //         key: "Y",
      //         value: "Yıl",
      //         selected: i === "0",
      //         firstChild: true,
      //       })
      //         .addCustomData(
      //           new CustomData({
      //             key: "tab-index",
      //             value: "0",
      //             writeToDom: true,
      //           })
      //         )
      //         .addCustomData(
      //           new CustomData({
      //             key: "view-mode",
      //             value: "Y",
      //             writeToDom: true,
      //           })
      //         ),
      //       new MenuItem({
      //         key: "M",
      //         value: "Ay",
      //         selected: i === "1",
      //       })
      //         .addCustomData(
      //           new CustomData({
      //             key: "tab-index",
      //             value: "1",
      //             writeToDom: true,
      //           })
      //         )
      //         .addCustomData(
      //           new CustomData({
      //             key: "view-mode",
      //             value: "M",
      //             writeToDom: true,
      //           })
      //         ),
      //       new MenuItem({
      //         key: "A",
      //         value: "Ajanda",
      //         selected: i === "2",
      //         lastChild: true,
      //       })
      //         .addCustomData(
      //           new CustomData({
      //             key: "tab-index",
      //             value: "2",
      //             writeToDom: true,
      //           })
      //         )
      //         .addCustomData(
      //           new CustomData({
      //             key: "view-mode",
      //             value: "A",
      //             writeToDom: true,
      //           })
      //         ),
      //     ],
      //     styles: aStyles,
      //     itemSelected: function (e) {
      //       var i = e.getParameter("selectedItem");
      //       that._getModal().close();
      //       that._handleViewChange(null, i);
      //       o.removeClass("spp-contains-focus").removeClass("spp-pressed");
      //     },
      //   });
      //   this._getModal().openBy(oContent);
      // },

      // _handleCreateEvent: function (c, e, o) {
      //   if (o && o.element) {
      //     this._openCreateEventDialog(o.element, o.period);
      //   }
      // },
      // _handleDisplayEventWidget: function (c, e, o) {
      //   if (o && o.element) {
      //     //this._openDisplayEventDialog(o.element, o.day);
      //   }
      // },

      // _openDisplayEventDialog: function (r, d) {
      //   var that = this;
      //   var o = $(r);
      //   if (!o) {
      //     return;
      //   }
      //   var eO = o.offset(); //Element position
      //   var eH = o.outerHeight(); //Element height
      //   var eW = o.outerWidth();

      //   var aStyles = new Map([
      //     ["transform", `matrix(1, 0, 0, 1, ${eO.left}, -100%)`],
      //   ]);

      //   var oDialog = new Dialog({
      //     header: new DialogHeader({
      //       title: d.title,
      //       closed: function () {
      //         that._getModal().close();
      //       },
      //     }),
      //     styles: aStyles,
      //     elementPosition: {
      //       offset: { ...eO },
      //       outerHeight: eH,
      //       outerWidth: eW,
      //     },
      //     headerDockTop: true,
      //     content: this._createDisplayEventWidget(d),
      //     closed: function () {},
      //   });

      //   this._getModal().openBy(oDialog);
      // },

      // _createDisplayEventWidget: function (d) {
      //   // console.log(d);
      //   // return new EventContainer({
      //   //   widget: true,
      //   //   events: [
      //   //     new CalEvent({
      //   //       color: "spp-holiday-all-day",
      //   //       text: d.holiday.text
      //   //     })
      //   //   ]
      //   // })
      // },

      // _openCreateEventDialog: function (r, p) {
      //   var that = this;
      //   var o = $(r);
      //   if (!o) {
      //     return;
      //   }
      //   var eO = o.offset(); //Element position
      //   var eH = o.outerHeight(); //Element height
      //   var eW = o.outerWidth();

      //   var aStyles = new Map([
      //     ["transform", `matrix(1, 0, 0, 1, ${eO.left}, -100%)`],
      //     ["--date-time-length", "14em"],
      //     ["--date-width-difference", "1em"],
      //   ]);

      //   var oDialog = new Dialog({
      //     header: new DialogHeader({
      //       title: "Yeni Plan",
      //       closed: function () {
      //         oDialog.close();
      //       },
      //     }),
      //     styles: aStyles,
      //     elementPosition: {
      //       offset: { ...eO },
      //       outerHeight: eH,
      //       outerWidth: eW,
      //     },
      //     classList: ["spp-eventeditor"],
      //     content: this._createEventEditor(p),
      //     closed: function () {
      //       //--Codes that perform operations after dialog close
      //       that._createEventCancelled();
      //     },
      //     cancelled: function(){
      //       //--Modal closed cancel event
      //       that._cancelCreateEvent();
      //     }
      //   });

      //   this._getModal().openBy(oDialog);
      // },

      // _cancelCreateEvent: function(){
      //   eventUtilities.publishEvent(
      //     "PlanningCalendar",
      //     "CreateEventCancelled",
      //     null
      //   );
      // },
      // _createEventCancelled: function () {
      //   this._cancelCreateEvent();
      //   this._getModal().close();
      // },

      // _createEventEditorToolbar() {
      //   var that = this;
      //   return new Toolbar({
      //     items: [
      //       new Button({
      //         raised: true,
      //         label: "Kaydet",
      //         firstChild: true,
      //         classList: ["spp-blue"],
      //         press: function () {
      //           //TODO
      //         },
      //       }),
      //       new Button({
      //         lastChild: true,
      //         label: "İptal",
      //         press: function () {
      //           that._createEventCancelled();
      //         },
      //       }),
      //     ],
      //   });
      // },
      // _callDatePicker: function(e){
      //   var s = e.getParameter("sourceField");
      //   var t = e.getParameter("targetField");
      //   var p = e.getParameter("period");
      //   var o = t.$();
      //   if(o && o?.length > 0){

      //     var eO = o.offset(); //Element position
      //     var eH = o.outerHeight(); //Element height
      //     var eW = o.outerWidth();
          
      //     var oDPW = new DatePickerWidget({
      //       floating: true,
      //       period: p,
      //       select: function(e){
      //         var d = e.getParameter("selectedDate");
      //         if(s && typeof s.handleValueSelection  === "function"){
      //           s.handleValueSelection(d);
      //         }
      //       },
      //       selectedDate: dateUtilities.convertPeriodToDate(p),
      //       elementPosition: {
      //         offset: { ...eO },
      //         outerHeight: eH,
      //         outerWidth: eW,
      //       },
      //     });

      //     s.registerDatePickerWidget(oDPW);

      //     this._getModal().openBy(oDPW);
      //   }
      // },
      // _createEventEditor: function (p) {
      //   return new EventEditor({
      //     toolbar: this._createEventEditorToolbar(),
      //     items: [
      //       new Field({
      //         firstChild: true,
      //         containsFocus: true,
      //         empty: true,
      //         // noHint: true,
      //         label: new Label({
      //           text: "Tür",
      //           for: this.getId() + "_input_event_type",
      //         }),
      //         field: new Input({
      //           id: this.getId() + "_input_event_type",
      //           placeHolder: "Türü seçiniz",
      //           name: "İzin türü seçiniz",
      //         }),
      //       }),
      //       new Field({
      //         containsFocus: true,
      //         empty: p?.startDate ? false : true,
      //         label: new Label({
      //           text: "Başlangıç",
      //           for: this.getId() + "_datepicker_start_date",
      //         }),
      //         field: new DatePicker({
      //           id: this.getId() + "_datepicker_start_date",
      //           name: "BeginDate",
      //           value: dateUtilities.formatDate(p.startDate),
      //           selectDate: this._callDatePicker.bind(this)
      //         }),
      //       }),
      //       new Field({
      //         lastChild: true,
      //         containsFocus: true,
      //         empty: p?.endDate ? false : true,
      //         label: new Label({
      //           text: "Bitiş",
      //           for: this.getId() + "_datepicker_end_date",
      //         }),
      //         field: new DatePicker({
      //           id: this.getId() + "_datepicker_end_date",
      //           name: "EndDate",
      //           value: dateUtilities.formatDate(p.endDate),
      //           selectDate: this._callDatePicker.bind(this)
      //         }),
      //       }),
      //     ],
      //   });
      // },

      // _getModal: function () {
      //   return this.getAggregation("modal");
      // },

      // _handleViewChange: function (e, c = null) {
      //   var that = this;
      //   var s = e ? e.getSource() : c;
      //   if (!s) {
      //     return;
      //   }
      //   var i = s.data("tab-index");
      //   var m = s.data("view-mode");
      //   var d = "right"; //by default animate from right direction

      //   if (this.getTabIndex() < i) {
      //     d = "R";
      //   } else {
      //     d = "L";
      //   }

      //   this.setProperty("tabIndex", i, true);
      //   this.setProperty("mode", m, true);

      //   this._publishViewChanged(
      //     jQuery.proxy(that._handleViewChangeCompleted, that),
      //     false,
      //     d
      //   );
      // },
      // _handleViewChangeCompleted: function () {
      //   var i = this.getTabIndex();
      //   var p = this.getPeriod();
      //   var m = this.getMode();
      //   eventUtilities.publishEvent("PlanningCalendar", "ViewChangeCompleted", {
      //     period: { ...p },
      //     mode: m,
      //     tabIndex: i,
      //   });
      // },
      // _handlePeriodChange: function (b) {
      //   var p = this.getPeriod();
      //   var x = { ...p };
      //   var m = this.getMode();
      //   var that = this;
      //   switch (b) {
      //     case "T": //Today
      //       p = dateUtilities.getToday();
      //       break;
      //     case "N": //Next period
      //       p = dateUtilities.getNextPeriod(p, m);
      //       break;
      //     case "P": //Previous period
      //       p = dateUtilities.getPrevPeriod(p, m);
      //       break;
      //   }

      //   var d = dateUtilities.decidePeriodChangeDirection(x, p);

      //   this.setProperty("period", p, true);

      //   this._publishPeriodChanged(
      //     jQuery.proxy(that._publishViewChanged, that, null, true, d)
      //   );
      // },

      // _publishPeriodChanged: function (fnCb) {
      //   var p = this.getPeriod();
      //   var m = this.getMode();
      //   eventUtilities.publishEvent("PlanningCalendar", "PeriodChanged", {
      //     period: { ...p },
      //     mode: m,
      //     fnCallback: fnCb,
      //   });
      // },

      // _publishViewChanged: function (fnCb, e, d) {
      //   var i = this.getTabIndex();
      //   eventUtilities.publishEvent("PlanningCalendar", "ViewChanged", {
      //     tabIndex: i,
      //     transitionEffect: e,
      //     direction: d,
      //     fnCallback: fnCb ? fnCb : null,
      //   });
      // },
    });
  }
);
