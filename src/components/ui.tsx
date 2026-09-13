import { useEffect, useId, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-fg border border-transparent hover:bg-brand-hi active:brightness-95 disabled:bg-brand/40 disabled:text-brand-fg/60",
  secondary:
    "bg-surface-2 text-ink border border-line hover:bg-surface-3 hover:border-line active:brightness-95 disabled:opacity-50",
  ghost:
    "bg-transparent text-muted border border-transparent hover:bg-surface-2 hover:text-ink active:brightness-95 disabled:opacity-40",
  danger:
    "bg-transparent text-bad border border-bad/40 hover:bg-bad-soft active:brightness-95 disabled:opacity-40",
};

const SIZES: Record<Size, string> = {
  sm: "text-[13px] min-h-11 py-2 px-3 gap-1.5 rounded-lg",
  md: "text-sm min-h-11 py-2.5 px-4 gap-2 rounded-lg",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`inline-flex items-center justify-center text-center font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand/60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`bg-surface border border-line rounded-xl ${className}`}>{children}</div>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[19px] text-ink">{children}</h2>
      {sub && <p className="text-[13px] text-muted mt-1 leading-relaxed">{sub}</p>}
    </div>
  );
}

type Tone = "neutral" | "brand" | "good" | "warn" | "bad";
const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted border-line",
  brand: "bg-brand/12 text-brand-hi border-brand/25",
  good: "bg-good-soft text-good border-good/25",
  warn: "bg-warn-soft text-warn border-warn/25",
  bad: "bg-bad-soft text-bad border-bad/25",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border leading-none whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[12px] text-faint mt-1">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-lg bg-surface-2 border border-line text-sm text-ink placeholder:text-faint outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 transition-colors";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`${inputCls} ${className}`} {...rest} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={`${inputCls} h-auto py-2 leading-relaxed resize-none ${className}`}
      {...rest}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, ...rest } = props;
  return (
    <select className={`${inputCls} pr-8 cursor-pointer appearance-none ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex p-0.5 bg-surface-2 border border-line rounded-lg">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 h-8 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap ${
            value === o.value
              ? "bg-brand text-brand-fg"
              : "text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Meter({ value, max, tone = "brand" }: { value: number; max: number; tone?: Tone }) {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100);
  const color =
    tone === "good"
      ? "bg-good"
      : tone === "warn"
      ? "bg-warn"
      : tone === "bad"
      ? "bg-bad"
      : "bg-brand";
  return (
    <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-[width] duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const scroller = document.querySelector<HTMLElement>(".phone-scroll");
    const previousOverflow = scroller?.style.overflowY ?? "";
    if (scroller) scroller.style.overflowY = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
      ) ?? []).filter((el) => el.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) { e.preventDefault(); return; }
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
        e.preventDefault(); first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (scroller) scroller.style.overflowY = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 @min-[640px]/phone:p-6">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative bg-surface border border-line rounded-2xl shadow-2xl w-full my-6 anim-in flex flex-col max-h-[calc(var(--app-height)-5rem)] ${
          wide ? "max-w-[398px]" : "max-w-[380px]"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-line-soft shrink-0">
          <h3 id={titleId} className="text-[16px] text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="text-faint hover:text-ink w-11 h-11 shrink-0 grid place-items-center rounded-lg hover:bg-surface-2 transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="p-5 min-h-0 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-line-soft shrink-0 bg-surface rounded-b-2xl">{footer}</div>
        )}
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "good" | "warn" | "bad";
}) {
  const color = tone === "good" ? "text-good" : tone === "warn" ? "text-warn" : tone === "bad" ? "text-bad" : "text-ink";
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-muted uppercase tracking-wide break-words">{label}</div>
      <div className={`text-[22px] font-display font-semibold tnum mt-1 break-words ${color}`}>{value}</div>
      {sub && <div className="text-[12px] text-muted mt-0.5 break-words">{sub}</div>}
    </div>
  );
}
