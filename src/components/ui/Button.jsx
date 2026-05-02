// src/components/ui/Button.jsx — Cubiny v5 — Tactile, premium, vibrant
import clsx from "clsx";

const STYLES = {
  primary: {
    bg:  "linear-gradient(135deg,#3b82f6,#7c3aed)",
    cls: "text-white border-none hover:-translate-y-0.5 active:scale-[0.96]",
    shadow: "0 6px 24px rgba(59,130,246,0.45)",
    hoverShadow: "0 10px 32px rgba(59,130,246,0.6)",
  },
  secondary: {
    bg:  "var(--s2)",
    cls: "text-[var(--t1)] border border-[var(--b2)] hover:bg-[var(--s3)] hover:border-[var(--b3)] active:scale-[0.96]",
    shadow: "none",
    hoverShadow: "none",
  },
  violet: {
    bg:  "linear-gradient(135deg,#7c3aed,#8b5cf6)",
    cls: "text-white border-none hover:-translate-y-0.5 active:scale-[0.96]",
    shadow: "0 6px 24px rgba(124,62,237,0.4)",
    hoverShadow: "0 10px 32px rgba(124,62,237,0.6)",
  },
  cyan: {
    bg:  "linear-gradient(135deg,#0891b2,#06b6d4)",
    cls: "text-white border-none hover:-translate-y-0.5 active:scale-[0.96]",
    shadow: "0 6px 24px rgba(8,145,178,0.4)",
    hoverShadow: "0 10px 32px rgba(8,145,178,0.6)",
  },
  green: {
    bg:  "linear-gradient(135deg,#10b981,#34d399)",
    cls: "text-white border-none hover:-translate-y-0.5 active:scale-[0.96]",
    shadow: "0 6px 24px rgba(16,185,129,0.4)",
    hoverShadow: "0 10px 32px rgba(16,185,129,0.6)",
  },
  danger: {
    bg:  "rgba(244,63,94,0.1)",
    cls: "text-[#fb7185] border border-[rgba(244,63,94,0.3)] hover:bg-[rgba(244,63,94,0.2)] active:scale-[0.96]",
    shadow: "none",
    hoverShadow: "none",
  },
  ghost: {
    bg:  "transparent",
    cls: "text-[var(--t2)] border-none hover:text-[var(--t1)] hover:bg-[var(--s2)]",
    shadow: "none",
    hoverShadow: "none",
  },
  success: {
    bg:  "rgba(16,185,129,0.1)",
    cls: "text-[#34d399] border border-[rgba(16,185,129,0.3)] hover:bg-[rgba(16,185,129,0.2)] active:scale-[0.96]",
    shadow: "none",
    hoverShadow: "none",
  },
};

export function Button({
  children, variant = "primary", className = "",
  loading = false, disabled = false, fullWidth = false,
  size = "md", style = {}, ...props
}) {
  const s = STYLES[variant] ?? STYLES.primary;
  const sizeClass =
    size === "sm" ? "px-4 py-2 text-[13px] rounded-xl gap-1.5" :
    size === "lg" ? "px-7 py-3.5 text-[15px] rounded-2xl gap-2.5" :
                   "px-5 py-2.5 text-[14px] rounded-xl gap-2";

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "flex items-center justify-center font-semibold transition-all duration-200",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
        fullWidth && "w-full",
        sizeClass, s.cls, className,
      )}
      style={{
        background: bg(disabled || loading, s.bg),
        fontFamily: "var(--font-b)",
        boxShadow: s.shadow,
        letterSpacing: "-0.01em",
        ...style,
      }}
      onMouseEnter={e => { if (s.hoverShadow !== "none" && !disabled && !loading) e.currentTarget.style.boxShadow = s.hoverShadow; }}
      onMouseLeave={e => { if (!disabled && !loading) e.currentTarget.style.boxShadow = s.shadow; }}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin-s shrink-0"/>
      )}
      {children}
    </button>
  );
}

function bg(isDisabled, gradient) {
  return isDisabled ? gradient : gradient;
}
