import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div className="max-w-md">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-clinical-50 text-clinical-700 dark:bg-clinical-950/40 dark:text-clinical-200">
          <SearchX size={34} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-black text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          The page you requested is not available in MediRescue.
        </p>
        <Link to="/">
          <Button className="mt-6" leftIcon={<Home size={18} aria-hidden="true" />}>
            Return home
          </Button>
        </Link>
      </div>
    </main>
  );
}
