/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"update_status_report/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
