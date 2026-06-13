import { MetricPanel } from "@/components/dashboard/MetricPanel";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart } from "recharts";
import { useTranslation } from "react-i18next";
import { Loader2, AlertCircle } from "lucide-react";
import { ChartSkeleton } from "@/components/common/Skeleton";

const tt = {
  contentStyle: { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12 },
  labelStyle: { color: "hsl(var(--foreground))" },
  itemStyle: { color: "hsl(var(--muted-foreground))" },
};

export default function MetricsPage() {
  const { t } = useTranslation("common");
  const [timePeriod, setTimePeriod] = useState('1h');
  const [refreshInterval, setRefreshInterval] = useState('30s');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cpuData, setCpuData] = useState<any[]>([]);
  const [memData, setMemData] = useState<any[]>([]);
  const [netData, setNetData] = useState<any[]>([]);
  const [ioData, setIoData] = useState<any[]>([]);
  const [isDemoData, setIsDemoData] = useState(false);

  // Fetch metrics from backend
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/metrics?timePeriod=${timePeriod}`);
        
        if (response.data && response.data.metrics) {
          const metrics = response.data.metrics;
          setCpuData(metrics.cpu || generateFallbackData('cpu'));
          setMemData(metrics.memory || generateFallbackData('memory'));
          setNetData(metrics.network || generateFallbackData('network'));
          setIoData(metrics.io || generateFallbackData('io'));
          setIsDemoData(false);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.warn('Failed to fetch real metrics, using demo data:', err);
        // Fallback to demo data
        setCpuData(generateFallbackData('cpu'));
        setMemData(generateFallbackData('memory'));
        setNetData(generateFallbackData('network'));
        setIoData(generateFallbackData('io'));
        setIsDemoData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();

    // Set up auto-refresh if interval is not 'off'
    let interval: NodeJS.Timeout;
    if (refreshInterval !== 'off') {
      const intervalMs = {
        '10s': 10000,
        '30s': 30000,
        '60s': 60000,
      }[refreshInterval] || 30000;

      interval = setInterval(fetchMetrics, intervalMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timePeriod, refreshInterval]);

  // Generate fallback demo data
  const generateFallbackData = (type: string) => {
    const baseValues = { cpu: 20, memory: 30, network: 100, io: 5 };
    const ranges = { cpu: 35, memory: 27, network: 350, io: 27 };
    const freq = { cpu: 0.3, memory: 0.4, network: 0.5, io: 0.6 };
    
    const baseValue = baseValues[type as keyof typeof baseValues] || 20;
    const range = ranges[type as keyof typeof ranges] || 30;
    const freqVal = freq[type as keyof typeof freq] || 0.3;
    
    return Array.from({ length: 50 }, (_, i) => ({
      time: i,
      value: baseValue + Math.sin(i * freqVal) * range,
    }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">{t('metrics_explorer', { defaultValue: 'Metrics Explorer' })}</h2>
        <div className="flex items-center gap-2">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            disabled={isLoading}
            className="px-2 py-1 text-xs rounded border border-border bg-card text-foreground hover:border-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Time period"
          >
            <option value="5m">Last 5m</option>
            <option value="15m">Last 15m</option>
            <option value="1h">Last 1h</option>
            <option value="6h">Last 6h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
          </select>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
            disabled={isLoading}
            className="px-2 py-1 text-xs rounded border border-border bg-card text-foreground hover:border-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh interval"
          >
            <option value="off">No refresh</option>
            <option value="10s">Refresh 10s</option>
            <option value="30s">Refresh 30s</option>
            <option value="60s">Refresh 1m</option>
          </select>
          {isLoading && (
            <div className="inline-flex items-center gap-2 rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-600 border border-blue-400/30 animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
          {error && (
            <div className="inline-flex items-center gap-2 rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-600 border border-red-400/30">
              <AlertCircle className="h-3 w-3" />
              <span>Error</span>
            </div>
          )}
          {isDemoData && !isLoading && (
            <div className="inline-flex items-center gap-2 rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-600 border border-amber-400/30">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-amber-500" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" /></span>
              <span>Demo Data</span>
            </div>
          )}
          {!isDemoData && !isLoading && !error && (
            <div className="inline-flex items-center gap-2 rounded-md bg-green-500/10 px-2 py-1 text-xs text-green-600 border border-green-400/30">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full rounded-full bg-green-500" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" /></span>
              <span>Live Data</span>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-red-600">
            <p className="font-medium">Failed to load metrics</p>
            <p className="text-red-600/70">{error}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <MetricPanel title={t('cpu_utilization', { defaultValue: 'CPU Utilization (%)' })}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={cpuData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip {...tt} />
                  <defs>
                    <linearGradient id="cpuG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#cpuG)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </MetricPanel>

            <MetricPanel title={t('memory_usage', { defaultValue: 'Memory Usage (%)' })}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={memData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip {...tt} />
                  <defs>
                    <linearGradient id="memG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--mp-success))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--mp-success))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--mp-success))" strokeWidth={2} fill="url(#memG)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </MetricPanel>

            <MetricPanel title={t('network_io', { defaultValue: 'Network I/O (MB/s)' })}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={netData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip {...tt} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--mp-warning))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </MetricPanel>

            <MetricPanel title={t('disk_io', { defaultValue: 'Disk I/O (ops/s)' })}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={ioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip {...tt} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </MetricPanel>
          </>
        )}
      </div>
    </div>
  );
}
