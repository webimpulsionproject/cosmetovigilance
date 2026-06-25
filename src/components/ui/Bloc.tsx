interface BlocProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Bloc({ title, hint, children, className }: BlocProps) {
  return (
    <div className={className} style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: '1.5px solid #f3f4f6' }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#6B3FA0', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
          {title}
        </h3>
        {hint && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, marginBottom: 0 }}>{hint}</p>}
      </div>
      {children}
    </div>
  );
}
