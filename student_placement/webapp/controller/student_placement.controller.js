sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/m/library',
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    'sap/ui/core/BusyIndicator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, mobileLibrary, Export, ExportTypeCSV, BusyIndicator) {
        "use strict";
        var that;
        var urlStorage;
        var oDataModel;
        var URLHelper = mobileLibrary.URLHelper;
        return Controller.extend("studentplacement.controller.student_placement", {
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
                that.listdata = this.getOwnerComponent().getModel("ZODATA_PM_1001_SRV");
                var oViewModel = new sap.ui.model.json.JSONModel({
                    minDate: new Date(2022, 1, 1)
                });
                this.getView().setModel(oViewModel, "viewModel");
                this.readCollageData();
            },
            // handleRouteMatched: function (oEvent) {
            //     //get UI model from component.js
            //     this.oPModel = this.getOwnerComponent().getModel("oPropertyModel");

            //     //get user attributes
            //     this._getUserId();
            // },
            // _getUserId: function () {
            //     $.get("/services/userapi/attributes").done(function (results) {
            //         // sLoginId = results.login_name;
            //         // sLoginType = results.user_type;
            //         sLoginId = '8300894';
            //         sLoginType = 'partner';
            //         this._user();
            //         this.readData();
            //     }.bind(this));
            // },
            // _user: function () {
            //     this.oModel2.mCustomHeaders.loginid = sLoginId;
            //     this.oModel2.mCustomHeaders.logintype = sLoginType;
            // },
            onGoPress: function (oEvent) {
                // debugger
                var collegeInput = this.getView().byId("collegeinput");
                var courseInput = this.getView().byId("courseinput2");
                var yearInput = this.getView().byId("yearinput");
                var studentListTable = this.getView().byId("studentList_table");

                var isCollegeEmpty = !collegeInput.getSelectedKey();
                var isCourseEmpty = !courseInput.getSelectedKeys().length;
                var isYearEmpty = !yearInput.getDateValue();

                var isAnyFieldEmpty = isCollegeEmpty || isCourseEmpty || isYearEmpty;

                studentListTable.setVisible(!isAnyFieldEmpty);

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
                    var yearFilter = new sap.ui.model.Filter("Peryr", sap.ui.model.FilterOperator.EQ, yearInput.getDateValue());
                    filters.push(yearFilter);
                }

                var that = this;
                var listmodel;
                // var listdata = that.getView().getModel(listmodel);

                oDataModel.read("/ZPMIELIGIBLESTSet", {
                    filters: filters,
                    success: function (Data, response) {
                        for (var i = 0; i < Data.results.length; i++) {
                            BusyIndicator.hide();
                            Data.results[i].OrganizationName = that.getView().byId("collegeinput").getSelectedKey();
                            Data.results[i].CourseName = that.getView().byId("courseinput").getSelectedKey();
                            // Data.results[i].yearinput = that.getView().byId("yearinput").getDateValue();
                        }
                        var listmodel = new sap.ui.model.json.JSONModel(Data);
                        that.getView().setModel(listmodel, "listModel");
                        console.log(Data);
                        console.log(response);
                    },
                    error: function (Error) {
                        sap.m.MessageBox.error("Error while expanding");
                    }
                });
            },
            onCollageSelectionChange: function (oEvent) {
                debugger
                var context = this;
                var text = oEvent.mParameters.selectedItem.mProperties.key
                var fil = new sap.ui.model.Filter("OrganizationCode", sap.ui.model.FilterOperator.EQ, text);
                oDataModel.read("/ZDDL_CDS_1001_itemSet", {
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
                        MessageBox.error("error while expanding");

                    }
                });
            },
            readCollageData: function (oEvent) {
                // debugger
                var context = this;
                var OrganizationName;
                var fil = new sap.ui.model.Filter("OrganizationName", "EQ", OrganizationName);
                oDataModel.read("/ZDDL_CDS_1001Set", {
                    filters: [fil],
                    success: function (Data, response) {
                        BusyIndicator.hide();
                        var Data2 = Data
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

                    },
                    error: function (Error) {
                        MessageBox.error("error while expanding");

                    }
                });
            },
            onSendMail: function (oEvent) {
                debugger

                // Get the table reference
                var oTable = this.byId("studentList_table");

                // Get the table model data
                var oModel = oTable.getModel("listModel");
                var aData = oModel.getProperty("/results");

                // Create a new export object
                var oExport = new Export({
                    exportType: new ExportTypeCSV({
                        separatorChar: ";"
                    }),
                    models: oModel,
                    rows: {
                        path: "/results"
                    },
                    columns: [
                        {
                            name: "Collage or Institute",
                            template: {
                                content: "{listModel>OrganizationName}"
                            }
                        },
                        {
                            name: "Study / Course",
                            template: {
                                content: "{listModel>CourseName}"
                            }
                        },
                        {
                            name: "Academic Year",
                            template: {
                                content: "{listModel>Peryr}"
                            }
                        },
                        {
                            name: "Student Number",
                            template: {
                                content: "{listModel>Student12}"
                            }
                        },
                        {
                            name: "Name of Student",
                            template: {
                                content: "{listModel>Vorna}{listModel>Midnm}{listModel>Nachn}"
                            }
                        },
                        {
                            name: "Email sent Data",
                            template: {
                                content: "{listModel>StEmail}"
                            }
                        },
                        {
                            name: "Email Sent by : Placement UserID",
                            template: {
                                content: "{listModel>}"
                            }
                        }

                    ]
                });

                // Trigger the export
                oExport.saveFile().catch(function (oError) {
                    MessageBox.error("Error when exporting data: " + oError);
                });

                /******************Sending email using standard workflow Email Task*****************/

                // thatMaster._userMaster();
                var token = this._fetchToken();
                this._startInstance(token, Object);
            },
            _fetchToken: function () {
                var token;
                $.ajax({
                    url: "/bpmworkflowruntime/rest/v1/xsrf-token",
                    method: "GET",
                    async: false,
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    success: function (result, xhr, data) {
                        token = data.getResponseHeader("X-CSRF-Token");
                    }
                });
                return token;
            },
            _startInstance: function (token, object) {
                var mailBody, subject;
                var arr = [];
                var cDate = new Date();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "dd-MM-yyyy"
                });
                var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "HH:mm a"
                });
                var dateFormatted = dateFormat.format(cDate);
                var dateFormatted1 = dateFormat1.format(cDate);
                var link = "https://flpnwc-oaezgac8ar.dispatcher.ap1.hana.ondemand.com/sites/PreLit#preLitRFM-Display&/view2/" + thatMaster.sTicketNo;
                for (var i = 0; i < thatMaster.data.results.length; i++) {
                    if (object === "A" && thatMaster.data.results[i].ROLE === "RFM" && thatMaster.data.results[i].REGION_CODE === thatMaster.REGION_CODE) {
                        arr.push(thatMaster.data.results[i].EMAIL_ID);
                        mailBody = "Dear User, \n\nYou are assigned Ticket No. " + thatMaster.sTicketNo +
                            " by BM. \nPlease login to the following Pre - Litigation portal link and take necessary action.\n\n" + link +
                            "\n\nBest Regards\nLegal Team\n\n";
                        subject = "Ticket sent for RFM Approval";
                    }
                    /*if (object === "actC") {
                        arr.push(thatMaster.data.results[i].LOGIN_ID);
                        mailBody = "Hi, \n Action is Updated by Branch Manager for Ticket No: " + thatMaster.sTicketNo + " On " + dateFormatted + " at " +
                            dateFormatted1;
                        subject = "Branch Manager Action Updated";
                    }*/
                }
                thatMaster._email = arr;
                $.ajax({
                    url: "/bpmworkflowruntime/rest/v1/workflow-instances",
                    method: "POST",
                    async: false,
                    contentType: "application/json",
                    headers: {
                        "X-CSRF-Token": token
                    },
                    data: JSON.stringify({
                        definitionId: "mailtask",
                        context: {
                            "to": thatMaster._email,
                            // "to": "savan.p@intellectbizware.com",
                            "subject": subject,
                            "body": mailBody
                        }
                    }),
                    success: function (result, xhr, data) {
                        // console.log(data);
                    }
                });
            }

        });
    });
