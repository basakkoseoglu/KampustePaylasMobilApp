// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {initializeAuth,getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5vS0tWM2GwJktlCQu22rITzqMD_shdjI",
  authDomain: "kampustepaylasapp.firebaseapp.com",
  projectId: "kampustepaylasapp",
  storageBucket: "kampustepaylasapp.firebasestorage.app",
  messagingSenderId: "702773645845",
  appId: "1:702773645845:web:5e66c375fef2489337341c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth=initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
});

//db
export const firestore=getFirestore(app);