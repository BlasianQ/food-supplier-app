// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD20wlsuswmBYh1fkgMVzWlB9L7UO0gXKU",
  authDomain: "food-supplier-e5421.firebaseapp.com",
  projectId: "food-supplier-e5421",
  storageBucket: "food-supplier-e5421.firebasestorage.app",
  messagingSenderId: "322536136808",
  appId: "1:322536136808:web:72dd6d5bc1b093d780dbdd",
  measurementId: "G-LHW6W4EPK6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);