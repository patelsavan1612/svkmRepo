sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";
        var that;
        var urlStorage;
        var oDataModel;
        return Controller.extend("studentplacement.controller.student_placement", {
            onInit: function () {
                debugger
                var context;
                context = this;
                that = this;
                var placementdata = this.getOwnerComponent().getModel("placementdataproperty").getData();
                var placementmodel = new JSONModel(placementdata);
                this.getView().setModel(placementmodel, "cModel");
                oDataModel = this.getOwnerComponent().getModel();
                this.readCollageData();



            },
            onGoPress: function () {
                var oTable = this.getView().byId("studentList_table");
                oTable.setVisible(true);
            },
            readCollageData: function (oEvent) {
                debugger
                var context = this;
                var CollegeName;
                var fil = new sap.ui.model.Filter("OrganizationName", "EQ", CollegeName);
                oDataModel.read("/ZDDL_CDS_1001Set", {
                    filters: [fil],
                    success: function (Data, response) {
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
                        console.log(resArr)
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
                        console.log(resArr2)
                        var oModel = new JSONModel(resObj2);
                        context.getView().setModel(oModel, "classcollegeDatasetcourse");

                    },
                    error: function (Error) {
                        MessageBox.error("error while expanding");

                    }
                });
            }

        });
    });
