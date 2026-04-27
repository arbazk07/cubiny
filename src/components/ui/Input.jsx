// src/components/ui/Input.jsx  —  Cubiny v2
import clsx from "clsx";

export function Input({
  label, hint, icon: Icon, iconRight: IconRight,
  onIconRightClick, error, className = "", style = {}, ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex justify-between items-center">
          <label style={{ fontSize:12, color:"var(--t2)", fontWeight:500, letterSpacing:"0.03em" }}>{label}</label>
          {hint && <span style={{ fontSize:11, color:"var(--t3)" }}>{hint}</span>}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={14} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--t3)", pointerEvents:"none" }} />
        )}
        <input
          className={clsx(
            "w-full rounded-xl text-[14px] transition-all duration-200",
            "placeholder:text-[var(--t4)]",
            Icon && "pl-9",
            IconRight && "pr-10",
            className,
          )}
          style={{
            background:   "var(--s2)",
            border:       `1px solid ${error ? "rgba(244,63,94,0.5)" : "var(--b2)"}`,
            borderRadius: "var(--r2)",
            padding:      "12px 16px",
            color:        "var(--t1)",
            boxShadow:    error ? "0 0 0 3px rgba(244,63,94,0.1)" : "none",
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid rgba(109,40,217,0.6)";
            e.target.style.boxShadow = "0 0 0 3px rgba(109,40,217,0.12)";
            e.target.style.background = "var(--s3)";
          }}
          onBlur={(e) => {
            e.target.style.border = `1px solid ${error ? "rgba(244,63,94,0.5)" : "var(--b2)"}`;
            e.target.style.boxShadow = error ? "0 0 0 3px rgba(244,63,94,0.1)" : "none";
            e.target.style.background = "var(--s2)";
          }}
          {...props}
        />
        {IconRight && (
          <button type="button" onClick={onIconRightClick}
            style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--t3)", cursor:"pointer", display:"flex", alignItems:"center" }}>
            <IconRight size={15} />
          </button>
        )}
      </div>
      {error && <p style={{ fontSize:12, color:"#fb7185" }}>{error}</p>}
    </div>
  );
}
