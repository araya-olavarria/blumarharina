var appConfig={};
appConfig.camera={
		"options":{
			 quality: 50,
			 targetWidth: 500,
			 targetHeight: 500,
  			 //destinationType : Camera.DestinationType.FILE_URI
  			 destinationType :0, //Camera.DestinationType.DATA_URL
  			 correctOrientation:true,
  			 saveToPhotoAlbum:true,
	  		 //encodingType: Camera.EncodingType.JPEG
  			 encodingType: 0
	  }
}
appConfig.blueTooth={
	getData:false,
	data:0
};
appConfig.PesoBt="";
appConfig.signoBt="";
appConfig.getPesaBtData=1;
var appBt=[];
appBt.largoString=-1;
appBt.largoEnvio=0;
appBt.cantlog=0;
 var Bluetooth, BluetoothState, Device, DeviceCollection, DeviceListView, DeviceView, onDeviceReady;

 $.fn.extend({
   enable: function() {
     return this.removeAttr("disabled");
   },
   disable: function() {
     return this.attr("disabled", "disabled");
   }
 });

 BluetoothState = Backbone.Model.extend({}, {
   Off: 1,
   Busy: 2,
   Ready: 3,
   Connected: 4
 });

 Bluetooth = new BluetoothState({
   state: BluetoothState.Busy
 });

 Device = Backbone.Model.extend({
   //defaults: {
     name: "name",
     address: "address",
     isConnected: "false"
   //}
 });

 DeviceCollection = Backbone.Collection.extend({
   model: Device
 });

 DeviceView = Backbone.View.extend({
   template: templates.device,
   events: {
     "click .btn-bsbt-bt-connect": "connect",
     "click .btn-bsbt-bt-disconnect": "disconnect"
   },
   initialize: function() {
     return this.model.on("change", this.render, this);
   },
   render: function() {
    // alert(this.template)
     //alert(this.model.get("name")+' <> '+this.model.get("isConnected"));
	 //Bluetooth.set({state: BluetoothState.Busy});  
	 templates.name = this.model.get("name");
	 templates.isConnected = this.model.get("isConnected")
     this.$el.html(_.template(this.template, {
       name: this.model.get("name"),
       isConnected: this.model.get("isConnected")
     }));
     return this;
   },
   connect: function() {
     var gotUuids, onError;
     onError = (function(_this) {
       return function() {
         Bluetooth.set({
           state: BluetoothState.Ready
         });
         return _this.$(".btn-bsbt-bt-connect").html("Reconectar");
       };
     })(this);
     gotUuids = (function(_this) {
       return function(device) {
         var onConnectionEstablished;
         onConnectionEstablished = function() {
           var stringMsg="";
           var onConnectionLost, onMessageReceived;
           onMessageReceived = function(msg) {
        	   /*Bluetooth.set({state: BluetoothState.Connected});
        	   var res = msg.substring(msg.length-3,msg.length-2);
        	   if(/[a-z]/.test(res)){
        		   stringMsg+=msg;
        		   msg=stringMsg;
        		   stringMsg="";
        	   }else{
        		   stringMsg+=msg;
            	   return;
        	   }*/
        	    msg = msg.split(" ").join("");
				msg = msg.split("ST,NT,").join("");
				msg = msg.split("US,NT,").join("");
				msg = msg.split("ST,TR,").join("");
				msg = msg.split("US,TR,").join("");
         	    msg = msg.split("g").join("");
         	    msg = msg.split("G").join("");
         	    msg = msg.split("P").join("");
         	    msg = msg.split("	").join("");
         	    msg = msg.split("p").join("");
         	    msg = parseInt(msg);
                //msg = msg.split("\n").join("");
                //msg = msg.trim();
                if(msg==="+"){appConfig.signoBt="";return;}
                else if(msg==="-"){appConfig.signoBt=msg;return;}
         	    $("#resultBtData").html(msg);
                appConfig.blueTooth.data=msg*1;
           };
           onConnectionLost = function() {
             _this.model.set({
               isConnected: false
             });
             return onError();
           };
           _this.model.set({
             isConnected: true
           });
           return window.bluetooth.startConnectionManager(onMessageReceived, onConnectionLost);
         };
         return window.bluetooth.connect(onConnectionEstablished, onError, {
           address: _this.model.get("address"),
           uuid: device.uuids[0]
         });
       };
     })(this);
     Bluetooth.set({
       state: BluetoothState.Busy
     });
     this.$(".btn-bsbt-bt-connect").html("loading");
     return window.bluetooth.getUuids(gotUuids, onError, this.model.get("address"));
   },
   disconnect: function() {
     var onDisconnected;
     onDisconnected = function() {
       this.model.set({
         isConnected: "false"
       });
       return Bluetooth.set({
         state: BluetoothState.Ready
       });
     };
     Bluetooth.set({
       state: BluetoothState.Busy
     });
     return window.bluetooth.disconnect(onDisconnected);
   }
 });

 DeviceListView = Backbone.View.extend({
   el: "#list-devices",
   initialize: function() {
     return this.collection.on("reset add", this.render, this);
   },
   render: function() {
     this.$el.html("");
     return this.collection.each((function(_this) {
       return function(device) {
    	 //alert('device: '+JSON.stringify(device))	
         return _this.$el.append(new DeviceView({
           model:device
         }).render().el);
       };
     })(this));
   }
 });
function onDeviceReady() {
   var deviceList, onBluetoothStateChanged, onDiscover, onToggleOff, onToggleOn;
   deviceList = new DeviceListView({
     collection: new DeviceCollection
   });
   
   onBluetoothStateChanged = function() {
     //alert(Bluetooth.get("state"))
     switch (Bluetooth.get("state")) {
       case BluetoothState.Off:
         $("#btn-bsbt-bt-on").prop('disabled', false);
         $("#btn-bsbt-bt-off").prop('disabled', true);
         $("#btn-bsbt-bt-discover").prop('disabled', true);
         $(".btn-bsbt-bt-connect").prop('disabled', true);
         return $(".btn-bsbt-bt-disconnect").prop('disabled', true);
       case BluetoothState.Busy:
         $("#btn-bsbt-bt-on").prop('disabled', true);
         $("#btn-bsbt-bt-off").prop('disabled', true);
         $("#btn-bsbt-bt-discover").prop('disabled', true);
         $(".btn-bsbt-bt-connect").prop('disabled', true);
         return $(".btn-bsbt-bt-disconnect").prop('disabled', true);
       case BluetoothState.Ready:
         $("#btn-bsbt-bt-on").prop('disabled', true);
         $("#btn-bsbt-bt-off").prop('disabled', false);
         $("#btn-bsbt-bt-discover").prop('disabled', false);
         $(".btn-bsbt-bt-connect").prop('disabled', false);
         return $(".btn-bsbt-bt-disconnect").enable();
       case BluetoothState.Connected:
         $("#btn-bsbt-bt-on").prop('disabled', true);
         $("#btn-bsbt-bt-off").prop('disabled', true);
         $("#btn-bsbt-bt-discover").prop('disabled', true);
         $(".btn-bsbt-bt-connect").prop('disabled', true);
         return $(".btn-bsbt-bt-disconnect").prop('disabled', false);
     }
   };
  
   onToggleOn = function() {
     var onBluetoothEnabled;
     //alert(2)
     onBluetoothEnabled = function() {
       return Bluetooth.set({
         state: BluetoothState.Ready
       });
     };
     Bluetooth.set({
       state: BluetoothState.Busy
     });
     return window.bluetooth.enable(onBluetoothEnabled);
   };
 
   onToggleOff = function() {
     var onBluetoothDisabled;
     onBluetoothDisabled = function() {
       return Bluetooth.set({
         state: BluetoothState.Off
       });
     };
     Bluetooth.set({
       state: BluetoothState.Busy
     });
     return window.bluetooth.disable(onBluetoothDisabled);
   };

   //listar dispositivo
   onDiscover = function() {
     var onDeviceDiscovered, onDiscoveryFinished;
     onDeviceDiscovered = function(device) {
 	    	  if(device.isConnected===null){
 	    		  device.isConnected=false;
 	    	  }
 	    	  device.isConnected=false;
 	    	  //alert(JSON.stringify(device))
 	    	  /*
 	    	  if (typeof console  != "undefined") 
 	    		    if (typeof console.log != 'undefined')
 	    		        console.olog = console.log;
 	    		    else
 	    		        console.olog = function() {};
 	    		        
 	    		    //alert(device)    
 	    		    console.log = function(device) {
 	    		    	//alert(device) 
 		    		    console.olog(device);
 		    		    $('#status').append('<p>' + device + '</p>');
 	    		    };
 	    		    console.log(device)
 	    		    console.error = console.debug = console.info =  console.log
 	    		    */
 	     // alert(JSON.stringify(device))	  ;
 	      var newdevice=new Device(device);
 	      //alert(JSON.stringify(newdevice));
 	      return deviceList.collection.add(new Device(device));
     };
     
     onDiscoveryFinished = function() {
       Bluetooth.set({
         state: BluetoothState.Ready
       });
       return $("#btn-bsbt-bt-discover").html("reset");
     };
     Bluetooth.set({
       state: BluetoothState.Busy
     });
     $("#btn-bsbt-bt-discover").html("loading");
     deviceList.collection.reset();
     return window.bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onDiscoveryFinished);
 	
   };
   
   $("#btn-bsbt-bt-on").on("click", onToggleOn);
   $("#btn-bsbt-bt-off").on("click", onToggleOff);
   $("#btn-bsbt-bt-discover").on("click", onDiscover);
   Bluetooth.on("change", onBluetoothStateChanged);
  //alert('isenabled')
   return window.bluetooth.isEnabled(
 	 function(isEnabled) {
 	    if (isEnabled) {
 	      return Bluetooth.set({
 	        state: BluetoothState.Ready
 	      });
 	    } else {
 	      return Bluetooth.set({
 	        state: BluetoothState.Off
 	      });
 	    }
   }
 		  //isEnabledSuccess, isEnabledError  
   );
 };
appConfig.log=function(r){

};