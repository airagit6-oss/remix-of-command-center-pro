# Chart & Tooltip Color QA Checklist

Goal: confirm all Recharts visuals on the admin dashboard resolve through the
navy / cyan / purple semantic tokens defined in `src/index.css` — never raw HSL.

## Routes to inspect
- `/admin` (OverviewPage) — area + line + bar + composed charts
- `/admin/metrics` — CPU / Memory / Network / Disk panels
- `/admin/infrastructure` — per-server sparkline grid
- `/admin/revenue` — revenue area chart
- `/admin/traces` — latency heatmap row
- `/admin/qa/charts` — automated visual harness

## Token contract (must hold on every chart)
| Role            | Token                          |
|-----------------|--------------------------------|
| Cyan / accent   | `hsl(var(--accent))`           |
| Purple / brand  | `hsl(var(--primary))`          |
| Success / green | `hsl(var(--mp-success))`       |
| Warning / amber | `hsl(var(--mp-warning))`       |
| Error / red     | `hsl(var(--destructive))`      |
| Grid lines      | `hsl(var(--border))`           |
| Axis ticks      | `hsl(var(--muted-foreground))` |
| Tooltip bg      | `hsl(var(--popover))`          |
| Tooltip border  | `hsl(var(--border))`           |
| Tooltip label   | `hsl(var(--foreground))`       |
| Tooltip value   | `hsl(var(--muted-foreground))` |

## Per-chart checks
- [ ] Strokes / fills use one of the tokens above (no raw hex / hsl literals)
- [ ] Grid `stroke` = `--border`
- [ ] Both axes' tick `fill` = `--muted-foreground`
- [ ] Tooltip background = `--popover`, border = `--border`
- [ ] Tooltip label / item text legible in dark theme
- [ ] Gradient `<defs>` use accent / success / warning / primary tokens
- [ ] No `text-white`, `bg-black`, `#xxxxxx` literals in chart JSX

## Time-range states (1h / 24h / 7d / 30d / custom)
- [ ] Colors stable across every range — no flash to default palette
- [ ] Axis labels remain readable
- [ ] Gradients still render with token-based stops
- [ ] Tooltip stays on `--popover` for long series
- [ ] Empty / sparse data still uses semantic stroke

## Live mode
- [ ] Toggle live ON — new ticks inherit the same stroke token
- [ ] Pulse / glow on live indicator uses `--accent`
- [ ] Tooltip on streaming point keeps popover bg token
- [ ] Pause → Resume keeps colors identical (no remount drift)

## Theme switch
- [ ] Toggle `.light` on `<html>` — every chart re-skins automatically

## Automated coverage
`bunx vitest run src/test/chart-tokens.test.ts` enforces that no chart page
contains raw HSL / hex literals in Recharts color props. The visual harness at
`/admin/qa/charts` renders every chart type with time-range + live toggles
wired so QA can eyeball all states on a single screen.
