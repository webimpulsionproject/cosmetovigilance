interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280' }}>
        {label}{required && <span style={{ color: '#6B3FA0', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && !error && <p style={{ fontSize: 11, color: '#9ca3af' }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: '#dc2626' }}>⚠ {error}</p>}
    </div>
  );
}

export const inputCls =
  'w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 ' +
  'placeholder:text-gray-400 transition-colors ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-400';

export const selectCls =
  'w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 ' +
  'cursor-pointer transition-colors ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-400';
