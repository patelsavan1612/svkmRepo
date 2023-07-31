sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/BusyIndicator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, BusyIndicator) {
        "use strict";
        var that;
        var oDataModel;
        return Controller.extend("studentregistrationform.controller.student_registration_form", {
            onInit: function () {
                var context;
                context = this;
                that = this;
                var studentdata = this.getOwnerComponent().getModel("registrationproperty").getData();
                var studentmodel = new JSONModel(studentdata);
                this.getView().setModel(studentmodel, "cModel");
                oDataModel = this.getOwnerComponent().getModel("oData");
                that.listdata = this.getOwnerComponent().getModel("");
                // this.onDataSave();
                this.readStudentRegistrationData();
                this.oQualificationTable = this.byId("Qalification");
                this.oInternshipTable = this.byId("ip_Details");
                this.attachInputChangeEventListeners(this.oQualificationTable);
                this.attachInputChangeEventListeners(this.oInternshipTable);
                this.toggleFooterVisibility();


            },

            readStudentRegistrationData: function () {
                // BusyIndicator.show(0);
                var filters = [];
                // if (!isStudentUserEmpty) {
                //     var collegeFilter = new sap.ui.model.Filter("Student12", sap.ui.model.FilterOperator.EQ, collegeInput.getSelectedKey());
                //     filters.push(collegeFilter);
                // }

                // if (!isPasswordEmpty) {
                //     var courseFilters = [];
                //     courseInput.getSelectedKeys().forEach(function (course) {
                //         var courseFilter = new sap.ui.model.Filter("ScObjid", sap.ui.model.FilterOperator.EQ, course);
                //         courseFilters.push(courseFilter);
                //     });
                //     var courseFilter = new sap.ui.model.Filter(courseFilters, false);
                //     filters.push(courseFilter);
                // }
                oDataModel.read("/ZISTPERSONALSet", {
                    // filters: filters,
                    success: function (Data, response) {
                        BusyIndicator.hide();
                        var oModel = new JSONModel(Data);
                        context.getView().setModel(oModel, "StudentDataset");
                    },
                    error: function (Error) {
                        BusyIndicator.hide();
                        MessageBox.error("error while expanding");

                    }
                });
            },

            onDataSave: function () {
                debugger
                if (!this.oQualificationTable || !this.oInternshipTable) {
                    MessageBox.error("Tables are not properly initialized.");
                    // return;
                }

                var bQualificationEmpty = this.areAllInputsEmpty(this.oQualificationTable);
                var bInternshipEmpty = this.areAllInputsEmpty(this.oInternshipTable);

                if (bQualificationEmpty && bInternshipEmpty) {
                    MessageBox.error("Please fill in the required fields.");
                    // return;
                }

                var aQualificationData = [];
                var aInternshipData = [];


                var aQualificationRows = this.oQualificationTable.getItems();
                aQualificationRows.forEach(function (oRow) {
                    var aCells = oRow.getCells();
                    var oData = {
                        "SrNo": aCells[0].getText(),
                        "AdditionalQualification": aCells[1].getSelectedItem().getText(),
                        "Institution": aCells[2].getValue(),
                        "Duration": aCells[3].getDateValue(),
                        "Result": aCells[4].getValue()
                    };
                    aQualificationData.push(oData);
                });


                var aInternshipRows = this.oInternshipTable.getItems();
                aInternshipRows.forEach(function (oRow) {
                    var aCells = oRow.getCells();
                    var oData = {
                        "SrNo": aCells[0].getText(),
                        "InternshipDetails": aCells[1].getValue(),
                        "OrganizationName": aCells[2].getValue(),
                        "Duration": aCells[3].getDateValue(),
                        "ContactDetails": aCells[4].getValue(),
                        "StudentDesignation": aCells[5].getValue(),
                        "Attachments": aCells[6].getValue(),
                        "HigherEducationDetails": aCells[7].getValue()
                    };
                    aInternshipData.push(oData);
                });

                var oModel = this.getView().getModel(); // Get the OData model

                var oPayload = {
                    QualificationData: aQualificationData,
                    InternshipData: aInternshipData
                };

                oModel.create("/EntitySet", oPayload, {
                    success: function () {
                        sap.m.MessageToast.show("Data saved successfully.");

                        this.clearTableInputs(this.oQualificationTable);
                        this.clearTableInputs(this.oInternshipTable);
                        this.toggleFooterVisibility();
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageToast.show("Error while saving data: " + oError.responseText);
                    }
                });
            },
            onInputChange: function () {
                this.toggleFooterVisibility();
            },

            toggleFooterVisibility: function () {
                if (!this.oQualificationTable || !this.oInternshipTable) {
                    return;
                }
                var bQualificationEmpty = this.areAllInputsEmpty(this.oQualificationTable);
                var bInternshipEmpty = this.areAllInputsEmpty(this.oInternshipTable);
                var bShowFooter = !bQualificationEmpty || !bInternshipEmpty;
                var oObjectPageLayout = this.byId("ObjectPageLayout");
                oObjectPageLayout.setShowFooter(bShowFooter);
            },
            attachInputChangeEventListeners: function (oTable) {
                if (!oTable) {
                    return;
                }

                var aItems = oTable.getItems();
                aItems.forEach(function (oItem) {
                    var aCells = oItem.getCells();
                    aCells.forEach(function (oCell) {
                        if (oCell instanceof sap.m.Input ||
                            oCell instanceof sap.m.Select ||
                            oCell instanceof sap.m.DateRangeSelection) {
                            oCell.attachChange(this.onInputChange, this);
                        }
                    }, this);
                }, this);
            },
            areAllInputsEmpty: function (oTable) {
                if (!oTable) {
                    return true;
                }

                var aItems = oTable.getItems();
                return aItems.every(function (oItem) {
                    var aCells = oItem.getCells();
                    return aCells.every(function (oCell) {
                        if (oCell instanceof sap.m.Input ||
                            oCell instanceof sap.m.Select ||
                            oCell instanceof sap.m.DateRangeSelection) {
                            return !oCell.getValue();
                        }
                        return true;
                    });
                });
            },
            clearTableInputs: function (oTable) {
                if (!oTable) {
                    return;
                }

                var aItems = oTable.getItems();
                aItems.forEach(function (oItem) {
                    var aCells = oItem.getCells();
                    aCells.forEach(function (oCell) {
                        if (oCell instanceof sap.m.Input || oCell instanceof sap.m.Select || oCell instanceof sap.m.DateRangeSelection) {
                            oCell.setValue("");
                            if (oCell.setSelectedKey) {
                                oCell.setSelectedKey(""); // Clear selected key for Select control
                            }
                        }
                    }, this);
                }, this);
            },
            handleUploadComplete: function (oEvent) {
                var sResponse = oEvent.getParameter("response"),
                    iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
                    sMessage;

                if (sResponse) {
                    sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                    MessageToast.show(sMessage);
                }
            },

            onAddButtonClick: function () {
                var table = this.getView().byId("Qalification");
                var templateRow = this.getView().byId("templateRow");
                var newRow = templateRow.clone();
                var rowCount = table.getItems().length;
                var srNo = rowCount + 1;
                newRow.getCells()[0].setText(srNo.toString());
                table.addItem(newRow);
            },
            onAddButtonClickip: function () {

                var table = this.getView().byId("ip_Details");
                var templateRow = this.getView().byId("templateRowIp");
                var newRow = templateRow.clone();
                var rowCount = table.getItems().length;
                var srNo = rowCount + 1;
                newRow.getCells()[0].setText(srNo.toString());
                table.addItem(newRow);
            },
            handleUploadButtonPress: function (event) {
                // Get the source of the event (the button)
                var button = event.getSource();

                // Get the parent HBox of the button
                var hbox = button.getParent();

                // Get the child controls of the HBox using their IDs
                var fileNameInput = hbox.byId("fileName");
                var fileUploader = hbox.byId("fileUploader");

                // Check if the FileUploader is defined and has selected files
                if (fileUploader && fileUploader.getFocusDomRef() && fileUploader.getFocusDomRef().files.length > 0) {
                    var file = fileUploader.getFocusDomRef().files[0];

                    // Set the value of the "fileName" input to the name of the selected file
                    fileNameInput.setValue(file.name);
                } else {
                    // Handle the case when no file is selected or the FileUploader is not defined
                    fileNameInput.setValue("");
                    // Add any other error handling or feedback as needed
                }
            },
            onSubmit: function () {
                MessageBox.warning("Are you sure you want to submit this information.", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        MessageToast.show("Action selected: " + sAction);
                    }
                });
            },

            toggleFooter: function () {
                var oObjectPageLayout = this.byId("ObjectPageLayout");
                oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
            },
            onGeneratePDF: function () {
                const oObjectPageLayout = this.getView().byId("ObjectPageLayout");
                const oRenderManager = sap.ui.getCore().createRenderManager();
                oRenderManager.render(oObjectPageLayout);
                oRenderManager.flush();
                oRenderManager.destroy();

                const pdfOptions = {
                    filename: "student_registration_form.pdf",
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                };

                // Use html2pdf.js library to generate the PDF
                html2pdf().from(oObjectPageLayout.$().parent().get(0)).set(pdfOptions).save();
            },
        });
    });
