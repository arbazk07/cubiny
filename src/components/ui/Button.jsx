// src/components/ui/Button.jsx  —  Cubiny v2
import clsx from "clsx";

const STYLES = {
  primary: {
    bg: "linear-gradient(135deg,#6d28d9,#8b5cf6)",
    cls: "text-white border-none shadow-v-md hover:shadow-v-lg hover:-translate-y-0.5 active:scale-[0.97]",
  },
  secondary: {
    bg: "var(--s2)",
    cls: "text-[var(--t1)] border border-[var(--b2)] hover:bg-[var(--s3)] hover:border-[var(--b3)] active:scale-[0.97]",
  },
  cyan: {
    bg: "linear-gradient(135deg,#0891b2,#06b6d4)",
    cls: "text-white border-none shadow-c-md hover:shadow-c-lg hover:-translate-y-0.5 active:scale-[0.97]",
  },
  danger: {
    bg: "rgba(244,63,94,0.12)",
    cls: "text-[#fb7185] border border-[rgba(244,63,94,0.3)] hover:bg-[rgba(244,63,94,0.22)] active:scale-[0.97]",
  },
  ghost: {
    bg: "transparent",
    cls: "text-[var(--t2)] border-none hover:text-[var(--t1)] hover:bg-[var(--s2)]",
  },
  success: {
    bg: "rgba(34,197,94,0.12)",
    cls: "text-[#4ade80] border border-[rgba(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.22)] active:scale-[0.97]",
  },
};

export function Button({
  children, variant = "primary", className = "",
  loading = false, disabled = false, fullWidth = false,
  size = "md", style = {}, ...props
}) {
  const { bg, cls } = STYLES[variant] ?? STYLES.primary;
  const sizeClass = size === "sm"
    ? "px-4 py-2 text-[13px] rounded-xl gap-1.5"
    : size === "lg"
      ? "px-8 py-4 text-[16px] rounded-2xl gap-3"
      : "px-5 py-3 text-[14px] rounded-xl gap-2";

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "flex items-center justify-center font-medium transition-all duration-200",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
        fullWidth && "w-full",
        sizeClass, cls, className,
      )}
      style={{ background: bg, fontFamily: "var(--font-b)", ...style }}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin-s shrink-0" />
      )}
      {children}
    </button>
  );
}
