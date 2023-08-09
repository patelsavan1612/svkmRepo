sap.ui.define(function () {

    "use strict";

    return {
        formatType: function (sValue) {
            if (sValue === "1") {
                return "Internship";
            } else if (sValue === "2") {
                return "Project";
            }
        },

        formatQuali: function (sValue) {
            if (sValue === "1") {
                return "Degree";
            } else if (sValue === "2") {
                return "Diploma";
            } else if (sValue === "3") {
                return "PG Diploma";
            } else if (sValue === "4") {
                return "Certification";
            }
        },

    }

});