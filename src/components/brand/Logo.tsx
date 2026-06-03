import horizontalLogo from "@/assets/brand/software-vala-horizontal.png";
import roundLogo from "@/assets/brand/software-vala-round.jpg";

type Variant = "horizontal" | "round" | "icon";

interface LogoProps {
  variant?: Variant;
  /** Height in px. Width auto-scales preserving aspect ratio. */
  height?: number;
  className?: string;
  alt?: string;
  withGlow?: boolean;
}

/**
 * Software Vala brand mark. Selects between horizontal and round versions.
 * - horizontal: use in navbars, headers, footers, login hero
 * - round / icon: use in sidebars collapsed, avatars, small chips
 */
export function Logo({
  variant = "horizontal",
  height = 36,
  className = "",
  alt = "Software Vala — The Name of Trust",
  withGlow = false,
}: LogoProps) {
  const src = variant === "horizontal" ? horizontalLogo : roundLogo;
  const isRound = variant !== "horizontal";

  const style: React.CSSProperties = {
    height,
    width: isRound ? height : "auto",
    objectFit: "contain",
    borderRadius: isRound ? "50%" : 0,
    background: isRound ? "#FFFFFF" : "transparent",
    padding: isRound ? Math.max(2, height * 0.04) : 0,
    filter: withGlow
      ? "drop-shadow(0 0 18px rgba(10,91,255,0.45)) drop-shadow(0 0 6px rgba(45,140,255,0.35))"
      : undefined,
    display: "block",
  };

  return <img src={src} alt={alt} style={style} className={className} loading="eager" decoding="async" />;
}

export default Logo;