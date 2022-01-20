// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import {getAuth,signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getDatabase, ref, onValue, query,orderByChild,equalTo,limitToLast } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
Push.Permission.request();

const firebaseConfig = {
  apiKey: "AIzaSyA8F3rJMj_OPhhjM3sKfk09r7V37sv6Gz0",
  authDomain: "boton-de-panico-bb93e.firebaseapp.com",
  databaseURL: "https://boton-de-panico-bb93e-default-rtdb.firebaseio.com",
  projectId: "boton-de-panico-bb93e",
  storageBucket: "boton-de-panico-bb93e.appspot.com",
  messagingSenderId: "760252501543",
  appId: "1:760252501543:web:89a509cc0faa6b0a8dc802",
  measurementId: "G-60811BPB5Q"
};


  // Initialize Firebase, const and var to htmll page.
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase();
  window.map = undefined;      // global variable
  var CloseSesion  = document.getElementById('cerrar-sesion');

 
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    // window.location = 'dashboard/dashboard.html';
      console.log("sesion ya iniciada");      
    } 
      else {
        window.location = '../index.html';
      }
    });

  // consulting from SOS in Real Time Database and mark in map Markers
  const AlertMap = query(ref(db, 'SOS/'),orderByChild('Status'),equalTo('Pendiente'));
  onValue(AlertMap, (snapshotMap) => {
  const dataMap = snapshotMap.val();


  setMarkersMap(dataMap);

});

var LatitudeArray = new Array();
var LongitudeArray = new Array();
var DateArray = new Array();
var HourArray = new Array();
var LocationArray = new Array();
var PhoneArray = new Array();
var TypeAlertArray = new Array();
var NameArray = new Array();
var LastNameArray = new Array(); 
var autoincrement =0;

function setMarkersMap(dataMap){

  LatitudeArray.length=0;
  LongitudeArray.length=0;
  DateArray.length=0;
  HourArray.length=0;
  LocationArray.length=0;
  PhoneArray.length=0;
  TypeAlertArray.length=0;
  NameArray.length=0;
  LastNameArray.length=0;
  autoincrement=0;
  
  for(let is in dataMap){

    var Name = dataMap[is].Name;
    var LastName = dataMap[is].LastName;
    var Date = dataMap[is].Date;
    var Hour = dataMap[is].Hour;
    var Location = dataMap[is].Location;
    var Phone = dataMap[is].Phone;
    var Latitude = dataMap[is].latitude;
    var Longitude =dataMap[is].longitude;
    var TypeAlert = dataMap[is].Type_of_alert;


      NameArray[autoincrement]=Name;
      LastNameArray[autoincrement]=LastName;
      DateArray[autoincrement]=Date;
      HourArray[autoincrement]=Hour;
      LocationArray[autoincrement]=Location;
      PhoneArray[autoincrement]=Phone;  
      LatitudeArray[autoincrement]=Latitude;
      LongitudeArray[autoincrement]=Longitude;
      TypeAlertArray[autoincrement]=TypeAlert;
      autoincrement= autoincrement+1;

  }

      MarkPointersOnTheMap();

  }



  var reference;
  function MarkPointersOnTheMap(){
    reference =  {
      zoom: 12,
      center: { lat:19.4274751 ,lng: -98.2339104},
    };
    window.map = new google.maps.Map(document.getElementById("map"),reference);
    setMarkers();
  }
  
  

  var infowindow = new google.maps.InfoWindow();
   function setMarkers() {
      const image = {
      url: 'icon/alerticon.png',
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 42),
    };
   

    for (var i = 0; i < NameArray.length; i++) {
          var marker = new google.maps.Marker({
          position: new google.maps.LatLng(LatitudeArray[i], LongitudeArray[i]),
          map: window.map,
          icon: image,
          title:  'Alerta de '+NameArray[i]+' '+LastNameArray[i]
      });

      let Img = 'ImgInformation/mapPoint.png'
      const contentString =
          '<div id="content">' +
          '<div id="siteNotice">' +'<center><div><img src="'+Img+'" width="200" height="200" ></div></center>'+
          "</div>" +
          '<h1 id="firstHeading" class="firstHeading">'+'<center><b>Alerta '+TypeAlertArray[i]+'</b></center></h1>' +
          '<div id="bodyContent">' +
          "<h5><b>"+NameArray[i]+" "+LastNameArray[i]+"</b>, Envio una alerta de panico el dia <b>"+DateArray[i]+"</b>, a las <b>"+HourArray[i]+" </b>" +
          "quedando registrado en la central con la ubicación <b> "+LocationArray[i]+",</b> Numero de telefono:<b> "+PhoneArray[i]+
          '.</b><p><b>Latitude:</b> '+LatitudeArray[i]+' , <b>Longitude:</b> '+LongitudeArray[i] +
          "</h5>" +
          "</div>" +
          "</div>";
      
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(contentString);
                    infowindow.open(window.map, marker);
                }
            })(marker, i));
         }
      }



      // consulting Alert from SOS in Real Time Database
      const starCountRef = query(ref(db, 'SOS/'),orderByChild('last_time_stamp'),limitToLast(1));
      onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
        SetAlert(data);
      });

      function SetAlert(data){

            for(let i in data){

              var Name = data[i].Name;
              var LastName = data[i].LastName;
              var Date = data[i].Date;
              var Hour = data[i].Hour;
              var Location = data[i].Location;
              var Phone = data[i].Phone;
              var Latitude = data[i].latitude;
              var Longitude =data[i].longitude;
              var TypeAlert = data[i].Type_of_alert;

            
              Push.create('Alerta '+TypeAlert, {
                body: Name+" "+LastName+" ubicación "+Location+" Numero de telefono: "+Phone,
                icon: 'https://firebasestorage.googleapis.com/v0/b/boton-de-panico-bb93e.appspot.com/o/Avatars%2F8ImxaHRe80QpZJliUYwgaasUIPA3?alt=media&token=16a353d3-0781-4d44-88c8-e8df2b788b04',
                timeout: 8000,               // Timeout before notification closes automatically.
                vibrate: [100, 100, 100],    // An array of vibration pulses for mobile devices.
                onClick: function() {
                    // Callback for when the notification is clicked. 
                    console.log(this);
                }  
          });

    
    Swal.fire({

      icon:'warning',
      title: 'Alerta '+TypeAlert+'!',
      html: Name+' '+LastName+' envio una alerta en la ubicación '+Location+ ' Numero de telefono: '+Phone,
      timer: 15000,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Centrar en el mapa',
      cancelButtonText:'Cerrar',
      timerProgressBar: true,
      
      
        }).then((result) => {
          if (result.isConfirmed) {
            centerFromMap(Latitude,Longitude,Name,LastName,Date,Hour,Location,Phone,TypeAlert);
                 
          }
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
        } 
      }

  
  function centerFromMap(latitude,longitude,name,lastName,date,hour,location,phone,typeAlert){
    const center = new google.maps.LatLng(latitude, longitude);
    window.map.panTo(center);
    window.map.setZoom(18);
  }


  
  CloseSesion.addEventListener('click', closeSesion);
  function closeSesion(){
      signOut(auth).then(() =>{
        console.log("Sesiòn cerrada");
        alert("Sesion cerrada");
        window.location = '../index.html';   
      })
      .catch((error) => {
         alert("Ocurrio un error cerrando la sesión");
      });
  }