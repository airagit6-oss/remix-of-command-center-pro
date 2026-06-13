import {
  BarChart3, FileText, Activity, Server, Users, AppWindow,
  DollarSign, Bell, LayoutDashboard, Settings, Compass, Zap, Sparkles, ShieldCheck
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ComponentType<{ className: string }>;
  labelKey: string;
  path: string;
  groupKey: string;
}

const navItems: NavItem[] = [
  { icon: Compass, labelKey: "overview", path: "/", groupKey: "command" },
  { icon: BarChart3, labelKey: "metricsExplorer", path: "/metrics", groupKey: "command" },
  { icon: FileText, labelKey: "logsExplorer", path: "/logs", groupKey: "command" },
  { icon: Zap, labelKey: "tracesAPM", path: "/traces", groupKey: "command" },
  { icon: Server, labelKey: "infrastructure", path: "/infrastructure", groupKey: "operations" },
  { icon: Users, labelKey: "usersMonitoring", path: "/users", groupKey: "operations" },
  { icon: AppWindow, labelKey: "appsMonitoring", path: "/apps", groupKey: "operations" },
  { icon: DollarSign, labelKey: "revenueMetrics", path: "/revenue", groupKey: "business" },
  { icon: Bell, labelKey: "alerts", path: "/alerts", groupKey: "business" },
  { icon: LayoutDashboard, labelKey: "dashboards", path: "/dashboards", groupKey: "business" },
  { icon: Settings, labelKey: "settings", path: "/settings", groupKey: "system" },
];

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isOpen }: Props) {
  const { t } = useTranslation('common');
  let lastGroup = "";
  
  return (
    <aside
      className={cn(
        "relative h-screen border-r border-border flex flex-col transition-all duration-300 shrink-0 overflow-hidden",
        "bg-gradient-to-b from-[hsl(220_25%_4%)] via-[hsl(220_22%_3%)] to-[hsl(260_30%_4%)]",
        isOpen ? "w-56" : "w-14"
      )}
    >
      {/* Ambient sidebar glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-60 h-60 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(186 90% 60% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(186 90% 60% / 0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "linear-gradient(to bottom, black 20%, transparent 90%)",
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative h-12 flex items-center px-3 border-b border-white/10 gap-2 z-10">
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_18px_hsl(186_90%_55%/0.55)]">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[hsl(220_22%_3%)] animate-pulse" />
        </div>
        {isOpen && (
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm text-foreground tracking-tight bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-transparent">
              BossPanel
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-cyan-300/60 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> AI Command
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="relative flex-1 py-2 overflow-y-auto z-10">
        {navItems.map((item) => {
          const showGroup = isOpen && item.groupKey !== lastGroup;
          lastGroup = item.groupKey;
          return (
            <div key={item.path}>
              {showGroup && (
                <div className="px-3 pt-3 pb-1 flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-[0.22em] text-cyan-300/50 font-medium">
                    {t(item.groupKey)}
                  </span>
                  <span className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
                </div>
              )}
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 px-3 py-2 mx-1 rounded-md text-sm transition-all",
                    isActive
                      ? "text-foreground bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active glow bar */}
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-r-full transition-all",
                        isActive
                          ? "bg-cyan-400 shadow-[0_0_10px_hsl(186_90%_55%/0.9)] opacity-100"
                          : "opacity-0 group-hover:opacity-40 bg-cyan-400"
                      )}
                    />
                    {/* Icon halo */}
                    <span className="relative shrink-0">
                      {isActive && (
                        <span className="absolute inset-0 -m-1 rounded-md bg-cyan-500/15 blur-md" />
                      )}
                      <item.icon
                        className={cn(
                          "relative w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-cyan-300" : "group-hover:text-cyan-300/80"
                        )}
                      />
                    </span>
                    {isOpen && <span className="truncate flex-1">{t(item.labelKey)}</span>}
                    {isOpen && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_hsl(186_90%_55%/0.9)] animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative p-3 border-t border-white/10 z-10">
        {isOpen ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </span>
                Connected
              </span>
              <span className="text-muted-foreground dd-text-mono">v2.4.1</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-cyan-300/80">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure session · 0 threats</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
