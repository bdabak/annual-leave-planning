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
    "sap/m/PDFViewer",
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
    PDFViewer,
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
          var oViewModel = new JSONModel(this._initiateViewModel());

          this.getView().setModel(oViewModel, "planModel");

          /* Set proxy model for dateUtilities */
          dateUtilities.setProxyModel(oViewModel);

          /* Subscribe Event Handlers */
          this._subscribeEventHandlers();
          /* Subscribe Event Handlers */

          this.getRouter()
            .getRoute("RoutePlanView")
            .attachPatternMatched(this._handlePlanViewCalled, this);

          //PDF viewer
          this._pdfViewer = new PDFViewer();
          this.getView().addDependent(this._pdfViewer);
        },
        onExit: function () {
          eventUtilities.invalidateEvents();
        },

        /* Event handlers*/
        onGetIncompletedButtonTooltip: function (e, q, t) {
          var sTooltip = null;
          var r = parseFloat(t) - parseFloat(q);
          // return this.getText("warningBeforePlanningCompletion", [3]);
          if (e && r > 0) {
            sTooltip = this.getText("warningBeforePlanningCompletion", [r]);
          }
          return sTooltip;
        },
        onToggleSidebar: function (e) {
          this._getById("LeaveManagementPageSidebar").toggleState();
        },

        onPeriodChange: function (e) {
          var s = e.getSource();
          var b = s.data("period");
          this._handlePeriodChange(b);
        },

        onLegendSelectionChanged: function () {
          this._triggerRenderChanged();
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
            this._getModal().open(this._oMobileViewMenu);
          }.bind(this);

          this._oMobileViewMenu = Fragment.load({
            id: this._getPagePrefix(),
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
        onMergeToggleCancel: function (e) {
          var that = this;
          var s = e.getSource() || null;
          if (!s) {
            return;
          }

          var i = s.data("targetIndex") || null;

          if (i === null) {
            return;
          }

          var p = "EventMerge/Parts/" + i + "/Cancelled";

          var bCancel = this._getPageProperty(p);

          if (bCancel === null) {
            return;
          }

          //--Check if cancellable

          this._setPageProperty(p, !bCancel);
          this._setPageProperty("EventMerge/ButtonState", new Date().getTime());

        },
        checkMergeButtonEnabled: function (a,b,s) {
          var t = 0;
          var m = 0;
          a.forEach((o) => {
            t = t + parseFloat(o.UsedQuota);
          });
          b.forEach((p) => {
            if (!p.Cancelled) {
              m = m + parseFloat(p.UsedQuota);
            }
          });

          return m >= t;
        },
        onMergeEventDateChanged: function (e) {
          var that = this;
          var s = e.getSource() || null;
          if (!s) {
            return;
          }

          var i = s.data("targetIndex") || null;

          if (i === null) {
            return;
          }

          var p = "EventMerge/Parts/" + i;

          var oEvent = this._getPageProperty(p) || null;

          if (oEvent === null) {
            return;
          }

          var sD = dateUtilities.convertToDate(oEvent.StartDate);
          var eD = dateUtilities.convertToDate(oEvent.EndDate);

          if (!sD || !eD) {
            if (sD) {
              oEvent["RefStartDate"] = oEvent["RefEndDate"] = oEvent.StartDate;
            } else {
              oEvent["RefStartDate"] = oEvent["RefEndDate"] = oEvent.EndDate;
            }

            this._setPageProperty(p, oEvent);

            return;
          }
          oEvent.UsedQuota = null;

          if (moment(sD).isAfter(moment(eD))) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: this.getText("dateSelectionError", []),
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
            that._setPageProperty(p, oEvent);
            that._setPageProperty("EventMerge/ButtonState", new Date().getTime());
          });
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

          var oEvent = this._getPageProperty(p) || null;

          if (oEvent === null) {
            return;
          }

          var sD = dateUtilities.convertToDate(oEvent.StartDate);
          var eD = dateUtilities.convertToDate(oEvent.EndDate);

          if (!sD || !eD) {
            if (sD) {
              oEvent["RefStartDate"] = oEvent["RefEndDate"] = oEvent.StartDate;
            } else {
              oEvent["RefStartDate"] = oEvent["RefEndDate"] = oEvent.EndDate;
            }

            this._setPageProperty(p, oEvent);

            return;
          }
          oEvent.UsedQuota = null;

          if (dateUtilities.momentFromDate(sD).isAfter(dateUtilities.momentFromDate(eD))) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: this.getText("dateSelectionError", []),
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
            that._setPageProperty(p, oEvent);
          });
        },
        onUserManual: function (e) {
          var oView = this.getView();
          var oButton = e.getSource();
          if (!this._oMenuFragment) {
            this._oMenuFragment = Fragment.load({
              id: oView.getId(),
              name: "com.thy.ux.annualleaveplanning.view.fragment.LanguageSelection",
              controller: this,
            }).then(
              function (oMenu) {
                this.getView().addDependent(oMenu);
                oMenu.openBy(oButton);
                this._oMenuFragment = oMenu;

                return this._oMenuFragment;
              }.bind(this)
            );
          } else {
            this._oMenuFragment.openBy(oButton);
          }
        },

        onLanguageSelection: function (oEvent) {
          var oItem = oEvent.getParameter("item");
          var sKey = oItem.getKey();

          if (!sKey) return;

          // var sLibraryPath = jQuery.sap.getModulePath(
          //   "com.thy.ux.annualleaveplanning"
          // ); //get the server location of the ui library

          // var sFile = sLibraryPath + `/assets/manual_${sKey}.pdf`;

          // var oDevice = this.getModel("device").getData();

          // if (oDevice.browser.name === "cr" && oDevice.system.desktop) {
          //   this._pdfViewer.setSource(sFile);
          //   this._pdfViewer.setTitle(this.getText("userManual", []));
          //   this._pdfViewer.open();
          // } else {
          //   sap.m.URLHelper.redirect(sFile, true);
          // }

          //--Rewrite for company codes
          const oModel = this.getModel();
          const sEntityPath = oModel.createKey("/ManualSet",{
            Language: sKey
          });

          let sFile = oModel.sServiceUrl + sEntityPath + "/$value"; 
          var oDevice = this.getModel("device").getData();

          if (oDevice.browser.name === "cr" && oDevice.system.desktop) {
            this._pdfViewer.setSource(sFile);
            this._pdfViewer.setTitle(this.getText("userManual", []));
            this._pdfViewer.open();
          } else {
            sap.m.URLHelper.redirect(sFile, true);
          }

          //--Rewrite for company codes

        },
        onEventDateChanged: function (e) {
          var sId = e.getSource().getId();
          var oEvent = this._getPageProperty("EventEdit");
          var that = this;

          oEvent.QuotaCalculating = true;
          oEvent.UsedQuota = null;

          if (sId.includes("StartDate")) {
            oEvent["RefDate"] = oEvent.StartDate;
          } else {
            oEvent["RefDate"] = oEvent.EndDate;
          }

          this._setPageProperty("EventEdit", oEvent);

          this._countUsedQuota(
            dateUtilities.convertToDate(oEvent.StartDate),
            dateUtilities.convertToDate(oEvent.EndDate)
          ).then(function (response) {
            oEvent.QuotaCalculating = false;
            oEvent.UsedQuota = response.UsedQuota;
            that._setPageProperty("EventEdit", oEvent);
          });
        },

        onViewMenuItemSelected: function (e) {
          var s = e.getParameter("selectedItem");

          //--Mobile View Menu
          this._getById("MobileViewMenuButton")?.setSelected(false);

          //--Close modal--//
          this._getModal().close();

          //--View Change Handler
          this._handleViewChange(s);
        },

        onEventDialogClosed: function () {
          if (this._oEventDialog) this._oEventDialog.close();
        },
        onAfterEventDialogClosed: function (e) {
          try {
            e.getSource()?.destroy();
            if (this._oEventDialog) this._oEventDialog.destroy();
          } catch (e) {
            //catch possible errors
          }

          this._oEventDialog = null;
        },

        onEventCancelled: function () {
          this._closeEventDialog();
          this._cancelCreateEvent();
        },

        onEventDelete: function () {
          var that = this;
          var oEvent = this._getPageProperty("EventEdit");
          var sPath = this._getEntityPathFromKey(oEvent.LeaveType.Key);
          var sSource = this._getDataSourceFromKey(oEvent.LeaveType.Key);
          var eL = this._getProperty(sPath) || [];

          if (eL.length === 0) {
            that._closeEventDialog();
            return;
          }

          var i = _.findIndex(eL, ["EventId", oEvent.EventId]);

          if (i === -1) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: this.getText("leaveRecordNotFound", []),
              toast: true,
              showConfirmButton: false,
              timer: 2000,
            });
            return;
          }

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
              if (sSource === "PL") that._deletePlan(oEvent);
              if (sSource === "AL") that._deleteAnnualLeave(oEvent);
            }
          });
        },
        onFilterLegend: function () {
          this._oFilterEventDialog = sap.ui.xmlfragment(
            "com.thy.ux.annualleaveplanning.view.fragment.FilterEvents",
            this
          );

          this.getView().addDependent(this._oFilterEventDialog);

          this._oFilterEventDialog.open();
        },
        onFilterEventClose: function () {
          this._oFilterEventDialog.close();
        },
        onFilterEventClosed: function () {
          this._oFilterEventDialog.destroy();
        },
        onEventSave: function () {
          var oEvent = this._getPageProperty("EventEdit");
          var oHeader = this._getPageProperty("Header");
          var that = this;

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

          var sPath = this._getDataSourceFromKey(oEvent.LeaveType.Key);

          //--Event checks
          //--S0-Date check
          if (
            !dateUtilities.isValidDate(oEvent.StartDate) ||
            !dateUtilities.isValidDate(oEvent.EndDate)
          ) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: this.getText("enterValidDates", []),
              toast: true,
              showConfirmButton: true,
            });
            return;
          }
          //--S0-Date check

          //--S1-Date check
          if (
            moment(dateUtilities.convertToDate(oEvent.StartDate)).isAfter(
              moment(dateUtilities.convertToDate(oEvent.EndDate))
            )
          ) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: this.getText("correctDates", []),
              toast: true,
              showConfirmButton: true,
            });
            return;
          }
          //--S1-Date check

          //--S2-Date within planning period
          if (sPath === "PL") {
            if (
              !moment(
                dateUtilities.convertToDate(oEvent.StartDate)
              ).isSameOrAfter(dateUtilities.convertToDate(oHeader.QuotaAccrualBeginDate)) ||
              !moment(
                dateUtilities.convertToDate(oEvent.EndDate)
              ).isSameOrBefore(dateUtilities.convertToDate(oHeader.QuotaAccrualEndDate))
            ) {
              Swal.fire({
                position: "bottom",
                icon: "error",
                html: this.getText("planningPeriodError", [
                  dateUtilities.formatDateObject(oHeader.QuotaAccrualBeginDate),
                  dateUtilities.formatDateObject(oHeader.QuotaAccrualEndDate),
                ]),
                toast: true,
                showConfirmButton: true,
              });
              return;
            }
          }
          //--S2-Date within planning period

          switch (sPath) {
            case "PL":
              if (oEvent.New) {
                this._createPlan(oEvent);
              } else {
                this._editPlan(oEvent);
              }
              break;
            case "AL":
              if (oEvent.New) {
                var aFPL = this._findPlanningEventsAfterLeave(oEvent);

                if (aFPL.length > 0) {
                  var btnClickHandler = function (e) {
                    Swal.close();
                    var d = $(e.target)?.data();
                    var r = _.find(aFPL, ["EventId", d.eventId]);
                    var o = {
                      EventId: r.EventId,
                      EventType:
                        r.LegendAttributes.LegendGroupKey +
                        "_" +
                        r.LegendAttributes.LegendItemKey,
                      LeaveType: r.LegendAttributes.LeaveType,
                      Deletable: r.LegendAttributes.Deletable,
                    };
                    if (d.action === "Edit") {
                      that._handleEditEvent(null, null, o);
                    } else if (d.action === "Split") {
                      that._handleSplitEvent(null, null, o);
                    }
                  };

                  Swal.fire({
                    title: this.getText("leaveRequestHasFuturePlansTitle", []),
                    html: this._generateFuturePlanList(aFPL, oEvent),
                    icon: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#2196f3",
                    backdrop: false,
                    confirmButtonText: this.getText(
                      "continueWithCurrentLeave",
                      []
                    ),
                    didRender: function () {
                      $(".spp-use-future-plan-button").on(
                        "click",
                        btnClickHandler.bind(that)
                      );
                    },
                    willClose: function () {
                      $(".spp-use-future-plan-button").off(
                        "click",
                        btnClickHandler
                      );
                      that._cancelCreateEvent(false);
                    },
                  }).then((a) => {
                    if (a.isConfirmed) {
                      this._createAnnualLeave(oEvent);
                    }
                  });
                } else {
                  this._createAnnualLeave(oEvent);
                }
              }
              break;
          }

          this._closeEventDialog();
        },

        _generateFuturePlanList: function (aFPL, oEvent) {
          var h = this.getText("leaveRequestHasFuturePlansText", [
            oEvent.StartDate,
            oEvent.EndDate,
          ]);
          var that = this;
          var p = `<div class='spp-resp-grid-container'><header class='spp-resp-grid-header'>${that.getText(
            "plannedLeavesAtFuture",
            []
          )}</header><div class='spp-resp-grid'>`;
          $.each(aFPL, function (i, l) {
            p =
              p +
              `<div class="spp-resp-grid-cell">
            ${dateUtilities.formatDateObject(
                l.StartDate
              )} - ${dateUtilities.formatDateObject(l.EndDate)}
            </div>
            <div class="spp-resp-grid-cell">
              <button class="swal2-confirm swal2-styled swal2-default-outline spp-use-future-plan-button" 
              data-event-id="${l.EventId}"
              data-action="Edit">${that.getText("editAction", [])}</button>
              <button class="swal2-deny swal2-styled swal2-default-outline spp-use-future-plan-button" 
              data-event-id="${l.EventId}"
              data-action="Split">${that.getText("splitAction", [])}</button>
            </div>`;
          });

          p = p + "</div></div>";

          h = h + p;

          return h;
        },
        _findPlanningEventsAfterLeave: function (e) {
          var aPL = this._getProperty("PlannedLeaves");
          var sD = dateUtilities.convertToDate(e.StartDate);
          var eD = dateUtilities.convertToDate(e.EndDate);

          var h = this._getPageProperty("Header");

          if (
            !dateUtilities.momentFromDate(sD).isSameOrAfter(dateUtilities.momentFromDate(h.QuotaAccrualBeginDate)) ||
            !dateUtilities.momentFromDate(eD).isSameOrBefore(dateUtilities.momentFromDate(h.QuotaAccrualEndDate))
          ) {
            return [];
          }

          var aFPL =
            _.filter(aPL, function (l, i) {
              if (l.LeaveStatus === "PLN" && l.LeaveType === "PL") {
                if (
                  dateUtilities.momentFromDate(l.StartDate).isAfter(dateUtilities.momentFromDate(eD)) ||
                  dateUtilities.momentFromDate(l.EndDate).isAfter(dateUtilities.momentFromDate(sD)) ||
                  dateUtilities.momentFromDate(l.StartDate).isBetween(
                    dateUtilities.momentFromDate(sD),
                    dateUtilities.momentFromDate(eD),
                    undefined,
                    "[]"
                  ) ||
                  dateUtilities.momentFromDate(l.EndDate).isBetween(
                    dateUtilities.momentFromDate(sD),
                    dateUtilities.momentFromDate(eD),
                    undefined,
                    "[]"
                  )
                ) {
                  return true;
                }
              }
              return false;
            }) || [];

          return aFPL;
        },

        onSendPlanForApproval: function () {
          var that = this;
          var oHeader = this._getPageProperty("Header");
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
              formatter.suppressZeroDecimal(oHeader.QuotaPlanned),
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

        onMergeSave: function () {
          var oEvent = this._getPageProperty("EventMerge");
          
          this._mergePlan(oEvent);

          this._closeEventDialog();
        },
        onSplitSave: function () {
          var oEvent = this._getPageProperty("EventSplit");

          var eL = this._getProperty("PlannedLeaves");

          var i = _.findIndex(eL, ["EventId", oEvent.EventId]);
          if (i === -1) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: this.getText("leaveRecordNotFound", []),
              toast: true,
              showConfirmButton: false,
              timer: 2000,
            });
            return;
          }

          var hE = 0;
          $.each(oEvent.Splits, function (i, e) {
            if (
              e.Visible === true &&
              moment(dateUtilities.convertToDate(e.StartDate)).isAfter(
                moment(dateUtilities.convertToDate(e.EndDate))
              )
            ) {
              hE++;
            }
          });

          if (hE > 0) {
            Swal.fire({
              position: "bottom",
              icon: "warning",
              html: this.getText("correctDates", []),
              showConfirmButton: false,
              toast: true,
              timer: 3000,
            });
            return;
          }
          var vS = _.filter(oEvent.Splits, function (e) {
            if (
              e.Visible === true &&
              moment(dateUtilities.convertToDate(e.StartDate)).isValid() &&
              moment(dateUtilities.convertToDate(e.EndDate)).isValid()
            ) {
              return true;
            }
          });

          if (vS.length < 2) {
            Swal.fire({
              position: "bottom",
              icon: "error",
              html: this.getText("min2SplitsWarning", []),
              toast: true,
              showConfirmButton: true,
              timer: 2000,
            });
            return;
          }

          this._splitPlan(oEvent);

          this._closeEventDialog();
        },

        onAddSplit: function () {
          var aS = this._getPageProperty("EventSplit/Splits");

          $.each(aS, function (i, s) {
            if (!s.Visible) {
              s.Visible = true;
              return false;
            }
          });

          this._setPageProperty("EventSplit/Splits", aS);
          this._setPageProperty("EventSplit/ButtonState", new Date().getTime());
        },

        onRemoveSplit: function () {
          var aS = this._getPageProperty("EventSplit/Splits");
          var l = aS.length - 1;

          while (l > 1) {
            if (aS[l].Visible) {
              aS[l].Visible = false;
              break;
            }
            l--;
          }

          this._setPageProperty("EventSplit/Splits", aS);
          this._setPageProperty("EventSplit/ButtonState", new Date().getTime());
        },

        getLeaveTypeVisible: function (d, r) {
          var e = this._getPageProperty("EventEdit");
          var h = this._getPageProperty("Header");

          if (!r) {
            return false;
          }

          if (d === "AL") {
            //Yıllık izin
            return true;
          }

          if (d === "PL" && e?.New && h?.PlanningEnabled) {
            return true;
          }

          return false;
        },
        onNavigateTeamCalendar: function () {
          this.oCrossAppNav = sap.ushell?.Container?.getService(
            "CrossApplicationNavigation"
          );
          if (this.oCrossAppNav) {
            this.oCrossAppNav.toExternal({
              target: { semanticObject: "ZHCMUXALTC", action: "display" },
              params: {},
            });
          }
        },
        /* Private - Helper Methods */
        _getModal: function () {
          return this._getById("LeaveManagementPageModal");
        },
        _getById: function (id) {
          return this.getView().byId(id);
        },

        _getProperty: function (p) {
          return this.getModel("planModel").getProperty("/" + p);
        },

        _setProperty: function (p, v) {
          return this.getModel("planModel").setProperty("/" + p, v);
        },

        _getPageProperty: function (p) {
          return this.getModel("planModel").getProperty("/Page/" + p);
        },
        _setPageProperty: function (p, v) {
          this.getModel("planModel").setProperty("/Page/" + p, v);
        },
        _getPageProps: function () {
          return this.getModel("planModel").getProperty("/Page");
        },
        _setPageProps: function (o) {
          this.getModel("planModel").setProperty("/Page", { ...o });
        },
        _getPeriod: function () {
          return this._getPageProperty("Period");
        },
        _setPeriod: function (p) {
          this._setPageProperty("Period", p);
        },
        _getMode: function () {
          return this._getPageProperty("Mode");
        },
        _setMode: function (m) {
          this._setPageProperty("Mode", m);
        },

        _getTabIndex: function () {
          return this._getPageProperty("TabIndex");
        },
        _setTabIndex: function (i) {
          this._setPageProperty("TabIndex", i);
        },

        /* Private methods */
        _countUsedQuota: function (b, e) {
          var oModel = this.getModel();
          var p = $.Deferred();
          if (dateUtilities.momentFromDate(b).isSameOrBefore(dateUtilities.momentFromDate(e))) {
            oModel.callFunction("/CalculateQuota", {
              urlParameters: {
                StartDate: dateUtilities.convertDatePattern(b),
                EndDate: dateUtilities.convertDatePattern(e),
              },
              success: function (d, r) {
                p.resolve(d);
              },
              error: function (e) {
                p.reject(e);
              },
            });
          } else {
            p.resolve({ UsedQuota: null });
            Swal.fire({
              position: "bottom",
              icon: "warning",
              html: this.getText("correctDates", []),
              showConfirmButton: false,
              toast: true,
              timer: 3000,
            });
          }
          return p;
        },

        _showPlanningInfo: function () {
          var h = this._getPageProperty("Header");
          var t, m;
          if (h.PlanningEnabled && h.CouncilApprovalStatus === "") {
            t = `<strong>${this.getText(
              "planningStatus",
              []
            )}</strong> <span style='color:green'>${this.getText(
              "planningActive",
              []
            )}</span>`;
            m = `<p>${this.getText("planningProcedure", [
              dateUtilities.momentFromDate(h.PlanningBeginDate).format("D MMMM YYYY"),
              // moment(h.PlanningBeginDate).format("D MMMM YYYY"),
              dateUtilities.momentFromDate(h.PlanningEndDate).format("D MMMM YYYY"),
              // moment(h.PlanningEndDate).format("D MMMM YYYY"),
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

        _showRejectedInfo: function () {
          var h = this._getPageProperty("Header");
          var t, m;

          t = `<strong>${this.getText("rejectedPlansExist", [])}</strong>`;
          m = `<p>${this.getText("rejectedPlansProcedure", [])}</p>`;

          Swal.fire({
            title: t,
            icon: "warning",
            html: m,
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: true,
            confirmButtonColor: "#0fb391",
            confirmButtonText: `<i class="spp-fa spp-fa-thumbs-up"></i>&nbsp;${this.getText(
              "okAction",
              []
            )}`,
            confirmButtonAriaLabel: this.getText("okAction", []),
            backdrop: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        },

        _refreshLegend: function () {
          var p = $.Deferred();
          var that = this;
          var oModel = this.getModel();
          var lt = [];

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

                /* Leave Types */
                if (
                  lgr.LeaveType !== null &&
                  lgr.LeaveType !== "" &&
                  lgr.Requestable
                ) {
                  lt.push({
                    Type: lgr.LeaveType,
                    Value: lgr.LegendGroupKey,
                    Description: lgr.LegendGroupName,
                    Color: lgr.LegendGroupColor,
                    Requestable: lgr.Requestable,
                    Source: lgr.DataSource,
                    Selected: false,
                  });
                }
                /* Leave Types */
              });

              lt = _.orderBy(lt, ["Type"], ["desc"]);

              that._setPageProperty("LegendGroup", lg);
              that._setPageProperty("LeaveTypes", lt);
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
              if (!o.Authorized) {
                that.getRouter().navTo("NotAuthorized", null, null, true);
                p.reject({
                  showMessage: false,
                });
              }

              var period = that._getPageProperty("Period") || null;
              if (!period) {
                if (!o.PlanningEnabled) {
                  that._setPageProperty(
                    "Period",
                    dateUtilities.convertDateToPeriod(new Date())
                  );
                } else {
                  that._setPageProperty(
                    "Period",
                    dateUtilities.convertDateToPeriod(o.QuotaAccrualBeginDate)
                  );
                }
              }
              that._setPageProperty(
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
          var oHeader = this._getPageProperty("Header");
          var oDefaultPeriod;

           //--Adjust period filters
           var t = _.clone(period) || _.clone(this._getPageProperty("Period"));

          if (oHeader.PlanningEnabled) {
            oDefaultPeriod = dateUtilities.convertDateToPeriod(
              oHeader.QuotaAccrualBeginDate
            );
            if(parseInt(oDefaultPeriod.month,10) < parseInt(t.month,10)){
              //--Make sure data is fetched for a year
              t.month = oDefaultPeriod.month;
              t.day = oDefaultPeriod.day;
            }
          } else {
            oDefaultPeriod = dateUtilities.convertDateToPeriod(null);
          }

          var rD = dateUtilities.convertPeriodToDateObject(t);
          var bD = dateUtilities.convertPeriodToDateObject(t);
          var eY = dateUtilities.calculateOffsetDate(rD, "+", 1, "y");

          var eD = dateUtilities.calculateOffsetDate(rD, "+", 1, "y");

          var oBD  = dateUtilities.momentFromDate(bD).startOf("month").toDate();
          // var oBD  = moment(bD).startOf("month").toDate();
          var oED  = dateUtilities.momentFromDate(eY).endOf("month").toDate();
          // var oED  = moment(eY).endOf("month").toDate();

          var sPath = oModel.createKey("/CalendarQuerySet", {
            BeginDate: dateUtilities.convertDatePattern(oBD),
            EndDate: dateUtilities.convertDatePattern(oED)
          });


          oModel.read(sPath, {
            urlParameters: {
              $expand:
                "HolidayCalendarSet,HolidayCalendarSet/HolidayInfoSet,HolidayCalendarSet/HolidayInfoSet/HolidayDateSet,PlannedLeaveSet,LeaveRequestSet",
            },
            // filters:aFilters,
            success: function (o, r) {
              that._setPageProperty("LastPeriod", {
                StartDate: oBD,
                EndDate: oED
              });
              //--UTC Conversion
              that._convertUTC(o);

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

        _convertUTC: function(oData){
          for (const [key, _] of Object.entries(oData)) {
            switch(key){
              case "BeginDate":
              case "EndDate":
                oData[key] = dateUtilities.convertUTCDate(oData[key]);
                break;
              case "PlannedLeaveSet":
              case "LeaveRequestSet":
                $.each(oData[key].results, (i,oEl)=>{
                  oEl.StartDate =  dateUtilities.convertUTCDate(oEl.StartDate);
                  oEl.EndDate =  dateUtilities.convertUTCDate(oEl.EndDate);
                });
                break;
              case "HolidayCalendarSet":
                $.each(oData[key].results, (i,oEl)=>{
                  oEl.BeginDate =  dateUtilities.convertUTCDate(oEl.BeginDate);
                  oEl.EndDate =  dateUtilities.convertUTCDate(oEl.EndDate);
                });
                break;
            }          
          }
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
                var a = that._getLegendAttributes("HL", d.DayClass);

                hC.HolidayList[l.Year].push({
                  ..._.clone(_.omit(d, ["__metadata"])),
                  LegendAttributes: a,
                });
              });
            });
          });
          this._setProperty("HolidayCalendar", hC);
          /* Holiday calendar */

          /* Leaves */
          var pL = [];
          // console.dir(o.PlannedLeaveSet.results);
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

          //Check if any rejected leave exists
          var rL = _.filter(b, ["LeaveStatus", "LRJ"]) || [];
          var rD = _.filter(b, ["LeaveStatus", "LRD"]) || [];

          if (rL.length > 0 || rD.length > 0) {
            this._showRejectedInfo();
          }

          this._setProperty("PlannedLeaves", pL);

          var aL = [];

          // console.dir(o.LeaveRequestSet.results);
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

          this._setProperty("AnnualLeaves", aL);
          /* Leaves */

          p.resolve(true);

          // console.dir(hC);

          return p;
        },

        _triggerRenderChanged: function () {
          this._setPageProperty("PageRenderChanged", new Date().getTime());
        },
        _editPlan: function (oEvent) {
          var that = this;
          var oHeader = this._getPageProperty("Header");
          var aPL = this._getProperty("PlannedLeaves");
          var oPlan = _.find(aPL, ["EventId", oEvent.EventId]);
          var oOperation = {
            Actio: "MOD",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: oPlan.PlannedLeaveId,
            PlannedLeaveSet: [
              {
                PlannedLeaveId: oPlan.PlannedLeaveId,
                EmployeeNumber: oHeader.EmployeeNumber,
                StartDate: dateUtilities.convertToDatePattern(oEvent.StartDate),
                EndDate: dateUtilities.convertToDatePattern(oEvent.EndDate),
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
        _getAbsenceTypeCustomizing: function () {
          var oLeaveModel = this.getModel("leaveRequest");
          var oHeader = this._getPageProperty("Header");
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
              //$expand: "toApprover,toAdditionalFieldsDefinition",
            },
            filters: aFilters,
            success: function (o, r) {
              p.resolve(o);
            },
            error: function (e) {
              p.reject(e);
            },
          });

          return p;
        },
        _deleteAnnualLeave: function (oAnnual) {
          var oLeaveModel = this.getModel("leaveRequest");
          var sPath = oLeaveModel.createKey("/LeaveRequestCollection", {
            ...oAnnual.Key,
          });
          var that = this;

          this.openBusyFragment("annualLeaveBeingDeleted", []);
          oLeaveModel.remove(sPath, {
            success: function (o, r) {
              that._refreshHeader().then(function () {
                that._triggerRenderChanged(); //Page should be rerendered
                that.closeBusyFragment();
                Swal.fire({
                  position: "bottom",
                  icon: "success",
                  html: that.getText("annualLeaveDeleted", []),
                  showConfirmButton: false,
                  toast: true,
                  timer: 2000,
                });
              });
            },
            error: function (e) {
              that.closeBusyFragment();
              that._showServiceError(e);
            },
          });
        },
        _createAnnualLeave: function (oAnnual) {
          var that = this;
          var oHeader = this._getPageProperty("Header");
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
              StartDate: dateUtilities.convertToDatePattern(oAnnual.StartDate),
              EndDate: dateUtilities.convertToDatePattern(oAnnual.EndDate),
              Attachments: [],
              ActionCode: 1,
              ProcessCheckOnlyInd: true,
              AdditionalFields: {},
              ApproverEmployeeID: oAbsence.ApproverName,
              ApproverEmployeeName: oAbsence.ApproverPernr,
              MultipleApprovers: _.clone(oAbsence.MultipleApprovers.results),
              Notes: oAnnual.Reason,
            };

            that.openBusyFragment("annualLeaveBeingCreated", []);
            oLeaveModel.create("/LeaveRequestCollection", oLeaveRequest, {
              success: function (x, y) {
                oLeaveRequest.ProcessCheckOnlyInd = false;
                oLeaveModel.create("/LeaveRequestCollection", oLeaveRequest, {
                  success: function (o, r) {
                    that._refreshHeader().then(function () {
                      that._triggerRenderChanged(); //Page should be rerendered
                      that.closeBusyFragment();
                      Swal.fire({
                        position: "bottom",
                        icon: "success",
                        html: that.getText("annualLeaveSentForApproval", []),
                        showConfirmButton: false,
                        toast: true,
                        timer: 2000,
                      });
                    });
                  },
                });
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
          var oHeader = this._getPageProperty("Header");
          var oOperation = {
            Actio: "INS",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: null,
            PlannedLeaveSet: [
              {
                PlannedLeaveId: eventUtilities.createEventId(),
                EmployeeNumber: oHeader.EmployeeNumber,
                StartDate: dateUtilities.convertToDatePattern(oPlan.StartDate),
                EndDate: dateUtilities.convertToDatePattern(oPlan.EndDate),
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
          var oHeader = this._getPageProperty("Header");
          var aPL = this._getProperty("PlannedLeaves");
          var oPlan = _.find(aPL, ["EventId", oEvent.EventId]);

          var oOperation = {
            Actio: "DEL",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: oPlan.PlannedLeaveId,
            PlannedLeaveSet: [
              {
                PlannedLeaveId: oPlan.PlannedLeaveId,
                EmployeeNumber: oHeader.EmployeeNumber,
                StartDate: dateUtilities.convertToDatePattern(oPlan.StartDate),
                EndDate: dateUtilities.convertToDatePattern(oPlan.EndDate),
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
          var oHeader = this._getPageProperty("Header");
          var aPL = this._getProperty("PlannedLeaves");
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
              StartDate: dateUtilities.convertToDatePattern(s.StartDate),
              EndDate: dateUtilities.convertToDatePattern(s.EndDate),
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

        _mergePlan: function (oEvent) {
          var that = this;
          var oHeader = this._getPageProperty("Header");
          var aPL = this._getProperty("PlannedLeaves");
          var aParts = _.filter(oEvent.Parts, ["Cancelled", false]) || [];
          var aCanc = _.filter(oEvent.Parts, ["Cancelled", true]) || [];
          var aPL = this._getProperty("PlannedLeaves");
          var oPlan = _.find(aPL, ["EventId", aCanc[0] ? aCanc[0].EventId : aParts[0].EventId]);


          var oOperation = {
            Actio: "MRG",
            PlanId: oHeader.PlanId,
            PlannedLeaveId: oPlan.PlannedLeaveId,
            PlannedLeaveSet: [],
            ReturnSet: [],
          };

          $.each(aParts, function (i, s) {
            var p = _.find(aPL,  ["EventId",s.EventId]);
            if(p){
              oOperation.PlannedLeaveSet.push({
                PlannedLeaveId: p.PlannedLeaveId ,
                EmployeeNumber: oHeader.EmployeeNumber,
                StartDate: dateUtilities.convertToDate(s.StartDate),
                EndDate: dateUtilities.convertToDate(s.EndDate),
                LeaveType: "PL",
                PlanId: oHeader.PlanId,
              });
            }
          });

          var fnCallback = function () {
            Swal.fire({
              position: "bottom",
              icon: "success",
              html: that.getText("eventMerged", []),
              showConfirmButton: false,
              toast: true,
              timer: 2000,
            });
          };

          this._callPlannedLeaveOperation(
            "plannedLeaveBeingMerged",
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
          var g = this._getPageProperty("LegendGroup") || [];

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
              $.each(r, function (i, l) {
                g = l;
                f =
                  _.find(l.LegendItemSet, {
                    EventType: e,
                  }) || null;
                if (f !== null) {
                  return false;
                }
              });

              return {
                LegendGroupName: g.LegendGroupName,
                LegendItemCount: g.LegendItemSet.length,
                ...f,
                LeaveType: g.LeaveType,
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
                ...f,
                LeaveType: g.LeaveType,
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
                ...f,
                LeaveType: g.LeaveType,
              };

            default:
              return null;
          }
        },
        _closeEventDialog: function () {
          if (this._oEventDialog) {
            this._oEventDialog.close();
          }
          //--Close modal--//
          this._getModal()?.close();
        },
        _handlePeriodChange: function (b) {
          var p = this._getPeriod();
          var x = { ...p };
          var m = this._getMode();
          var that = this;
          var oLastPeriod = this._getPageProperty("LastPeriod");
          var bChange = false;

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

          var d = dateUtilities.decidePeriodChangeDirection(x, p, m);

          if (d === null) {
            return;
          }

          var doChange = function () {
            that._setPeriod(p);
            that._publishPeriodChanged(
              jQuery.proxy(that._publishViewChanged, that, null, true, d),
              d
            );
            that.closeBusyFragment();
          };


          // if(oLastPeriod.StartDate){
          //    bChange = !dateUtilities.checkIsPeriodBetweenDates(p, oLastPeriod.StartDate, oLastPeriod.EndDate);
          // }else{
          //    bChange = true;
          // }

          if (x.year !== p.year) {
            this.openBusyFragment("pleaseWait", []);
            this._refreshCalendar(p).then(doChange);
          } else {
            doChange();
          }
        },

        _publishPeriodChanged: function (fnCb, d) {
          var p = this._getPeriod();
          var m = this._getMode();
          var i = this._getTabIndex();
          eventUtilities.publishEvent("PlanningCalendar", "PeriodChanged", {
            Period: { ...p },
            Mode: m,
            Direction: d,
            TabIndex: i,
            FnCallback: fnCb,
          });
        },

        _publishViewChanged: function (fnCb, e, d) {
          var i = this._getTabIndex();
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

          if (this._getTabIndex() < i) {
            d = "R";
          } else {
            d = "L";
          }

          var oPage = this._getPageProps();

          oPage.TabIndex = i;
          oPage.Mode = m;

          this._setPageProps(oPage);

          this._publishViewChanged(
            jQuery.proxy(that._handleViewChangeCompleted, that),
            false,
            d
          );
        },

        _handleViewChangeCompleted: function () {
          var i = this._getTabIndex();
          var p = this._getPeriod();
          var m = this._getMode();
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
        _handleSelectEventDate: function (c, e, o) {
          var p = this._getProperty("SelectEvent");
          var that = this;
          var opened = false;

          var initiateSelectEvent = function () {
            var n = {
              Element: null,
              Period: {
                StartDate: null,
                EndDate: null,
              },
            };
            eventUtilities.setSelectEventStatus(false);
            that._setProperty("SelectEvent", n);
          };

          if (!p.Period.StartDate) {
            p.Element = o.Element;
            p.Period.StartDate = o.Date;
            p.Period.EndDate = null;
            Swal.fire({
              position: "bottom",
              icon: "warning",
              html: that.getText("selectEndDate", [p.Period.StartDate]),
              showConfirmButton: false,
              toast: true,
              timer: 10000,
              timerProgressBar: true,
              didOpen: function () {
                opened = true;
              },
              willClose: function () {
                if (opened) {
                  opened = false;
                  $(".spp-calendar-cell").removeClass(
                    "spp-cal-tentative-event"
                  );
                  initiateSelectEvent();
                }
              },
            });
            this._setProperty("SelectEvent", p);
            $(`.spp-calendar-cell[data-date='${p.Period.StartDate}']`).addClass(
              "spp-cal-tentative-event"
            );
            eventUtilities.setSelectEventStatus(true);
            return;
          } else {
            Swal.close();

            if (
              moment(dateUtilities.convertToDate(o.Date)).isSameOrAfter(
                moment(dateUtilities.convertToDate(p.Period.StartDate))
              )
            ) {
              p.Period.EndDate = o.Date;
            } else {
              p.Period.EndDate = _.clone(p.Period.StartDate);
              p.Period.StartDate = o.Date;
            }

            var dates =
              dateUtilities.findDatesBetweenTwoDates(
                p.Period.StartDate,
                p.Period.EndDate
              ) || [];

            if (dates.length === 0) {
              Swal.fire({
                position: "bottom",
                icon: "warning",
                html: this.getText("correctDates", []),
                showConfirmButton: false,
                toast: true,
                timer: 3000,
              });
              initiateSelectEvent();
              return;
            }

            dates.forEach(function (n) {
              $(`.spp-calendar-cell[data-date='${n}']`).addClass(
                "spp-cal-tentative-event"
              );
            });

            this._openEditEventDialog(p.Element, p.Period, true);

            initiateSelectEvent();
          }
        },
        _handleCreateEvent: function (c, e, o) {
          if (o && o.Element) {
            this._openEditEventDialog(o.Element, o.Period, true);
          }
        },
        _handleSplitEvent: function (c, e, o) {
          var s = this._getEventType(o.EventType);

          if (!s) {
            return null;
          }

          var a = this._getProperty(s) || [];

          if (a.length === 0) {
            return;
          }

          var b = _.find(a, ["EventId", o.EventId]) || null;
          console.log(b);
          if (!b) {
            return;
          }

          var t = this._getLeaveType(o.EventType);

          var z = {
            ...b,
            LeaveType: {
              ...t,
              SubType: b.LeaveType
            },
          };

          this._openSplitEventDialog(null, z);
        },
        _handleMergeEvent: function (c, e, o) {
          var s = this._getEventType(o.EventType);

          if (!s) {
            return null;
          }

          var a = this._getProperty(s) || [];

          if (a.length === 0) {
            return;
          }

          var b = _.find(a, ["EventId", o.EventId]) || null;

          if (!b) {
            return;
          }

          var t = this._getLeaveType(o.EventType);

          var z;

          if (eventUtilities.getMergeEventStatus()) {
            z = this._getProperty("MergeEvent");
            if (!z.Originals.length === 1) {
              eventUtilities.setMergeEventStatus(false)
              return;
            }
            if (z.Originals[0].EventId === o.EventId) {
              Swal.fire({
                position: "bottom",
                icon: "error",
                html: this.getText("sameEventSelectedError", []),
                toast: true,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
              });
              eventUtilities.setMergeEventStatus(false);
              return;
            }
          } else {
            //--First close the dialog
            this._getModal().close();

            //--Set the merge event data
            z = {
              LeaveType: {
                ...t,
                SubType: b.LeaveType
              },
              Originals: [],
            };
          };

          z.Originals.push({
            ...b
          });

          this._setProperty("MergeEvent", z);

          this._selectEventMergeDate();
        },

        _selectEventMergeDate: function () {
          var m = this._getProperty("MergeEvent");
          var that = this;
          var opened = false;

          var initiateMergeEvent = function () {
            var n = {
              LeaveType: {},
              Originals: [],
            };
            eventUtilities.setMergeEventStatus(false);
            that._setProperty("MergeEvent", n);
          };

          if (m.Originals.length === 0) {
            return;
          }

          if (m.Originals.length === 1) {
            Swal.fire({
              position: "bottom",
              icon: "warning",
              html: that.getText("selectMergeSecondEvent", [dateUtilities.formatDate(m.Originals[0].StartDate), dateUtilities.formatDate(m.Originals[0].EndDate)]),
              showConfirmButton: false,
              toast: true,
              timer: 10000,
              timerProgressBar: true,
              didOpen: function () {
                opened = true;
              },
              willClose: function () {
                if (opened) {
                  opened = false;
                  initiateMergeEvent();
                }
              },
            });
            eventUtilities.setMergeEventStatus(true);
            return;
          } else {
            Swal.close();

            m.Originals = _.orderBy(m.Originals, ["StartDate"], ["asc"]);

            this._openMergeEventDialog(m);


            // if (
            //   moment(dateUtilities.convertToDate(o.Date)).isSameOrAfter(
            //     moment(dateUtilities.convertToDate(p.Period.StartDate))
            //   )
            // ) {
            //   p.Period.EndDate = o.Date;
            // } else {
            //   p.Period.EndDate = _.clone(p.Period.StartDate);
            //   p.Period.StartDate = o.Date;
            // }

            // var dates =
            //   dateUtilities.findDatesBetweenTwoDates(
            //     p.Period.StartDate,
            //     p.Period.EndDate
            //   ) || [];

            // if (dates.length === 0) {
            //   Swal.fire({
            //     position: "bottom",
            //     icon: "warning",
            //     html: this.getText("correctDates", []),
            //     showConfirmButton: false,
            //     toast: true,
            //     timer: 3000,
            //   });
            //   initiateMergeEvent();
            //   return;
            // }


            initiateMergeEvent();
          }
        },

        _handleDeleteEvent: function (c, e, o) {
          var s = this._getEventType(o.EventType);

          if (!s) {
            return null;
          }

          var a = this._getProperty(s) || [];

          if (a.length === 0) {
            return;
          }

          var c = _.find(a, ["EventId", o.EventId]) || null;

          if (!c) {
            return;
          }

          var t = this._getLeaveType(o.EventType);

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
            Deletable: true,
          };

          if (s === "AnnualLeaves") {
            oEvent.Key = {
              EmployeeID: c.EmployeeID,
              RequestID: formatter.convertGuidToChar(c.RequestID),
              ChangeStateID: c.ChangeStateID,
              LeaveKey: c.LeaveKey,
            };
          }

          this._setPageProperty("EventEdit", oEvent);

          this.onEventDelete();
        },
        _getEventType: function (k) {
          var keys = k.split("_");
          var g = keys[0];
          var i = keys[1];
          var lg = this._getPageProperty("LegendGroup") || [];

          if (lg.length === 0) {
            return null;
          }

          var a = _.find(lg, ["LegendGroupKey", g]) || null;

          if (!a) {
            return null;
          }
          return a.DataSource === "PL"
            ? "PlannedLeaves"
            : a.DataSource === "AL"
              ? "AnnualLeaves"
              : null;
        },
        _getDataSourceFromKey: function (k) {
          var lg = this._getPageProperty("LegendGroup") || [];

          if (lg.length === 0) {
            return null;
          }

          var a = _.find(lg, ["LeaveType", k]) || null;

          if (!a) {
            return null;
          }
          return a.DataSource;
        },

        _getEntityPathFromKey: function (k) {
          var s = this._getDataSourceFromKey(k);
          return s === "PL"
            ? "PlannedLeaves"
            : s === "AL"
              ? "AnnualLeaves"
              : null;
        },

        _getLeaveType: function (k) {
          var keys = k.split("_");
          var g = keys[0];
          var i = keys[1];
          var lg = this._getPageProperty("LegendGroup") || [];

          if (lg.length === 0) {
            return null;
          }

          var a = _.find(lg, ["LegendGroupKey", g]) || null;

          if (!a) {
            return null;
          }

          var lt = this._getPageProperty("LeaveTypes");
          var t = _.find(lt, ["Type", a.LeaveType]) || null;

          return t;
        },
        _handleEditEvent: function (x, e, o) {
          var s = this._getEventType(o.EventType);

          if (!s) {
            return null;
          }

          var a = this._getProperty(s) || [];

          if (a.length === 0) {
            return;
          }

          var c = _.find(a, ["EventId", o.EventId]) || null;

          if (!c) {
            return;
          }

          var t = this._getLeaveType(o.EventType);

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
            alignment: "auto",
            showPointer: true,
            content: this._createDisplayEventWidget(l),
            closed: function () { },
          }).addStyleClass("spp-overflowpopup");

          this._getModal().open(oDialog);
        },

        _createDisplayEventWidget: function (l) {
          var eventList = [];
          var that = this;

          $.each(l, function (i, e) {
            eventList.push(
              new Event({
                eventId: e.eventId,
                eventType: e.eventType,
                leaveType: e.leaveType,
                color: e.color,
                text: e.text,
                height: "25px",
                hasPast: e.hasPast,
                hasFuture: e.hasFuture,
                hasOverflow: e.hasOverflow,
                rowIndex: e.rowIndex,
                rowSpan: 7,
                editable: e.editable,
                splittable: e.splittable,
                mergable: e.mergable,
                deletable: e.deletable,
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
            ["--textfield-width", bPhone ? "10.5em" : "15em"],
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
              RefDate: dateUtilities.formatDate(p.StartDate),
              UsedQuota: p.UsedQuota,
              New: n,
              Title: that.getText(n ? "newEventTitle" : "editEventTitle", []),
              QuotaCalculating: false,
              Deletable: p.Deletable || false,
              Reason: "",
            };
            that._setPageProperty("EventEdit", oEvent);

            var oDialog = Fragment.load({
              id: that._getPagePrefix(),
              name: "com.thy.ux.annualleaveplanning.view.fragment.EditEventDialog",
              controller: that,
            }).then(
              function (d) {
                d.setStyles(that._getEditDialogStyles());
                that._oEventDialog = d;
                that._getModal().open(that._oEventDialog);
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
          var that = this;
          var oEvent = {
            LeaveType: {
              Key: p.LeaveType.Type,
              Value: p.LeaveType.Description,
              Icon: p.LeaveType.Color,
              Type: p.LeaveType.SubType
            },
            EventId: p.EventId,
            StartDate: sD,
            EndDate: eD,
            UsedQuota: p.UsedQuota,
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
          this._setPageProperty("EventSplit", oEvent);

          var oDialog = Fragment.load({
            id: that._getPagePrefix(),
            name: "com.thy.ux.annualleaveplanning.view.fragment.SplitEventDialog",
            controller: this,
          }).then(
            function (d) {
              d.setStyles(this._getEditDialogStyles());
              this._oEventDialog = d;
              this._getModal().open(this._oEventDialog);
            }.bind(this)
          );
        },

        _openMergeEventDialog: function (p) {
          var oPart1 = _.clone(p.Originals[0]);
          var oPart2 = _.clone(p.Originals[1]);
          var that = this;
          var oEvent = {
            LeaveType: {
              Key: p.LeaveType.Type,
              Value: p.LeaveType.Description,
              Icon: p.LeaveType.Color,
            },
            Originals: _.clone(p.Originals),
            Leaves: [
              {
                EventId: oPart1.EventId,
                StartDate: dateUtilities.formatDate(oPart1.StartDate),
                EndDate: dateUtilities.formatDate(oPart1.EndDate),
              },
              {
                EventId: oPart2.EventId,
                StartDate: dateUtilities.formatDate(oPart2.StartDate),
                EndDate: dateUtilities.formatDate(oPart2.EndDate),
              },
            ],
            UsedQuota: parseFloat(oPart1.UsedQuota) + parseFloat(oPart2.UsedQuota),
            Title: this.getText("mergeEventTitle", []),
            Parts: [
              {
                EventId: oPart1.EventId,
                Title: this.getText("eventMergeItem", ["1"]),
                StartDate: dateUtilities.formatDate(oPart1.StartDate),
                EndDate: dateUtilities.formatDate(oPart1.EndDate),
                Visible: true,
                UsedQuota: oPart1.UsedQuota,
                RefStartDate: dateUtilities.formatDate(oPart1.StartDate),
                RefEndDate: dateUtilities.formatDate(oPart1.EndDate),
                QuotaCalculating: false,
                Cancelled: false
              },
              {
                EventId: oPart2.EventId,
                Title: this.getText("eventMergeItem", ["2"]),
                StartDate: dateUtilities.formatDate(oPart2.StartDate),
                EndDate: dateUtilities.formatDate(oPart2.EndDate),
                Visible: true,
                UsedQuota: oPart2.UsedQuota,
                RefStartDate: dateUtilities.formatDate(oPart2.StartDate),
                RefEndDate: dateUtilities.formatDate(oPart2.EndDate),
                QuotaCalculating: false,
                Cancelled: false
              },
            ],
            ButtonState: new Date().getTime(), //For refreshing button states
          };
          this._setPageProperty("EventMerge", oEvent);

          var oDialog = Fragment.load({
            id: that._getPagePrefix(),
            name: "com.thy.ux.annualleaveplanning.view.fragment.MergeEventDialog",
            controller: this,
          }).then(
            function (d) {
              d.setStyles(this._getEditDialogStyles());
              this._oEventDialog = d;
              this._getModal().open(this._oEventDialog);
            }.bind(this)
          );
        },

        _createEventCancelled: function () {
          this._cancelCreateEvent();
          this._getModal().close();
        },
        _cancelCreateEvent: function (p = true) {
          eventUtilities.publishEvent(
            "PlanningCalendar",
            "CreateEventCancelled",
            { showAlert: p }
          );
        },

        _showServiceError: function (oError) {
          this._cancelCreateEvent();
          var m;

          try {
            m = JSON.parse(oError?.responseText).error.message.value;
          } catch (e) {
            m = oError?.responseText;
          }

          Swal.fire({
            icon: "error",
            title: this.getText("serviceErrorTitle", []),
            html: m,
            position: "center",
            showConfirmButton: false,
            showCloseButton: true,
          });
        },
        _showErrorMessages: function (aError, titleText) {
          this._cancelCreateEvent();
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
                showConfirmButton: true,
                confirmButtonText: this.getText("okAction", []),
                focusConfirm: true,
                showCloseButton: true,
              });
            }
          } catch (e) { }
        },

        _initiateViewModel: function () {
          return {
            Page: {
              Visible: false,
              Mode: "Y",
              Period: null,
              TabIndex: "0",
              Legend: null,
              PageRenderChanged: null,
              EventEdit: {
                LeaveType: null,
                EventId: null,
                StartDate: null,
                EndDate: null,
                RefDate: null,
                New: false,
                UsedQuota: null,
                Title: "",
                QuotaCalculating: false,
                Deletable: false,
                Key: null,
                Reason: "",
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
              EventMerge: {
                LeaveType: null,
                Originals: [],
                Leaves: [],
                UsedQuota: null,
                Title: "",
                Parts: [],
                ButtonState: null,
              },
              Header: {},
              LeaveTypes: [],
              HomeButtonVisible: sap?.ushell?.Container ? true : false,
              LastPeriod: {
                StartDate: null,
                EndDate: null
              }
            },
            HolidayCalendar: null,
            PlannedLeaves: [],
            AnnualLeaves: [],
            PagePrefix: this.getView().getId() + "_" + new Date().getTime(),
            SelectEvent: {
              Element: null,
              Period: {
                StartDate: null,
                EndDate: null,
              },
            },

            MergeEvent: {
              Originals: [],
              Parts: [],
            },

            LanguageIconTR:
              jQuery.sap.getModulePath("com.thy.ux.annualleaveplanning") +
              "/assets/images/tr.png",
            LanguageIconEN:
              jQuery.sap.getModulePath("com.thy.ux.annualleaveplanning") +
              "/assets/images/en.png",
          };
        },
        _getPagePrefix: function () {
          return this._getProperty("PagePrefix");
        },
        _subscribeEventHandlers: function () {
          /* Subscribe Event Handlers */

          eventUtilities.subscribeEvent(
            "PlanningCalendar",
            "SelectEventDate",
            this._handleSelectEventDate,
            this
          );

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
            "MergeEvent",
            this._handleMergeEvent,
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
          /* Subscribe Event Handlers */
        },

        onNavBack: function () {
          // var oRenderer = sap.ushell.Container.getRenderer("fiori2");
          // if (oRenderer) {
          //   oRenderer.setHeaderVisibility(true, true, [ "app"]);

          var oNav = sap.ushell.Container.getService(
            "CrossApplicationNavigation"
          );

          if (oNav) {
            oNav.toExternal({
              target: {
                semanticObject: "Shell-home",
              },
            });
          }
          // }
        },

        _registerHasChange: function () {
          var that = this;
          window.removeEventListener("hashchange", that._hashChangeListener);

          window.addEventListener(
            "hashchange",
            that._hashChangeListener.bind(that),
            false
          );
        },

        _hashChangeListener: function (e) {
          if (sap?.ushell?.Container) {
            if (e.newURL && e.newURL.includes("#Shell-home")) {
              this.onExit();

              var oRenderer = sap.ushell.Container.getRenderer("fiori2");
              if (oRenderer) {
                oRenderer.setHeaderVisibility(true, true, ["app"]);
              }
            }
          }
        },

        _handlePlanViewCalled: function () {
          if (sap?.ushell?.Container) {
            this._registerHasChange();
            var oRenderer = sap.ushell.Container.getRenderer("fiori2");
            if (oRenderer) {
              oRenderer.setHeaderVisibility(false, false, ["app"]);
            }
          }

          this._setPageProperty("Visible", false);
          this.openBusyFragment("pleaseWait", []);

          $.when(this._refreshLegend(), this._refreshHeader())
            .done(
              function () {
                this.closeBusyFragment();
                this._setPageProperty("Visible", true);
                this._showPlanningInfo();
              }.bind(this)
            )
            .fail(
              function (e) {
                this.closeBusyFragment();
                if (
                  e.hasOwnProperty("showMessage") &&
                  e.showMessage === false
                ) {
                  //Nothing
                } else {
                  this._showServiceError(e);
                }
              }.bind(this)
            );
        },

        _formatDate: function (d) {
          return dateUtilities.formatDate(d);
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

            this._getModal().openSub(oDPW);
          }
        },
      }
    );
  }
);
