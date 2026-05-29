import { LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState([
    { name: "Production Overview", widgets: 12, updated: "2 min ago" },
    { name: "Revenue Analytics", widgets: 8, updated: "15 min ago" },
    { name: "Error Tracking", widgets: 6, updated: "1 hour ago" },
    { name: "User Engagement", widgets: 10, updated: "30 min ago" },
  ]);

  const { t } = useTranslation("common");
  const createDashboard = () => {
    const name = window.prompt(t('dashboard_name_prompt', { defaultValue: 'Dashboard name?' }));
    if (!name?.trim()) return;
    setDashboards(d => [{ name: name.trim(), widgets: 0, updated: "just now" }, ...d]);
    toast.success(t('dashboard_created', { defaultValue: 'Dashboard created' }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">{t('custom_dashboards', { defaultValue: 'Custom Dashboards' })}</h2>
        <button onClick={createDashboard} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-md hover:bg-primary/90 transition-colors">
          + {t('new_dashboard', { defaultValue: 'New Dashboard' })}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {dashboards.map((d) => (
          <div key={d.name} onClick={() => toast(d.name, { description: `${d.widgets} ${t('widgets', { defaultValue: 'widgets' })} · ${t('updated', { defaultValue: 'Updated' })} ${d.updated}` })} className="dd-panel p-4 hover:bg-accent/30 cursor-pointer transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{d.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{d.widgets} {t('widgets', { defaultValue: 'widgets' })}</span>
              <span>{t('updated', { defaultValue: 'Updated' })} {d.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
