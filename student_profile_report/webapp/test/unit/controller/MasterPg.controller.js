/*global QUnit*/

sap.ui.define([
	"student_profile_report/controller/MasterPg.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MasterPg Controller");

	QUnit.test("I should test the MasterPg controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
