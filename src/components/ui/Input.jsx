// src/components/ui/Input.jsx
import clsx from "clsx";

export function Input({
  label,
  icon: Icon,
  iconRight: IconRight,
  onIconRightClick,
  error,
  className = "",
  style = {},
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs text-[var(--clr-txt-2)] tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--clr-txt-3)", pointerEvents: "none" }}
          />
        )}
        <input
          className={clsx(
            "w-full rounded-xl px-4 py-3 text-[15px] transition-all duration-200",
            "placeholder:text-[var(--clr-txt-3)]",
            "focus:ring-2 focus:ring-violet-500/20",
            Icon && "pl-9",
            IconRight && "pr-10",
            error && "ring-1 ring-red-500/60",
            className,
          )}
          style={{
            background:  "var(--clr-sur)",
            border:      "1px solid var(--clr-bor-2)",
            color:       "var(--clr-txt)",
            borderColor: error ? "rgba(239,68,68,0.6)" : undefined,
            ...style,
          }}
          {...props}
        />
        {IconRight && (
          <button
            type="button"
            onClick={onIconRightClick}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--clr-txt-3)" }}
          >
            <IconRight size={16} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
