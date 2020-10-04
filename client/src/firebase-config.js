import firebase from 'firebase/app';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyAp6Dt-bbWsntCQmQ89XGlV9RPxV0kbEUM',
  authDomain: 'twitter-clone-dbe75.firebaseapp.com',
  databaseURL: 'https://twitter-clone-dbe75.firebaseio.com',
  projectId: 'twitter-clone-dbe75',
  storageBucket: 'twitter-clone-dbe75.appspot.com',
  messagingSenderId: '89889572893',
  appId: '1:89889572893:web:a00c82c218ba607a6d1ef4',
  measurementId: 'G-1SB6F3GWST'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export { storage, firebase as default };
