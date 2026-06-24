import { Bell, CheckCircle2 } from "lucide-react";
import type { NotificationItem } from "../../types";
import { formatDateTime } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Card, CardHeader, CardTitle } from "../ui/Card";

export function NotificationPanel({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Notifications</CardTitle>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Booking, ambulance, payment, and system updates.</p>
        </div>
        <Bell className="text-clinical-700 dark:text-clinical-300" aria-hidden="true" size={22} />
      </CardHeader>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">{notification.title}</h4>
                  {notification.read ? <Badge tone="neutral">read</Badge> : <Badge tone="info">new</Badge>}
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notification.body}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(notification.createdAt)}</p>
              </div>
              {notification.read ? (
                <CheckCircle2 className="mt-1 text-emerald-600 dark:text-emerald-300" size={18} aria-hidden="true" />
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
