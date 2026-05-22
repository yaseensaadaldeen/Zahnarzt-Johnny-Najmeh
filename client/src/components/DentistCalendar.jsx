import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import allLocales from '@fullcalendar/core/locales-all';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import CenteredCard from './CenteredCard';
import { appointmentsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './DentistCalendar.module.css';

export default function DentistCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    appointmentsApi.getPublic().then(setAppointments).catch(() => setAppointments([]));
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);

    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  const events = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id,
        title: appointment.service,
        start: appointment.date,
        allDay: true,
        extendedProps: {
          time: appointment.time,
          service: appointment.service,
        },
      })),
    [appointments]
  );

  const selectedAppointments = useMemo(() => {
    if (!selectedDay) return [];

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date).toISOString().slice(0, 10);
      return appointmentDate === selectedDay;
    });
  }, [appointments, selectedDay]);

  return (
    <CenteredCard className="surface-card" hover={false}>
      <div className={styles.calendarShell} style={{ padding: '24px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          locales={allLocales}
          locale={language === 'de' ? 'de' : 'en'}
          headerToolbar={{ left: 'prev,next', center: 'title', right: '' }}
          events={events}
          fixedWeekCount={false}
          dayMaxEvents={isMobile ? 2 : 3}
          eventDisplay="block"
          dateClick={(info) => setSelectedDay(info.dateStr)}
          eventClick={(info) => setSelectedDay(info.event.startStr.slice(0, 10))}
          eventContent={(eventInfo) => (
            <div className={styles.calendarEvent}>
              <span className={styles.calendarEventTime}>{eventInfo.event.extendedProps.time}</span>
              <span className={styles.calendarEventService}>{eventInfo.event.extendedProps.service}</span>
            </div>
          )}
        />

        <div className={styles.selectedPanel}>
          <h3 className={styles.selectedTitle}>
            {selectedDay
              ? `${t({ de: 'Termine am', en: 'Appointments on' })} ${selectedDay}`
              : t({ de: 'Tag auswaehlen', en: 'Select a day' })}
          </h3>
          {selectedAppointments.length ? (
            <div className={styles.selectedList}>
              {selectedAppointments.map((appointment) => (
                <div key={appointment.id} className={`surface-card ${styles.selectedItem}`}>
                  <strong className={styles.selectedTime}>{appointment.time}</strong>
                  <span>{appointment.service}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted" style={{ marginBottom: 0 }}>
              {t({
                de: 'Im oeffentlichen Kalender werden nur Zeit und Leistung angezeigt.',
                en: 'The public calendar shows only the appointment time and service.',
              })}
            </p>
          )}
        </div>
      </div>
    </CenteredCard>
  );
}
