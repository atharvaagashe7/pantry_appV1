// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb3Ly9YC3-P34DfYaV1WpbTRdUiPda9Bg",
  authDomain: "fbpantryapp.firebaseapp.com",
  projectId: "fbpantryapp",
  storageBucket: "fbpantryapp.appspot.com",
  messagingSenderId: "168677757005",
  appId: "1:168677757005:web:d9ee88a507c17e24980c04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}