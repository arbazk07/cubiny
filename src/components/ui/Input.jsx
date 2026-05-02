// src/components/ui/Input.jsx — Cubiny v5
import clsx from "clsx";

export function Input({
  label, hint, icon: Icon, iconRight: IconRight,
  onIconRightClick, error, className = "", style = {}, ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex justify-between items-center">
          <label style={{ fontSize:12, color:"var(--t2)", fontWeight:600, letterSpacing:"0.03em" }}>
            {label}
          </label>
          {hint && (
            <button type="button" style={{
              fontSize:11, color:"var(--blu2)", background:"none", border:"none",
              cursor:"pointer", fontFamily:"var(--font-b)", fontWeight:500,
            }}>
              {hint}
            </button>
          )}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={14} style={{
            position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
            color: error ? "#fb7185" : "var(--t3)", pointerEvents:"none",
          }}/>
        )}
        <input
          className={clsx(
            "w-full text-[14px] transition-all duration-200",
            "placeholder:text-[var(--t4)]",
            Icon     && "pl-9",
            IconRight && "pr-10",
            className,
          )}
          style={{
            background:   error ? "rgba(244,63,94,0.05)" : "var(--s2)",
            border:       `1px solid ${error ? "rgba(244,63,94,0.45)" : "var(--b2)"}`,
            borderRadius: "var(--r2)",
            padding:      "12px 16px",
            color:        "var(--t1)",
            fontFamily:   "var(--font-b)",
            boxShadow:    error ? "0 0 0 3px rgba(244,63,94,0.10)" : "none",
            ...style,
          }}
          onFocus={e => {
            e.target.style.border     = "1px solid rgba(59,130,246,0.55)";
            e.target.style.boxShadow  = "0 0 0 3px rgba(59,130,246,0.12)";
            e.target.style.background = "var(--s3)";
          }}
          onBlur={e => {
            const hasErr = !!error;
            e.target.style.border     = `1px solid ${hasErr ? "rgba(244,63,94,0.45)" : "var(--b2)"}`;
            e.target.style.boxShadow  = hasErr ? "0 0 0 3px rgba(244,63,94,0.10)" : "none";
            e.target.style.background = hasErr ? "rgba(244,63,94,0.05)" : "var(--s2)";
          }}
          {...props}
        />
        {IconRight && (
          <button type="button" onClick={onIconRightClick} style={{
            position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:"var(--t3)",
            cursor:"pointer", display:"flex", alignItems:"center",
          }}>
            <IconRight size={15}/>
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize:11, color:"#fb7185", marginTop:1, display:"flex", alignItems:"center", gap:4 }}>
          {error}
        </p>
      )}
    </div>
  );
}
