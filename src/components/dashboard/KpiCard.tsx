import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: string | number;
  change: number;
  color: "blue" | "green" | "red" | "yellow" | "purple";
  prefix?: string;
  suffix?: string;
  sparklineData?: Array<{ v: number }>;
}

const colorMap = {
  blue: { stroke: "hsl(210,100%,56%)", fill: "hsl(210,100%,56%)" },
  green: { stroke: "hsl(142,71%,45%)", fill: "hsl(142,71%,45%)" },
  red: { stroke: "hsl(0,72%,51%)", fill: "hsl(0,72%,51%)" },
  yellow: { stroke: "hsl(38,92%,50%)", fill: "hsl(38,92%,50%)" },
  purple: { stroke: "hsl(270,70%,60%)", fill: "hsl(270,70%,60%)" },
};

// Generate deterministic sparkline data from value (no random)
const generateDeterministicSparkline = (baseValue: number, points: number = 12): Array<{ v: number }> => {
  const data: Array<{ v: number }> = [];
  let current = baseValue * 0.7; // Start at 70% of base
  
  for (let i = 0; i < points; i++) {
    // Use sine wave with offset to create smooth deterministic pattern
    const variance = Math.sin(i * 0.5) * (baseValue * 0.15);
    const trend = (i / points) * (baseValue * 0.3);
    data.push({ v: Math.round(current + variance + trend) });
  }
  
  return data;
};

export function KpiCard({ title, value, change, color, prefix = "", suffix = "", sparklineData }: Props) {
  const sparkData = sparklineData || generateDeterministicSparkline(typeof value === 'number' ? value : 0);
  const isPositive = change >= 0;
  const c = colorMap[color];

  return (
    <div className="dd-panel p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className={cn("flex items-center gap-0.5 text-xs font-medium",
          isPositive ? "text-dd-success" : "text-dd-error"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl font-semibold text-foreground dd-text-mono">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.fill} stopOpacity={0.3} />
                <stop offset="100%" stopColor={c.fill} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={c.stroke}
              strokeWidth={1.5}
              fill={`url(#grad-${color})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
