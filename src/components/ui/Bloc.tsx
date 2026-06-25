interface BlocProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Bloc({ title, hint, children, className }: BlocProps) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-md px-6 pt-7 pb-8 mb-8 ${className ?? ''}`}>
      <div className="flex items-center gap-2.5 mb-7">
        <div style={{ width: 3, height: 14, background: '#6B3FA0', borderRadius: 2, flexShrink: 0 }}/>
        <h3 className="text-[13px] font-bold text-gray-700 tracking-wide">{title}</h3>
      </div>
      {hint && <p className="text-[12px] text-gray-400 mb-4 -mt-3">{hint}</p>}
      {children}
    </div>
  );
}
