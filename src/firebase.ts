import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase configuration
  apiKey: "AIzaSyCRsSloX7nZjzVcs-j4p0MsmgBTZbmBjp8",
  authDomain: "mosquetimes-b2a10.firebaseapp.com",
  projectId: "mosquetimes-b2a10",
  storageBucket: "mosquetimes-b2a10.firebasestorage.app",
  messagingSenderId: "645318070072",
  appId: "1:645318070072:web:abb8b963f0a410aeb53bcd",
  measurementId: "G-BNFRQVFLCM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
