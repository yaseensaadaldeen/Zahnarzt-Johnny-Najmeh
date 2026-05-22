import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDJkMptOkCYtBTi2N3CsEyr9VwbIOdCB5w",
  authDomain: "dentist-johnny-najmeh.firebaseapp.com",
  projectId: "dentist-johnny-najmeh",
  storageBucket: "dentist-johnny-najmeh.firebasestorage.app",
  messagingSenderId: "387052533736",
  appId: "1:387052533736:web:6e106c8e267d5e8e35d65d",
  measurementId: "G-44CDR5BBXT"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
