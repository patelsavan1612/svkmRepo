/*global QUnit*/

sap.ui.define([
	"student_placement/controller/student_placement.controller"
], function (Controller) {
	"use strict";

	QUnit.module("student_placement Controller");

	QUnit.test("I should test the student_placement controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
