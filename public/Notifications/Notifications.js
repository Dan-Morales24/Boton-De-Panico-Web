// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import {getAuth,signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getDatabase, get, ref,update,remove, child } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";

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
  const AlertsSOSTable = document.getElementById('AlertsSOS-Table')
  var x = document.getElementById("myDIV");
  var CloseSesion  = document.getElementById('cerrar-sesion');
  var NoData = document.getElementById('NoData')
   

 
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

const dbRef = ref(getDatabase());
get(child(dbRef, 'Notifications')).then((snapshot) => {
  if (snapshot.exists()) {
    snapshot.forEach(element => {

        const AlertSOSData= element.val()
        var key = Object.keys(element.val())[0];
        x.style.visibility = "hidden";
        AlertsSOSTable.innerHTML += `<tr>
              <td>${AlertSOSData.Id}</td>
              <td>${AlertSOSData.Date+"/"+AlertSOSData.Hour}</td>
              <td>${AlertSOSData.TitleNotification}</td>
              <td>${AlertSOSData.NotificationType}</td>
              <td>
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button class = "btn btn-warning btn-sm" data-id="${AlertSOSData.Uid}">
              ver 
              </button>
              <button class = "btn btn-dark btn-sm" data-id="${AlertSOSData.Uid}">
              Eliminar
              </button>
              </div>
              </td>
              </tr>
            
        `
        
        const ButtonsDelete = document.querySelectorAll('.btn-dark')
        const ButtonsSeeAlert = document.querySelectorAll('.btn-warning')

        ButtonsDelete.forEach((button) =>{
          button.addEventListener('click', (e) =>{

            Swal.fire({
              title: 'Estas seguro que quieres eliminarlo?',
              text: "No podras deshacer los cambios!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Eliminar!'
            }).then((result) => {
              if (result.isConfirmed) {
               
                const db = getDatabase();
                remove(ref(db, `Notifications/${e.target.dataset.id}`)).then(() => {
                  window.location = '/Notifications/Notifications.html';
                })
                .catch((error) => {
                  alert("Error al eliminar el registro: "+error)
                });;
                  }
               })
            })
          });

        
        ButtonsSeeAlert.forEach((button) =>{
          button.addEventListener('click', (e) =>{
            console.log(e.target.dataset.id)

            get(child(dbRef, `Notifications/${e.target.dataset.id}`)).then((snapshot) => {
              if (snapshot.exists()) {
                console.log(snapshot.val());
                const Data= snapshot.val()
            Swal.fire({
              title: Data.Type_of_alert,
              imageUrl:Data.ImageNotification,
              imageWidth: 200,
              imageHeight: 200,
              html: '<h2><b>'+Data.TitleNotification+'</b></h2><br>'+
              '<table class="table table-sm">'+
              "<thead>"+
              "<tr>"+
              ' <th class="bg-primary" scope="col"><b>Hora</b></th>'+
              '<th class="bg-primary" scope="col"><b>fecha</b></th>'+
              " </tr>"+
              "</thead>"+
              "<tbody>"+
              "<tr>"+
              "<td>"+Data.Hour+"</td>"+
              "<td>"+Data.Date+"</td>"+
              "</tr>"+
              "</tbody>"+
              "</table>"+
              '<p style="font-style: italic;"><b>'+Data.NotificationType+'</b></p>'+
              "<p>"+Data.Description+"</p>",

             
              confirmButtonColor: 'green'
              });
  
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
              console.error(error);
            });

          })
        })

    });

  

  } else {
    x.style.visibility = "hidden";
    NoData.innerHTML += `<h4>No hay notificaciónes creadas</h4>`
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});


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



