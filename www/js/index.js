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
        GeckoWS.go();
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

var GeckoWS = {
  ws: null
  ,timerID: null

  ,go: function() {
      $(document).ready(function() {
          $('.btnSend').on('click', function(e) {
                  GeckoWS.Send();
          });

          $(document.body).on('keypress', function(e) {
                  if ( e.keyCode == 13 ) {
                      $('.btnSend').click();
                  }
          });

          $('[name="GeckoWS_user"]').val("User" + Math.floor((Math.random() * 99) + 1));

          GeckoWS.SetupReconnectLoop();
      });
  }

  ,Connect: function() {
      console.log("Connecting...");
      this.ws = new WebSocket('ws://lamp2.geckogroup.net:9000/ws');
      this.ws.onopen = function (evt) {
          console.log("Connected to WebSocket server. readyState: " + JSON.stringify(GeckoWS.ws.readyState));
          $('#GeckoWS_status').removeClass('Disconnected').addClass('Connected');
          $('.btnSend').attr('disabled', false);
      };
      this.ws.onclose = function (evt) {
          console.log("Disconnected");
          $('#GeckoWS_status').removeClass('Connected').addClass('Disconnected');
          $('.btnSend').attr('disabled', 'disabled');
          GeckoWS.SetupReconnectLoop();
      };
      this.ws.onmessage = function (evt) {
          console.log("Message received: data = " + JSON.stringify(evt.data));
          var data;
          try {
                  eval("data = " + evt.data);
          } catch (ex) {
                  data = evt.data;
          }

          if ( data && data.user && data.message ) {
                  $('#GeckoWS_messagelog').append('<div><b style="margin-right: 1em; ' + (data.user == $('[name="GeckoWS_user"]').val() ? 'color: blue;' : '') + '">' + data.user + '</b><span>' + data.message + '</span></div>');
          } else {
                  $('#GeckoWS_messagelog').append('<div>' + data + '</div>');
          }
          //document.getElementById('msg').innerHTML = evt.data;
      };
      this.ws.onerror = function (evt) {
          console.log('Error occured: ' + evt.data);
      };
  }

  ,SetupReconnectLoop: function() {
      if (this.timerID) {
              console.log("SetupReconnectLoop: timer already active, exiting");
              return;
      } else {
              this.timerID = setInterval(this.Reconnect, 1000);
      }
  }

  ,Reconnect: function() {
      if( GeckoWS.ws ) console.log("Reconnect: readyState = " + GeckoWS.ws.readyState);

      if ( GeckoWS.ws && GeckoWS.ws.readyState == 1 ) {
              clearInterval(GeckoWS.timerID);
              GeckoWS.timerID = null;
              console.log("Reconnect: ws is open, cancelling reconnect loop");
      } else {
              GeckoWS.Connect();
      }

  }

  ,Send: function() {
      var message = {
              user: $('[name="GeckoWS_user"]').val()
              ,message: $('[name="GeckoWS_message"]').val()
      };
      //alert('btnSend.Click: ' + message);
      /*jQuery.get(
              '/notify'
              ,{
                      msg: JSON.stringify(message)
              }
              ,function(data, textStatus, jqXHR) {
                      //console.log('Sent message: ' + data);
              }
      );*/
      console.log('Sent message: ' + JSON.stringify(message));
      this.ws.send(JSON.stringify(message));
      $('[name="GeckoWS_message"]').val('');
  }


}


//var mycfwebsocketobject;

var CFWebSockets = {
  go: function() {
    //ColdFusion.Event.registerOnLoad(this._cf_websockets_init_1408971150236);
    //moved this to index.html instead
  },

  //using the copy of this in index.html instead
  //_cf_websockets_init_1408971150236: function() {
  //  mycfwebsocketobject = ColdFusion.WebSocket.init('mycfwebsocketobject','publishexample','D9453F56711EE71210D26C9E1683C0DF','publishdemochannel',mymessagehandler,null,null,null,'http://www.onlyaglance.com/testing/2/index.cfm');
  //}
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
