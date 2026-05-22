import { Link } from 'react-router';
import { Button } from '../components/Button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="font-serif text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/">
            <Button variant="primary">
              <Home size={20} className="mr-2" />
              Go Home
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="secondary">
              <ArrowLeft size={20} className="mr-2" />
              Go Back
            </Button>
          </button>
        </div>

        <div className="mt-12 p-6 bg-secondary rounded-2xl">
          <h2 className="font-semibold mb-2">Need Help?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            If you need assistance or want to book an appointment, feel free to contact us.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/services" className="text-primary hover:underline">Our Services</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/book" className="text-primary hover:underline">Book Appointment</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
