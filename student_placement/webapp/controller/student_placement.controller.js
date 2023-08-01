sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/m/library',
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    'sap/ui/core/BusyIndicator',
    'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, mobileLibrary, Export, ExportTypeCSV, BusyIndicator, MessageToast) {
        "use strict";
        var that;
        var urlStorage;
        var oDataModel;
        var URLHelper = mobileLibrary.URLHelper;
        return Controller.extend("studentplacement.controller.student_placement", {
            onInit: function () {
                debugger
                BusyIndicator.show(0);
                var context;
                context = this;
                that = this;
                var placementdata = this.getOwnerComponent().getModel("placementdataproperty").getData();
                var placementmodel = new JSONModel(placementdata);
                this.getView().setModel(placementmodel, "cModel");
                oDataModel = this.getOwnerComponent().getModel();
                that.listdata = this.getOwnerComponent().getModel("ZODATA_PM_1001_SRV");
                var oViewModel = new sap.ui.model.json.JSONModel({
                    minDate: new Date(2022, 1, 1)
                });
                this.getView().setModel(oViewModel, "viewModel");
                this.readCollageData();
            },

            onGoPress: function (oEvent) {

                var that = this;
                BusyIndicator.show(0);
                var collegeInput = this.getView().byId("collegeinput");
                var courseInput = this.getView().byId("courseinput2");
                var yearInput = this.getView().byId("yearinput");
                var studentListTable = this.getView().byId("studentList_table");

                var isCollegeEmpty = !collegeInput.getSelectedKey();
                var isCourseEmpty = !courseInput.getSelectedKeys().length;
                var isYearEmpty = !yearInput.getDateValue();
                var isstudentListTableEmpty = !studentListTable.getSelectedItems().length;


                // Check if any filter field is empty
                if (isCollegeEmpty || isCourseEmpty || isYearEmpty) {
                    // Hide the table if any filter is empty
                    studentListTable.setVisible(false);
                    BusyIndicator.hide();
                    // Show a message asking the user to enter values in all filters
                    sap.m.MessageBox.error("Please enter values in all filters.");
                    var oModel = this.getView().getModel("listModel");
                    var obj;
                    oModel.setProperty("/selectedItems", obj);
                    var oButton = this.byId("sendEmailButton");
                    oButton.setEnabled(false);

                    return;
                }



                // If all filters have values, proceed with filtering and show the table
                studentListTable.setVisible(true);

                var filters = [];

                if (!isCollegeEmpty) {
                    var collegeFilter = new sap.ui.model.Filter("OObjid", sap.ui.model.FilterOperator.EQ, collegeInput.getSelectedKey());
                    filters.push(collegeFilter);
                }

                if (!isCourseEmpty) {
                    var courseFilters = [];
                    courseInput.getSelectedKeys().forEach(function (course) {
                        var courseFilter = new sap.ui.model.Filter("ScObjid", sap.ui.model.FilterOperator.EQ, course);
                        courseFilters.push(courseFilter);
                    });
                    var courseFilter = new sap.ui.model.Filter(courseFilters, false);
                    filters.push(courseFilter);
                }

                if (!isYearEmpty) {
                    var yearFilter = new sap.ui.model.Filter(
                        "Peryr",
                        sap.ui.model.FilterOperator.EQ,
                        yearInput.getDateValue().getFullYear().toString()
                    );
                    filters.push(yearFilter);
                }

                oDataModel.read("/StudentSet", {
                    filters: filters,
                    success: function (Data, response) {
                        BusyIndicator.hide();
                        var listmodel = new sap.ui.model.json.JSONModel(Data);
                        that.getView().setModel(listmodel, "listModel");

                        console.log(Data);
                        console.log(response);
                    },
                    error: function (Error) {
                        BusyIndicator.hide();
                        sap.m.MessageBox.error("Error while expanding");
                    }
                });
            },

            onCollageSelectionChange: function (oEvent) {

                var context = this;
                var text = oEvent.mParameters.selectedItem.mProperties.key
                var fil = new sap.ui.model.Filter("OrganizationCode", sap.ui.model.FilterOperator.EQ, text);
                oDataModel.read("/CourseSHSet", {
                    filters: [fil],
                    success: function (Data, response) {
                        BusyIndicator.hide();
                        console.log(Data)
                        console.log(response)
                        context.getView().byId("courseinput").setVisible(true)

                        var resArr2 = [];
                        var resObj2 = {

                            resArr2: []
                        }
                        Data.results.filter(function (item) {
                            var i = resObj2.resArr2.findIndex(x => (x.CourseName == item.CourseName));
                            if (i <= -1) {
                                resObj2.resArr2.push(item);
                            }
                            return null;
                        });
                        // console.log(resArr2)
                        var oModel = new JSONModel(resObj2);
                        context.getView().setModel(oModel, "classcollegeDatasetcourse");

                    },
                    error: function (Error) {
                        BusyIndicator.hide();
                        MessageBox.error("error while expanding");

                    }
                });
            },
            readCollageData: function (oEvent) {
                BusyIndicator.show(0);
                var context = this;
                var OrganizationName;
                var fil = new sap.ui.model.Filter("OrganizationName", "EQ", OrganizationName);
                // var filcours = new sap.ui.model.Filter("CourseName", "EQ", CourseName);
                oDataModel.read("/CollageSHSet", {
                    filters: [fil],
                    success: function (Data, response) {
                        BusyIndicator.hide();
                        var Data2 = Data;
                        var Data3 = Data;
                        var oModel = new JSONModel(Data);
                        context.getView().setModel(oModel, "classcollegeData");
                        that.getView().byId("collegeinput").setSelectedKey();
                        var resArr = [];
                        var resObj = {

                            resArr: []
                        }
                        Data.results.filter(function (item) {
                            var i = resObj.resArr.findIndex(x => (x.OrganizationName == item.OrganizationName));
                            if (i <= -1) {
                                resObj.resArr.push(item);
                            }
                            return null;
                        });
                        // console.log(resArr)
                        var oModel = new JSONModel(resObj);
                        context.getView().setModel(oModel, "classcollegeDataset");


                        var resArr2 = [];
                        var resObj2 = {

                            resArr2: []
                        }
                        Data2.results.filter(function (item) {
                            var i = resObj2.resArr2.findIndex(x => (x.CourseName == item.CourseName));
                            if (i <= -1) {
                                resObj2.resArr2.push(item);
                            }
                            return null;
                        });
                        // console.log(resArr2)
                        var oModel = new JSONModel(resObj2);
                        context.getView().setModel(oModel, "classcollegeDatasetcourse");


                        var resArr3 = [];
                        var resObj3 = {

                            resArr3: []
                        }
                        Data3.results.filter(function (item) {
                            var i = resObj3.resArr3.findIndex(x => (x.yearInput == item.yearInput));
                            if (i <= -1) {
                                resObj3.resArr3.push(item);
                            }
                            return null;
                        });
                        // console.log(resArr3)
                        var oModel = new JSONModel(resObj3);
                        context.getView().setModel(oModel, "classcollegeDatasetyears");


                    },
                    error: function (Error) {
                        BusyIndicator.hide();
                        MessageBox.error("error while expanding");

                    }
                });
            },


            onSelectionChange: function (oEvent) {

                var oTable = oEvent.getSource();
                var aSelectedItems = oTable.getSelectedItems();

                // Store the selected items in the model
                var oModel = this.getView().getModel("listModel");
                var aSelectedData = [];
                var obj;

                if (aSelectedItems.length > 0) {
                    obj = Object.assign({}, aSelectedItems[0].getBindingContext("listModel").getObject());
                    obj.NavStudent = [];

                    for (var i = 0; i < aSelectedItems.length; i++) {
                        var oContext = aSelectedItems[i].getBindingContext("listModel");
                        var oSelectedData = oContext.getObject();
                        delete oSelectedData.__metadata;
                        delete oSelectedData.NavStudent;
                        obj.NavStudent.push(oSelectedData);
                    }
                };
                MessageToast.show("seleceted Student " + aSelectedItems.length.toString());
                oModel.setProperty("/selectedItems", obj);


                var oButton = this.byId("sendEmailButton");
                if (aSelectedItems.length > 0) {
                    oButton.setEnabled(true);
                } else {
                    oButton.setEnabled(false);
                };
            },


            onSendMail: function (oEvent) {
                BusyIndicator.show(0);
                var oModel = this.getView().getModel("listModel");
                var oStudentList = oModel.getProperty("/selectedItems");

                if (!oStudentList) {
                    // No items are selected, handle this scenario (show an error message, etc.)
                    MessageToast.show("No Student Seleceted");
                    BusyIndicator.hide();
                    return;
                }

                oDataModel.create("/StudentSet", oStudentList, {
                    success: function (Data, response) {
                        BusyIndicator.hide();
                        MessageBox.success("Email Has been Sent");
                    },
                    error: function (Error) {
                        BusyIndicator.hide();
                        MessageBox.error("error while expanding");
                    }
                });
            }

        });
    });
