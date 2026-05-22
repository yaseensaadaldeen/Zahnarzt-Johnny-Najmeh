const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('dentistToken') : null;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export interface Appointment {
  _id: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PublicAppointment {
  id: string;
  date: string;
  time: string;
  service: string;
  status: string;
}

export interface Settings {
  workingHours: { start: string; end: string };
  breakStart: string;
  breakEnd: string;
  holidays: string[];
}

export const appointmentsApi = {
  getPublic: () => request<PublicAppointment[]>(`${API_BASE}/appointments/public`),
  getTimeslots: (date: string) =>
    request<{ date: string; availableTimes: string[]; bookedTimes: string[]; outTimes?: any[]; reason?: string }>(`${API_BASE}/appointments/timeslots?date=${date}`),
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Appointment[]>(`${API_BASE}/appointments${query}`);
  },
  create: (payload: Partial<Appointment>) =>
    request<Appointment>(`${API_BASE}/appointments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<Appointment>) =>
    request<Appointment>(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  updateStatus: (id: string, status: string) =>
    request<Appointment>(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) =>
    request<void>(`${API_BASE}/appointments/${id}`, { method: 'DELETE' }),
  bulkDelete: (ids: string[]) =>
    request<void>(`${API_BASE}/appointments/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),
  bulkApprove: (ids: string[]) =>
    request<void>(`${API_BASE}/appointments/bulk-approve`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),
};

export const settingsApi = {
  get: () => request<Settings>(`${API_BASE}/settings`),
  update: (payload: Partial<Settings>) =>
    request<Settings>(`${API_BASE}/settings`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

export const authApi = {
  verifyDentistCode: (code: string) =>
    request<{ success: boolean }>(`${API_BASE}/auth/dentist-code`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
};

export interface WeeklyShift {
  _id?: string;
  dayOfWeek: number;
  start: string;
  end: string;
  enabled: boolean;
}

export interface OutTime {
  _id?: string;
  date: string;
  reason?: string;
  allDay: boolean;
  start?: string;
  end?: string;
}

export interface Availability {
  _id?: string;
  weeklyShifts: WeeklyShift[];
  outTimes: OutTime[];
}

export const availabilityApi = {
  get: () => request<Availability>(`${API_BASE}/availability`),
  updateWeekly: (weeklyShifts: WeeklyShift[]) =>
    request<Availability>(`${API_BASE}/availability/weekly`, {
      method: 'PUT',
      body: JSON.stringify({ weeklyShifts }),
    }),
  addOutTime: (payload: Partial<OutTime>) =>
    request<Availability>(`${API_BASE}/availability/out-times`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateOutTime: (id: string, payload: Partial<OutTime>) =>
    request<Availability>(`${API_BASE}/availability/out-times/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteOutTime: (id: string) =>
    request<Availability>(`${API_BASE}/availability/out-times/${id}`, {
      method: 'DELETE',
    }),
};
