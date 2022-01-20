// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import {getStorage,uploadBytes,getDownloadURL,ref as Sref} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-storage.js";
import {getAuth,signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getDatabase, set,ref} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
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
  const storage = getStorage(app);


  const SendData = document.getElementById('send-notification');
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


      SendData.addEventListener('submit',(e) =>{
        e.preventDefault();
        const Id = `${Math.round(Math.random()*(99999-10000)+parseInt(10000))}`;
        const Uid =  uuidv4();
        const Title = SendData['Title'].value;
        const Date = SendData['Date'].value;
        const Hour = SendData['Hour'].value;
        const TypeNotification = SendData['TypeNotification'].value
        const ResumeNotification = SendData['ResumeNotification'].value
        const NameImage = SendData['inputFileNotification'].value


        if(NameImage){
            
          const blobFile = SendData['inputFileNotification'].files[0];
          const archivoRef = Sref(storage,'Notifications/'+blobFile.name);
            uploadBytes(archivoRef,blobFile).then((snapshot) => {
              console.log('Archivo subido');
              var dataImage = `${blobFile.name}`
              
              getDownloadURL(Sref(storage, '/Notifications/'+dataImage))
              .then((url) => {
              console.log("La URL es "+url)
              set(ref(db, 'Notifications/' + Uid), {
              Uid:Uid,
              Date: Date,
              Hour:Hour,
              TitleNotification:Title,
              Description:ResumeNotification,
              NotificationType:TypeNotification,
              Id:Id,
              ImageNotification:url
              }).then(() => {
              //Task Success
              SendNotificationToMobile(Title,ResumeNotification)
            //  window.location = '/SendNotifications/SendNotifications.html';
              })
              .catch((error) => {
              // The write failed...
              Swal.fire({
              title: 'Error actualizando el status reintente',
              body: error
              })});
              
              })
              .catch((error) => {
              // Handle any errors
              Swal.fire({
              title: 'Error cargando la imagen reintente',
              body: error
              })
              });
        
            }).catch((error) => {
              // Handle any errors
              console.log(error)
            });



        }else{

          set(ref(db, 'Notifications/' + Uid), {
            Uid:Uid,
            Date: Date,
            Hour:Hour,
            TitleNotification:Title,
            Description:ResumeNotification,
            NotificationType:TypeNotification,
            Id:Id,
            ImageNotification:""
            }).then(() => {
            //Task Success
          //  window.location = '/SendNotifications/SendNotifications.html';
            SendNotificationToMobile(Title,ResumeNotification)
            })
            .catch((error) => {
            // The write failed...
            Swal.fire({
            title: 'Error actualizando el status reintente',
            body: error
            })
          });
         
         }
      
       })


      

        function SendNotificationToMobile(title,description){

          $.ajax({        
            type : 'POST',
            url : "https://fcm.googleapis.com/fcm/send?",
            headers : {
                Authorization : 'key=' + 'AAAAsQKUjic:APA91bE7HDGUdOP3Un6i8-me3tQAECYGUTAVzg7sT2XVScfARPYLfVTP-HQ3YWMmJLax0J1iYngl4uQdqPhuU2khXpQyp2WEVXUthVaQZ9mJuezcjR-qy3RobxvSqCWj3wY5vZrGvK1J'
            },
            contentType : 'application/json',
            dataType: 'json',
            data: JSON.stringify({"to": "/topics/notifications", "notification": {
              "title":title,
              "body":description
              }}),
            success : function(response) {
                console.log(response);
                  window.location = '/SendNotifications/SendNotifications.html';
            },
            error : function(xhr, status, error) {
                console.log(xhr.error);                   
            }
        });

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



