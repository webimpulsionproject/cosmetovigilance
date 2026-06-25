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
      <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', userSelect: 'none', lineHeight: 1 }}>
        {label}
        {required && <span style={{ color: '#6B3FA0', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{hint}</p>
      )}
      {error && (
        <p style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm.6 9H5.4V7.8h1.2V9zm0-2.4H5.4V3h1.2v3.6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export const inputCls =
  'w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] text-gray-900 ' +
  'placeholder:text-gray-300 transition-colors duration-150 ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-300';

export const selectCls =
  'w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] text-gray-900 ' +
  'cursor-pointer transition-colors duration-150 ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-300';
