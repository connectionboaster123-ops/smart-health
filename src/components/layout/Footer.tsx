import { Link } from "react-router-dom";
import { HeartPulse, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-clinical-700 text-white">
              <HeartPulse size={22} aria-hidden="true" />
            </span>
            <span className="text-lg font-black text-slate-950 dark:text-white">MediRescue</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
            A connected emergency healthcare platform for ambulance dispatch, doctor bookings, telemedicine, medical records, and operational oversight.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">Patients</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/doctors">Find doctors</Link>
            <Link to="/ambulance">Request ambulance</Link>
            <Link to="/book-doctor">Book appointment</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">Platform</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/doctor">Doctor dashboard</Link>
            <Link to="/provider">Provider dashboard</Link>
            <Link to="/admin">Admin console</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">Contact</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2"><Phone size={15} /> 911-ready dispatch</span>
            <span className="flex items-center gap-2"><Mail size={15} /> care@medirescue.local</span>
            <span className="flex items-center gap-2"><MapPin size={15} /> Citywide coverage</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        MediRescue is a healthcare platform template. Connect licensed emergency services before production use.
      </div>
    </footer>
  );
}
