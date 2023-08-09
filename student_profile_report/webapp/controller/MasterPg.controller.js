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
        return Controller.extend("studentprofilereport.controller.MasterPg", {
            onInit: function () {
                // debugger
                BusyIndicator.show(0);
                var context;
                context = this;
                that = this;
                var placementdata = this.getOwnerComponent().getModel("placementdataproperty").getData();
                var placementmodel = new JSONModel(placementdata);
                this.getView().setModel(placementmodel, "cModel");
                oDataModel = this.getOwnerComponent().getModel();
                that.listdata = this.getOwnerComponent().getModel("ZIODATA_PM_1005_SRV");
                var oViewModel = new sap.ui.model.json.JSONModel({
                    minDate: new Date(2022, 1, 1)
                });
                that.onread();
                this.getView().setModel(oViewModel, "viewModel");
                this.readCollageData();
            },


            onGoPress: function (oEvent) {
                // debugger
                var that = this;
                BusyIndicator.show(0);

                var collegeInput = this.getView().byId("collegeinput");
                var courseInput = this.getView().byId("courseinput2");
                var studentInput = this.getView().byId("studentSapNumber");
                var yearInput = this.getView().byId("yearinput");
                var studentListTable = this.getView().byId("studentList_table1");

                var isCollegeEmpty = !collegeInput.getSelectedKey();
                var isCourseEmpty = !courseInput.getSelectedKeys().length;
                var isStudentEmpty = !studentInput.getSelectedKeys().length;
                var isYearEmpty = !yearInput.getDateValue();
                var isstudentListTableEmpty = !studentListTable.getSelectedIndices().length;


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
                    // var oButton = this.byId("sendEmailButton");
                    // oButton.setEnabled(false);

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

                if (!isStudentEmpty) {
                    var studentFilters = [];
                    studentInput.getSelectedKeys().forEach(function (number) {
                        var studentFilter = new sap.ui.model.Filter("Student12", sap.ui.model.FilterOperator.EQ, number);
                        studentFilters.push(studentFilter);
                    });
                    var studentFilter = new sap.ui.model.Filter(studentFilters, false);
                    filters.push(studentFilter);
                }
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

                        var resArr4 = [];
                        var resObj4 = {

                            resArr4: []
                        }
                        Data4.results.filter(function (item) {
                            var i = resObj4.resArr4.findIndex(x => (x.studentInput == item.studentInput));
                            if (i <= -1) {
                                resObj4.resArr4.push(item);
                            }
                            return null;
                        });
                        // console.log(resArr2)
                        var oModel = new JSONModel(resObj4);
                        context.getView().setModel(oModel, "classStudentDatasetNumber");


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

                    label: 'Full Name',

                    property: 'Fullname',

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

                    label: 'College Org Id',

                    property: 'OObjid',

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

                    label: 'Course Org Id',

                    property: 'ScObjid',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 1 Job Titile',

                    property: 'Int1Post',

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

                    label: 'Internship 2 Job Titile',

                    property: 'Int2Post',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 3 Job Titile',

                    property: 'Int3Post',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 4 Job Titile',

                    property: 'Int4Post',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 5 Job Titile',

                    property: 'Int5Post',

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

                    label: 'SSC Total Marks (Out Of)',

                    property: 'SscTotMarks',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'SSC Obtained Marks',

                    property: 'SscMarksObt',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'SSC (%)',

                    property: 'SscPerc',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'HSC Total Marks (Out Of)',

                    property: 'HscTotMarks',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'HSC Obtained Marks',

                    property: 'HscMarksObt',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'HSC (%)',

                    property: 'HscPerc',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'DIPLOMA Total Marks (Out Of)',

                    property: 'DiplomaTotMarks',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'Diploma Marks Obtained',

                    property: 'DiplomaMarksObt',

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

                    label: 'DEGREE Total Marks (Out Of)',

                    property: 'DegreeTotMarks',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE Obtained Marks',

                    property: 'DegreeMarksObt',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'DEGREE (%)',

                    property: 'DegreePerc',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation Total Marks (Out Of)',

                    property: 'PostDegreeTotMarks',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation Obtained Marks',

                    property: 'PostDegreeMarksObt',

                    type: EdmType.Int,

                    width: 30

                });
                aCols.push({

                    label: 'POST Graduation (%)',

                    property: 'PostDegreePerc',

                    type: EdmType.Int,

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

                    label: 'Personal E-Mail Address',

                    property: 'Pemail',

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

                    label: 'Postal Code',

                    property: 'Pincode',

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

                    label: 'SSC Board',

                    property: 'SscBoad',

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

                    property: 'DiplomaBoad',

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

                    property: 'DiplomaSpecli',

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

                    label: 'Internship 1 Responsibilities',

                    property: 'Int1Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 1 Company Name',

                    property: 'Int1Butxt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 2 Responsibilities',

                    property: 'Int2Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 2 Company Name',

                    property: 'Int2Butxt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 3 Responsibilities',

                    property: 'Int3Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 3 Company Name',

                    property: 'Int3Butxt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 4 Responsibilities',

                    property: 'Int4Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 4 Company Name',

                    property: 'Int4Butxt',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 5 Responsibilities',

                    property: 'Int5Detail',

                    type: EdmType.String,

                    width: 30

                });
                aCols.push({

                    label: 'Internship 5 Company Name',

                    property: 'Int5Butxt',

                    type: EdmType.String,

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
