/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        //$('#gecko-target').append('<div>app.initialize</div>');
        GeckoAJAX.go();
        CFWebSockets.go();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        $('#gecko-target').append('<div>app.receivedEvent</div>');
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

    }
};


var GeckoAJAX = {
  go: function() {
    //go get something via ajax and dump it in gecko-target
    jQuery.get(
        'http://www.thinkgecko.com'
        ,''
        ,function(data, textStatus, jqXHR) {
            $('#gecko-target').append('<div>' + data + '</div>');
            console.log('Received data');
        }
    );
  }
}




//var mycfwebsocketobject;

var CFWebSockets = {
  go: function() {
    //ColdFusion.Event.registerOnLoad(this._cf_websockets_init_1408971150236);
  },

  _cf_websockets_init_1408971150236: function() {
    mycfwebsocketobject = ColdFusion.WebSocket.init('mycfwebsocketobject','publishexample','D9453F56711EE71210D26C9E1683C0DF','publishdemochannel',mymessagehandler,null,null,null,'http://www.onlyaglance.com/testing/2/index.cfm');
  }
};

function mymessagehandler( atoken) {
		if (atoken.data != null) {
			var message = atoken.data;
			var txt = document.getElementById("cf_websockets_target");
			txt.innerHTML += message + "<br>";
		}
}

function publishmessage()	{
		var msg =  "<b>" + document.getElementById("user").value +"</b>:  " + document.getElementById("message").value;

		mycfwebsocketobject.publish("publishdemochannel",msg );
}

function publisharray() {
		var myarr = new Array();
		myarr[1]=document.getElementById("arr1").value;
		myarr[2]=document.getElementById("arr2").value;
		myarr[3]=document.getElementById("arr3").value;
		mycfwebsocketobject.publish("publishdemochannel",myarr);
}

function publishobject() {
		var myobj= new Object();
		myobj.fname=document.getElementById("fn").value;
		myobj.lname=document.getElementById("ln").value;
		myobj.age=document.getElementById("age").value;
		myobj.gender=document.getElementById("gender").value;
		mycfwebsocketobject.publish("publishdemochannel",myobj);
}

function inpublish() {
		mycfwebsocketobject.invokeAndPublish("publishdemochannel", "employee", "processMessage",[389,"Hello "]);
}
