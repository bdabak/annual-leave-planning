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
        formatter: formatter,
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
                UsedQuota: null,
                Title: "",
                QuotaCalculating: false,
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
                  Type: "9999",
                  Value: "planned",
                  Description: "Planlanan İzin",
                  Color: "spp-sch-foreground-blue",
                  Selected: false,
                },
                {
                  Type: "0010",
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

          $.when(this._refreshLegend(), this._refreshHeader())
            .done(
              function () {
                this.closeBusyFragment();
                this.setPageProperty("Visible", true);
                this._showPlanningInfo();
              }.bind(this)
            )
            .fail(
              function (e) {
                this.closeBusyFragment();
                this._showServiceError(e);
              }.bind(this)
            );
        },

        onSplitEventDateChanged: function (e) {
          var that = this;
          var s = e.getSource() || null;
          if (!s) {
            return;
          }

          var i = s.data("targetIndex") || null;

          if (i === null) {
            return;
          }

          var p = "EventSplit/Splits/" + i;

          var oEvent = this.getPageProperty(p) || null;

          if (oEvent === null) {
            return;
          }

          var sD = dateUtilities.convertToDate(oEvent.StartDate);
          var eD = dateUtilities.convertToDate(oEvent.EndDate);
          if (!sD || !eD) {
            return;
          }
          oEvent.UsedQuota = null;

          if (moment(sD).isAfter(moment(eD))) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: "Bitiş tarihi, başlangıç tarihinden önce olamaz",
              toast: true,
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
            });
            return;
          }

          oEvent.QuotaCalculating = true;

          this._countUsedQuota(sD, eD).then(function (response) {
            oEvent.QuotaCalculating = false;
            oEvent.UsedQuota = response.UsedQuota;
            that.setPageProperty(p, oEvent);
          });
        },

        onEventDateChanged: function (e) {
          var oEvent = this.getPageProperty("EventEdit");
          var that = this;

          oEvent.QuotaCalculating = true;
          oEvent.UsedQuota = null;

          this.setPageProperty("EventEdit", oEvent);

          this._countUsedQuota(
            dateUtilities.convertToDate(oEvent.StartDate),
            dateUtilities.convertToDate(oEvent.EndDate)
          ).then(function (response) {
            oEvent.QuotaCalculating = false;
            oEvent.UsedQuota = response.UsedQuota;
            that.setPageProperty("EventEdit", oEvent);
          });
        },

        _countUsedQuota: function (b, e) {
          var oModel = this.getModel();
          var p = $.Deferred();

          oModel.callFunction("/CalculateQuota", {
            urlParameters: {
              StartDate: b,
              EndDate: e,
            },
            success: function (d, r) {
              p.resolve(d);
            },
            error: function (e) {
              p.reject(e);
            },
          });

          return p;
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
              icon: "info",
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

        _refreshLegend: function () {
          var p = $.Deferred();
          var that = this;
          var oModel = this.getModel();

          oModel.read("/LegendSet", {
            urlParameters: {
              $expand: "LegendItemSet",
            },
            success: function (o, r) {
              var lg = [];

              $.each(o.results, function (i, r) {
                var lgr = _.clone(_.omit(r, ["__metadata", "LegendItemSet"]));

                lgr["LegendItemSet"] = [];
                lgr.Selected = true;
                $.each(r.LegendItemSet?.results, function (j, e) {
                  var li = _.clone(_.omit(e, ["__metadata"]));
                  li.Selected = true;
                  lgr["LegendItemSet"].push(li);
                });

                lg.push(lgr);
              });

              that.setPageProperty("LegendGroup", lg);
              // console.log(lg);
              p.resolve(true);
            },
            error: function (e) {
              p.reject(e);
            },
          });
          return p;
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
              that.setPageProperty(
                "Header",
                _.clone(_.omit(o, ["__metadata"]))
              );
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
          var oHeader = this.getPageProperty("Header");
          var oDefaultPeriod = dateUtilities.convertDateToPeriod(
            oHeader.QuotaAccrualBeginDate
          );

          //--Adjust period filters
          var t = _.clone(period) || _.clone(this.getPageProperty("Period"));

          //--Make sure data is fetched for a year
          t.month = oDefaultPeriod.month;
          t.day = oDefaultPeriod.day;

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
          var that = this;

          /* Holiday calendar */
          var r = o.HolidayCalendarSet.results;
          var hC = {
            HolidayList: {},
            HolidayInfo: [],
          };
          var a = that._getLegendAttributes("HL", null);
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
                hC.HolidayList[l.Year].push({
                  ..._.clone(_.omit(d, ["__metadata"])),
                  LegendAttributes: a,
                });
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

            var a = that._getLegendAttributes("PL", e);

            pL.push({
              EventId: eventUtilities.createEventId(),
              ...e,
              LegendAttributes: { ...a },
            });
          });

          this.setProperty("PlannedLeaves", pL);

          var aL = [];
          var a = o.LeaveRequestSet.results;
          $.each(a, function (i, l) {
            var e = _.cloneDeep(_.omit(l, ["__metadata"]));
            var a = that._getLegendAttributes("AL", e);
            aL.push({
              EventId: eventUtilities.createEventId(),
              ...e,
              LegendAttributes: { ...a },
            });
          });

          this.setProperty("AnnualLeaves", aL);
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
            oEvent.LeaveType.Key === "9999" ? "PlannedLeaves" : "AnnualLeaves";
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
              if (oEvent.LeaveType.Key === "9999") that._deletePlan(oEvent);
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
            oEvent.LeaveType.Key === "9999" ? "PlannedLeaves" : "AnnualLeaves";
          var eL = this.getProperty(sPath);

          switch (oEvent.LeaveType.Key) {
            case "9999":
              if (oEvent.New) {
                this._createPlan(oEvent);
              } else {
                this._editPlan(oEvent);
              }
              break;
            case "0010":
              if (oEvent.New) {
                this._createAnnualLeave(oEvent);
              } else {
                //Not implemented
              }
              break;
          }

          this._closeEventDialog();
        },
        onSendPlanForApproval: function () {
          var that = this;
          var oHeader = this.getPageProperty("Header");
          var oOperation = {
            Actio: "PLC",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: null,
            PlannedLeaveSet: [],
            ReturnSet: [],
          };

          var fnCallback = function () {
            Swal.fire({
              position: "bottom",
              icon: "success",
              html: that.getText("planSentForApproval", []),
              showConfirmButton: false,
              toast: true,
              timer: 2000,
            });
          };

          Swal.fire({
            title: this.getText("planSendConfirmationTitle", []),
            html: this.getText("planSendConfirmationText", [
              oHeader.QuotaPlanned,
            ]),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3f51b5",
            cancelButtonColor: "#3085d6",
            backdrop: true,
            confirmButtonText: this.getText("approveAction", []),
            cancelButtonText: this.getText("cancelAction", []),
          }).then((a) => {
            if (a.isConfirmed) {
              that._callPlannedLeaveOperation(
                "planBeingSentForApproval",
                oOperation,
                fnCallback
              );
            }
          });
        },

        _editPlan: function (oEvent) {
          var that = this;
          var oHeader = this.getPageProperty("Header");
          var aPL = this.getProperty("PlannedLeaves");
          var oPlan = _.find(aPL, ["EventId", oEvent.EventId]);
          var oOperation = {
            Actio: "MOD",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: oPlan.PlannedLeaveId,
            PlannedLeaveSet: [
              {
                PlannedLeaveId: oPlan.PlannedLeaveId,
                EmployeeNumber: oHeader.EmployeeNumber,
                StartDate: dateUtilities.convertToDate(oEvent.StartDate),
                EndDate: dateUtilities.convertToDate(oEvent.EndDate),
                LeaveType: "PL",
                PlanId: oHeader.PlanId,
              },
            ],
          };

          var fnCallback = function () {
            Swal.fire({
              position: "bottom",
              icon: "success",
              html: that.getText("eventEdited", [oEvent.LeaveType.Value]),
              showConfirmButton: false,
              toast: true,
              timer: 2000,
            });
          };

          this._callPlannedLeaveOperation(
            "plannedLeaveBeingChanged",
            oOperation,
            fnCallback
          );
        },

        onSplitSave: function () {
          var oEvent = this.getPageProperty("EventSplit");
          var eL = this.getProperty("PlannedLeaves");

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

          //TODO: Add additional split checks
          //TODO: Add additional split checks

          var vS = _.filter(oEvent.Splits, ["Visible", true]);

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

          this._splitPlan(oEvent);

          this._closeEventDialog();
        },

        _getAbsenceTypeCustomizing: function () {
          var oLeaveModel = this.getModel("leaveRequest");
          var oHeader = this.getPageProperty("Header");
          var aFilters = [];
          var p = $.Deferred();

          aFilters.push(
            new Filter("EmployeeID", FilterOperator.EQ, oHeader.EmployeeNumber)
          );
          aFilters.push(
            new Filter("AbsenceTypeCode", FilterOperator.EQ, "0010")
          );
          aFilters.push(new Filter("InfoType", FilterOperator.EQ, "2001"));

          oLeaveModel.read("/AbsenceTypeCollection", {
            urlParameters: {
              $expand: "MultipleApprovers,AdditionalFields",
            },
            filters: aFilters,
            success: function (o, r) {
              // console.log(o);
              p.resolve(o);
            },
            error: function (e) {
              p.reject(e);
            },
          });

          return p;
        },
        _createAnnualLeave: function (oAnnual) {
          var that = this;
          var oHeader = this.getPageProperty("Header");
          var oLeaveModel = this.getModel("leaveRequest");

          this._getAbsenceTypeCustomizing().then(function (aAbsence) {
            var oAbsence = _.find(aAbsence.results, [
              "AbsenceTypeCode",
              "0010",
            ]);

            if (!oAbsence) {
              return;
            }

            var oLeaveRequest = {
              EmployeeID: oHeader.EmployeeNumber,
              AbsenceTypeCode: "0010",
              InfoType: "2001",
              StartDate: dateUtilities.convertToDate(oAnnual.StartDate),
              EndDate: dateUtilities.convertToDate(oAnnual.EndDate),
              Attachments: [],
              ActionCode: 1,
              AdditionalFields: {},
              ProcessCheckOnlyInd: false,
              ApproverEmployeeID: oAbsence.ApproverName,
              ApproverEmployeeName: oAbsence.ApproverPernr,
              MultipleApprovers: _.clone(oAbsence.MultipleApprovers.results),
            };
            oLeaveModel.create("/LeaveRequestCollection", oLeaveRequest, {
              success: function (o, r) {
                // console.dir(o);
                //TODO: Success messages
              },
              error: function (e) {
                // console.dir(e);
                that.closeBusyFragment();
                that._showServiceError(e);
              },
            });
          });
        },

        _createPlan: function (oPlan) {
          var that = this;
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
            ReturnSet: [],
          };

          var fnCallback = function () {
            Swal.fire({
              position: "bottom",
              icon: "success",
              html: that.getText("eventCreated", [oPlan.LeaveType.Value]),
              showConfirmButton: false,
              toast: true,
              timer: 2000,
            });
          };

          this._callPlannedLeaveOperation(
            "plannedLeaveBeingCreated",
            oOperation,
            fnCallback
          );
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

          var fnCallback = function () {
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
          };

          this._callPlannedLeaveOperation(
            "plannedLeaveBeingDeleted",
            oOperation,
            fnCallback
          );
        },

        _splitPlan: function (oEvent) {
          var that = this;
          var oHeader = this.getPageProperty("Header");
          var aPL = this.getProperty("PlannedLeaves");
          var oPlan = _.find(aPL, ["EventId", oEvent.EventId]);

          var oOperation = {
            Actio: "DIV",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: oPlan.PlannedLeaveId,
            PlannedLeaveSet: [],
            ReturnSet: [],
          };
          var vS = _.filter(oEvent.Splits, ["Visible", true]);
          $.each(vS, function (i, s) {
            oOperation.PlannedLeaveSet.push({
              PlannedLeaveId: eventUtilities.createEventId(),
              EmployeeNumber: oHeader.EmployeeNumber,
              StartDate: dateUtilities.convertToDate(s.StartDate),
              EndDate: dateUtilities.convertToDate(s.EndDate),
              LeaveType: "PL",
              PlanId: oHeader.PlanId,
            });
          });

          var fnCallback = function () {
            Swal.fire({
              position: "bottom",
              icon: "success",
              html: that.getText("eventSplitted", [
                oEvent.StartDate,
                oEvent.EndDate,
                oEvent.LeaveType.Value,
              ]),
              showConfirmButton: false,
              toast: true,
              timer: 2000,
            });
          };

          this._callPlannedLeaveOperation(
            "plannedLeaveBeingSplitted",
            oOperation,
            fnCallback
          );
        },
        _callPlannedLeaveOperation: function (b, o, f) {
          var oModel = this.getModel();
          var that = this;
          this.openBusyFragment(b, []);

          oModel.create("/PlannedLeaveOperationSet", o, {
            success: function (oData, oResponse) {
              var aErrors =
                _.filter(oData.ReturnSet.results, ["Type", "E"]) || [];

              if (aErrors.length > 0) {
                that.closeBusyFragment();
                that._showErrorMessages(aErrors, "plannedLeaveOperationError");
              } else {
                that._refreshHeader().then(function () {
                  that._triggerRenderChanged(); //Page should be rerendered
                  that.closeBusyFragment();
                  if (typeof f === "function") {
                    f();
                  }
                });
              }
            },
            error: function (oError) {
              that.closeBusyFragment();
              that._showServiceError(oError);
            },
          });
        },

        _getLegendAttributes: function (s, e) {
          var g = this.getPageProperty("LegendGroup") || [];

          if (g.length === 0) {
            return null;
          }

          var r = _.filter(g, ["DataSource", s]) || [];

          if (r.length === 0) {
            return null;
          }

          var f;
          var g;

          switch (s) {
            case "HL":
              return {
                LegendGroupName: r[0].LegendGroupName,
                LegendItemCount: 1,
                ...r[0].LegendItemSet[0]
              };
            case "PL":
              $.each(r, function (i, l) {
                g = l;
                f =
                  _.find(l.LegendItemSet, {
                    EventType: e.LeaveType,
                    EventStatus: e.LeaveStatus,
                  }) || null;
                if (f !== null) {
                  return false;
                }
              });

              return {
                LegendGroupName: g.LegendGroupName,
                LegendItemCount: g.LegendItemSet.length,
                ...f
              };
            case "AL":
              $.each(r, function (i, l) {
                g = l;
                f =
                  _.find(l.LegendItemSet, function (y) {
                    if (y.EventStatus.includes(";")) {
                      var z = y.EventStatus.split(";");
                      return z.includes(e.StatusCode);
                    } else {
                      return y.EventStatus === e.StatusCode;
                    }
                  }) || null;
                if (f !== null) {
                  return false;
                }
              });

              return {
                LegendGroupName: g.LegendGroupName,
                LegendItemCount: g.LegendItemSet.length,
                ...f
              };

            default:
              return null;
          }
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

          var l = this.getPageProperty("LeaveTypes") || [];
          var t = _.find(l, ["Value", o.EventType]);

          var z = {
            ...c,
            LeaveType: {
              ...t,
            },
          };

          this._openSplitEventDialog(null, z);
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
          var that = this;

          $.each(l, function (i, e) {
            // console.log(e);
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
                duration: e?.duration
                  ? formatter.suppressZeroDecimal(e.duration) +
                    " " +
                    that.getText("days", [])
                  : null,
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

        _getEditDialogStyles: function () {
          var bPhone = this.getModel("device").getProperty("/system/phone");

          var aStyles = new Map([
            ["--date-time-length", bPhone ? "10em" : "14em"],
            ["--date-width-difference", bPhone ? "0.5em" : "1em"],
            ["--textfield-width", bPhone ? "10.5em" : "12.5em"],
          ]);

          return aStyles;
        },

        _openEditEventDialog: function (r, p, n) {
          var that = this;

          var openDialog = function () {
            var oEvent = {
              LeaveType: {
                Key: n ? null : p.LeaveType.Type,
                Value: n ? null : p.LeaveType.Description,
                Icon: n ? null : p.LeaveType.Color,
              },
              EventId: p.EventId,
              StartDate: dateUtilities.formatDate(p.StartDate),
              EndDate: dateUtilities.formatDate(p.EndDate),
              UsedQuota: p.UsedQuota,
              New: n,
              Title: that.getText(n ? "newEventTitle" : "editEventTitle", []),
              QuotaCalculating: false,
            };
            that.setPageProperty("EventEdit", oEvent);

            var oDialog = Fragment.load({
              id: that.getView().getId(),
              name: "com.thy.ux.annualleaveplanning.view.fragment.EditEventDialog",
              controller: that,
            }).then(
              function (d) {
                d.setStyles(that._getEditDialogStyles());
                that._oEventDialog = d;
                that.getModal().open(that._oEventDialog);
              }.bind(that)
            );
          };

          if (n) {
            this._countUsedQuota(
              dateUtilities.convertToDate(p.StartDate),
              dateUtilities.convertToDate(p.EndDate)
            ).then(function (response) {
              p.UsedQuota = response.UsedQuota;
              openDialog();
            });
          } else {
            openDialog();
          }
        },

        _openSplitEventDialog: function (r, p) {
          var sD = dateUtilities.formatDate(p.StartDate);
          var eD = dateUtilities.formatDate(p.EndDate);
          var oEvent = {
            LeaveType: {
              Key: p.LeaveType.Type,
              Value: p.LeaveType.Description,
              Icon: p.LeaveType.Color,
            },
            EventId: p.EventId,
            StartDate: sD,
            EndDate: eD,
            New: false,
            Title: this.getText("splitEventTitle", []),
            Splits: [
              {
                Title: this.getText("eventSplitItem", ["1"]),
                StartDate: null,
                EndDate: null,
                Visible: true,
                UsedQuota: null,
                RefStartDate: sD,
                RefEndDate: eD,
                QuotaCalculating: false,
              },
              {
                Title: this.getText("eventSplitItem", ["2"]),
                StartDate: null,
                EndDate: null,
                Visible: true,
                UsedQuota: null,
                RefStartDate: sD,
                RefEndDate: eD,
                QuotaCalculating: false,
              },
              {
                Title: this.getText("eventSplitItem", ["3"]),
                StartDate: null,
                EndDate: null,
                Visible: false,
                UsedQuota: null,
                RefStartDate: sD,
                RefEndDate: eD,
                QuotaCalculating: false,
              },
              {
                Title: this.getText("eventSplitItem", ["4"]),
                StartDate: null,
                EndDate: null,
                Visible: false,
                UsedQuota: null,
                RefStartDate: sD,
                RefEndDate: eD,
                QuotaCalculating: false,
              },
              {
                Title: this.getText("eventSplitItem", ["5"]),
                StartDate: null,
                EndDate: null,
                Visible: false,
                UsedQuota: null,
                RefStartDate: sD,
                RefEndDate: eD,
                QuotaCalculating: false,
              },
            ],
            ButtonState: new Date().getTime(), //For refreshing button states
          };
          this.setPageProperty("EventSplit", oEvent);

          var oDialog = Fragment.load({
            id: this.getView().getId(),
            name: "com.thy.ux.annualleaveplanning.view.fragment.SplitEventDialog",
            controller: this,
          }).then(
            function (d) {
              d.setStyles(this._getEditDialogStyles());
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

        _showServiceError: function (oError) {
          Swal.fire({
            icon: "error",
            title: this.getText("serviceErrorTitle", []),
            html: JSON.parse(oError?.responseText).error.message.value,
            position: "center",
            showConfirmButton: false,
            showCloseButton: true,
          });
        },
        _showErrorMessages: function (aError, titleText) {
          try {
            if (aError?.length > 0) {
              var html = "<div class='spp-error-container'>";

              $.each(aError, function (i, e) {
                html =
                  html +
                  `<span class='spp-error-line'><i class='spp-icon spp-fa-circle-exclamation spp-error'></i> ${e?.Message}</span>`;
              });

              html = html + "</div>";

              Swal.fire({
                customClass: {
                  popup: "spp-error-pane",
                },
                icon: "error",
                title: titleText
                  ? this.getText(titleText, [])
                  : this.getText("errorPaneTitle", []),
                html: html,
                position: "bottom",
                showClass: {
                  popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                  `,
                },
                hideClass: {
                  popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
                `,
                },
                grow: "row",
                showConfirmButton: false,
                showCloseButton: true,
              });
            }
          } catch (e) {}
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
