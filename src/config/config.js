import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';  // Importando a parte de autenticação

const firebaseConfig = {
  apiKey: "AIzaSyCZI40cOWEVO5XiVYXFQiroBKhCMRLsz1o",
  authDomain: "leobeca-ad5b8.firebaseapp.com",
  databaseURL: "https://leobeca-ad5b8-default-rtdb.firebaseio.com",
  projectId: "leobeca-ad5b8",
  storageBucket: "leobeca-ad5b8.appspot.com",
  messagingSenderId: "627592096174",
  appId: "1:627592096174:web:39ce5fb194335a5d04003f",
  measurementId: "G-SV8EZL65FY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
