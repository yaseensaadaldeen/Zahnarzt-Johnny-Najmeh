importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDJkMptOkCYtBTi2N3CsEyr9VwbIOdCB5w",
  authDomain: "dentist-johnny-najmeh.firebaseapp.com",
  projectId: "dentist-johnny-najmeh",
  storageBucket: "dentist-johnny-najmeh.firebasestorage.app",
  messagingSenderId: "387052533736",
  appId: "1:387052533736:web:6e106c8e267d5e8e35d65d",
  measurementId: "G-44CDR5BBXT",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Zahnarzt Johnny Najmeh";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/images/treatment_room.jpg",
    badge: "/images/treatment_room.jpg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
