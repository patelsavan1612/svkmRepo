/*global QUnit*/

sap.ui.define([
	"student_registration_form/controller/student_registration_form.controller"
], function (Controller) {
	"use strict";

	QUnit.module("student_registration_form Controller");

	QUnit.test("I should test the student_registration_form controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
