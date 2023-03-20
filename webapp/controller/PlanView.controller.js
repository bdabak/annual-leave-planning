sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "com/thy/ux/annualleaveplanning/ui/Dialog",
    "com/thy/ux/annualleaveplanning/ui/DialogHeader",
    "com/thy/ux/annualleaveplanning/ui/Toolbar",
    "com/thy/ux/annualleaveplanning/ui/Button",
    "com/thy/ux/annualleaveplanning/ui/EventEditor",
    "com/thy/ux/annualleaveplanning/ui/FormField",
    "com/thy/ux/annualleaveplanning/ui/FormLabel",
    "com/thy/ux/annualleaveplanning/ui/FormInput",
    "com/thy/ux/annualleaveplanning/ui/FormDatePicker",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidget",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    Fragment,
    Dialog,
    DialogHeader,
    Toolbar,
    Button,
    EventEditor,
    Field,
    Label,
    Input,
    DatePicker,
    DatePickerWidget,
    dateUtilities,
    eventUtilities
  ) {
    "use strict";

    return Controller.extend(
      "com.thy.ux.annualleaveplanning.controller.PlanView",
      {
        onInit: function () {
          var legend = [
            {
              type: "holiday",
              text: "Resmi tatiller",
              color: "spp-sch-foreground-orange",
              design: "spp-holiday-all-day-event",
              selected: true,
            },
            {
              type: "planned",
              text: "Planlanan izin",
              color: "spp-sch-foreground-blue",
              design: "spp-planned-leave-event",
              selected: true,
            },
            {
              type: "annual",
              text: "Yıllık izin",
              color: "spp-sch-foreground-green",
              design: "spp-annual-leave-event",
              selected: true,
            },
          ];

          var holidayCalendar = {
            holidayList: {
              2023: [
                {
                  id: 1,
                  month: "01",
                  day: "01",
                  text: "Yılbaşı tatili",
                  type: "1",
                  belongsTo: "JAN01",
                },
                {
                  id: 2,
                  month: "04",
                  day: "20",
                  text: "Ramazan Bayram Arefesi",
                  type: "2",
                  belongsTo: "RAM",
                },
                {
                  id: 3,
                  month: "04",
                  day: "21",
                  text: "Ramazan Bayramı",
                  type: "1",
                  belongsTo: "RAM",
                },
                {
                  id: 4,
                  month: "04",
                  day: "22",
                  text: "Ramazan Bayramı",
                  type: "1",
                  belongsTo: "RAM",
                },
                {
                  id: 5,
                  month: "04",
                  day: "23",
                  text: "Ramazan Bayramı",
                  type: "1",
                  belongsTo: "RAM",
                },
                {
                  id: 51,
                  month: "04",
                  day: "24",
                  text: "Ramazan Bayramı",
                  type: "1",
                  belongsTo: "RAM",
                },
                {
                  id: 6,
                  month: "04",
                  day: "23",
                  text: "Ulusal Egemenlik ve Çocuk Bayramı",
                  type: "1",
                  belongsTo: "APR23",
                },
                {
                  id: 61,
                  month: "05",
                  day: "01",
                  type: "1",
                  text: "Emek ve Dayanışma Günü",
                  belongsTo: "MAY01",
                },
                {
                  id: 7,
                  month: "05",
                  day: "19",
                  text: "Atatürk'ü Anma Gençlik ve Spor Bayramı",
                  type: "1",
                  belongsTo: "MAY19",
                },
                {
                  id: 8,
                  month: "07",
                  day: "15",
                  text: "Demokrasi ve Millî Birlik Günü",
                  type: "1",
                  belongsTo: "JUL15",
                },
                {
                  id: 9,
                  month: "06",
                  day: "27",
                  text: "Kurban Bayram Arefesi",
                  type: "2",
                  belongsTo: "SAC",
                },
                {
                  id: 10,
                  month: "06",
                  day: "28",
                  text: "Kurban Bayramı",
                  type: "1",
                  belongsTo: "SAC",
                },
                {
                  id: 11,
                  month: "06",
                  day: "29",
                  text: "Kurban Bayramı",
                  type: "1",
                  belongsTo: "SAC",
                },
                {
                  id: 12,
                  month: "06",
                  day: "30",
                  text: "Kurban Bayramı",
                  type: "1",
                  belongsTo: "SAC",
                },
                {
                  id: 13,
                  month: "07",
                  day: "01",
                  text: "Kurban Bayramı",
                  type: "1",
                  belongsTo: "SAC",
                },
                {
                  id: 14,
                  month: "08",
                  day: "30",
                  text: "Zafer Bayramı",
                  type: "1",
                  belongsTo: "AUG30",
                },
                {
                  id: 15,
                  month: "10",
                  day: "28",
                  text: "Cumhuriyet Bayramı Arefesi",
                  type: "2",
                  belongsTo: "OCT28",
                },
                {
                  id: 16,
                  month: "10",
                  day: "29",
                  text: "Cumhuriyet Bayramı",
                  type: "1",
                  belongsTo: "OCT29",
                },
                {
                  id: 17,
                  month: "12",
                  day: "31",
                  text: "Yılbaşı Arefesi",
                  type: "2",
                  belongsTo: "DEC31",
                },
              ],
            },

            holidayInfo: [
              { id: "RAM", text: "Ramazan Bayramı" },
              { id: "SAC", text: "Kurban Bayramı" },
              { id: "JAN01", text: "Yılbaşı Tatili" },
              { id: "APR23", text: "Ulusal Egemenlik ve Çocuk Bayramı" },
              { id: "MAY01", text: "Emek ve Dayanışma Günü" },
              { id: "MAY19", text: "Atatürk'ü Anma Gençlik ve Spor Bayramı" },
              { id: "JUL15", text: "Demokrasi ve Millî Birlik Günü" },
              { id: "AUG30", text: "Zafer Bayramı" },
              { id: "OCT28", text: "Cumhuriyet Bayramı Arefesi" },
              { id: "OCT29", text: "Cumhuriyet Bayramı" },
              { id: "DEC31", text: "Yılbaşı Arefesi" },
            ],
          };
          var oViewModel = new JSONModel({
            page: {
              mode: "Y",
              period: dateUtilities.getToday(),
              tabIndex: "0",
              legend: legend,
              legendChanged: null,
              eventEdit: {
                leaveType: null,
                startDate: null,
                endDate: null,
              },
              header: {
                entitlementDate: new Date(2023, 2, 12),
                leaveQuotaBalance: "53",
                leaveUsed: "12",
                toBePlannedLeave: "32",
                plannedLeave: "12.5",
              },
              leaveTypes: [
                {
                  type: "0010",
                  description: "Planlanan İzin",
                  color: "spp-sch-foreground-blue",
                  selected: false,
                },
                {
                  type: "0100",
                  description: "Yıllık İzin",
                  color: "spp-sch-foreground-green",
                  selected: false,
                },
              ],
            },
            holidayCalendar: holidayCalendar,
            plannedLeaves: [
              {
                startDate: new Date(2023, 5, 5),
                endDate: new Date(2023, 5, 11),
              },
              {
                startDate: new Date(2023, 6, 17),
                endDate: new Date(2023, 6, 23),
              },
              {
                startDate: new Date(2023, 5, 26),
                endDate: new Date(2023, 6, 2),
              },
            ],
            annualLeaves: [],
          });

          this.getView().setModel(oViewModel, "planModel");

          // Set proxy model for dateUtilities
          dateUtilities.setProxyModel(oViewModel);

          /* Subscribe Event Handlers */
          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "CreateEvent",
            this._handleCreateEvent,
            this
          );

          //--Subscribe to event
          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "DisplayEventWidget",
            this._handleDisplayEventWidget,
            this
          );
        },

        onPickLeaveType: function (e) {
          var t = e.getSource();
          var o = $(t.getDomRef());

          if (this._oPicker) {
            this._oPicker.destroy();
          }

          if (o && o?.length > 0) {
            var eO = o.offset(); //Element position
            var eH = o.outerHeight(); //Element height
            var eW = o.outerWidth();

            this._oPicker = e.getParameter("picker");

            this._oPicker.setElementPosition({
              offset: { ...eO },
              outerHeight: eH,
              outerWidth: eW,
            });

            this.getModal().openSub(this._oPicker);
          }
        },

        /* Event handlers*/
        onToggleSidebar: function (e) {
          this.getById("LeaveManagementPageSidebar").toggleState();
        },

        onPeriodChange: function (e) {
          var s = e.getSource();
          var b = s.data("period");
          this._handlePeriodChange(b);
        },

        onLegendSelectionChanged: function () {
          // dateUtilities.setLegendSettings(this.getPageProperty("legend"));

          this.setPageProperty("legendChanged", new Date().getTime());
        },

        onViewChange: function (e) {
          var s = e.getSource();
          this._handleViewChange(s);
        },

        onMobileViewMenu: function (e) {
          var r = e.getSource();
          var that = this;
          var o = $(r.getDomRef());
          if (!o) {
            return;
          }

          var doOpen = function () {
            var cO = o.offset();
            var cH = o.outerHeight();
            var w = 120;
            var x = cO.left - (w - o.outerWidth());
            var y = cO.top + cH;
            var aStyles = new Map([
              ["width", `${w}px`],
              ["transform", `matrix(1, 0, 0, 1, ${x}, ${y})`],
            ]);

            r.setSelected(true);
            this._oMobileViewMenu.setStyles(aStyles);
            // this.getView().addDependent(this._oMobileViewMenu, this);
            this.getModal().open(this._oMobileViewMenu);
          }.bind(this);

          this._oMobileViewMenu = Fragment.load({
            id: this.getView().getId(),
            name: "com.thy.ux.annualleaveplanning.view.fragment.MobileViewMenu",
            controller: this,
          }).then(
            function (oMenu) {
              this._oMobileViewMenu = oMenu;
              doOpen();
              return this._oMobileViewMenu;
            }.bind(this)
          );
        },

        onViewMenuItemSelected: function (e) {
          var s = e.getParameter("selectedItem");

          //--Mobile View Menu
          this.getById("MobileViewMenuButton")?.setSelected(false);

          //--Close modal--//
          this.getModal().close();

          //--View Change Handler
          this._handleViewChange(s);
        },

        onEventDialogClosed: function () {
          if (this._oEventDialog) this._oEventDialog.close();
        },
        onAfterEventDialogClosed: function () {
          this._createEventCancelled();
          this._oEventDialog = null;
        },

        onEventCancelled: function () {
          this._cancelCreateEvent();
          this._closeEventDialog();
        },

        onEventSave: function () {
          var oEvent = this.getPageProperty("eventEdit");
          var sPath =
            oEvent.leaveType.key === "0010" ? "plannedLeaves" : "annualLeaves";
          var aPL = this.getProperty(sPath);

          aPL.push({
            startDate: dateUtilities.convertToDate(oEvent.startDate),
            endDate: dateUtilities.convertToDate(oEvent.endDate),
          });
          this.setProperty(sPath, aPL);

          this.setPageProperty("legendChanged", new Date().getTime());

          Swal.fire({
            position: "bottom",
            icon: "success",
            title: oEvent.leaveType.value + " kaydedildi",
            showConfirmButton: false,
            toast: true,
            timer: 2000,
          });

          this._closeEventDialog();
        },

        onCallDatePicker: function (e) {
          var s = e.getParameter("sourceField");
          var t = e.getParameter("targetField");
          var p = e.getParameter("period");
          var o = t.$();

          if (this._oDatePickerWidget) {
            this._oDatePickerWidget.destroy();
          }

          if (o && o?.length > 0) {
            var eO = o.offset(); //Element position
            var eH = o.outerHeight(); //Element height
            var eW = o.outerWidth();

            this._oDatePickerWidget = new DatePickerWidget({
              floating: true,
              period: p,
              select: function (e) {
                var d = e.getParameter("selectedDate");
                if (s && typeof s.handleValueSelection === "function") {
                  s.handleValueSelection(d);
                }
              },
              selectedDate: dateUtilities.convertPeriodToDate(p),
              elementPosition: {
                offset: { ...eO },
                outerHeight: eH,
                outerWidth: eW,
              },
            });

            s.registerDatePickerWidget(this._oDatePickerWidget);

            this.getModal().openSub(this._oDatePickerWidget);
          }
        },

        /* Helper methods */
        getModal: function () {
          return this.getById("LeaveManagementPageModal");
        },
        getById: function (id) {
          return this.getView().byId(id);
        },

        getModel: function (m) {
          return this.getView().getModel(m);
        },

        getProperty: function (p) {
          return this.getModel("planModel").getProperty("/" + p);
        },

        setProperty: function (p, v) {
          return this.getModel("planModel").setProperty("/" + p, v);
        },

        getPageProperty: function (p) {
          return this.getModel("planModel").getProperty("/page/" + p);
        },
        setPageProperty: function (p, v) {
          this.getModel("planModel").setProperty("/page/" + p, v);
        },
        getPageProps: function () {
          return this.getModel("planModel").getProperty("/page");
        },
        setPageProps: function (o) {
          this.getModel("planModel").setProperty("/page", { ...o });
        },
        getPeriod: function () {
          return this.getPageProperty("period");
        },
        setPeriod: function (p) {
          this.setPageProperty("period", p);
        },
        getMode: function () {
          return this.getPageProperty("mode");
        },
        setMode: function (m) {
          this.setPageProperty("mode", m);
        },

        getTabIndex: function () {
          return this.getPageProperty("tabIndex");
        },
        setTabIndex: function (i) {
          this.setPageProperty("tabIndex", i);
        },

        /* Private methods */
        _closeEventDialog: function () {
          if (this._oEventDialog) {
            this._oEventDialog.destroy();
            this._oEventDialog = null;
            //--Close modal--//
            this.getModal().close();
          }
        },
        _handlePeriodChange: function (b) {
          var p = this.getPeriod();
          var x = { ...p };
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

          var d = dateUtilities.decidePeriodChangeDirection(x, p);

          if (d === null) {
            return;
          }

          this.setPeriod(p);

          this._publishPeriodChanged(
            jQuery.proxy(that._publishViewChanged, that, null, true, d),
            d
          );
        },

        _publishPeriodChanged: function (fnCb, d) {
          var p = this.getPeriod();
          var m = this.getMode();
          var i = this.getTabIndex();
          eventUtilities.publishEvent("PlanningCalendar", "PeriodChanged", {
            period: { ...p },
            mode: m,
            direction: d,
            tabIndex: i,
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

        _handleViewChange: function (s) {
          var that = this;
          if (!s) {
            return;
          }
          var i = s.data("tab-index");
          var m = s.data("view-mode");
          var d = "right"; //by default animate from right direction

          if (this.getTabIndex() < i) {
            d = "R";
          } else {
            d = "L";
          }

          var oPage = this.getPageProps();

          oPage.tabIndex = i;
          oPage.mode = m;

          this.setPageProps(oPage);

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
          eventUtilities.publishEvent(
            "PlanningCalendar",
            "ViewChangeCompleted",
            {
              period: { ...p },
              mode: m,
              tabIndex: i,
            }
          );
        },
        _handleCreateEvent: function (c, e, o) {
          if (o && o.element) {
            this._openCreateEventDialog(o.element, o.period);
          }
        },

        _handleDisplayEventWidget: function (c, e, o) {
          if (o && o.element) {
            this._openDisplayEventDialog(o.element, o.day);
          }
        },

        _openDisplayEventDialog: function (r, d) {
          var that = this;
          var o = $(r);
          if (!o) {
            return;
          }
          var eO = o.offset(); //Element position
          var eH = o.outerHeight(); //Element height
          var eW = o.outerWidth();

          var aStyles = new Map([
            ["transform", `matrix(1, 0, 0, 1, ${eO.left}, -100%)`],
          ]);

          var oDialog = new Dialog({
            header: new DialogHeader({
              title: d.title,
              closed: function () {
                that._getModal().close();
              },
            }),
            styles: aStyles,
            elementPosition: {
              offset: { ...eO },
              outerHeight: eH,
              outerWidth: eW,
            },
            headerDockTop: true,
            content: this._createDisplayEventWidget(d),
            closed: function () {},
          });

          this.getModal().openSub(oDialog);
        },

        _createDisplayEventWidget: function (d) {
          return new EventContainer({
            widget: true,
            events: [
              new CalEvent({
                color: "spp-holiday-all-day",
                text: d.holiday.text,
              }),
            ],
          });
        },
        _openCreateEventDialog: function (r, p) {
          var o = $(r);
          if (!o) {
            return;
          }
          var eO = o.offset(); //Element position
          var eH = o.outerHeight(); //Element height
          var eW = o.outerWidth();

          var oEvent = {
            leaveType: {
              key: null,
              value: null,
            },
            startDate: dateUtilities.formatDate(p.startDate),
            endDate: dateUtilities.formatDate(p.endDate),
          };
          this.setPageProperty("eventEdit", oEvent);

          var aStyles = new Map([
            ["transform", `matrix(1, 0, 0, 1, ${eO.left}, -100%)`],
            ["--date-time-length", "14em"],
            ["--date-width-difference", "1em"],
          ]);

          var oDialog = Fragment.load({
            id: this.getView().getId(),
            name: "com.thy.ux.annualleaveplanning.view.fragment.EditEventDialog",
            controller: this,
          }).then(
            function (d) {
              d.setStyles(aStyles);
              d.setElementPosition({
                offset: { ...eO },
                outerHeight: eH,
                outerWidth: eW,
              });
              this._oEventDialog = d;
              this.getModal().open(this._oEventDialog);
            }.bind(this)
          );

          // var oDialog = new Dialog({
          //   header: new DialogHeader({
          //     title: "Yeni Plan",
          //     closed: function () {
          //       oDialog.close();
          //     },
          //   }),
          //   styles: aStyles,
          //   elementPosition: {
          //     offset: { ...eO },
          //     outerHeight: eH,
          //     outerWidth: eW,
          //   },
          //   classList: ["spp-eventeditor"],
          //   content: this._createEventEditor(p),
          //   closed: function () {
          //     //--Codes that perform operations after dialog close
          //     that._createEventCancelled();
          //   },
          //   cancelled: function () {
          //     //--Modal closed cancel event
          //     that._cancelCreateEvent();
          //   },
          // });
        },

        _createEventCancelled: function () {
          this._cancelCreateEvent();
          this.getModal().close();
        },
        _cancelCreateEvent: function () {
          eventUtilities.publishEvent(
            "PlanningCalendar",
            "CreateEventCancelled",
            null
          );
        },
        _createEventEditorToolbar() {
          var that = this;
          return new Toolbar({
            items: [
              new Button({
                raised: true,
                label: "Kaydet",
                firstChild: true,
                classList: ["spp-blue"],
                press: function () {
                  //TODO
                },
              }),
              new Button({
                lastChild: true,
                label: "İptal",
                press: function () {
                  that._createEventCancelled();
                },
              }),
            ],
          });
        },
        _callDatePicker: function (e) {
          var s = e.getParameter("sourceField");
          var t = e.getParameter("targetField");
          var p = e.getParameter("period");
          var o = t.$();
          if (o && o?.length > 0) {
            var eO = o.offset(); //Element position
            var eH = o.outerHeight(); //Element height
            var eW = o.outerWidth();

            var oDPW = new DatePickerWidget({
              floating: true,
              period: p,
              select: function (e) {
                var d = e.getParameter("selectedDate");
                if (s && typeof s.handleValueSelection === "function") {
                  s.handleValueSelection(d);
                }
              },
              selectedDate: dateUtilities.convertPeriodToDate(p),
              elementPosition: {
                offset: { ...eO },
                outerHeight: eH,
                outerWidth: eW,
              },
            });

            s.registerDatePickerWidget(oDPW);

            this.getModal().openSub(oDPW);
          }
        },
        _createEventEditor: function (p) {
          return new EventEditor({
            toolbar: this._createEventEditorToolbar(),
            items: [
              new Field({
                firstChild: true,
                containsFocus: true,
                empty: true,
                // noHint: true,
                label: new Label({
                  text: "Tür",
                  for: this.getView().getId() + "_input_event_type",
                }),
                field: new Input({
                  id: this.getView().getId() + "_input_event_type",
                  placeHolder: "Türü seçiniz",
                  name: "İzin türü seçiniz",
                }),
              }),
              new Field({
                containsFocus: true,
                empty: p?.startDate ? false : true,
                label: new Label({
                  text: "Başlangıç",
                  for: this.getView().getId() + "_datepicker_start_date",
                }),
                field: new DatePicker({
                  id: this.getView().getId() + "_datepicker_start_date",
                  name: "BeginDate",
                  value: dateUtilities.formatDate(p.startDate),
                  selectDate: this._callDatePicker.bind(this),
                }),
              }),
              new Field({
                lastChild: true,
                containsFocus: true,
                empty: p?.endDate ? false : true,
                label: new Label({
                  text: "Bitiş",
                  for: this.getView().getId() + "_datepicker_end_date",
                }),
                field: new DatePicker({
                  id: this.getView().getId() + "_datepicker_end_date",
                  name: "EndDate",
                  value: dateUtilities.formatDate(p.endDate),
                  selectDate: this._callDatePicker.bind(this),
                }),
              }),
            ],
          });
        },
      }
    );
  }
);
