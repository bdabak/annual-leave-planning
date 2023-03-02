/*global QUnit*/

sap.ui.define([
	"comthyux/annual-leave-planning/controller/PlanView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PlanView Controller");

	QUnit.test("I should test the PlanView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
