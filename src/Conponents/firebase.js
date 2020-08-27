import firebse from "firebase";

const fireBaseApp = firebse.initializeApp({
  apiKey: "AIzaSyB0HA0hoqK-kf0lmIlFn_7yehx-5UzDCJg",
  authDomain: "instagram-react-cb829.firebaseapp.com",
  databaseURL: "https://instagram-react-cb829.firebaseio.com",
  projectId: "instagram-react-cb829",
  storageBucket: "instagram-react-cb829.appspot.com",
  messagingSenderId: "747441870886",
  appId: "1:747441870886:web:de3e2b971b10adc47deee7",
  measurementId: "G-64Q1EEJ8HB",
});

const auth = fireBaseApp.auth();
const db = fireBaseApp.firestore();
const storage = fireBaseApp.storage();

export { db, auth, storage };
