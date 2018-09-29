sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
	], function (Controller, MessageBox, JSONModel) {
		"use strict";
		var dataBase;
		var oRouter;
		var oData;
		var _this;
		var sPath;
		return Controller.extend("newProject.controller.Main", {
			onInit:function(){				
				 _this = this;
				this.getView().setModel(oModel);				
				var modelDoc={
					"Modeldoctortitle":[
					{ titleId:"1",doktorTitle: "Pratisyen Doktor"},
					{ titleId:"2",doktorTitle: "Uzman Doktor"},
					{ titleId:"3",doktorTitle: "Operator Doktor"},
					{ titleId:"4",doktorTitle: "Yardımcı Doçent"},
					{ titleId:"5",doktorTitle: "Doçent"},
					{ titleId:"6",doktorTitle: "Profesör"},
					{ titleId:"7",doktorTitle: "Ordinaryus"}
					]
				};
				oModel.setData(modelDoc);
				oModel.setProperty("/DoctorList",[]);
			},
			addNewDoctor:function(oEvent){
				if (window.openDatabase) {
					dataBase = openDatabase('DoctorHastaApp', '1.0', 'Web SQL Veritabanı', 15*1024*1024);  
					console.log("local_veritabani isimli veritabanı 1.0 versiyonu ile 15MB olacak şekilde oluşturuldu veya zaten varsa yeniden oluşturulmadı!");
					dataBase.transaction(function(tx) {
						tx.executeSql('CREATE TABLE doctorTable(id INTEGER PRIMARY KEY, doctorAd VARCHAR(50), doctorUnvan VARCHAR(25))', []);
						tx.executeSql('CREATE TABLE hastaTable(id INTEGER PRIMARY KEY, patientName VARCHAR(50), doctorPatientId INT(6),patientIllName VARCHAR(15),patientMedicine_Name VARCHAR(15))',[]); 
						tx.executeSql('CREATE TABLE hastalikTable(id INTEGER PRIMARY KEY, illName VARCHAR(50),illID INT(3))', []);
						tx.executeSql('CREATE TABLE ilacTable(id INTEGER PRIMARY KEY, medicineName VARCHAR(50), illId INT(3))', []);
						dataBase.transaction(function(tx2) {
							tx2.executeSql('INSERT INTO hastalikTable(illName,illID) VALUES ("Şizofren","1")');
							tx2.executeSql('INSERT INTO hastalikTable(illName,illID) VALUES ("Soğuk Algınlığı","2")');
							tx2.executeSql('INSERT INTO hastalikTable(illName,illID) VALUES ("Faranjit","3")');	
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Pimozid","1")');
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Sülpirid","1")');
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Haloperidol","1")');
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Beniflex","2")');
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Tanflex","2")');
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Panadol","2")');
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Klamoks","3")');
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Aksef","3")');
							tx2.executeSql('INSERT INTO ilacTable(medicineName,illId) VALUES ("Siprobel","3")');
						});  
					});
				}else{
					alert("Maalesef tarayıcınızda Web SQL desteği bulunmamaktadır.")
				}
				_this=this;
				if(!_this.addNewDoctorDialog){
					_this.addNewDoctorDialog = sap.ui.xmlfragment("newProject.fragments.doctorDialog", this);
				}
				_this.addNewDoctorDialog.open();
			},
			addNewDoctorDialogClose:function(){
				_this.addNewDoctorDialog.destroy(true);	
				_this.addNewDoctorDialog.close();
			},
			goToDoctorList: function(){
		              _this=this;		              
					var oRouter2 = sap.ui.core.UIComponent.getRouterFor(_this);
					oRouter2.navTo("DoctorHastaList");
				},
				addNewDoctorToDB:function(){
					var dialogDoctorName = sap.ui.getCore().byId("idNewDoctorName").getValue();
					dialogDoctorName +=" "+sap.ui.getCore().byId("idNeweDoctorSurname").getValue();
					var dialogDoctorTitle = sap.ui.getCore().byId("idNewDoctorUnvan").getValue();
					dataBase.transaction(function(tx2) {
						tx2.executeSql('INSERT INTO doctorTable(doctorAd,doctorUnvan) VALUES (?,?)',[dialogDoctorName,dialogDoctorTitle]);  
					});	
					_this.getDoctorList();  
					_this.addNewDoctorDialog.close();		
				},
				getDoctorList:function(){
					var doctorListArray = [];
					dataBase.transaction(function(tx) {
						tx.executeSql('SELECT * FROM doctorTable ', [],function(islem, sonuc) {
							console.log(sonuc.rows);
							jQuery.each(sonuc.rows, function(index, value) {
								doctorListArray.push(value);							
							// oModel.oData.DoctorList.push({
							// 	"doctorModelName" : value.doctorAd,
							// 	"doctorModelTitle" : value.doctorUnvan,
							// });
						});
							oModel.setProperty("/DoctorList",doctorListArray);
						});
					})
				}
			});		
});





