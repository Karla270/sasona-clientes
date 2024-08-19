// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD389EMn7azI0Rx0-zs0LKoeDHr_0LtVh8",
  authDomain: "clientes-sasona.firebaseapp.com",
  projectId: "clientes-sasona",
  storageBucket: "clientes-sasona.appspot.com",
  messagingSenderId: "535121900098",
  appId: "1:535121900098:web:6e4af83496ed0b17e9b3db",
  measurementId: "G-F94KMSZBLD"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

