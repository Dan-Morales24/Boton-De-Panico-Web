
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import {getAuth,  signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getDatabase, get,query, ref,orderByChild,equalTo, child} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";

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
const getStateAuth = getAuth(app);
const signIn = document.querySelector('#sign-in');
var nerror = document.getElementById("notificationError");
var x = document.getElementById("myDIV");
var login = document.getElementById("sign-in");
const db = getDatabase();
     

onAuthStateChanged(getStateAuth, (user) => {
  if (user) {
    const uid = user.uid;
    window.location = 'dashboard/dashboard.html';
    console.log("sesion ya iniciada");  
    
  } 
    else {
      login.style.visibility="visible";
    }
  });
  
  signIn.addEventListener('submit',(e) =>{
    e.preventDefault();

    
    const signInEmail = document.querySelector("#email").value;
    const signInPassword = document.querySelector("#password").value;
    UserExist(signInEmail, signInPassword);

  })


    function UserExist(email,password){

      x.style.visibility = "visible";
      nerror.style.display = "none";

      get(query(ref(db, 'UsersDashboard/'),orderByChild('Email'),equalTo(email))).then((snapshot) => {
        if (snapshot.exists()) {

          loginCheck(email,password)


        }
          else{

            x.style.visibility = "hidden";  
            nerror.style.display = "block";
             



          }}).catch((error) => {
            console.error(error);
          });



      

    }



  //function Login Check()
   function loginCheck(email,password){

    x.style.visibility = "visible";
    nerror.style.display = "none";
    
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          
        // Signed in
        const user = userCredential.user;
        console.log("Registrado :"+user)  
        x.style.visibility = "hidden";
        window.location = 'dashboard/dashboard.html';
          
        // ...
        
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          x.style.visibility = "hidden";
          console.log(errorMessage)  
          nerror.style.display = "block";

        });
    }
