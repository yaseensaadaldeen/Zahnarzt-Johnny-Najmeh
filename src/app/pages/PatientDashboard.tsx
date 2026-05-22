import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Calendar, Clock, X, Edit, User, Settings, LogOut } from 'lucide-react';
import { appointmentsApi, Appointment } from '../services/api';

export function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+49 123 456 7890',
    address: 'Sample Street 123, Freiburg'
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await appointmentsApi.getAll();
        setAppointments(data);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const upcomingAppointments = appointments.filter(
    a => a.status === 'pending' || a.status === 'confirmed'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments.filter(
    a => a.status === 'completed' || a.status === 'cancelled'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await appointmentsApi.updateStatus(id, 'cancelled');
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Patient Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profileData.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-serif mx-auto mb-3">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="font-semibold">{profileData.name}</div>
                <div className="text-sm text-muted-foreground">{profileData.email}</div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'appointments' ? 'bg-primary text-white' : 'hover:bg-muted'
                  }`}
                >
                  <Calendar size={20} />
                  My Appointments
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-muted'
                  }`}
                >
                  <User size={20} />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-muted'
                  }`}
                >
                  <Settings size={20} />
                  Settings
                </button>
                <Link to="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive">
                  <LogOut size={20} />
                  Logout
                </Link>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl font-semibold">Upcoming Appointments</h2>
                    <Link to="/book">
                      <Button variant="primary">Book New Appointment</Button>
                    </Link>
                  </div>

                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <Card key={appointment._id} className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{appointment.service}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  appointment.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {appointment.status}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center gap-2">
                                  <User size={16} />
                                  {t('Zahnarzt Johnny Najmeh', 'Dentist Johnny Najmeh')}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="secondary" className="px-4 py-2">
                                <Edit size={16} className="mr-2" />
                                Reschedule
                              </Button>
                              <Button
                                variant="tertiary"
                                className="px-4 py-2 text-destructive hover:bg-destructive/10"
                                onClick={() => handleCancelAppointment(appointment._id)}
                              >
                                <X size={16} className="mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                      <Link to="/book">
                        <Button variant="primary">Book Your First Appointment</Button>
                      </Link>
                    </Card>
                  )}
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-6">Past Appointments</h2>
                  <div className="space-y-4">
                    {pastAppointments.length > 0 ? (
                      pastAppointments.map((appointment) => (
                        <Card key={appointment._id} className="p-6 opacity-75">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{appointment.service}</h3>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} />
                                  {appointment.time}
                                </div>
                              </div>
                            </div>
                            <Link to="/book">
                              <Button variant="secondary">Book Again</Button>
                            </Link>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <Card className="p-12 text-center">
                        <p className="text-muted-foreground">No past appointments</p>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <Card className="p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">Edit Profile</h2>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                  <Input
                    label="Address"
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                  <Button type="submit" variant="primary">Save Changes</Button>
                </form>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card className="p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>Email notifications for appointments</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>SMS reminders</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>Marketing communications</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <Input label="Current Password" type="password" />
                      <Input label="New Password" type="password" />
                      <Input label="Confirm New Password" type="password" />
                      <Button variant="primary">Update Password</Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3 text-destructive">Danger Zone</h3>
                    <Button variant="tertiary" className="text-destructive">Delete Account</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}