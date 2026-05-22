import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../environments/environment';

// Firebase app inicializalas az environment configgal.
const firebaseApp = initializeApp(environment.firebase);

// Kozponti export, hogy minden service ugyanazt a kapcsolatot hasznalja.
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
