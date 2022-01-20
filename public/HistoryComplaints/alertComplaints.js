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
  var x = document.getElementById("myDIV")
  var NoData = document.getElementById("NoData")
  var CloseSesion  = document.getElementById('cerrar-sesion');
   
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("sesion ya iniciada");      
      } 
        else {
          window.location = '../index.html';
        }
      });

    const dbRef = ref(getDatabase());
    get(child(dbRef, 'Incident_Notification')).then((snapshot) => {
    if (snapshot.exists()) {
    snapshot.forEach(element => {

        const AlertComplaintData= element.val()
        x.style.visibility = "hidden";
        
              AlertsSOSTable.innerHTML += `<tr>
              <td>${AlertComplaintData.Date+"/"+AlertComplaintData.Hour}</td>
              <td>${AlertComplaintData.Id_Incident}</td>
              <td>${AlertComplaintData.Name+" "+AlertComplaintData.LastName}</td>
              <td>${AlertComplaintData.NumberPhone}</td>
              <td>${AlertComplaintData.Email}</td>
              <td>${AlertComplaintData.TitleComplaint}</td>
              <td>${AlertComplaintData.Status}</td>
              <td>
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button class = "btn btn-warning btn-sm" data-id="${AlertComplaintData.Uid}">
              ver 
              </button>
              <button class = "btn btn-dark btn-sm" data-id="${AlertComplaintData.Uid}">
              Eliminar
              </button>
              <button class = "btn btn-info btn-sm" data-id="${AlertComplaintData.Uid}">
              Comentarios
              </button>
              </div>
              </td>
              </tr>`
        
              const ButtonsDelete = document.querySelectorAll('.btn-dark')
              const ButtonsSeeAlert = document.querySelectorAll('.btn-warning')
              const ButtonsComments = document.querySelectorAll('.btn-info')
              const db = getDatabase();
                      

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
               
                    remove(ref(db, `Incident_Notification/${e.target.dataset.id}`)).then(() =>{
                    window.location = '/HistoryComplaints/AlertsComplaints.html';
                    })
                    .catch((error) => {
                      alert("Error al eliminar el registro: "+error)
                    });;
                      }
                    })
                  })
                });

        
 // ver detalles de la alerta

            ButtonsSeeAlert.forEach((button) =>{
            button.addEventListener('click', (e) =>{
            console.log(e.target.dataset.id)

                get(child(dbRef, `Incident_Notification/${e.target.dataset.id}`)).then((snapshot) => {
                if (snapshot.exists()) {
                console.log(snapshot.val());
                const Data= snapshot.val()
                var dataNull 
                var comentsNull
                if (typeof Data.IncidentComplaint === 'undefined'){dataNull ='Sin evidencia'} 
                else{dataNull = '<p><a target="_blank" href="'+Data.IncidentComplaint+'">Ver</a></p>'}

                if(Data.Comments == ""){comentsNull = 'Sin Comentarios'}
                else{comentsNull=Data.Comments}
            
                  Swal.fire({
                  title: Data.Type_of_alert,
                  icon:"warning",
                  html:
                  '<p>Registrada por '+Data.Name+' '+Data.LastName+', a continuacion se mostraran los detalles de la denuncia:</p>'+
                  '<h5>'+Data.TitleComplaint+'</h5>'+
                  '<p>'+Data.Description+'</p>'
                  +'<h5>Evidencia</h5>'+dataNull+
                  '<h5>Comentarios de la central</h5>'+
                  '<p>'+comentsNull+'</p>',
                 
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
                      update(ref(db, `Incident_Notification/${e.target.dataset.id}`),{
                        Status: result.value
                        }).then(() => {
                          //Task Success
                          window.location = '/HistoryComplaints/AlertsComplaints.html';
                        })
                        .catch((error) => {
                        // The write failed...
                        Swal.fire({
                          title: 'Error actualizando el status',
                          body: error
                          
                          })
                        });
                    }});
  
              } else {

                console.log("No datos available");
              }
            }).catch((error) => {
              console.error(error);
            });

          })
        })
//...
// Agregar comentarios...

          ButtonsComments.forEach((button) =>{
          button.addEventListener('click', (e) =>{
            Swal.fire({
                  imageUrl: 'coments.png',
                  imageWidth: 300,
                  imageHeight: 200,
                  title:'Agregar comentarios al incidente',
                  input: 'textarea',
                  html: 'Los comentarios podrá visualizarlos la persona que genero la denuncia actual através de su dispositivo movil.',
                  inputPlaceholder: 'Escribe tu comentario aqui...',
                  inputAttributes: {
                    'aria-label': 'Escribe tu comentario aqui'
                  },
                      showCancelButton: true
                      }).then((result) => {
                      if (result.value) {
                      update(ref(db, `Incident_Notification/${e.target.dataset.id}`),{
                      Comments: result.value
                        }).then(() => {
                          //Task Success
                          window.location = '/HistoryComplaints/AlertsComplaints.html';
                        })
                        .catch((error) => {
                         // The write failed...
                        Swal.fire({
                        title: 'Error actualizando el status',
                        body: error
                        })
                      });
                    }});
                  })
               });
              });


          } else {
                  
                x.style.visibility = "hidden";
                NoData.innerHTML += `<h4>No hay denuncias actualmente</h4>`
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



