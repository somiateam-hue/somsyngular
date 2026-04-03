import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            "AIzaSyAxY1d2FJIgq8KyBlHuM8JqxQWjYy_UAdo",
  authDomain:        "som-syngular.firebaseapp.com",
  projectId:         "som-syngular",
  storageBucket:     "som-syngular.firebasestorage.app",
  messagingSenderId: "314154988520",
  appId:             "1:314154988520:web:f6c48c5a2bb58941faaa5d",
};

const app        = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);
