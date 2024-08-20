// Your web app's Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAeU1uXZDnJdqiPg7QvAMCUDX2D3MAA1Xo",
    authDomain: "bookingsheet-e5958.firebaseapp.com",
    projectId: "bookingsheet-e5958",
    storageBucket: "bookingsheet-e5958.appspot.com",
    messagingSenderId: "124505706846",
    appId: "1:124505706846:web:d152545b05cc6a30b23fcf"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);
