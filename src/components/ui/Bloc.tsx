interface BlocProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Bloc({ title, hint, children, className }: BlocProps) {
  return (
    <div className={`mb-16 ${className ?? ''}`}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{ width: 4, height: 22, background: '#6B3FA0', borderRadius: 9, flexShrink: 0 }} />
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', letterSpacing: '-0.01em', margin: 0 }}>
          {title}
        </h3>
      </div>
      {hint && (
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: -14, marginBottom: 20, paddingLeft: 19 }}>
          {hint}
        </p>
      )}
      <div style={{ paddingLeft: 0 }}>
        {children}
      </div>
    </div>
  );
}
