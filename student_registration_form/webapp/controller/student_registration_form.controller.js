sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("studentregistrationform.controller.student_registration_form", {
            onInit: function () {

            },
            onAddButtonClick: function () {
                var table = this.getView().byId("Qalification");
                var templateRow = this.getView().byId("templateRow");

                // Clone the template row
                var newRow = templateRow.clone();

                // Get the current number of rows in the table
                var rowCount = table.getItems().length;

                // Increment the SR No. for the new row
                var srNo = rowCount + 1;

                // Set the SR No. for the new row
                newRow.getCells()[0].setText(srNo.toString());

                // Add the new row to the table
                table.addItem(newRow);
            },
            onAddButtonClickip: function () {

                var table = this.getView().byId("ip_Details");
                var templateRow = this.getView().byId("templateRowIp");

                // Clone the template row
                var newRow = templateRow.clone();

                // Get the current number of rows in the table
                var rowCount = table.getItems().length;

                // Increment the SR No. for the new row
                var srNo = rowCount + 1;

                // Set the SR No. for the new row
                newRow.getCells()[0].setText(srNo.toString());

                // Add the new row to the table
                table.addItem(newRow);
            },
            onClick: function (oEvent) {
                debugger
                // var that = this;
                // /*	sap.ui.core.util.File.save(that.objectUrl, "filename", "jpeg", "image/jpeg");*/
                // var that = this;
                // download("data:application/octet-stream;base64," + that.convert, that.filename, that.mime);
                // var x = new XMLHttpRequest();
                // x.open("GET", "http://danml.com/wave2.gif", true);
                // x.responseType = 'blob';
                // x.onload = function (e) {
                //     download(x.response, that.filename, that.mime);
                // };
                // x.send();
                /*window.location.href = 'data:application/octet-stream;base64,' + that.convert;*/
            }

        });
    });
