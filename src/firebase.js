import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyAdU-3xt_euef8AbX0tmfg-N_F11TkucEk",
        authDomain: "insta-clone-8b24e.firebaseapp.com",
        databaseURL: "https://insta-clone-8b24e.firebaseio.com",
        projectId: "insta-clone-8b24e",
        storageBucket: "insta-clone-8b24e.appspot.com",
        messagingSenderId: "103669593475",
        appId: "1:103669593475:web:fd4a21e6336b28477c32b6"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};