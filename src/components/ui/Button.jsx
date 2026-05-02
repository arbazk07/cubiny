// src/components/ui/Button.jsx — Cubiny v6 Professional
import clsx from 'clsx';

const VARIANTS = {
  primary: {
    base: 'bg-[#22C55E] text-white border-transparent hover:bg-[#16A34A] active:scale-[0.97]',
    shadow: '0 4px 14px rgba(34,197,94,0.35)',
  },
  cobalt: {
    base: 'bg-[#2563EB] text-white border-transparent hover:bg-[#1D4ED8] active:scale-[0.97]',
    shadow: '0 4px 14px rgba(37,99,235,0.30)',
  },
  secondary: {
    base: 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:scale-[0.97]',
    shadow: '0 1px 4px rgba(15,23,42,0.06)',
  },
  ghost: {
    base: 'bg-transparent text-[#475569] border-transparent hover:bg-[#F1F5F9] hover:text-[#0F172A]',
    shadow: 'none',
  },
  danger: {
    base: 'bg-[#FEE2E2] text-[#DC2626] border-transparent hover:bg-[#FECACA] active:scale-[0.97]',
    shadow: 'none',
  },
  success: {
    base: 'bg-[#DCFCE7] text-[#16A34A] border-transparent hover:bg-[#BBF7D0] active:scale-[0.97]',
    shadow: 'none',
  },
  dark: {
    base: 'bg-[#0F172A] text-white border-transparent hover:bg-[#1E293B] active:scale-[0.97]',
    shadow: '0 4px 14px rgba(15,23,42,0.25)',
  },
};

const SIZES = {
  xs:  'px-3 py-1.5 text-xs rounded-lg gap-1',
  sm:  'px-4 py-2 text-sm rounded-xl gap-1.5',
  md:  'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg:  'px-6 py-3 text-[15px] rounded-xl gap-2',
  xl:  'px-7 py-3.5 text-base rounded-2xl gap-2.5',
};

export function Button({
  children, variant = 'primary', size = 'md',
  fullWidth = false, loading = false, disabled = false,
  className = '', style = {}, iconOnly = false, ...props
}) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size] ?? SIZES.md;
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-semibold border',
        'transition-all duration-150 select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        fullWidth && 'w-full',
        iconOnly && 'aspect-square !px-0',
        s, v.base, className,
      )}
      style={{ boxShadow: (disabled || loading) ? 'none' : v.shadow, ...style }}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent anim-spin shrink-0" />
      )}
      {children}
    </button>
  );
}
