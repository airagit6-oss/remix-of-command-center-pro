import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, XCircle, Clock, Trash2, Eye, Bell } from "lucide-react";
import { toast } from "sonner";

export default function AlertsPage() {
  const { t } = useTranslation("common");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.get('/alerts');
        setAlerts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
        setAlerts([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadAlerts();
  }, []);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Alert dismissed');
  };

  const muteAlert = (id: string, duration: '1h' | '1d' | '1w') => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, muted: true, mutedUntil: duration } : a));
    toast.success(`Alert muted for ${duration}`);
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
    toast.success('Alert resolved');
  };

  const severityIcon = (s: string) => {
    if (s === 'Critical') return <XCircle className="w-4 h-4 text-dd-error" />;
    if (s === 'Medium') return <AlertTriangle className="w-4 h-4 text-dd-warning" />;
    return <Clock className="w-4 h-4 text-dd-info" />;
  };

  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

  if (error) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">{t('alerts', { defaultValue: 'Alerts' })}</h2>
        <div className="rounded-lg border border-dd-error/50 bg-dd-error/5 p-4 text-sm text-dd-error">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">{t('alerts', { defaultValue: 'Alerts' })}</h2>
        <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          Loading alerts...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-foreground">{t('alerts', { defaultValue: 'Alerts' })}</h2>
          <span className="dd-badge-error">{criticalCount} {t('critical', { defaultValue: 'critical' })}</span>
          <span className="dd-badge-warning">{activeCount} {t('active', { defaultValue: 'active' })}</span>
        </div>
        {alerts.length === 0 && (
          <span className="text-xs text-green-600">All clear</span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600/50 mb-3" />
          <p className="text-sm text-muted-foreground">No alerts to display</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "rounded-lg border transition-all",
                alert.severity === 'Critical' && alert.status === 'Active' ? "border-dd-error/50 bg-dd-error/5" : "border-border bg-card hover:border-border/80",
                expandedId === alert.id && "ring-1 ring-primary"
              )}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
              >
                <span className="flex items-center">{severityIcon(alert.severity)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{alert.name}</p>
                  <p className="text-xs text-muted-foreground">{alert.rule}</p>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded",
                  alert.severity === 'Critical' ? "bg-dd-error/20 text-dd-error" : alert.severity === 'Medium' ? "bg-dd-warning/20 text-dd-warning" : "bg-dd-info/20 text-dd-info"
                )}>
                  {alert.severity}
                </span>
                <span className={cn("text-xs px-2 py-1 rounded", alert.status === 'Active' ? "bg-dd-error/20 text-dd-error" : "bg-green-600/20 text-green-600")}>
                  {alert.status}
                </span>
              </div>

              {expandedId === alert.id && (
                <div className="border-t border-border/50 px-4 py-3 bg-muted/30 space-y-3">
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-border hover:bg-accent transition-colors"
                      title="Mark as resolved"
                    >
                      <CheckCircle className="w-3 h-3" /> Resolve
                    </button>
                    <button
                      onClick={() => muteAlert(alert.id, '1h')}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-border hover:bg-accent transition-colors"
                      title="Mute for 1 hour"
                    >
                      <Bell className="w-3 h-3" /> Mute 1h
                    </button>
                    <button
                      onClick={() => muteAlert(alert.id, '1d')}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-border hover:bg-accent transition-colors"
                      title="Mute for 1 day"
                    >
                      <Bell className="w-3 h-3" /> Mute 1d
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-dd-error/50 text-dd-error hover:bg-dd-error/10 transition-colors"
                      title="Dismiss alert"
                    >
                      <Trash2 className="w-3 h-3" /> Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
