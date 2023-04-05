sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/thy/ux/annualleaveplanning/ui/Dialog",
    "com/thy/ux/annualleaveplanning/ui/DialogHeader",
    "com/thy/ux/annualleaveplanning/ui/DialogContent",
    "com/thy/ux/annualleaveplanning/ui/EventContainer",
    "com/thy/ux/annualleaveplanning/ui/Event",
    "com/thy/ux/annualleaveplanning/ui/DatePickerWidget",
    "com/thy/ux/annualleaveplanning/utils/date-utilities",
    "com/thy/ux/annualleaveplanning/utils/event-utilities",
    "com/thy/ux/annualleaveplanning/model/formatter",
  ],
  /**
   * @param {BaseController} BaseController
   */
  function (
    BaseController,
    JSONModel,
    Fragment,
    Filter,
    FilterOperator,
    Dialog,
    DialogHeader,
    DialogContent,
    EventContainer,
    Event,
    DatePickerWidget,
    dateUtilities,
    eventUtilities,
    formatter
  ) {
    "use strict";

    return BaseController.extend(
      "com.thy.ux.annualleaveplanning.controller.PlanView",
      {
        onInit: function () {
          var legend = [
            {
              Type: "holiday",
              Text: "Resmi tatiller",
              Color: "spp-sch-foreground-orange",
              Design: "spp-holiday-all-day-event",
              Selected: true,
            },
            {
              Type: "planned",
              Text: "Planlanan izin",
              Color: "spp-sch-foreground-blue",
              Design: "spp-planned-leave-event",
              Selected: true,
            },
            {
              Type: "annual",
              Text: "Yıllık izin",
              Color: "spp-sch-foreground-green",
              Design: "spp-annual-leave-event",
              Selected: true,
            },
          ];

          // var holidayCalendar = {
          //   holidayList: {
          //     2023: [
          //       {
          //         id: 1,
          //         month: "01",
          //         day: "01",
          //         text: "Yılbaşı tatili",
          //         type: "1",
          //         belongsTo: "JAN01",
          //       },
          //       {
          //         id: 2,
          //         month: "04",
          //         day: "20",
          //         text: "Ramazan Bayram Arefesi",
          //         type: "2",
          //         belongsTo: "RAM",
          //       },
          //       {
          //         id: 3,
          //         month: "04",
          //         day: "21",
          //         text: "Ramazan Bayramı",
          //         type: "1",
          //         belongsTo: "RAM",
          //       },
          //       {
          //         id: 4,
          //         month: "04",
          //         day: "22",
          //         text: "Ramazan Bayramı",
          //         type: "1",
          //         belongsTo: "RAM",
          //       },
          //       {
          //         id: 5,
          //         month: "04",
          //         day: "23",
          //         text: "Ramazan Bayramı",
          //         type: "1",
          //         belongsTo: "RAM",
          //       },
          //       {
          //         id: 51,
          //         month: "04",
          //         day: "24",
          //         text: "Ramazan Bayramı",
          //         type: "1",
          //         belongsTo: "RAM",
          //       },
          //       {
          //         id: 6,
          //         month: "04",
          //         day: "23",
          //         text: "Ulusal Egemenlik ve Çocuk Bayramı",
          //         type: "1",
          //         belongsTo: "APR23",
          //       },
          //       {
          //         id: 61,
          //         month: "05",
          //         day: "01",
          //         type: "1",
          //         text: "Emek ve Dayanışma Günü",
          //         belongsTo: "MAY01",
          //       },
          //       {
          //         id: 7,
          //         month: "05",
          //         day: "19",
          //         text: "Atatürk'ü Anma Gençlik ve Spor Bayramı",
          //         type: "1",
          //         belongsTo: "MAY19",
          //       },
          //       {
          //         id: 8,
          //         month: "07",
          //         day: "15",
          //         text: "Demokrasi ve Millî Birlik Günü",
          //         type: "1",
          //         belongsTo: "JUL15",
          //       },
          //       {
          //         id: 9,
          //         month: "06",
          //         day: "27",
          //         text: "Kurban Bayram Arefesi",
          //         type: "2",
          //         belongsTo: "SAC",
          //       },
          //       {
          //         id: 10,
          //         month: "06",
          //         day: "28",
          //         text: "Kurban Bayramı",
          //         type: "1",
          //         belongsTo: "SAC",
          //       },
          //       {
          //         id: 11,
          //         month: "06",
          //         day: "29",
          //         text: "Kurban Bayramı",
          //         type: "1",
          //         belongsTo: "SAC",
          //       },
          //       {
          //         id: 12,
          //         month: "06",
          //         day: "30",
          //         text: "Kurban Bayramı",
          //         type: "1",
          //         belongsTo: "SAC",
          //       },
          //       {
          //         id: 13,
          //         month: "07",
          //         day: "01",
          //         text: "Kurban Bayramı",
          //         type: "1",
          //         belongsTo: "SAC",
          //       },
          //       {
          //         id: 14,
          //         month: "08",
          //         day: "30",
          //         text: "Zafer Bayramı",
          //         type: "1",
          //         belongsTo: "AUG30",
          //       },
          //       {
          //         id: 15,
          //         month: "10",
          //         day: "28",
          //         text: "Cumhuriyet Bayramı Arefesi",
          //         type: "2",
          //         belongsTo: "OCT28",
          //       },
          //       {
          //         id: 16,
          //         month: "10",
          //         day: "29",
          //         text: "Cumhuriyet Bayramı",
          //         type: "1",
          //         belongsTo: "OCT29",
          //       },
          //       {
          //         id: 17,
          //         month: "12",
          //         day: "31",
          //         text: "Yılbaşı Arefesi",
          //         type: "2",
          //         belongsTo: "DEC31",
          //       },
          //     ],
          //   },

          //   holidayInfo: [
          //     { id: "RAM", text: "Ramazan Bayramı" },
          //     { id: "SAC", text: "Kurban Bayramı" },
          //     { id: "JAN01", text: "Yılbaşı Tatili" },
          //     { id: "APR23", text: "Ulusal Egemenlik ve Çocuk Bayramı" },
          //     { id: "MAY01", text: "Emek ve Dayanışma Günü" },
          //     { id: "MAY19", text: "Atatürk'ü Anma Gençlik ve Spor Bayramı" },
          //     { id: "JUL15", text: "Demokrasi ve Millî Birlik Günü" },
          //     { id: "AUG30", text: "Zafer Bayramı" },
          //     { id: "OCT28", text: "Cumhuriyet Bayramı Arefesi" },
          //     { id: "OCT29", text: "Cumhuriyet Bayramı" },
          //     { id: "DEC31", text: "Yılbaşı Arefesi" },
          //   ],
          // };
          var oViewModel = new JSONModel({
            Page: {
              Visible: false,
              Mode: "Y",
              Period: null,
              TabIndex: "0",
              Legend: legend,
              PageRenderChanged: null,
              EventEdit: {
                LeaveType: null,
                EventId: null,
                StartDate: null,
                EndDate: null,
                New: false,
                Title: "",
              },
              EventSplit: {
                LeaveType: null,
                EventId: null,
                StartDate: null,
                EndDate: null,
                New: false,
                Title: "",
                Splits: [],
                ButtonState: null,
              },
              Header: {},
              LeaveTypes: [
                {
                  Type: "0010",
                  Value: "planned",
                  Description: "Planlanan İzin",
                  Color: "spp-sch-foreground-blue",
                  Selected: false,
                },
                {
                  Type: "0100",
                  Value: "annual",
                  Description: "Yıllık İzin",
                  Color: "spp-sch-foreground-green",
                  Selected: false,
                },
              ],
            },
            HolidayCalendar: null,
            PlannedLeaves: [],
            AnnualLeaves: [],
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

          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "EditEvent",
            this._handleEditEvent,
            this
          );

          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "SplitEvent",
            this._handleSplitEvent,
            this
          );

          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "DeleteEvent",
            this._handleDeleteEvent,
            this
          );

          //--Subscribe to event
          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "DisplayEventWidget",
            this._handleDisplayEventWidget,
            this
          );

          this.getRouter()
            .getRoute("RoutePlanView")
            .attachPatternMatched(this.onPlanViewCalled, this);
        },
        onPlanViewCalled: function () {
          this.setPageProperty("Visible", false);
          this.openBusyFragment("pleaseWait", []);

          this._refreshHeader().done(
            function () {
              this.closeBusyFragment();
              this.setPageProperty("Visible", true);
              this._showPlanningInfo();
            }.bind(this)
          );
        },

        _showPlanningInfo: function () {
          var h = this.getPageProperty("Header");
          var t, m;
          if (h.PlanningEnabled) {
            t = `<strong>${this.getText(
              "planningStatus",
              []
            )}</strong> <span style='color:green'>${this.getText(
              "planningActive",
              []
            )}</span>`;
            m = `<p>${this.getText("planningProcedure", [
              moment(h.PlanningBeginDate).format("D MMMM YYYY"),
              moment(h.PlanningEndDate).format("D MMMM YYYY"),
              formatter.suppressZeroDecimal(h.QuotaToBePlanned),
            ])}</p>`;

            Swal.fire({
              title: t,
              icon: "warning",
              html: m,
              showCloseButton: false,
              showCancelButton: false,
              focusConfirm: true,
              confirmButtonColor: "#0fb391",
              confirmButtonText: `<i class="spp-fa spp-fa-thumbs-up"></i>&nbsp;${this.getText(
                "confirmPlanningInfo",
                []
              )}`,
              confirmButtonAriaLabel: this.getText("confirmPlanningInfo", []),
              backdrop: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          }
        },

        _refreshHeader: function () {
          var p = $.Deferred();
          var that = this;
          var oModel = this.getModel();
          var sPath = "/EmployeeInfoSet('ME')";

          oModel.read(sPath, {
            success: function (o, r) {
              var period = that.getPageProperty("Period") || null;
              if (!period) {
                that.setPageProperty(
                  "Period",
                  dateUtilities.convertDateToPeriod(o.QuotaAccrualBeginDate)
                );
              }
              that.setPageProperty("Header", _.clone(o));
              that._refreshCalendar(null).then(function () {
                p.resolve(true);
              });
            },
            error: function (e) {
              p.reject(e);
            },
          });

          return p;
        },

        _refreshCalendar: function (period) {
          var p = $.Deferred();
          var that = this;
          var oModel = this.getModel();

          //--Adjust period filters
          var t = period || this.getPageProperty("Period");
          var rD = dateUtilities.convertPeriodToDateObject(t);

          var eD = dateUtilities.calculateOffsetDate(rD, "+", 1);

          var sPath = oModel.createKey("/CalendarQuerySet", {
            BeginDate: rD,
            EndDate: eD,
          });

          oModel.read(sPath, {
            urlParameters: {
              $expand:
                "HolidayCalendarSet,HolidayCalendarSet/HolidayInfoSet,HolidayCalendarSet/HolidayInfoSet/HolidayDateSet,PlannedLeaveSet,LeaveRequestSet",
            },
            // filters:aFilters,
            success: function (o, r) {
              that._setCalendarData(o).done(function () {
                p.resolve(true);
              });
            },
            error: function (e) {
              p.reject(e);
            },
          });
          return p;
        },

        _setCalendarData: function (o) {
          var p = $.Deferred();

          /* Holiday calendar */
          var r = o.HolidayCalendarSet.results;
          var hC = {
            HolidayList: {},
            HolidayInfo: [],
          };
          $.each(r, function (i, l) {
            if (!hC.HolidayList.hasOwnProperty(l.Year)) {
              hC.HolidayList[l.Year] = [];
            }

            $.each(l?.HolidayInfoSet?.results, function (j, h) {
              var hI = _.findIndex(hC.HolidayInfo, [
                "HolidayGroupId",
                h.HolidayGroupId,
              ]);
              if (hI === -1) {
                hC.HolidayInfo.push(
                  _.clone(_.omit(h, ["HolidayDateSet", "__metadata"]))
                );
              }

              $.each(h?.HolidayDateSet?.results, function (k, d) {
                hC.HolidayList[l.Year].push(_.clone(_.omit(d, ["__metadata"])));
              });
            });
          });

          this.setProperty("HolidayCalendar", hC);
          /* Holiday calendar */

          /* Leaves */
          var pL = [];
          var b = o.PlannedLeaveSet.results;
          $.each(b, function (i, l) {
            var e = _.clone(_.omit(l, ["__metadata"]));
            pL.push({
              EventId: eventUtilities.createEventId(),
              ...e,
            });
          });

          this.setProperty("PlannedLeaves", pL);
          /* Leaves */

          p.resolve(true);

          // console.dir(hC);

          return p;
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
          this._triggerRenderChanged();
        },

        _triggerRenderChanged: function () {
          this.setPageProperty("PageRenderChanged", new Date().getTime());
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

        onEventDelete: function () {
          var that = this;
          var oEvent = this.getPageProperty("EventEdit");
          var sPath =
            oEvent.LeaveType.Key === "0010" ? "PlannedLeaves" : "AnnualLeaves";
          var eL = this.getProperty(sPath) || [];

          if (eL.length === 0) {
            that._closeEventDialog();
            return;
          }

          var i = _.findIndex(eL, ["EventId", oEvent.EventId]);

          Swal.fire({
            title: this.getText("eventDeleteConfirmationTitle", []),
            html: this.getText("eventDeleteConfirmationText", [
              oEvent.StartDate,
              oEvent.EndDate,
              oEvent.LeaveType.Value,
            ]),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            backdrop: false,
            confirmButtonText: this.getText("deleteAction", []),
            cancelButtonText: this.getText("cancelAction", []),
          }).then((a) => {
            that._closeEventDialog();
            if (a.isConfirmed) {
              if (oEvent.LeaveType.Key === "0010") that._deletePlan(oEvent);
            }
          });
        },

        onEventSave: function () {
          var oEvent = this.getPageProperty("EventEdit");
          var oModel = this.getModel();

          if (
            oEvent.LeaveType.Key === "" ||
            oEvent.LeaveType.Key === null ||
            oEvent.LeaveType.Key === undefined
          ) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: this.getText("selectEventType", []),
              toast: true,
            });
            return;
          }

          var sPath =
            oEvent.LeaveType.Key === "0010" ? "PlannedLeaves" : "AnnualLeaves";
          var eL = this.getProperty(sPath);

          if (oEvent.New) {
            this._createPlan(oEvent);
          } else {
            var i = _.findIndex(eL, ["EventId", oEvent.EventId]);
            if (!(i >= 0)) {
              Swal.fire({
                position: "bottom",
                icon: "error",
                html: "İzin bulunamadı",
                toast: true,
                showConfirmButton: false,
                timer: 2000,
              });
            }
            // eL[i] = {
            //   eventId: oEvent.eventId,
            //   startDate: dateUtilities.convertToDate(oEvent.startDate),
            //   endDate: dateUtilities.convertToDate(oEvent.endDate),
            // };
          }

          this._closeEventDialog();
        },

        _createPlan: function (oPlan) {
          var that = this;
          var oModel = this.getModel();
          var oHeader = this.getPageProperty("Header");
          var oOperation = {
            Actio: "INS",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: null,
            PlannedLeaveSet: [
              {
                PlannedLeaveId: eventUtilities.createEventId(),
                EmployeeNumber: oHeader.EmployeeNumber,
                StartDate: dateUtilities.convertToDate(oPlan.StartDate),
                EndDate: dateUtilities.convertToDate(oPlan.EndDate),
                LeaveType: "PL",
                PlanId: oHeader.PlanId,
              },
            ],
          };

          this.openBusyFragment("newPlannedLeaveBeingCreated", []);

          oModel.create("/PlannedLeaveOperationSet", oOperation, {
            success: function () {
              that._refreshHeader().then(function () {
                that._triggerRenderChanged(); //Page should be rerendered
                that.closeBusyFragment();
                Swal.fire({
                  position: "bottom",
                  icon: "success",
                  html: that.getText("eventCreated", [oPlan.LeaveType.Value]),
                  showConfirmButton: false,
                  toast: true,
                  timer: 2000,
                });
              });
            },
            error: function () {},
          });
        },

        _deletePlan: function (oEvent) {
          var that = this;
          var oModel = this.getModel();
          var oHeader = this.getPageProperty("Header");
          var aPL = this.getProperty("PlannedLeaves");

          var oPlan = _.find(aPL, ["EventId", oEvent.EventId]);

          var oOperation = {
            Actio: "DEL",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: oPlan.PlannedLeaveId,
            PlannedLeaveSet: [
              {
                PlannedLeaveId: oPlan.PlannedLeaveId,
                EmployeeNumber: oHeader.EmployeeNumber,
                StartDate: dateUtilities.convertToDate(oPlan.StartDate),
                EndDate: dateUtilities.convertToDate(oPlan.EndDate),
                LeaveType: "PL",
                PlanId: oHeader.PlanId,
              },
            ],
            ReturnSet: [],
          };

          this.openBusyFragment("plannedLeaveBeingDeleted", []);

          oModel.create("/PlannedLeaveOperationSet", oOperation, {
            success: function () {
              that._refreshHeader().then(function () {
                that._triggerRenderChanged(); //Page should be rerendered
                that.closeBusyFragment();
                Swal.fire({
                  position: "bottom",
                  icon: "success",
                  html: that.getText("eventDeleted", [
                    oEvent.StartDate,
                    oEvent.EndDate,
                    oEvent.LeaveType.Value,
                  ]),
                  showConfirmButton: false,
                  toast: true,
                  timer: 2000,
                });
              });
            },
            error: function () {},
          });
        },

        onSplitSave: function () {
          var oEvent = this.getPageProperty("EventSplit");

          var sPath =
            oEvent.LeaveType.Key === "0010" ? "PlannedLeaves" : "AnnualLeaves";
          var eL = this.getProperty(sPath);

          var i = _.findIndex(eL, ["EventId", oEvent.EventId]);
          if (!(i >= 0)) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: "İzin bulunamadı",
              toast: true,
              showConfirmButton: false,
              timer: 2000,
            });
            return;
          }

          //TODO: Add split checks
          //TODO: Add split checks

          var vS = _.filter(oEvent.splits, ["visible", true]);

          if (vS.length < 2) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: "İzni en az 2 parçaya bölmelisiniz",
              toast: true,
              showConfirmButton: true,
              timer: 2000,
            });
            return;
          }

          eL.splice(i, 1);

          $.each(vS, function (i, s) {
            eL.push({
              eventId: eventUtilities.createEventId(),
              startDate: dateUtilities.convertToDate(s.startDate),
              endDate: dateUtilities.convertToDate(s.endDate),
            });
          });

          this.setProperty(sPath, eL);

          this.setPageProperty("PageRenderChanged", new Date().getTime());

          Swal.fire({
            position: "bottom",
            icon: "success",
            html: this.getText("eventSplitted", [
              oEvent.StartDate,
              oEvent.EndDate,
              oEvent.LeaveType.Value,
            ]),
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
        onAddSplit: function () {
          var aS = this.getPageProperty("EventSplit/Splits");

          $.each(aS, function (i, s) {
            if (!s.Visible) {
              s.Visible = true;
              return false;
            }
          });

          this.setPageProperty("EventSplit/Splits", aS);
          this.setPageProperty("EventSplit/ButtonState", new Date().getTime());
        },

        onRemoveSplit: function () {
          var aS = this.getPageProperty("EventSplit/Splits");
          var l = aS.length - 1;

          while (l > 1) {
            if (aS[l].Visible) {
              aS[l].Visible = false;
              break;
            }
            l--;
          }

          this.setPageProperty("EventSplit/Splits", aS);
          this.setPageProperty("EventSplit/ButtonState", new Date().getTime());
        },
        checkAddSplitVisible: function (s = [], r) {
          var v = _.filter(s, ["Visible", true]);
          return v.length < 5;
        },
        checkRemoveSplitVisible: function (s = [], r) {
          var v = _.filter(s, ["Visible", true]);
          return v.length > 2;
        },
        /* Helper methods */
        getModal: function () {
          return this.getById("LeaveManagementPageModal");
        },
        getById: function (id) {
          return this.getView().byId(id);
        },

        getProperty: function (p) {
          return this.getModel("planModel").getProperty("/" + p);
        },

        setProperty: function (p, v) {
          return this.getModel("planModel").setProperty("/" + p, v);
        },

        getPageProperty: function (p) {
          return this.getModel("planModel").getProperty("/Page/" + p);
        },
        setPageProperty: function (p, v) {
          this.getModel("planModel").setProperty("/Page/" + p, v);
        },
        getPageProps: function () {
          return this.getModel("planModel").getProperty("/Page");
        },
        setPageProps: function (o) {
          this.getModel("planModel").setProperty("/Page", { ...o });
        },
        getPeriod: function () {
          return this.getPageProperty("Period");
        },
        setPeriod: function (p) {
          this.setPageProperty("Period", p);
        },
        getMode: function () {
          return this.getPageProperty("Mode");
        },
        setMode: function (m) {
          this.setPageProperty("Mode", m);
        },

        getTabIndex: function () {
          return this.getPageProperty("TabIndex");
        },
        setTabIndex: function (i) {
          this.setPageProperty("TabIndex", i);
        },

        /* Private methods */
        _closeEventDialog: function () {
          if (this._oEventDialog) {
            this._oEventDialog.destroy();
            this._oEventDialog = null;
          }
          //--Close modal--//
          this.getModal()?.close();
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

          var doChange = function () {
            that.setPeriod(p);
            that._publishPeriodChanged(
              jQuery.proxy(that._publishViewChanged, that, null, true, d),
              d
            );
            that.closeBusyFragment();
          };

          if (x.year !== p.year) {
            this.openBusyFragment("pleaseWait", []);
            this._refreshCalendar(p).then(doChange);
          } else {
            doChange();
          }
        },

        _publishPeriodChanged: function (fnCb, d) {
          var p = this.getPeriod();
          var m = this.getMode();
          var i = this.getTabIndex();
          eventUtilities.publishEvent("PlanningCalendar", "PeriodChanged", {
            Period: { ...p },
            Mode: m,
            Direction: d,
            TabIndex: i,
            FnCallback: fnCb,
          });
        },

        _publishViewChanged: function (fnCb, e, d) {
          var i = this.getTabIndex();
          eventUtilities.publishEvent("PlanningCalendar", "ViewChanged", {
            TabIndex: i,
            TransitionEffect: e,
            Direction: d,
            FnCallback: fnCb ? fnCb : null,
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

          oPage.TabIndex = i;
          oPage.Mode = m;

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
              Period: { ...p },
              Mode: m,
              TabIndex: i,
            }
          );
        },
        _handleCreateEvent: function (c, e, o) {
          if (o && o.Element) {
            this._openEditEventDialog(o.Element, o.Period, true);
          }
        },
        _handleSplitEvent: function (c, e, o) {
          var s = o.EventType === "planned" ? "PlannedLeaves" : "AnnualLeaves";
          var a = this.getProperty(s) || [];

          if (a.length === 0) {
            return;
          }

          var c = _.find(a, ["EventId", o.EventId]) || null;

          if (!c) {
            return;
          }

          var l = this.getPageProperty("leaveTypes") || [];
          var t = _.find(l, ["value", o.EventType]);

          var o = {
            ...c,
            leaveType: {
              ...t,
            },
          };

          this._openSplitEventDialog(null, o);
        },
        _handleDeleteEvent: function (c, e, o) {
          var s = o.EventType === "planned" ? "PlannedLeaves" : "AnnualLeaves";
          var a = this.getProperty(s) || [];

          if (a.length === 0) {
            return;
          }

          var c = _.find(a, ["EventId", o.EventId]) || null;

          if (!c) {
            return;
          }

          var l = this.getPageProperty("LeaveTypes") || [];
          var t = _.find(l, ["Value", o.EventType]);

          var z = {
            ...c,
            LeaveType: {
              ...t,
            },
          };

          var oEvent = {
            LeaveType: {
              Key: z.LeaveType.Type,
              Value: z.LeaveType.Description,
              Icon: z.LeaveType.Color,
            },
            EventId: z.EventId,
            StartDate: dateUtilities.formatDate(z.StartDate),
            EndDate: dateUtilities.formatDate(z.EndDate),
            New: false,
            Title: null,
          };
          this.setPageProperty("EventEdit", oEvent);

          this.onEventDelete();
        },
        _handleEditEvent: function (c, e, o) {
          var s = o.EventType === "planned" ? "PlannedLeaves" : "AnnualLeaves";
          var a = this.getProperty(s) || [];

          if (a.length === 0) {
            return;
          }

          var c = _.find(a, ["EventId", o.EventId]) || null;

          if (!c) {
            return;
          }

          var l = this.getPageProperty("LeaveTypes") || [];
          var t = _.find(l, ["Value", o.EventType]);

          var z = {
            ...c,
            LeaveType: {
              ...t,
            },
          };

          this._openEditEventDialog(null, z, false);
        },

        _handleDisplayEventWidget: function (c, e, o) {
          if (o && o.Element) {
            this._openDisplayEventDialog(o.Element, o.Day);
          }
        },

        _openDisplayEventDialog: function (r, l) {
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
              title: this.getText("dayInformation", []),
              closed: function () {
                that.getModal().close();
              },
            }),
            styles: aStyles,
            elementPosition: {
              offset: { ...eO },
              outerHeight: eH,
              outerWidth: eW,
            },
            headerDockTop: true,
            alignment: "auto",
            showPointer: true,
            content: this._createDisplayEventWidget(l),
            closed: function () {},
          }).addStyleClass("spp-overflowpopup");

          this.getModal().open(oDialog);
        },

        _createDisplayEventWidget: function (l) {
          var eventList = [];

          $.each(l, function (i, e) {
            eventList.push(
              new Event({
                eventId: e.eventId,
                eventType: e.eventType,
                color: e.color,
                text: e.text,
                height: "25px",
                hasPast: e.hasPast,
                hasFuture: e.hasFuture,
                hasOverflow: e.hasOverflow,
                rowIndex: e.rowIndex,
                rowSpan: 7,
                editable: e.eventType === "planned",
              }).addStyleClass("sapUiTinyMarginBottom")
            );
          });

          return new DialogContent({
            content: new EventContainer({
              widget: true,
              events: eventList,
            }),
          });
        },
        _openEditEventDialog: function (r, p, n) {
          var oEvent = {
            LeaveType: {
              Key: n ? null : p.LeaveType.Type,
              Value: n ? null : p.LeaveType.Description,
              Icon: n ? null : p.LeaveType.Color,
            },
            EventId: p.EventId,
            StartDate: dateUtilities.formatDate(p.StartDate),
            EndDate: dateUtilities.formatDate(p.EndDate),
            New: n,
            Title: this.getText(n ? "newEventTitle" : "editEventTitle", []),
          };
          this.setPageProperty("EventEdit", oEvent);

          var aStyles = new Map([
            // ["transform", `matrix(1, 0, 0, 1, ${eO.left}, -100%)`],
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
              // d.setElementPosition({
              //   offset: { ...eO },
              //   outerHeight: eH,
              //   outerWidth: eW,
              // });
              this._oEventDialog = d;
              this.getModal().open(this._oEventDialog);
            }.bind(this)
          );
        },

        _openSplitEventDialog: function (r, p) {
          var sD = dateUtilities.formatDate(p.startDate);
          var eD = dateUtilities.formatDate(p.endDate);
          var oEvent = {
            leaveType: {
              key: p.leaveType.type,
              value: p.leaveType.description,
              icon: p.leaveType.color,
            },
            eventId: p.eventId,
            startDate: sD,
            endDate: eD,
            new: false,
            title: this.getText("splitEventTitle", []),
            splits: [
              {
                title: this.getText("eventSplitItem", ["1"]),
                startDate: null,
                endDate: null,
                visible: true,
                refStartDate: sD,
                refEndDate: eD,
              },
              {
                title: this.getText("eventSplitItem", ["2"]),
                startDate: null,
                endDate: null,
                visible: true,
                refStartDate: sD,
                refEndDate: eD,
              },
              {
                title: this.getText("eventSplitItem", ["3"]),
                startDate: null,
                endDate: null,
                visible: false,
                refStartDate: sD,
                refEndDate: eD,
              },
              {
                title: this.getText("eventSplitItem", ["4"]),
                startDate: null,
                endDate: null,
                visible: false,
                refStartDate: sD,
                refEndDate: eD,
              },
              {
                title: this.getText("eventSplitItem", ["5"]),
                startDate: null,
                endDate: null,
                visible: false,
                refStartDate: sD,
                refEndDate: eD,
              },
            ],
            buttonState: new Date().getTime(), //For refreshing button states
          };
          this.setPageProperty("EventSplit", oEvent);

          var aStyles = new Map([
            // ["transform", `matrix(1, 0, 0, 1, ${eO.left}, -100%)`],
            ["--date-time-length", "14em"],
            ["--date-width-difference", "1em"],
          ]);

          var oDialog = Fragment.load({
            id: this.getView().getId(),
            name: "com.thy.ux.annualleaveplanning.view.fragment.SplitEventDialog",
            controller: this,
          }).then(
            function (d) {
              d.setStyles(aStyles);
              // d.setElementPosition({
              //   offset: { ...eO },
              //   outerHeight: eH,
              //   outerWidth: eW,
              // });
              this._oEventDialog = d;
              this.getModal().open(this._oEventDialog);
            }.bind(this)
          );
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
      }
    );
  }
);
