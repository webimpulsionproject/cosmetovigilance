interface BlocProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Bloc({ title, hint, children, className }: BlocProps) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-gray-50/60 px-5 pt-4 pb-5 mb-5 ${className ?? ''}`}>
      <div className="flex items-start gap-2.5 mb-4">
        <div style={{ width: 3, height: 15, background: '#6B3FA0', borderRadius: 2, marginTop: 2, flexShrink: 0 }}/>
        <div>
          <h3 className="text-[13px] font-semibold text-gray-700 leading-tight">{title}</h3>
          {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
