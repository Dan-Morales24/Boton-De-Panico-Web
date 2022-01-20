import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import {getAuth,  signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getDatabase, get,query, ref,orderByChild,equalTo, child} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";

    
var CloseSesion  = document.getElementById('cerrar-sesion');
   
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


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const getStateAuth = getAuth(app);
const db = getDatabase();
const NotificationsUsers = document.getElementById('NotificationsUsers')
const ComplaintsUsers = document.getElementById('ComplaintsUsers')
const AlertsSOSPending = document.getElementById('AlertsSOSPending')
const AlertsSOSAttend = document.getElementById('AlertsSOSAttend')
const DashboardSOSTable=document.getElementById('DashboardSOS-Table')
const NoData = document.getElementById('NoData')
 

onAuthStateChanged(getStateAuth, (user) => {
    if (user) {
      const uid = user.uid;
      // ...
    } else {
      window.location = '../index.html';  
    }
  });

        CloseSesion.addEventListener('click', closeSesion);
        function closeSesion(){
            signOut(auth).then(() =>{
            console.log("Sesiòn cerrada");
            alert("Sesion cerrada");
            window.location = '../index.html';   
            }).catch((error) => {
              alert("Ocurrio un error cerrando la sesión");
            });
          }

         
          const dbRef = ref(getDatabase());
          var SOSLength
          var SOSPendingLength
          var ComplaintsLength
          var NotificationsLength
          

          get(query(ref(db, 'SOS/'),orderByChild('Status'),equalTo('Pendiente'))).then((snapshot) => {
            if (snapshot.exists()) {

              SOSLength = snapshot.size
              consultingSOSPending(SOSLength)

            } else {
              console.log("No hay datos disponibles pendientes");
              SOSLength = 0;
              consultingSOSPending(SOSLength)
            }
          }).catch((error) => {
            console.error(error);
          });




          

              function consultingSOSPending(sosLength){

                get(query(ref(db, 'SOS/'),orderByChild('Status'),equalTo('Visto'))).then((snapshot) => {
                if (snapshot.exists()) {
                  SOSPendingLength = snapshot.size
                  consultingComplaintsPending(sosLength,SOSPendingLength)
    
                } else {
                  SOSPendingLength = 0
                  consultingComplaintsPending(sosLength,SOSPendingLength)
                }
                  }).catch((error) => {
                    console.error(error);
                    });
                  }



             function consultingComplaintsPending(Data1,Data2){

              get(query(ref(db, 'Incident_Notification/'),orderByChild('Status'),equalTo('Pendiente'))).then((snapshot) => {
                if (snapshot.exists()) {
                  ComplaintsLength = snapshot.size
                  consultingNotificationsSend(Data1,Data2,ComplaintsLength)
    
                } else {            
                  ComplaintsLength = 0
                  consultingNotificationsSend(Data1,Data2,ComplaintsLength)
                  console.log("No existen datos en estado visto")
                
                }
              }).catch((error) => {
                console.log(error);
              });
    
         

              }


              function consultingNotificationsSend(Data1,Data2,Data3){

                  get(child(dbRef, `Notifications/`)).then((snapshot) => {
                  if (snapshot.exists()) {
                     NotificationsLength = snapshot.size
                     AddDataFromResult(Data1,Data2,Data3,NotificationsLength)
                      } else {
                            NotificationsLength = 0
                            AddDataFromResult(Data1,Data2,Data3,NotificationsLength)
                            }
                            }).catch((error) => {
                             console.error(error);
                            });
                        }


              function AddDataFromResult(Data1,Data2,Data3,Data4){

                NotificationsUsers.innerHTML += `<div class="h5 mb-0 font-weight-bold text-gray-800">${Data4}</div>`
                ComplaintsUsers.innerHTML += `<div class="h5 mb-2 font-weight-bold text-gray-900">${Data3}</div>`
                AlertsSOSPending.innerHTML += `<div class="h5 mb-2 font-weight-bold text-gray-900">${Data1}</div>`
                AlertsSOSAttend.innerHTML += `<div class="h5 mb-2 font-weight-bold text-gray-900">${Data2}</div>`

                var chart = bb.generate({
                  data: {
                    columns: [
                      ["Denuncias", Data3],
                      ["Alertas pendientes", Data1],
                      ["Alertas vistas sin antender", Data2],
                    ],
                    type: "donut",
                 
                  },
                    donut: {
                    title: "Pendientes",
                  },
                    size: {
                    height: 450
                  },
                  bindto: "#donutChart",
                  });
                  consultingAlertSOS()
                  }

             function consultingAlertSOS(){

              get(child(dbRef, 'SOS')).then((snapshot) => {
                if (snapshot.exists()) {
                  snapshot.forEach(element => {
                  
                    const AlertSOSData= element.val()

                     

                    DashboardSOSTable.innerHTML += `<tr>
                    <td>${AlertSOSData.Date+"/"+AlertSOSData.Hour}</td>
                    <td>${AlertSOSData.Name+" "+AlertSOSData.LastName}</td>
                    <td>${AlertSOSData.Phone}</td>
                    <td>${AlertSOSData.Location}</td>
                    <td>${AlertSOSData.Id_Incident}</td>
                    <td>${AlertSOSData.Status}</td>
                    </tr>   
              `   



                  })
                  
             } else {

              NoData.innerHTML += `<h4>No hay alertas de panico</h4>`    
              console.log("No data available");
              }
              }).catch((error) => {
              console.error(error);
            });
              



              }