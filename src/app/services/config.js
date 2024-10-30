// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDDnc9WHXf4CWwXCVggeiarYGu_xBgibJY",
	authDomain: "eviusauth.firebaseapp.com",
	databaseURL: "https://eviusauth.firebaseio.com",
	projectId: "eviusauth",
	storageBucket: "eviusauth.appspot.com",
	messagingSenderId: "400499146867",
	appId: "1:400499146867:web:5d0021573a43a1df"
  };

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseDB = getFirestore(FirebaseApp);

export const firebaseRealtime = getDatabase(FirebaseApp);
