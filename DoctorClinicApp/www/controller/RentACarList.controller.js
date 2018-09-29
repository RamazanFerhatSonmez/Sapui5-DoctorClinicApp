sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
	
  ], function (Controller, MessageBox, JSONModel) {
   "use strict";
   var db;
   return Controller.extend("rentACar.controller.RentACarList", {
    onInit: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("RentACarList").attachPatternMatched(this._onObjectMatched, this);		
      this.getView().setModel(oModel);
    },
    _onObjectMatched: function (oEvent) {
     var elements = oEvent.getParameter("arguments");
     this.getView().bindElement({
      path: "/" + oEvent.getParameter("arguments").invoicePath,
      model: "invoice"
    });

   },


 });

 });





