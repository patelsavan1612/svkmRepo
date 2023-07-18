/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"student_registration_form/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
