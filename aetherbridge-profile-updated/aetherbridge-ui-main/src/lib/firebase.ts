/// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQPDB7Xvm9Q4YNm75GM_GK_zSJ9KTc5eg",
  authDomain: "ather-bridge.firebaseapp.com",
  projectId: "ather-bridge",
  storageBucket: "ather-bridge.firebasestorage.app",
  messagingSenderId: "500969485452",
  appId: "1:500969485452:web:74dfc2f5ece0f5f6a6b7a9",
  measurementId: "G-ND3DYDMEH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);