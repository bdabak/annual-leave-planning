/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comthyux/annual-leave-planning/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
