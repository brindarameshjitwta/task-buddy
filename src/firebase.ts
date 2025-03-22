// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup,signInWithRedirect } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdY5Y6fMiu_Zxxn2LQ_qU_sJLqJP8DsMg",
  authDomain: "task-buddy-d72d9.firebaseapp.com",
  projectId: "task-buddy-d72d9",
  storageBucket: "task-buddy-d72d9.firebasestorage.app",
  messagingSenderId: "1050291343224",
  appId: "1:1050291343224:web:f698454ba542220566428d",
  measurementId: "G-L0SCEXEXBH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signInWithRedirect };