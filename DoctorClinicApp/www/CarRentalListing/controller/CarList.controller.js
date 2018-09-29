sap.ui.define(["sap/ui/core/mvc/Controller",'jquery.sap.global'],
	function(Controller) {
		"use strict";
		var _this;
		var dataBase;
		var iconColor;
		var carListId;
		var carListArray=[];
		var carId=0;
		var oData;
		var splitTheWord;
		var sPath;
		var carImage;
		var carListContent;
		var imageSrc;
		var _image;
		return Controller.extend("rentACar.CarRentalListing.controller.CarList", {
			onInit:function(oEvent){
				_this = this;
				dataBase = openDatabase('RentACarDateBase', '1.0', 'Web SQL Veritabanı', 15*1024*1024);
				var stateCarModel={
					"stateCar":[
					{ state:"state1",stateCarText: "Uygun"},
					{ state:"state2",stateCarText: "Uygun Degil"}
					],

					"rentalPeriodModel":[
					{ period:"1",periodText: "Saatlik"},
					{ period:"2",periodText: "Günlük"},
					{ period:"3",periodText: "Haftalık"},
					{ period:"4",periodText: "Aylık"}
					]
				};
				oModel.setData(stateCarModel);
				oModel.setProperty("/carListModel",[]);
				oModel.setProperty("/imageModelDialog","");
				oModel.setProperty("/imageSrcModel","");

				if(oModel.oData.carListModel.length >0){
					oModel.setProperty("/carListModel",[]);
					carListArray=[];
				}
				dataBase.transaction(function(tx) {
					tx.executeSql('SELECT * FROM rentCarTable ', [],function(islem, sonuc) {
						console.log(sonuc.rows);
						for (var i = 0; i <sonuc.rows.length; i++) {
							carId=i+1;
							if(sonuc.rows[i].carRentalStatus=="uygun"){
								tx.executeSql('UPDATE rentCarTable SET colorState=? WHERE id=? ',["#63F2D1",sonuc.rows[i].id]); 
							}
							else if(sonuc.rows[i].carRentalStatus=="uygun degil"){
								tx.executeSql('UPDATE rentCarTable SET colorState=? WHERE id=? ',["#F41A1A",sonuc.rows[i].id]); 
							}
						}
					});				
				});
                oModel.setProperty("/carListModel",[]);
				dataBase.transaction(function(tx) {
					tx.executeSql('SELECT * FROM rentCarTable ', [],function(islem, sonuc) {
						console.log(sonuc.rows);

						for (var i = 0; i <sonuc.rows.length; i++) {
							carListArray.push(sonuc.rows[i]);
						}
						oModel.setProperty("/carListModel",carListArray);
						carListContent=oModel.getData().carListModel;
						for(var j=0;j<carListContent.length;j++){
							carListContent[j].carBrand=_this.toTitleCase(carListContent[j].carBrand);
							carListContent[j].carModel=_this.toTitleCase(carListContent[j].carModel);
							carListContent[j].carRentalStatus=_this.toTitleCase(carListContent[j].carRentalStatus);
						}
						oModel.refresh();
					});				
				});
				carListArray=[];
             oModel.refresh();
			},
			handleUploadComplete: function(oEvent) {
				var sResponse = oEvent.getParameter("response");
				newCarThis=this;			
				if (sResponse) {
					var sMsg = "";
					var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
					if (m[1] == "200") {
						sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
						oEvent.getSource().setValue("");
					} else {
						sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
					}
					MessageToast.show(sMsg);
				}
			},
			handleUploadPress: function(oEvent) {
				var oFileUploader = sap.ui.getCore().byId("fileUploaderCarAddId");
				var domRef=oFileUploader.getFocusDomRef();
				var file=domRef.files[0];
				var that=this;
				this.fileName=file.name;
				this.fileType=file.type;
				var reader=new FileReader();
				reader.readAsDataURL(file);
				
				reader.onload = function(){
					_image = reader.result;
					oModel.setProperty("/imageSrcModel",_image);
				}
			},
			addNewCarToDB:function(){
				var new_CaBrand = sap.ui.getCore().byId("idNewCaBrand").getValue().toLowerCase();
				var new_CarModel =sap.ui.getCore().byId("idNewCarModel").getValue().toLowerCase();
				var new_CarFeatures = sap.ui.getCore().byId("idNewCarFeatures").getValue().toLowerCase();
				var new_CarState = sap.ui.getCore().byId("idNewCarState").getValue().toLowerCase();
				var new_CarPeriod = sap.ui.getCore().byId("idNewCarPeriod").getValue().toLowerCase();
				var new_CArRentalFee = sap.ui.getCore().byId("idNewCArRentalFee").getValue().toLowerCase();
				imageSrc=oModel.getProperty("/imageSrcModel");
				dataBase.transaction(function(tx2) {
					tx2.executeSql('INSERT INTO rentCarTable(carBrand,carModel,carFeatures,carRentalStatus,carPeriod,rentalFee,imageCarBase) VALUES (?,?,?,?,?,?,?)',[new_CaBrand,new_CarModel,new_CarFeatures,new_CarState,new_CarPeriod,new_CArRentalFee,imageSrc]);  
				});
				_this.addNewRentACarDialogOpen.close();	
				oModel.setProperty("/carListModel",[]);	
				_this.onInit();
			},
			addNewCarDialogClose:function(){

				_this.addNewRentACarDialogOpen.close();
				
			},
			updateCarToDB:function(oEvent){
				var brandCar=sap.ui.getCore().byId("idUpdateCarBrand").getValue().toLowerCase();
				var modelCar=sap.ui.getCore().byId("idUpdateCarModel").getValue().toLowerCase();
				var periodCar=sap.ui.getCore().byId("idUpdateCarPeriod").getValue().toLowerCase();
				var rentalFee=sap.ui.getCore().byId("idUpdateCArRentalFee").getValue().toLowerCase();
				var stateCar=sap.ui.getCore().byId("idUpdateCarState").getValue().toLowerCase();
				dataBase.transaction(function(tx) {
					tx.executeSql('UPDATE rentCarTable SET carBrand=?, carModel=? , carPeriod=? , rentalFee=? , carRentalStatus=?  WHERE id=? ',[ brandCar ,modelCar ,periodCar ,rentalFee ,stateCar,carListId],function(a,b){
						carListContent.carBrand=  brandCar;    
						carListContent.carModel=modelCar;
						carListContent.carPeriod=periodCar;
						carListContent.rentalFee=rentalFee;
						carListContent.carRentalStatus=stateCar;
						oModel.refresh();
					});
					_this.updateCarOpenDialog.close();
					
				});	
				_this.onInit();	
			},
			newCarAdd:function(){
				_this=this;
				if(!_this.addNewRentACarDialogOpen){
					_this.addNewRentACarDialogOpen = sap.ui.xmlfragment("rentACar.CarRentalListing.fragments.carAddDialog", this);
				}
				_this.addNewRentACarDialogOpen.open();
			},
			updateCarDialogClose: function(){
				_this.updateCarOpenDialog.close();
			},
			editCar:function(oEvent){
				oData = oModel.getData().carListModel;
				sPath = oEvent.getSource().getBindingContext().getPath();				
				var carListModel=oModel.getProperty(sPath);
				carListContent=oModel.getProperty(sPath);
				carListId=carListContent.id;
				oModel.setProperty("/imageModelDialog",carListContent.imageCarBase);
				if(!_this.updateCarOpenDialog){
					_this.updateCarOpenDialog = sap.ui.xmlfragment("rentACar.CarRentalListing.fragments.updateCarDialog", _this);
				}
				_this.updateCarOpenDialog.open();
				sap.ui.getCore().byId("idUpdateCarBrand").setValue(carListContent.carBrand);
				sap.ui.getCore().byId("idUpdateCarModel").setValue(carListContent.carModel);
				sap.ui.getCore().byId("idUpdateCarPeriod").setValue(carListContent.carPeriod);
				sap.ui.getCore().byId("idUpdateCArRentalFee").setValue(carListContent.rentalFee);
				sap.ui.getCore().byId("idUpdateCarState").setValue(carListContent.carRentalStatus);
			},
			deleteCar: function (oEvent){
				oData = oModel.getData().carListModel;
				sPath = oEvent.getSource().getBindingContext().getPath();				
				var carListModel=oModel.getProperty(sPath);
				dataBase.transaction(function(tx) {
					tx.executeSql('DELETE FROM rentCarTable WHERE id = ?', [carListModel.id], function(islem, sonuc){
					});
				});
				carId=0;
				var iLength = sPath.length;
				var idIndex = sPath.slice(iLength - 1);
				oData.splice(idIndex, 1);
				oModel.refresh();
			},
			comboboxAddStateSelectId:function(oEvent){
				var newvalAddState = oEvent.getParameter("text");
				var keyAddState = oEvent.getSource().getSelectedItem();
				if (newvalAddState !== "" && keyAddState == null && newvalAddState==keyAddState){
					oEvent.getSource().setValue("");
					oEvent.getSource().setValueState("Error");
				}else{
					oEvent.getSource().setValueState("None");
				}
			},
			comboboxAddPeriotSelectId:function(oEvent){
				var newvalAddPeriot = oEvent.getParameter("text");
				var keyAddPerit = oEvent.getSource().getSelectedItem();
				if (newvalAddPeriot !== "" && keyAddPerit == null && newvalAddPeriot!==keyAddPerit){
					oEvent.getSource().setValue("");
					oEvent.getSource().setValueState("Error");
				}else{
					oEvent.getSource().setValueState("None");
				}
			},
			comboboxUpdateStateSelectId:function(oEvent){
				var newvalUpdateState = oEvent.getParameter("text");
				var keyUpdateState = oEvent.getSource().getSelectedItem();
				if (newvalUpdateState !== "" && keyUpdateState == null && newvalUpdateState!==keyUpdateState){
					oEvent.getSource().setValue("");
					oEvent.getSource().setValueState("Error");
				}else{
					oEvent.getSource().setValueState("None");
				}
			},
			comboboxUpdatePeriotSelectId:function(oEvent){
				var newvalUpdatePeriot = oEvent.getParameter("text");
				var keyUpdatePeriot = oEvent.getSource().getSelectedItem();
				if (newvalUpdatePeriot !== "" && keyUpdatePeriot == null && newvalUpdatePeriot !==keyUpdatePeriot){
					oEvent.getSource().setValue("");
					oEvent.getSource().setValueState("Error");
				}else{
					oEvent.getSource().setValueState("None");
				}
			},
			toTitleCase:function(str) {
				return str.replace(/\w\S*/g, function(txt){
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
			}
		});
});