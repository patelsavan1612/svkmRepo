sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            createModel: function () {
                var oPropertyModel = {

                };
                var oModel2 = new JSONModel(oPropertyModel);
                return oModel2;
            },
            createListModel: function () {
                var oPropertyListModel = {

                };
                var oModel3 = new JSONModel(oPropertyListModel);
                return oModel3;
            }
        };
    });