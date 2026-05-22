import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../firebase";

const VAPID_KEY = "BKlM8lyALXqPmV63q2xvAJ4B_IjzY_GKGK1FqDPz3lYT-s2ChAZ2Z84h0K2tq9dqpGl-b0HFoezIFQ44OECVV1I";

interface StoredAppointment {
  id: string;
  date: string;
  time: string;
  service: string;
  notified24h?: boolean;
  notified1h?: boolean;
}

const STORAGE_KEY = "dr_najmeh_appointments";

function getStoredAppointments(): StoredAppointment[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAppointments(appointments: StoredAppointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function showBrowserNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      icon: "/images/treatment_room.jpg",
      badge: "/images/treatment_room.jpg",
      ...options,
    });
  } catch {
    // fallback if notification fails silently
  }
}

export async function setupFCM(): Promise<boolean> {
  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      console.log("FCM token obtained");
      onMessage(messaging, (payload) => {
        if (payload.notification) {
          showBrowserNotification(payload.notification.title || "Zahnarzt Johnny Najmeh", {
            body: payload.notification.body,
          });
        }
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function storeAppointment(appointment: { id: string; date: string; time: string; service: string }) {
  const appointments = getStoredAppointments();
  if (!appointments.find(a => a.id === appointment.id)) {
    appointments.push({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      service: appointment.service,
      notified24h: false,
      notified1h: false,
    });
    saveAppointments(appointments);
  }
}

export function notifyBookingConfirmation(service: string, date: string, time: string) {
  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("de-DE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  showBrowserNotification("Termin gebucht – Zahnarzt Johnny Najmeh", {
    body: `${service} am ${formattedDate} um ${time} Uhr`,
  });
}

export function checkUpcomingAppointments() {
  const appointments = getStoredAppointments();
  const now = new Date();
  let updated = false;

  for (const apt of appointments) {
    const aptDate = new Date(apt.date + "T" + apt.time + ":00");
    const diffMs = aptDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs < 0) continue;

    if (!apt.notified24h && diffHours <= 24 && diffHours > 0) {
      showBrowserNotification("Morgen Termin – Zahnarzt Johnny Najmeh", {
        body: `Erinnerung: ${apt.service} morgen um ${apt.time} Uhr`,
      });
      apt.notified24h = true;
      updated = true;
    }

    if (!apt.notified1h && diffHours <= 1 && diffHours > 0) {
      showBrowserNotification("Termin in Kürze – Zahnarzt Johnny Najmeh", {
        body: `${apt.service} um ${apt.time} Uhr – bald bei uns erwartet`,
      });
      apt.notified1h = true;
      updated = true;
    }
  }

  if (updated) saveAppointments(appointments);
}

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      return registration;
    } catch {
      return null;
    }
  }
  return null;
}

export async function initNotifications() {
  await registerServiceWorker();
  const granted = await requestNotificationPermission();
  if (granted) {
    setupFCM();
    checkUpcomingAppointments();
    setInterval(checkUpcomingAppointments, 60000);
  }
}
