// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import {getAuth,  signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

    
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
