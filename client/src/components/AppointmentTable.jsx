import styles from './AppointmentTable.module.css';

function formatDate(date, locale) {
  return new Date(date).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function AppointmentTable({
  appointments,
  locale,
  labels,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  actions = () => null,
}) {
  const allSelected = appointments.length > 0 && appointments.every((appointment) => selectedIds.includes(appointment._id));

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {selectable ? (
              <th>
                <input type="checkbox" checked={allSelected} onChange={() => onSelectAll?.(allSelected)} />
              </th>
            ) : null}
            <th>{labels.patient}</th>
            <th>{labels.date}</th>
            <th>{labels.time}</th>
            <th>{labels.service}</th>
            <th>{labels.status}</th>
            <th>{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              {selectable ? (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(appointment._id)}
                    onChange={() => onToggleSelect?.(appointment._id)}
                  />
                </td>
              ) : null}
              <td>{appointment.patientName}</td>
              <td>{formatDate(appointment.date, locale)}</td>
              <td>{appointment.time}</td>
              <td>{appointment.service}</td>
              <td>
                <span className={`pill status-${appointment.status}`}>{labels[appointment.status]}</span>
              </td>
              <td>{actions(appointment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
