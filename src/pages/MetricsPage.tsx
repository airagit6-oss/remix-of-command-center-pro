import { MetricPanel } from "@/components/dashboard/MetricPanel";
import { api } from "@/lib/api";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart } from "recharts";
import { useTranslation } from "react-i18next";

const tt = {
  contentStyle: { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12 },
  labelStyle: { color: "hsl(var(--foreground))" },
  itemStyle: { color: "hsl(var(--muted-foreground))" },
};

export default function MetricsPage() {
  const { t } = useTranslation("common");
  const [cpuData] = useState(() => Array.from({ length: 50 }, (_, i) => ({ time: i, value: 20 + Math.sin(i * 0.3) * 35 })));
  const [memData] = useState(() => Array.from({ length: 50 }, (_, i) => ({ time: i, value: 30 + Math.sin(i * 0.4) * 27 })));
  const [netData] = useState(() => Array.from({ length: 50 }, (_, i) => ({ time: i, value: 100 + Math.sin(i * 0.5) * 350 })));
  const [ioData] = useState(() => Array.from({ length: 50 }, (_, i) => ({ time: i, value: 5 + Math.sin(i * 0.6) * 27 })));

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">{t('metrics_explorer', { defaultValue: 'Metrics Explorer' })}</h2>
      <div className="grid grid-cols-2 gap-3">
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
      </div>
    </div>
  );
}
