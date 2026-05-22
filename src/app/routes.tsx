import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Book } from './pages/Book';
import { Gallery } from './pages/Gallery';
import { Location } from './pages/Location';
import { Contact } from './pages/Contact';
import { DentistControlPanel } from './pages/DentistControlPanel';
import { DentistShiftManager } from './pages/DentistShiftManager';
import { DentistRouteGuard } from './components/DentistRouteGuard';
import { AdminPanel } from './pages/AdminPanel';
import { NotFound } from './pages/NotFound';

function GuardedControlPanel() {
  return <DentistRouteGuard><DentistControlPanel /></DentistRouteGuard>;
}

function GuardedShiftManager() {
  return <DentistRouteGuard><DentistShiftManager /></DentistRouteGuard>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'services', Component: Services },
      { path: 'services/:id', Component: ServiceDetail },
      { path: 'book', Component: Book },
      { path: 'gallery', Component: Gallery },
      { path: 'location', Component: Location },
      { path: 'contact', Component: Contact },
      { path: 'dentist/control-panel', Component: GuardedControlPanel },
      { path: 'dentist/shifts', Component: GuardedShiftManager },
      { path: 'admin-panel', Component: AdminPanel },
      { path: '*', Component: NotFound },
    ],
  },
]);
