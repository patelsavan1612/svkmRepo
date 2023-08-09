sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/BusyIndicator',
    'sap/m/ColumnListItem',
    'sap/m/Input',
    "sap/base/util/deepExtend",
    'sap/m/Text',
    "sap/ui/core/Item",
    "studentregistrationform/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, JSONModel, BusyIndicator, ColumnListItem, Input, deepExtend, Text, Item, formatter) {
        "use strict";
        var that;
        var oDataModel;
        var bIsEditable = true;
        var oTable
        var ID
        var sUrl;
        var Content;
        var fileName;
        var fileType;
        var Attachments;
        var basePlusASCII
        var convert
        var Sno
        var EDate
        var SDate
        var streguid
        var index,index1,index2
        
        return Controller.extend("studentregistrationform.controller.student_registration_form", {
            formatter: formatter,
            onInit: function () {
               
                Attachments = {
                    results: []
                };
                var context;
                context = this;
                that = this;
                var studentdata = this.getOwnerComponent().getModel("viewModel").getData();
                var studentmodel = new JSONModel(studentdata);
                this.getView().setModel(studentmodel, "cModel");
                oDataModel = this.getOwnerComponent().getModel();
                this.readNew();

                this.oPModel = this.getOwnerComponent().getModel("viewModel");

                that.listdata = this.getOwnerComponent().getModel("");
                // this.onDataSave();
                // this.readStudentRegistrationData();
                // this. = this.byId("Qalification");
                // this.oInternshioQualificationTablepTable = this.byId("ip_Details");
                // this.attachInputChangeEventListeners(this.oQualificationTable);
                // this.attachInputChangeEventListeners(this.oInternshipTable);
                // this.toggleFooterVisibility();
                // this.setTableEditable(true);

            },
            // After rejecting this function will get perform
            _routing: function () {
               
                studentregistrationform.ind2 = "X";
                that.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
                    oShellService.setBackNavigation(function () {
                       
                        if (studentregistrationform.ind2 === "X") {
                            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                            var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                                target: {
                                    semanticObject: "",
                                    action: ""
                                }
                            })) || "";
                            oCrossAppNavigator.toExternal({
                                target: {
                                    shellHash: hash
                                }
                            });
                        } else {
                            window.history.go(-1);
                        }
                    });
                });
            },

            // First this function will get call
            readNew: function () {
               
                BusyIndicator.show(0);
                var context = this
                oDataModel.read("/StatusSet", {
                    // filters: filters,
                    success: function (Data, response) {
                       
                        BusyIndicator.hide();
                        var oModel = new JSONModel(Data);
                        context.formSet();
                        Sno = Data.results[0].Response
                        if (Data.results[0].Response == "Yes") {
                            context.FormRead();
                        }
                        else if (Data.results[0].Response == "No" || Data.results[0].Response == "") {
                            // context.addRowQuali();
                            // context.addRowInter();
                            // context.addRowActi();
                            context.openDialog();

                        }
                    },
                    error: function (Error) {
                        
                        BusyIndicator.hide();
                        MessageBox.error(JSON.parse(Error.responseText).error.message.value)
                    }
                });
            },
            // onGeneratePDF: function () {
            //     this.openDialog();
            // },

            // In Success function of readNew function this function is getting called
            openDialog: function () {
               
                if (!this.oDialog3) {
                    this.oDialog3 = sap.ui.xmlfragment("studentregistrationform.fragment.confirmation", this);   //fragment link("")
                    this.getView().addDependent(this.oDialog3);
                }
                this.oDialog3.open();
                if (Sno == "No") {
                    sap.ui.getCore().byId("otext").setText("You have rejected the form erliear, do you wish to continue?");
                } else if (Sno == "") {
                    sap.ui.getCore().byId("otext").setText("Do you want to fill registration form");
                }

                this.oDialog4.close(); 
            },
            
            //  if user click on reject button this function will get called
            regectfrag: function () {
                this.openDialog1();
            },

            openDialog1: function () {

                if (!this.oDialog4) {
                    this.oDialog4 = sap.ui.xmlfragment("studentregistrationform.fragment.reason", this);   //fragment link("")
                    this.getView().addDependent(this.oDialog4);
                }
                this.oDialog4.open();
                this.oDialog3.close(); 
            },

            // After filling Rejection Reason user will click on submit button & this function will getcalled
            NavHome: function () {
                BusyIndicator.show(0);
                var context = this
                if (sap.ui.getCore().byId("oArea").getValue() == "") {
                    BusyIndicator.hide();
                    MessageBox.error("Please Fill Your Reason")
                }
                else {
                    var Reason = sap.ui.getCore().byId("oArea").getValue()
                    var payload = {
                        "Stobjid": ID,
                        "Response": "No",
                        "Remark": Reason

                    }
                    oDataModel.create("/StatusSet", payload, {
                        PUT: "POST",
                        success: function (Data, oResponse) {
                           
                            BusyIndicator.hide();
                            context.oDialog4.close();
                            context._routing();
                        },
                        error: function (Error) {
                            BusyIndicator.hide();
                            MessageBox.error(JSON.parse(Error.responseText).error.message.value)
                        }
                    })
                }
            },

            // In Success function of readNew function this function is getting called to get Stobjid
            formSet: function () {
               
                oDataModel.read("/FormSet", {
                    // filters: filters,
                    success: function (Data, response) {
                       
                        BusyIndicator.hide();
                        var oModel = new JSONModel(Data);
                        ID = Data.results[0].Stobjid
                        // context.getView().setModel(oModel, "StudentDataset");
                        // context.openDialog();
                    },
                    error: function (Error) {
                        ;
                        BusyIndicator.hide();
                        MessageBox.error(JSON.parse(Error.responseText).error.message.value)

                    }
                });

            },
            
            // After clicking on accept button this function will get called
            onAccept: function () {
               
                BusyIndicator.show(0);
                var context = this
                this.oDialog3.close();

                var payload = {
                    "Stobjid": ID,
                    "Response": "Yes",
                    "Remark": ""

                }
                oDataModel.create("/StatusSet", payload, {
                    PUT: "POST",
                    success: function (Data, oResponse) {
                       
                        BusyIndicator.hide();
                        context.FormRead();
                    },
                    error: function (Error) {

                        BusyIndicator.hide();
                        MessageBox.error(JSON.parse(Error.responseText).error.message.value)
                    }
                })


            },

            // This function gets 2 times call for first time if user select accept button in success function of that it will get called
            //  2nd time if user already accepted in  the messeagebox the in success function ReadNew function it will get called
            FormRead: function () {
                BusyIndicator.show(0);
                var context = this
                oDataModel.read("/FormSet", {
                    // filters: filters,
                    urlParameters: {
                        $expand: "NavFormToIntern,NavFormToCurr,NavFormToQualf"
                    },
                    success: function (Data, response) {
                       
                        BusyIndicator.hide();
                        
                        streguid = Data.results[0].StregGuid

                        var oModel = new JSONModel(Data);
                        context.getView().setModel(oModel, "StudentDataset");

                        var oModel1 = new JSONModel(Data.results[0].NavFormToQualf);
                        context.getView().setModel(oModel1, "NavtoQuali");

                        var oModel2 = new JSONModel(Data.results[0].NavFormToIntern);
                        context.getView().setModel(oModel2, "NavtoIntern");

                        var oModel3 = new JSONModel(Data.results[0].NavFormToCurr);
                        context.getView().setModel(oModel3, "NavtoCurr");

                        // var test = Data.results[0].NavFormToInt.results
                        // for (var i = 0; i < test.length; i++) {
                        //     var oItems = context.getView().byId("ip_Details").getItems();

                        //     if (Data.results[0].NavFormToInt.results[i].Type == "1") {

                        //         oItems[i].getCells()[0].setSelectedKey("1")
                        //     } else {
                        //         oItems[i].getCells()[0].setSelectedKey("2")
                        //     }
                        // }

                        if (Data.results[0].Submit == "X") {
                            context.oPModel.setProperty("/btnEnable", false);
                        } else {
                            context.oPModel.setProperty("/btnEnable", true);
                        }
                        // context.openDialog();
                    },
                    error: function (Error) {
                       
                        BusyIndicator.hide();
                        MessageBox.error(JSON.parse(Error.responseText).error.message.value)

                    }
                });
            },

           
            // this function get called after we do check in check box
            onSelect: function (oEvent) {
               
                var oncheck = oEvent.getSource().getSelected()
                if (oncheck == true) {
                    this.getView().byId("idSubmit").setEnabled(true)
                } else {
                    this.getView().byId("idSubmit").setEnabled(false)
                }
            },

            
            onAddButtonClick: function () {

                var table = this.getView().byId("Qalification");
                var templateRow = this.getView().byId("templateRow");
                var newRow = templateRow.clone();
                var rowCount = table.getItems().length;
                var srNo = rowCount + 1;

                // Set the text for the first cell to the serial number (srNo)
                newRow.getCells()[0].setText(srNo.toString());

                // Clear the content of the other cells in the new row (assuming they are sap.m.Input or sap.m.TextArea controls)
                for (var i = 1; i < newRow.getCells().length; i++) {
                    var cell = newRow.getCells()[i];
                    if (cell instanceof sap.m.Input || cell instanceof sap.m.TextArea || cell.mProperties.value != "") {
                        cell.setValue(""); // Set the value of Input and TextArea controls to an empty string

                    }
                }

                table.addItem(newRow);
            },

            // Delete for Qualification
            DeleteDataQua: function (oEvent) {
               
                var table = this.getView().byId("Qalification");
                table.removeItem(oEvent.getSource().getParent());
            },

            // Delete for Internship
            DeleteDataInter: function (oEvent) {
               
                var table = this.getView().byId("ip_Details");
                table.removeItem(oEvent.getSource().getParent());
            },

            //  Delete for Activity
            DeleteDataActi: function (oEvent) {
               
                var table = this.getView().byId("activity");
                table.removeItem(oEvent.getSource().getParent());
            },


            handleChange: function (oEvent) {
               
                SDate = oEvent.getParameter('from')
                EDate = oEvent.getParameter('to')
            },

            onSubmit: function () {
               

                BusyIndicator.show(0);
                // if(this.getView().byId("id_type").getSelectedKey()==1){

                // }
                // else if(this.getView().byId("id_type").getSelectedKey()==2){

                // }
                var context = this
                var table = this.getView().byId("ip_Details");
                var templateRow = this.getView().byId("templateRowIp");
                var obj = {}
                var oModel = this.getView().getModel("StudentDataset").getData().results[0]
                oModel.Submit = "X";
                delete oModel.__metadata;
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-ddTHH:mm:ss" });
                for (var i = 0; i < table.getItems().length; i++) {

                    // obj.Posnr = i+1
                    obj.Type = table.getItems()[i].mAggregations.cells[0].mProperties.key
                    obj.Detail = table.getItems()[i].mAggregations.cells[1].mProperties.value

                    obj.Butxt = table.getItems()[i].mAggregations.cells[2].mProperties.value

                    var SDate = table.getItems()[i].mAggregations.cells[3].mProperties.value

                    var oDate = new Date(SDate)
                    var eDate = new Date(EDate)
                    var dateFormatted = dateFormat.format(oDate)
                    // var EnddateFormatted = dateFormat.format(eDate)

                    obj.SDate = dateFormatted
                    // obj.EDate = EnddateFormatted
                    // obj.EDate = ""

                    obj.ManagEmail = table.getItems()[i].mAggregations.cells[4].mProperties.value

                    obj.Post = table.getItems()[i].mAggregations.cells[5].mProperties.value

                    obj.HighEdu = table.getItems()[i].mAggregations.cells[6].mProperties.value

                    obj.Filename = table.getItems()[i].mAggregations.cells[8].mProperties.text


                    oModel.NavFormToInt.results.push(obj)
                    var obj = {}
                }




                oDataModel.create("/FormSet", oModel, {
                    PUT: "POST",
                    success: function (Data, oResponse) {
                       
                        BusyIndicator.hide();
                        // context.FormRead();

                    },
                    error: function (Error) {
                       
                        BusyIndicator.hide();
                        MessageBox.error(JSON.parse(Error.responseText).error.message.value)
                    }
                })
            },

            onPosting: function (oEvent) {
                // var validFlag = this.onQvalidation();
                // var validFlag1 = this.onvalidation();
                // var validFlag2 = this.onAvalidation();

                // if(validFlag === true && validFlag1 === true && validFlag2 === true) {
                BusyIndicator.show(0);
                var that = this;
                var oTable = that.getView().byId("Qalification");
                var oTable1 = that.getView().byId("ip_Details");
                var oTable2 = that.getView().byId("activity");
                var payload1 = this.getView().getModel("StudentDataset").getData();

                if (oEvent.getSource().getId().includes("Submit")) {
                    payload1.results[0].Submit = "X";
                } else {
                    payload1.results[0].Submit = "";
                }
                delete payload1.results[0].__metadata;

                var oItems = oTable.getItems();
                var oItems1 = oTable1.getItems();
                var oItems2 = oTable2.getItems();
                var selectItems = {}, selectItems1 = {}, selectItems2 = {};
                var aFinalItemsArr = [], aFinalItemsArr1 = [], aFinalItemsArr2 = [];
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-ddTHH:mm:ss" });
                for (var i = 0; i < oItems.length; i++) {
                    //
                    // selectItems = oItems[i].getBindingContext("NavtoQuali").getObject();
                    
                    // if (selectItems.__metadata) delete selectItems.__metadata;
                    selectItems.QualType = oItems[i].getCells()[0].getSelectedKey();
                    selectItems.QualName = oItems[i].getCells()[1].getValue();
                    selectItems.InstOrg = oItems[i].getCells()[2].getValue();
                    selectItems.Begda = dateFormat.format(oItems[i].getCells()[3].getDateValue());
                    selectItems.Endda = dateFormat.format(oItems[i].getCells()[4].getDateValue());
                    selectItems.Document = "";

                    selectItems.StregGuid =streguid;
                    selectItems.QiType = "";
                    selectItems.Srno = "";
                    selectItems.QualName = "";
                    selectItems.QualClass = "";
                    selectItems.QualPercentage = null;
                    selectItems.QualCgpa = null;
                    selectItems.Duration = "";


                    aFinalItemsArr.push(selectItems);
                    selectItems={}
                    
                    

                }

                for (var i = 0; i < oItems1.length; i++) {
                    
                
                    selectItems1.QualType = oItems1[i].getCells()[0].getSelectedKey();
                    selectItems1.QualName = oItems1[i].getCells()[1].getValue();
                    selectItems1.InstOrg = oItems1[i].getCells()[2].getValue();
                    selectItems1.Begda = dateFormat.format(oItems1[i].getCells()[3].getDateValue());
                    selectItems1.Endda = dateFormat.format(oItems1[i].getCells()[4].getDateValue());
                    selectItems1.Duration = "";
                    selectItems1.Document = "";
                    selectItems1.StregGuid = streguid;
                    selectItems1.QiType = "";
                    selectItems1.Srno = "";
                    selectItems1.QualClass = "";
                    selectItems1.QualPercentage = null;
                    selectItems1.QualCgpa = null;


                    aFinalItemsArr1.push(selectItems1);

                    selectItems1={}

                }

                for (var i = 0; i < oItems2.length; i++) {
                    //

                    selectItems2.StregGuid = streguid;
                    selectItems2.AcType = "";
                    selectItems2.Srno = "";
                    selectItems2.Text = oItems2[i].getCells()[0].getValue();
                    selectItems2.Document = "";

                    aFinalItemsArr2.push(selectItems2);
                    selectItems2 ={}
                }
               
                payload1.results[0].NavFormToQualf = aFinalItemsArr;
                payload1.results[0].NavFormToIntern = aFinalItemsArr1;
                payload1.results[0].NavFormToCurr = aFinalItemsArr2;
               



                oDataModel.create("/FormSet", payload1.results[0], {
                    PUT: "POST",
                    async: true,
                    success: function (Data, oResponse) {
                       
                        BusyIndicator.hide();
                        if (that.getView().byId("idDraft").getText() == "Draft") {
                            MessageToast.show("Draft Saved Successfully");
                        } else {

                            MessageBox.show("Registration Form Submitted Successfully", {

                                icon: MessageBox.Icon.SUCCESS,

                                title: "SUCCESS",

                                actions: [MessageBox.Action.OK],

                                emphasizedAction: MessageBox.Action.OK,

                                onClose: function (oAction) {

                                    if (oAction === "OK") {

                                        that.FormRead();
                                    }
                                }

                            });
                        }
                    },
                    error: function (Error) {
                       
                        BusyIndicator.hide();
                        MessageBox.error(JSON.parse(Error.responseText).error.message.value)
                    }
                })

            // }

            },

            // Adding Rows in Qualification
            addRowQuali: function () {
               
                BusyIndicator.show(0);
                var that = this;
                var oTable = that.getView().byId("Qalification");
                var payload1 = this.getView().getModel("StudentDataset").getData();

                payload1.results[0].Submit = "";

                delete payload1.results[0].__metadata;
                delete payload1.results[0].NavFormToIntern;
                delete payload1.results[0].NavFormToCurr;

                var oItems = oTable.getItems();
                var selectItems = {};
                var aFinalItemsArr = [];
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-ddTHH:mm:ss"});
                if (oItems.length != 0 || oItems.length != "") {
                    for (var i = 0; i < oItems.length; i++) {

                        if (oItems[i].getCells()[0].getSelectedKey() != "" || oItems[i].getCells()[1].getValue() != "" || oItems[i].getCells()[2].getValue() != "" || oItems[i].getCells()[3].getValue() != ""){
                            
                            selectItems.QualType = oItems[i].getCells()[0].getSelectedKey();
                            selectItems.QualName = oItems[i].getCells()[1].getValue();
                        selectItems.InstOrg = oItems[i].getCells()[2].getValue();
                        selectItems.Begda = dateFormat.format(oItems[i].getCells()[3].getDateValue());
                        selectItems.Endda = dateFormat.format(oItems[i].getCells()[4].getDateValue());
                        selectItems.Document = "";
    
                        selectItems.StregGuid = streguid;
                        selectItems.Srno = "";
                        selectItems.QiType = ""
                        selectItems.QualClass = "";
                        selectItems.QualPercentage = null;
                        selectItems.QualCgpa = null;
                        selectItems.Duration = "";
    
    
                        aFinalItemsArr.push(selectItems);
                        selectItems={}
                        }
    
                    }
                    payload1.results[0].NavFormToQualf = aFinalItemsArr;

                    BusyIndicator.hide();
                    
                    oDataModel.create("/FormSet", payload1.results[0], {
                        PUT: "POST",
                        async: true,
                        success: function (Data, oResponse) {
                           
                            BusyIndicator.hide();
                            MessageToast.show("Draft Saved Successfully")
                        },
                        error: function (Error) {
                           
                            BusyIndicator.hide();
                            MessageBox.error(JSON.parse(Error.responseText).error.message.value)
                        }
                    })

                }
                BusyIndicator.hide();
                var tablId = that.getView().byId("Qalification");
               
                var oComboBox = new sap.m.ComboBox(
                    {
                        items: [
                            new sap.ui.core.Item({
                                key: "1",
                                text: "Degree"
                            }),
                            new sap.ui.core.Item({
                                key: "2",
                                text: "Diploma"
                            }),
                            new sap.ui.core.Item({
                                key: "3",
                                text: "PG Diploma"
                            }),
                            new sap.ui.core.Item({
                                key: "4",
                                text: "Certification"
                            })
                        ],
                        width: "15rem"
                    });
                tablId.addItem(new sap.m.ColumnListItem({
                    cells: [
                        oComboBox,
                        new sap.m.Input({
                            
                        }),
                        new sap.m.Input({
                            
                        }),
                        new sap.m.DatePicker({
                           
                        }),
                        new sap.m.DatePicker({
                            
                        }),
                        new sap.ui.unified.FileUploader({
                            placeholder: "Choose a file for Upload...",
                            tooltip: "Upload your file to the local server",
                            buttonText: "Upload",
                            multiple: false,
                            style: "Emphasized",
                            sameFilenameAllowed: false,
                            change: function (oEvent) {
                                that.handleUploadPress(oEvent);
                            },
                        }),
                        new sap.m.Text({
                            
                        }),
                        new sap.m.Button({
                            press: function (oEvent) {
                                that.DeleteDataQua(oEvent);
                            },
                            icon: "sap-icon://delete",

                        })
                    ]
                }));
            },

            // Row Adding in Internship & Project
            addRowInter: function () {
               debugger;
                BusyIndicator.show(0);
                var that = this;
                var oTable1 = that.getView().byId("ip_Details");
                var payload1 = this.getView().getModel("StudentDataset").getData();


                payload1.results[0].Submit = "";

                delete payload1.results[0].__metadata;
                delete payload1.results[0].NavFormToQualf;
                delete payload1.results[0].NavFormToCurr;

                var oItems1 = oTable1.getItems();
                var selectItems1 = {};
                var aFinalItemsArr1 = [];
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-ddTHH:mm:ss" });
                if (oItems1.length != 0 || oItems1.length != "") {
                    for (var i = 0; i < oItems1.length; i++) {
                       
                    
                        selectItems1.QualType = oItems1[i].getCells()[0].getSelectedKey();
                        selectItems1.QualName = oItems1[i].getCells()[1].getValue();
                        selectItems1.InstOrg = oItems1[i].getCells()[2].getValue();

                        selectItems1.Begda = dateFormat.format(oItems1[i].getCells()[3].getDateValue());
                        selectItems1.Endda = dateFormat.format(oItems1[i].getCells()[4].getDateValue());
                        selectItems1.Duration = "";
                        selectItems1.Document = "";
                        selectItems1.StregGuid = streguid;
                        selectItems1.QiType = "";
                        selectItems1.Srno = "";
                        selectItems1.QualClass = "";
                        selectItems1.QualPercentage = null;
                        selectItems1.QualCgpa = null;
    
    
                        aFinalItemsArr1.push(selectItems1);
                        selectItems1 = {}
    
                    }
                    payload1.results[0].NavFormToIntern = aFinalItemsArr1;

                    // BusyIndicator.hide();

                    oDataModel.create("/FormSet", payload1.results[0], {
                        PUT: "POST",
                        async: true,
                        success: function (Data, oResponse) {
                           
                            BusyIndicator.hide();
                            MessageToast.show("Draft Saved Successfully")
                        },
                        error: function (Error) {
                           
                            BusyIndicator.hide();
                            MessageBox.error(JSON.parse(Error.responseText).error.message.value)
                        }
                    })

                }
                BusyIndicator.hide();
                var tablId = that.getView().byId("ip_Details");

                var oComboBox = new sap.m.ComboBox(
                    {
                        items: [
                            new sap.ui.core.Item({
                                key: "1",
                                text: "Internship"
                            }),
                            new sap.ui.core.Item({
                                key: "2",
                                text: "Project"
                            })
                        ],
                        width: "6.5rem",
                        placeholder: "Select Status"
                    });
                tablId.addItem(new sap.m.ColumnListItem({
                    cells: [
                        oComboBox,
                        new sap.m.Input({}),
                        new sap.m.Input({}),
                        new sap.m.DatePicker({

                        }),
                        new sap.m.DatePicker({

                        }),
                        new sap.m.Input({}),
                        new sap.m.Input({}),
                        // new sap.m.Input({}),
                        new sap.ui.unified.FileUploader({
                            placeholder: "Choose a file for Upload...",
                            tooltip: "Upload your file to the local server",
                            buttonText: "Browse",
                            multiple: false,
                            style: "Emphasized",
                            sameFilenameAllowed: false,
                            change: function (oEvent) {
                                that.handleUploadPress(oEvent);
                            },
                        }),
                        new sap.m.Text({}),
                        new sap.m.Button({
                            press: function (oEvent) {
                                that.DeleteDataInter(oEvent);
                            },
                            icon: "sap-icon://delete"
                        })
                    ]
                }));
            },



            // Adding Rows in Activities
            addRowActi: function () {
               
                BusyIndicator.show(0);
                var that = this;
                var oTable = that.getView().byId("activity");
                var payload1 = this.getView().getModel("StudentDataset").getData();


                payload1.results[0].Submit = "";

                delete payload1.results[0].__metadata;
                delete payload1.results[0].NavFormToQualf;
                delete payload1.results[0].NavFormToIntern;

                var oItems2 = oTable.getItems();
                var selectItems2 = {};
                var aFinalItemsArr2 = [];
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-ddTHH:mm:ss" });
                if (oItems2.length != 0 || oItems2.length != "") {
                    for (var i = 0; i < oItems2.length; i++) {
                        selectItems2.StregGuid = streguid;
                        selectItems2.AcType = "";
                        selectItems2.Srno = "";
                        selectItems2.Text = oItems2[i].getCells()[0].getValue();
                        selectItems2.Document = "";
    
                        aFinalItemsArr2.push(selectItems2);
                        selectItems2 = {}
                    }
                    payload1.results[0].NavFormToCurr = aFinalItemsArr2;

                    BusyIndicator.hide();

                    oDataModel.create("/FormSet", payload1.results[0], {
                        PUT: "POST",
                        async: true,
                        success: function (Data, oResponse) {
                           
                            BusyIndicator.hide();
                            MessageToast.show("Draft Saved Successfully")
                        },
                        error: function (Error) {
                           
                            BusyIndicator.hide();
                            MessageBox.error(JSON.parse(Error.responseText).error.message.value)
                        }
                    })

                }
                BusyIndicator.hide();
                var tablId = that.getView().byId("activity");
                
                tablId.addItem(new sap.m.ColumnListItem({
                    cells: [
                        // oComboBox,
                        // new sap.m.Text({ text: srNo }),
                        new sap.m.Input({}),

                        new sap.ui.unified.FileUploader({
                            placeholder: "Choose a file for Upload...",
                            tooltip: "Upload your file to the local server",
                            buttonText: "Browse",
                            multiple: false,
                            style: "Emphasized",
                            sameFilenameAllowed: false,
                            change: function (oEvent) {
                                that.handleUploadPress(oEvent);
                            },
                        }),
                        new sap.m.Text({}),
                        new sap.m.Button({
                            press: function (oEvent) {
                                that.DeleteDataActi(oEvent);
                            },
                            icon: "sap-icon://delete"
                        })
                    ]
                }));
            },

            AllRow:function(){
               
                var that = this
                var tablId = that.getView().byId("Qalification");

                // newRow.getCells()[0].setText(srNo.toString());
                var oComboBox = new sap.m.ComboBox(
                    {
                        items: [
                            new sap.ui.core.Item({
                                key: "1",
                                text: "Degree"
                            }),
                            new sap.ui.core.Item({
                                key: "2",
                                text: "Diploma"
                            }),
                            new sap.ui.core.Item({
                                key: "3",
                                text: "PG Diploma"
                            }),
                            new sap.ui.core.Item({
                                key: "4",
                                text: "Certification"
                            })
                        ],
                        width: "15rem"
                    });
                tablId.addItem(new sap.m.ColumnListItem({
                    cells: [
                        // new sap.m.Text({ text: srNo }),
                        oComboBox,
                        new sap.m.Input({
                           
                        }),
                        new sap.m.DatePicker({
                            
                        }),
                        new sap.m.DatePicker({
                            
                        }),
                        new sap.ui.unified.FileUploader({
                            placeholder: "Choose a file for Upload...",
                            tooltip: "Upload your file to the local server",
                            buttonText: "Upload",
                            multiple: false,
                            style: "Emphasized",
                            sameFilenameAllowed: false,
                            change: function (oEvent) {
                                that.handleUploadPress(oEvent);
                            },
                        }),
                        new sap.m.Input({
                            
                        }),
                        new sap.m.Button({
                            press: function (oEvent) {
                                that.DeleteDataQua(oEvent);
                            },
                            icon: "sap-icon://delete",

                        })
                    ]
                }));



                var tablId1 = that.getView().byId("ip_Details");

                var oComboBox = new sap.m.ComboBox(
                    {
                        items: [
                            new sap.ui.core.Item({
                                key: "1",
                                text: "Internship"
                            }),
                            new sap.ui.core.Item({
                                key: "2",
                                text: "Project"
                            })
                        ],
                        width: "6.5rem",
                        placeholder: "Select Status"
                    });
                tablId1.addItem(new sap.m.ColumnListItem({
                    cells: [
                        oComboBox,
                        new sap.m.Input({}),
                        new sap.m.Input({}),
                        new sap.m.DatePicker({

                        }),
                        new sap.m.DatePicker({

                        }),
                        new sap.m.Input({}),
                        new sap.m.Input({}),
                        new sap.m.Input({}),
                        new sap.ui.unified.FileUploader({
                            placeholder: "Choose a file for Upload...",
                            tooltip: "Upload your file to the local server",
                            buttonText: "Browse",
                            multiple: false,
                            style: "Emphasized",
                            sameFilenameAllowed: false,
                            change: function (oEvent) {
                                that.handleUploadPress(oEvent);
                            },
                        }),
                        new sap.m.Input({}),
                        new sap.m.Button({
                            press: function (oEvent) {
                                that.DeleteDataInter(oEvent);
                            },
                            icon: "sap-icon://delete"
                        })
                    ]
                }));

                var tablId2 = that.getView().byId("activity");
                
                tablId2.addItem(new sap.m.ColumnListItem({
                    cells: [
                        // oComboBox,
                        // new sap.m.Text({ text: srNo }),
                        new sap.m.Input({}),

                        new sap.ui.unified.FileUploader({
                            placeholder: "Choose a file for Upload...",
                            tooltip: "Upload your file to the local server",
                            buttonText: "Browse",
                            multiple: false,
                            style: "Emphasized",
                            sameFilenameAllowed: false,
                            change: function (oEvent) {
                                that.handleUploadPress(oEvent);
                            },
                        }),
                        new sap.m.Input({}),
                        new sap.m.Button({
                            press: function (oEvent) {
                                that.DeleteDataActi(oEvent);
                            },
                            icon: "sap-icon://delete"
                        })
                    ]
                }));
            },
            // FIleuploader for Qualifications
            // handleUploadPress: function (oEvent) {
            //    debugger
            //     var that = this
                
            //     var TableId = that.getView().byId("Qalification")
            //      index =  oEvent.getSource().getId().split("-")[oEvent.getSource().getId().split("-").length-1]
            //     // var dyn = that.dynacmicFile(oEvent);
            //     var fileName = oEvent.getSource().oFileUpload.files[0].name;

            //     if (!fileName) {
            //         MessageBox.error("Choose a file first");
            //         return;
            //         }

            //     for(var i = 0; i<TableId.getItems().length; i++){
            //         if(TableId.getItems()[i].getCells()[5].getValue() == ""){
            //             TableId.getItems()[i].getCells()[5].setValue(fileName);
            //         }
            //         TableId.getItems()[i].getCells()[4].setValue("");
            //         return;
            //     }
                
                
               
            // },
            // dynacmicFile:function(oEvent){
            //     

            //     var oFileUploader = oEvent.getSource().oFileUpload.files[0];
            //     // var sFileName = oFileUploader.getValue();
            //     if (!oFileUploader) {
            //         MessageBox.error("Choose a file first");
            //         return;
            //     }
            //     // var file = TableId.getItems()[0].getCells()[5].oFileUpload.files[0];
            //     fileName = oFileUploader.name;
            //     fileType = oFileUploader.type;
            //     // var fileContent = 'data:' + file.type + ';base64,';
            //     var reader = new FileReader();

            //     reader.onload = function (e) {
            //        

            //         var obj = {}
            //         // f = e.currentTarget.result.split(",")[1];
            //         basePlusASCII = e.currentTarget.result.split(",")[1]
            //         convert = btoa(basePlusASCII);
            //         obj.fileName = fileName;
            //         obj.fileType = fileType;
            //         obj.content = convert;
            //         return obj;

            //     };
            //     //reader.readAsDataURL(oFileUploader);
            //     reader.readAsDataURL(oFileUploader);
            // },

            

            onQvalidation: function () {
               
                

                var bFlag = true, context = this;

                context.oTable1 = context.getView().byId("Qalification");

                var oItems = context.oTable1.getItems();

                for (var j = 0; j < oItems.length; j++) {

                    if (oItems[j].getCells()[0].getSelectedKey() === "" || oItems[j].getCells()[1].getValue() === "" || oItems[j].getCells()[2].getValue() === "" || oItems[j].getCells()[3].getValue() === "" || oItems[j].getCells()[5].getValue() === "" ) {

                        return MessageBox.show("Please fill all the required fields in Qualifications Table", {

                            icon: MessageBox.Icon.ERROR,
                            title: "ERROR",
                            actions: sap.m.MessageBox.Action.CLOSE,
                            emphasizedAction: sap.m.MessageBox.Action.CLOSE

                        });
                        
                        bFlag = false;

                    }
                }

                return bFlag;


            },


            onvalidation: function () {
               
                var bFlag = true, context = this;

                context.oTable2 = context.getView().byId("ip_Details");

                var oItems = context.oTable2.getItems();

                for (var j = 0; j < oItems.length; j++) {

                    if (oItems[j].getCells()[0].getSelectedKey() === "" || oItems[j].getCells()[1].getValue() === "" || oItems[j].getCells()[2].getValue() === "" || oItems[j].getCells()[3].getValue() === "" || oItems[j].getCells()[4].getValue() === "" || oItems[j].getCells()[5].getValue() === "" || oItems[j].getCells()[6].getValue() === "" || oItems[j].getCells()[7].getValue() === "" || oItems[j].getCells()[9].getValue() === "") {

                        return MessageBox.show("Please fill all the required fields in Internship/Projects Details Table", {

                            icon: MessageBox.Icon.ERROR,
                            title: "ERROR",
                            actions: sap.m.MessageBox.Action.CLOSE,
                            emphasizedAction: sap.m.MessageBox.Action.CLOSE

                        });
                        
                        bFlag = false;

                    }
                }

                return bFlag;

            },

            onAvalidation:function(){
               
                var bFlag = true, context = this;

                context.oTable3 = context.getView().byId("activity");

                var oItems = context.oTable3.getItems();

                for (var j = 0; j < oItems.length; j++) {

                    if (oItems[j].getCells()[0].getValue() === "" || oItems[j].getCells()[2].getValue() === ""  ) {

                        return MessageBox.show("Please fill all the required fields in Curricular Activities Table", {

                            icon: MessageBox.Icon.ERROR,
                            title: "ERROR",
                            actions: sap.m.MessageBox.Action.CLOSE,
                            emphasizedAction: sap.m.MessageBox.Action.CLOSE

                        });
                        
                        bFlag = false;

                    }
                }

                return bFlag;
            },


            onValidation: function () {
               
                var oTable = this.getView().byId("ip_Details")

                for (var i = 0; i < oTable.getItems().length; i++) {
                    if (oTable.getItems()[i].getCells()[0].getValue() === "" || oTable.getItems()[i].getCells()[0].getValue() === null) {
                        oTable.getItems()[i].getCells()[0].setValueState("Error");
                        oTable.getItems()[i].getCells()[0].setValueStateText("Details of Internships Can't be Empty");
                    }
                    if (oTable.getItems()[i].getCells()[1].getValue() === "" || oTable.getItems()[i].getCells()[1].getValue() === null) {
                        oTable.getItems()[i].getCells()[1].setValueState("Error");
                        oTable.getItems()[i].getCells()[1].setValueStateText("Name of Organisation (most recent) Can't be Empty");
                    }
                    if (oTable.getItems()[i].getCells()[2].getValue() === "" || oTable.getItems()[i].getCells()[2].getValue() === null) {
                        oTable.getItems()[i].getCells()[2].setValueState("Error");
                        oTable.getItems()[i].getCells()[2].setValueStateText("Duration of internship Can't be Empty");
                    }
                    if (oTable.getItems()[i].getCells()[3].getValue() === "" || oTable.getItems()[i].getCells()[3].getValue() === null) {
                        oTable.getItems()[i].getCells()[3].setValueState("Error");
                        oTable.getItems()[i].getCells()[3].setValueStateText("Contact details Can't be Empty");
                    }
                    if (oTable.getItems()[i].getCells()[4].getValue() === "" || oTable.getItems()[i].getCells()[4].getValue() === null) {
                        oTable.getItems()[i].getCells()[4].setValueState("Error");
                        oTable.getItems()[i].getCells()[4].setValueStateText("Designation of the student during internship Can't be Empty");
                    }
                    if (oTable.getItems()[i].getCells()[5].getValue() === "" || oTable.getItems()[i].getCells()[5].getValue() === null) {
                        oTable.getItems()[i].getCells()[5].setValueState("Error");
                        oTable.getItems()[i].getCells()[5].setValueStateText("Higher education Can't be Empty");
                    }
                    if (oTable.getItems()[i].getCells()[6].getValue() === "" || oTable.getItems()[i].getCells()[6].getValue() === null) {
                        oTable.getItems()[i].getCells()[6].setValueState("Error");
                        oTable.getItems()[i].getCells()[6].setValueStateText("Higher education Can't be Empty");
                    }
                    if (oTable.getItems()[i].getCells()[9].getValue() === "" || oTable.getItems()[i].getCells()[9].getValue() === null) {
                        oTable.getItems()[i].getCells()[9].setValueState("Error");
                        oTable.getItems()[i].getCells()[9].setValueStateText("Offer letter or experience certificate Can't be Empty");
                    }
                }

            },


            toggleFooter: function () {
                var oObjectPageLayout = this.byId("ObjectPageLayout");
                oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
            },



        });
    });
