function Login(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password).
        then(())

}