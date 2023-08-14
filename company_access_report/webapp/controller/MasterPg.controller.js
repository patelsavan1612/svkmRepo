sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/m/library',
    'sap/ui/core/BusyIndicator',
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, mobileLibrary, BusyIndicator, exportLibrary, Spreadsheet, MessageToast) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        var that;
        var urlStorage;
        var oDataModel;
        var URLHelper = mobileLibrary.URLHelper;
        return Controller.extend("companyaccessreport.controller.MasterPg", {
            onInit: function () {
                // debugger
                // BusyIndicator.show(0);
                var context;
                context = this;
                that = this;
                var placementdata = this.getOwnerComponent().getModel("placementdataproperty").getData();
                var placementmodel = new JSONModel(placementdata);
                this.getView().setModel(placementmodel, "cModel");
                oDataModel = this.getOwnerComponent().getModel();
                that.listdata = this.getOwnerComponent().getModel("ZIODATA_PM_1007_SRV");
                var oViewModel = new sap.ui.model.json.JSONModel({
                    minDate: new Date(2022, 1, 1)
                });
                that.onread();
                // that.onReadSH();
                this.getView().setModel(oViewModel, "viewModel");
                this.readCollageData();
            },
            onGoPress: function (oEvent) {
                // debugger
                var that = this;
                BusyIndicator.show(0);

                var collegeInput = this.getView().byId("collegeinput");
                // var courseInput = this.getView().byId("courseinput2");
                // var studentInput = this.getView().byId("studentSapNumber");
                var yearInput = this.getView().byId("yearinput");
                var studentListTable = this.getView().byId("studentList_table1");

                var isCollegeEmpty = !collegeInput.getSelectedKey();
                // var isCourseEmpty = !courseInput.getSelectedKeys().length;
                // var isStudentEmpty = !studentInput.getSelectedKeys().length;
                var isYearEmpty = !yearInput.getDateValue();
                var isstudentListTableEmpty = !studentListTable.getSelectedIndices().length;


                // Check if any filter field is empty
                if (isCollegeEmpty || isYearEmpty) {
                    // Hide the table if any filter is empty
                    studentListTable.setVisible(false);
                    BusyIndicator.hide();
                    // Show a message asking the user to enter values in all filters
                    sap.m.MessageBox.error("Please enter values in all filters.");
                    var oModel = this.getView().getModel("listModel");
                    var obj;
                    oModel.setProperty("/selectedItems", obj);
                    // var oButton = this.byId("sendEmailButton");
                    // oButton.setEnabled(false);

                    return;
                }



                // If all filters have values, proceed with filtering and show the table
                studentListTable.setVisible(true);

                var filters = [];

                if (!isCollegeEmpty) {
                    var collegeFilter = new sap.ui.model.Filter("OrganizationCode", sap.ui.model.FilterOperator.EQ, collegeInput.getSelectedKey());
                    filters.push(collegeFilter);
                }

                // if (!isCourseEmpty) {
                //     var courseFilters = [];
                //     courseInput.getSelectedKeys().forEach(function (course) {
                //         var courseFilter = new sap.ui.model.Filter("ScObjid", sap.ui.model.FilterOperator.EQ, course);
                //         courseFilters.push(courseFilter);
                //     });
                //     var courseFilter = new sap.ui.model.Filter(courseFilters, false);
                //     filters.push(courseFilter);
                // }

                // if (!isStudentEmpty) {
                //     var studentFilters = [];
                //     studentInput.getSelectedKeys().forEach(function (number) {
                //         var studentFilter = new sap.ui.model.Filter("Student12", sap.ui.model.FilterOperator.EQ, number);
                //         studentFilters.push(studentFilter);
                //     });
                //     var studentFilter = new sap.ui.model.Filter(studentFilters, false);
                //     filters.push(studentFilter);
                // }
                if (!isYearEmpty) {
                    var yearFilter = new sap.ui.model.Filter(
                        "Peryr",
                        sap.ui.model.FilterOperator.EQ,
                        yearInput.getDateValue().getFullYear().toString()
                    );
                    filters.push(yearFilter);
                }

                oDataModel.read("/zist_pm_9001Set", {
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

            onread: function () {
                // debugger
                oDataModel.read("/zist_pm_9001Set", {
                    // filters: filters,
                    success: function (Data, response) {
                        BusyIndicator.hide();
                        var listmodel = new sap.ui.model.json.JSONModel(Data);
                        that.getView().setModel(listmodel, "listModel");

                        console.log(Data);
                        console.log(response);
                    },
                    error: function (Error) {
                        BusyIndicator.hide();
                        sap.m.MessageBox.error(JSON.parse(Error.responseText).error.message.value);
                    }
                });
            },
            onReadSH: function () {
                // debugger
                oDataModel.read("/StudentSHSet", {
                    // filters: filters,
                    success: function (Data, response) {
                        BusyIndicator.hide();
                        var listmodel = new sap.ui.model.json.JSONModel(Data);
                        that.getView().setModel(listmodel, "listModel");
                        console.log(Data);
                        console.log(response);
                    },
                    error: function (Error) {
                        BusyIndicator.hide();
                        sap.m.MessageBox.error(JSON.parse(Error.responseText).error.message.value);
                    }

                });

            },

            // onCollageSelectionChange: function (oEvent) {

            //     var context = this;
            //     var text = oEvent.mParameters.selectedItem.mProperties.key
            //     var fil = new sap.ui.model.Filter("OrganizationCode", sap.ui.model.FilterOperator.EQ, text);
            //     oDataModel.read("/CourseSHSet", {
            //         filters: [fil],
            //         success: function (Data, response) {
            //             BusyIndicator.hide();
            //             console.log(Data)
            //             console.log(response)
            //             context.getView().byId("courseinput").setVisible(true)

            //             var resArr2 = [];
            //             var resObj2 = {

            //                 resArr2: []
            //             }
            //             Data.results.filter(function (item) {
            //                 var i = resObj2.resArr2.findIndex(x => (x.CourseName == item.CourseName));
            //                 if (i <= -1) {
            //                     resObj2.resArr2.push(item);
            //                 }
            //                 return null;
            //             });
            //             // console.log(resArr2)
            //             var oModel = new JSONModel(resObj2);
            //             context.getView().setModel(oModel, "classcollegeDatasetcourse");


            //         },
            //         error: function (Error) {
            //             BusyIndicator.hide();
            //             MessageBox.error("error while expanding");

            //         }
            //     });
            // },
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
                        // var Data2 = Data;
                        var Data3 = Data;
                        var Data4 = Data;
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


                        // var resArr2 = [];
                        // var resObj2 = {

                        //     resArr2: []
                        // }
                        // Data2.results.filter(function (item) {
                        //     var i = resObj2.resArr2.findIndex(x => (x.CourseName == item.CourseName));
                        //     if (i <= -1) {
                        //         resObj2.resArr2.push(item);
                        //     }
                        //     return null;
                        // });
                        // // console.log(resArr2)
                        // var oModel = new JSONModel(resObj2);
                        // context.getView().setModel(oModel, "classcollegeDatasetcourse");

                        // var resArr4 = [];
                        // var resObj4 = {

                        //     resArr4: []
                        // }
                        // Data4.results.filter(function (item) {
                        //     var i = resObj4.resArr4.findIndex(x => (x.studentInput == item.studentInput));
                        //     if (i <= -1) {
                        //         resObj4.resArr4.push(item);
                        //     }
                        //     return null;
                        // });
                        // // console.log(resArr2)
                        // var oModel = new JSONModel(resObj4);
                        // context.getView().setModel(oModel, "classStudentDatasetNumber");


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



            onExport: function (oEVent) {

                // debugger;

                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {

                    this._oTable = this.byId('studentList_table1');

                }

                oTable = this._oTable;

                oRowBinding = oTable.getBinding('rows');

                aCols = this.createColumnConfig();



                oSettings = {

                    workbook: {

                        columns: aCols,

                        hierarchyLevel: 'Level',

                        context: {

                            sheetName: 'Student List Report'

                        }

                    },

                    dataSource: oRowBinding,

                    fileName: 'Export.xlsx',

                    worker: false

                };



                oSheet = new Spreadsheet(oSettings);

                oSheet.build().finally(function () {

                    oSheet.destroy();

                });

            },





            createColumnConfig: function () {

                // debugger;

                var aCols = [];
                aCols.push({

                    label: 'Response date',

                    property: 'ResponseDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Submit',

                    property: 'Submit',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Program Name',

                    property: 'ProgramName',

                    type: EdmType.String,

                    width: 30

                });


                aCols.push({

                    label: 'College Name',

                    property: 'CollegeName',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Student Number',

                    property: 'Student12',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Student ID',

                    property: 'Stobjid',

                    type: EdmType.String,

                    width: 30

                });
                // aCols.push({

                //     label: 'College Org Id',

                //     property: 'OObjid',

                //     type: EdmType.String,

                //     width: 30

                // });
                aCols.push({

                    label: 'Course Org Id',

                    property: 'ScObjid',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Acad. Year',

                    property: 'Peryr',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Coded note text',

                    property: 'Codednoteidt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Comment',

                    property: 'CourseName',

                    type: EdmType.String,

                    width: 30

                });

                aCols.push({

                    label: 'First Name',

                    property: "FirstName",

                    type: EdmType.String,

                    width: 12

                });

                aCols.push({

                    label: 'Last Name',

                    property: 'LastName',

                    type: EdmType.String,

                    width: 35

                });
                aCols.push({

                    label: 'Personal E-Mail Address',

                    property: 'Pemail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 1 Name',

                    property: 'Prj1Nme',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Mobile no.',

                    property: 'Mobnumber',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Building no',

                    property: 'Building',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 1 Subject Name',

                    property: 'Prj1Sub',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Floor',

                    property: 'Floor',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 1 Description',

                    property: 'Prj1Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Room Number',

                    property: 'Roomnumber',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 2 Name',

                    property: 'Prj2Nme',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'c/o name',

                    property: 'NameCo',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 2 Subject Name',

                    property: 'Prj2Sub',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Street 5',

                    property: 'Location',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 2 Description',

                    property: 'Prj2Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Street 2',

                    property: 'StrSuppl1',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 3 Name',

                    property: 'Prj3Nme',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Street 3',

                    property: 'StrSuppl2',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 3 Subject Name',

                    property: 'Prj3Sub',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'House Number',

                    property: 'HouseNum1',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 3 Description',

                    property: 'Prj3Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 4 Name',

                    property: 'Prj4Nme',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'District',

                    property: 'City2',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 4 Subject Name',

                    property: 'Prj4Sub',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'City',

                    property: 'City1',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 4 Description',

                    property: 'Prj4Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 5 Name',

                    property: 'Prj5Nme',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Other City',

                    property: 'OthCity',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 5 Subject Name',

                    property: 'Prj5Sub',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Country',

                    property: 'Country',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Postal Code',

                    property: 'Pincode',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project 5 Description',

                    property: 'Prj5Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'SSC Board',

                    property: 'SscBoard',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'SSC State',

                    property: 'SscState',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'SSC School Name',

                    property: 'SscSchool',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'HSC Board',

                    property: 'HscBoard',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'HSC Board State',

                    property: 'HscState',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'HSC College Name',

                    property: 'HscSchool',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DIPLOMA UNIVERSITY',

                    property: 'DiplomaBoard',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DIPLOMA State',

                    property: 'DiplomaState',

                    type: EdmType.String,

                    width: 30

                });

                aCols.push({

                    label: 'Diploma College Name',

                    property: 'DiplomaSchool',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DIPLOMA NAME / SPECIALIZATION',

                    property: 'DiplomaSpecl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE UNIVERSITY',

                    property: 'DegreeBoad',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE UNIVERSITY State',

                    property: 'DegreeState',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Degree College Name',

                    property: 'DegreeSchool',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE SPECIALIZATION',

                    property: 'DegreeSpecli',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation DEGREE UNIVERSITY',

                    property: 'PostDegreeBoad',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation DEGREE UNIVERSITY State',

                    property: 'PstdegState',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Post Graduation College Name',

                    property: 'PostDegreeSchool',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation SPECIALIZATION',

                    property: 'PostDegreeSpecli',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Placement process Participation YES /NO',

                    property: 'Response',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Reason for non participation in placement process',

                    property: 'Remark',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Sem1',

                    property: 'Sem1',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Date of Birth',

                    property: 'Dob',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'SSC Pass date',

                    property: 'SscDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Sem2',

                    property: 'Sem2',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'HSC Pass date',

                    property: 'HscDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Sem3',

                    property: 'Sem3',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Sem4',

                    property: 'Sem4',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'DIPLOMA pass date',

                    property: 'DiplomaDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Sem5',

                    property: 'Sem5',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE Pass date',

                    property: 'DegreeDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Sem6',

                    property: 'Sem6',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation Pass date',

                    property: 'PstdegDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'SSC Total Marks (Out Of)',

                    property: 'SscTot',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Sem7',

                    property: 'Sem7',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Sem8',

                    property: 'Sem8',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'SSC Obtained Marks',

                    property: 'SscObt',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 1 Duration',

                    property: 'Int1Dur',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'SSC (%)',

                    property: 'SscPer',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 1 Company Name',

                    property: 'Int1Org',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'HSC Total Marks (Out Of)',

                    property: 'HscTot',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 1 Responsibilities',

                    property: 'Int1Pst',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'HSC Obtained Marks',

                    property: 'HscObt',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'HSC (%)',

                    property: 'HscPer',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 1 Date',

                    property: 'Int1Yrs',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 1 Job Titile',

                    property: 'Int1Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DIPLOMA Total Marks (Out Of)',

                    property: 'DiplomaTot',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 2 Duration',

                    property: 'Int2Dur',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Diploma Marks Obtained',

                    property: 'DiplomaObt',

                    type: EdmType.Int,

                    width: 30

                });

                aCols.push({

                    label: 'DIPLOMA (%)',

                    property: 'DiplomaPerc',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 2 Company Name',

                    property: 'Int2Org',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE Total Marks (Out Of)',

                    property: 'DegreeTot',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 2 Responsibilities',

                    property: 'Int2Pst',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE Obtained Marks',

                    property: 'DegreeObt',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 2 Date',

                    property: 'Int2Yrs',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE (%)',

                    property: 'DegreePer',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 2 Job Titile',

                    property: 'Int2Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation Total Marks (Out Of)',

                    property: 'PstdegTot',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 3 Duration',

                    property: 'Int3Dur',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation Obtained Marks',

                    property: 'PstdegObt',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 3 Company Name',

                    property: 'Int3Org',

                    type: EdmType.String,

                    width: 30

                });

                aCols.push({

                    label: 'POST Graduation (%)',

                    property: 'PstdegPer',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 3 Responsibilities',

                    property: 'Int3Pst',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'College Code',

                    property: 'OrganizationCode',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 3 Date',

                    property: 'Int3Yrs',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 3 Job Titile',

                    property: 'Int3Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 4 Duration',

                    property: 'Int4Dur',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Course Code',

                    property: 'CourseCode',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Course/Program Name',

                    property: 'ProgamName',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 4 Company Name',

                    property: 'Int4Org',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 4 Responsibilities',

                    property: 'Int4Pst',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 4 Date',

                    property: 'Int4Yrs',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 4 Job Titile',

                    property: 'Int4Dtl',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 5 Duration',

                    property: 'Int5Dur',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 5 Company Name',

                    property: 'Int5Org',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 5 Responsibilities',

                    property: 'Int5Pst',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 5 Date',

                    property: 'Int5Yrs',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 5 Job Titile',

                    property: 'Int5Dtl',

                    type: EdmType.String,

                    width: 30

                });

                aCols.push({

                    label: 'State',

                    property: 'State',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Full Name',

                    property: 'Fullname',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Organization Name',

                    property: 'OrganizationName',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project1 Job Titile',

                    property: 'Proj1Post',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project2 Job Titile',

                    property: 'Proj2Post',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project3 Job Titile',

                    property: 'Proj3Post',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project4 Job Titile',

                    property: 'Proj4Post',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project5 Job Titile',

                    property: 'Proj5Post',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'SSC Passing Date',

                    property: 'SscPassDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'HSC Passing Date',

                    property: 'HscPassDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Diploma passing date',

                    property: 'DiplomaPassDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Degree Passing date',

                    property: 'DegreePassDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Post Graduation passing date',

                    property: 'PostDegreePassDate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership1 Start date',

                    property: 'Int1Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership1 End date',

                    property: 'Int1Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership2 Start date',

                    property: 'Int2Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership2 End date',

                    property: 'Int2Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership3 Start date',

                    property: 'Int3Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership3 End date',

                    property: 'Int3Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership4 Start date',

                    property: 'Int4Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership4 End date',

                    property: 'Int4Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership5 Start date',

                    property: 'Int5Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Intership5 End date',

                    property: 'Int5Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project1 Start date',

                    property: 'Proj1Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project1 End date',

                    property: 'Proj1Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project2 Start date',

                    property: 'Proj2Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project2 End date',

                    property: 'Proj2Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project3 Start date',

                    property: 'Proj3Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project3 End date',

                    property: 'Proj3Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project4 Start date',

                    property: 'Proj4Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project4 End date',

                    property: 'Proj4Edate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project5 Start date',

                    property: 'Proj5Sdate',

                    type: EdmType.Date,

                    width: 30

                });
                aCols.push({

                    label: 'Project5 End date',

                    property: 'Proj5Edate',

                    type: EdmType.Date,

                    width: 30

                });


                aCols.push({

                    label: 'Project1 Responsibilities',

                    property: 'Proj1Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project1 Company Name',

                    property: 'Proj1Butxt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project2 Responsibilities',

                    property: 'Proj2Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project2 Company Name',

                    property: 'Proj2Butxt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project3 Responsibilities',

                    property: 'Proj3Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project3 Company Name',

                    property: 'Proj3Butxt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project4 Responsibilities',

                    property: 'Proj4Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project4 Company Name',

                    property: 'Proj4Butxt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project5 Responsibilities',

                    property: 'Proj5Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Project5 Company Name',

                    property: 'Proj5Butxt',

                    type: EdmType.String,

                    width: 30

                });

                return aCols;

            }
        });
    });
