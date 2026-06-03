import horizontalAsset from "@/assets/brand/software-vala-horizontal.png.asset.json";
import roundAsset from "@/assets/brand/software-vala-round.jpg.asset.json";

type Variant = "auto" | "horizontal" | "round" | "icon" | "mark";
type Tone = "auto" | "dark" | "light";

interface LogoProps {
  /**
   * - `horizontal` full wordmark with tagline (use for wide spaces)
   * - `round` / `icon` / `mark` round badge (use for sidebars, favicons, small chips)
   * - `auto` chooses based on height (>=40 → horizontal, else round)
   */
  variant?: Variant;
  /** Visual height in px. Width auto-scales preserving aspect ratio. */
  height?: number;
  className?: string;
  alt?: string;
  /** Royal-blue outer glow for dark hero placements. */
  withGlow?: boolean;
  /** Background plate style. `auto` picks based on variant. */
  tone?: Tone;
  /** Disable plate (raw image only). */
  plain?: boolean;
}

const ROYAL = "#0A5BFF";
const ELECTRIC = "#2D8CFF";

/**
 * Premium Software Vala brand mark — auto-selects horizontal vs round.
 * Renders a 3D-style glass plate behind the artwork so the logo always reads
 * crisp on dark navy, glass, or light surfaces without distortion.
 */
export function Logo({
  variant = "auto",
  height = 36,
  className = "",
  alt = "Software Vala — The Name of Trust",
  withGlow = false,
  tone = "auto",
  plain = false,
}: LogoProps) {
  const resolved: "horizontal" | "round" =
    variant === "auto" ? (height >= 48 ? "horizontal" : "round") : variant === "horizontal" ? "horizontal" : "round";
  const isRound = resolved === "round";
  const src = isRound ? roundAsset.url : horizontalAsset.url;

  const glow = withGlow
    ? `drop-shadow(0 0 22px rgba(10,91,255,0.55)) drop-shadow(0 0 6px rgba(45,140,255,0.45))`
    : `drop-shadow(0 2px 6px rgba(0,0,0,0.35))`;

  if (plain) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="eager"
        decoding="async"
        style={{
          height,
          width: isRound ? height : "auto",
          objectFit: "contain",
          display: "block",
          filter: glow,
        }}
      />
    );
  }

  if (isRound) {
    const ring = Math.max(2, height * 0.06);
    return (
      <span
        className={className}
        aria-label={alt}
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: height,
          height,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 25%, #ffffff 0%, #f4f7ff 60%, #e8efff 100%)`,
          boxShadow: [
            `inset 0 0 0 ${ring}px ${ROYAL}`,
            `inset 0 ${height * 0.06}px ${height * 0.12}px rgba(10,91,255,0.18)`,
            `0 ${height * 0.08}px ${height * 0.28}px -${height * 0.08}px rgba(10,91,255,0.55)`,
            withGlow ? `0 0 ${height * 0.6}px rgba(45,140,255,0.5)` : `0 1px 2px rgba(0,0,0,0.4)`,
          ].join(", "),
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={src}
          alt=""
          loading="eager"
          decoding="async"
          style={{
            width: height * 0.78,
            height: height * 0.78,
            objectFit: "contain",
            borderRadius: "50%",
            display: "block",
          }}
        />
        {/* gloss highlight */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 38%)",
            pointerEvents: "none",
          }}
        />
      </span>
    );
  }

  // Horizontal — premium glass plate that protects the logo on any surface
  const padX = Math.max(10, height * 0.32);
  const padY = Math.max(6, height * 0.18);
  const radius = Math.max(8, height * 0.28);

  return (
    <span
      className={className}
      aria-label={alt}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: padX * 0.6,
        padding: `${padY}px ${padX}px`,
        borderRadius: radius,
        background:
          tone === "light"
            ? "linear-gradient(135deg, #ffffff 0%, #f4f7ff 100%)"
            : `linear-gradient(135deg, rgba(10,15,30,0.85) 0%, rgba(14,21,40,0.75) 100%)`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border:
          tone === "light"
            ? `1px solid ${ROYAL}33`
            : `1px solid ${ELECTRIC}40`,
        boxShadow: withGlow
          ? `0 10px 40px -10px rgba(10,91,255,0.55), 0 0 0 1px ${ELECTRIC}33 inset, 0 0 50px -10px ${ELECTRIC}66`
          : `0 6px 24px -10px rgba(0,0,0,0.55), 0 0 0 1px ${ELECTRIC}22 inset`,
        position: "relative",
      }}
    >
      <img
        src={src}
        alt=""
        loading="eager"
        decoding="async"
        style={{
          height,
          width: "auto",
          objectFit: "contain",
          display: "block",
          filter: glow,
        }}
      />
      {/* top gloss line */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: radius,
          right: radius,
          top: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${ELECTRIC}88, transparent)`,
          pointerEvents: "none",
        }}
      />
    </span>
  );
}

export default Logo;