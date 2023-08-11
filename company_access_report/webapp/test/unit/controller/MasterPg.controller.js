/*global QUnit*/

sap.ui.define([
	"company_access_report/controller/MasterPg.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MasterPg Controller");

	QUnit.test("I should test the MasterPg controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
