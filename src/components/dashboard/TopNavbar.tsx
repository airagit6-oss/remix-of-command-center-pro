import { useEffect, useState } from "react";
import { Search, Bell, PanelLeft, User, Sparkles, Mic, Shield, Activity, Globe2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "./DashboardLayout";
import { cn } from "@/lib/utils";

const timeRanges = ["5m", "15m", "1h", "4h", "24h", "7d"];

export function TopNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { timeRange, setTimeRange, isLive, setIsLive, searchQuery, setSearchQuery } = useDashboard();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [revenue, setRevenue] = useState(48213);
  const [users, setUsers] = useState(1284);

  useEffect(() => {
    const i = setInterval(() => {
      setNow(new Date());
      if (isLive) {
        setRevenue((r) => r + (Date.now() % 40));
        setUsers((u) => Math.max(900, u + (Date.now() % 11) - 5));
      }
    }, 1500);
    return () => clearInterval(i);
  }, [isLive]);

  return (
    <header className="relative h-14 border-b border-cyan-400/10 shrink-0 overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220_25%_5%)] via-[hsl(230_28%_4%)] to-[hsl(260_30%_5%)]" />
      <div className="absolute inset-0 backdrop-blur-xl" />
      <div className="pointer-events-none absolute -top-12 left-1/4 w-72 h-32 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-12 right-1/4 w-72 h-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="relative h-full flex items-center px-3 gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-cyan-300 transition-colors"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* AI Search */}
        <div className="flex-1 max-w-xl relative group">
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-fuchsia-500/20 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity" />
          <div className="relative flex items-center h-9 rounded-lg bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Ask JARVIS · search logs, metrics, users, apps…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-full bg-transparent px-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <kbd className="hidden md:inline-flex items-center gap-1 mr-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
            <button
              className="mr-1 p-1.5 rounded-md text-muted-foreground hover:text-cyan-300 hover:bg-white/5 transition-colors"
              aria-label="Voice"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Revenue ticker */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 h-8 rounded-md bg-emerald-500/5 border border-emerald-400/15">
          <Zap className="w-3 h-3 text-emerald-300" />
          <span className="text-[10px] uppercase tracking-wider text-emerald-300/70">Rev</span>
          <span className="text-xs font-mono text-emerald-200 tabular-nums">${revenue.toLocaleString()}</span>
        </div>

        {/* Active users */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 h-8 rounded-md bg-cyan-500/5 border border-cyan-400/15">
          <Activity className="w-3 h-3 text-cyan-300" />
          <span className="text-xs font-mono text-cyan-100 tabular-nums">{users.toLocaleString()}</span>
          <span className="text-[10px] uppercase tracking-wider text-cyan-300/70">live</span>
        </div>

        {/* Time Range */}
        <div className="hidden md:flex items-center gap-0.5 h-8 px-0.5 rounded-md bg-white/[0.03] border border-white/10">
          {timeRanges.map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={cn(
                "px-2 h-7 text-[11px] rounded-sm transition-all font-medium",
                timeRange === t
                  ? "bg-gradient-to-b from-cyan-500/30 to-cyan-500/10 text-cyan-200 shadow-[0_0_12px_-2px_hsl(190_90%_50%/0.5)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Live Toggle */}
        <button
          onClick={() => setIsLive(!isLive)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 h-8 rounded-md text-[11px] font-semibold tracking-wide transition-all border",
            isLive
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/30 shadow-[0_0_12px_-2px_hsl(150_90%_45%/0.5)]"
              : "bg-white/[0.03] text-muted-foreground border-white/10"
          )}
        >
          <span className="relative flex w-1.5 h-1.5">
            {isLive && <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />}
            <span className={cn("relative w-1.5 h-1.5 rounded-full", isLive ? "bg-emerald-400" : "bg-muted-foreground")} />
          </span>
          LIVE
        </button>

        {/* Security shield */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 h-8 rounded-md bg-white/[0.03] border border-white/10" title="0 active threats">
          <Shield className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-[10px] text-muted-foreground font-mono">SECURE</span>
        </div>

        {/* Timezone clock */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2 h-8 rounded-md bg-white/[0.03] border border-white/10">
          <Globe2 className="w-3.5 h-3.5 text-cyan-300" />
          <span className="text-[11px] font-mono text-foreground tabular-nums">
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <span className="text-[10px] text-muted-foreground">UTC</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate("/alerts")}
          className="relative p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-cyan-300 transition-colors"
          aria-label="Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 text-[8px] flex items-center justify-center text-white font-bold shadow-[0_0_8px_hsl(330_90%_55%/0.6)]">
            3
          </span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Profile"
        >
          <User className="w-3.5 h-3.5 text-cyan-100" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[hsl(220_25%_5%)]" />
        </button>
      </div>
    </header>
  );
}
