// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import {getAuth,signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getDatabase, get, ref,update,remove,child } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";

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
get(child(dbRef, 'SOS')).then((snapshot) => {
  if (snapshot.exists()) {
    snapshot.forEach(element => {

        const AlertSOSData= element.val()
        var key = Object.keys(element.val())[0];
        x.style.visibility = "hidden";
        AlertsSOSTable.innerHTML += `<tr>
              <td>${AlertSOSData.Date+"/"+AlertSOSData.Hour}</td>
              <td>${AlertSOSData.Name+" "+AlertSOSData.LastName}</td>
              <td>${AlertSOSData.Phone}</td>
              <td>${AlertSOSData.Location}</td>
              <td>${AlertSOSData.Id_Incident}</td>
              <td>${AlertSOSData.Status}</td>
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
                remove(ref(db, `SOS/${e.target.dataset.id}`)).then(() => {
                  window.location = '/HistoryAlerts/AlertsSOS.html';
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

            get(child(dbRef, `SOS/${e.target.dataset.id}`)).then((snapshot) => {
              if (snapshot.exists()) {
                console.log(snapshot.val());
                const Data= snapshot.val()
            Swal.fire({
              title: Data.Type_of_alert,
              icon:"warning",
              footer: '<a target="_blank" href="https://maps.google.com/?q='+Data.latitude+','+Data.longitude+'&z=14">Ver en el mapa</a>',
              text: "El dia "+Data.Date+" "+Data.Name+" "+Data.LastName+" envio una alerta, fue registrada "+
              "a las "+Data.Hour+" quedando registrado en la ubicacion "+Data.Location+". Actualemente el status de esta alerta es "+Data.Status,
              input: 'select',
              inputOptions: {
                
                  Pendiente: 'Pendiente',
                  Visto: 'Visto',
                  Atendido: 'Atendido'
                
              },inputPlaceholder: 'Status',
              showCancelButton: true ,
              confirmButtonColor: 'green'
              }).then((result) => {
              if (result.value) {

                const db = getDatabase();
                update(ref(db, `SOS/${e.target.dataset.id}`), {
                  Status: result.value
                
                  }).then(() => {
                    // Data saved successfully!
                    window.location = '/HistoryAlerts/AlertsSOS.html';
                  
                  })
                  .catch((error) => {
                    // The write failed...
                    alert("Error actualizando el status: "+error)
                  });;

              }});
  
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
    NoData.innerHTML += `<h4>No hay alertas de panico</h4>`
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



