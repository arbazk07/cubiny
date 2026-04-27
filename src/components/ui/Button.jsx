// src/components/ui/Button.jsx
import clsx from "clsx";

const VARIANTS = {
  primary:   "text-white border-none shadow-violet hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)] active:scale-[0.98]",
  secondary: "text-white border border-[var(--clr-bor-2)] hover:bg-white/10 active:scale-[0.98]",
  cyan:      "text-white border-none shadow-cyan hover:-translate-y-px active:scale-[0.98]",
  danger:    "text-red-400 border border-red-500/30 hover:bg-red-500/25 active:scale-[0.98]",
  ghost:     "bg-transparent text-[var(--clr-txt-2)] border-none hover:text-white",
};

const BG = {
  primary:   "linear-gradient(135deg, var(--clr-violet), var(--clr-violet-2))",
  secondary: "var(--clr-sur-2)",
  cyan:      "linear-gradient(135deg, var(--clr-cyan), #0891b2)",
  danger:    "rgba(239,68,68,0.15)",
  ghost:     "transparent",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled = false,
  fullWidth = false,
  style = {},
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl",
        "text-[15px] font-medium transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        fullWidth && "w-full",
        VARIANTS[variant],
        className,
      )}
      style={{ background: BG[variant], ...style }}
      {...props}
    >
      {loading && (
        <span className="w-[18px] h-[18px] rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
}
