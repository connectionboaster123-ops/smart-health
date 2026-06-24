import { Outlet } from "react-router-dom";
import { PublicHeader } from "./PublicHeader";
import { Footer } from "./Footer";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <PublicHeader />
      <Outlet />
      <Footer />
    </div>
  );
}
