import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Search, Filter, AlertCircle } from "lucide-react";

export default function LogsPage() {
  const { t } = useTranslation('common');
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get('/logs');
        setLogs(data || []);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch logs';
        setError(errorMsg);
        console.error('Logs API Error:', err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchLogs();
    
    // Poll every 2 seconds
    const iv = setInterval(fetchLogs, 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filtered = logs.filter(l => {
    const matchText = !filter || l.userId.includes(filter) || l.appName.toLowerCase().includes(filter.toLowerCase()) || l.message.toLowerCase().includes(filter.toLowerCase());
    const matchEvent = eventFilter === "all" || l.eventType === eventFilter;
    return matchText && matchEvent;
  });

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Failed to load logs</p>
            <p className="text-xs text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('filter_placeholder', { defaultValue: 'Filter by user, app, message...' })}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-md p-0.5">
          {["all", "login", "payment", "error", "app_launch", "api_call"].map(t => (
            <button
              key={t}
              onClick={() => setEventFilter(t)}
              className={cn(
                "px-2 py-1 text-xs rounded-sm transition-colors capitalize",
                eventFilter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="w-3 h-3" />
          <span>{filtered.length} {t('events', { defaultValue: 'events' })}</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="dd-panel flex-1 flex flex-col min-h-0">
        {loading && logs.length === 0 && (
          <div className="flex items-center justify-center flex-1">
            <p className="text-muted-foreground">Loading logs...</p>
          </div>
        )}

        {!loading && logs.length === 0 && !error && (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <p className="font-medium text-muted-foreground mb-1">No logs available</p>
              <p className="text-xs text-muted-foreground">Backend logs endpoint may not be responding. Check server status.</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-[140px_100px_100px_120px_70px_1fr] gap-2 px-3 py-2 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-medium">
          <span>{t('timestamp', { defaultValue: 'Timestamp' })}</span>
          <span>{t('event', { defaultValue: 'Event' })}</span>
          <span>{t('user_id', { defaultValue: 'User ID' })}</span>
          <span>{t('app', { defaultValue: 'App' })}</span>
          <span>{t('status', { defaultValue: 'Status' })}</span>
          <span>{t('message', { defaultValue: 'Message' })}</span>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-auto">
          {filtered.map((log) => (
            <div
              key={log.id + log.timestamp}
              className={cn(
                "grid grid-cols-[140px_100px_100px_120px_70px_1fr] gap-2 px-3 py-1.5 text-xs border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors",
                log.status === 'fail' && "bg-dd-error/5"
              )}
            >
              <span className="dd-text-mono text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className={cn(
                "dd-badge-info w-fit",
                log.eventType === 'error' && "dd-badge-error",
                log.eventType === 'payment' && "dd-badge-success",
                log.eventType === 'login' && "dd-badge-info"
              )}>
                {log.eventType}
              </span>
              <span className="dd-text-mono text-muted-foreground truncate">{log.userId}</span>
              <span className="text-foreground truncate">{log.appName}</span>
              <span className={log.status === 'success' ? "dd-badge-success w-fit" : "dd-badge-error w-fit"}>
                {log.status}
              </span>
              <span className={cn("truncate", log.status === 'fail' ? "text-dd-error" : "text-muted-foreground")}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
