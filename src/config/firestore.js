import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpY-E-FN6h391W2-jyc91UJLAVOoCYFm4",
  authDomain: "employee-database-99db2.firebaseapp.com",
  projectId: "employee-database-99db2",
  storageBucket: "employee-database-99db2.firebasestorage.app",
  messagingSenderId: "470167916629",
  appId: "1:470167916629:web:c0ef4c5996de65090384dc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);