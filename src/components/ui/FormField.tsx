interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label style={{
        fontSize: 11, fontWeight: 600, color: '#9ca3af',
        textTransform: 'uppercase', letterSpacing: '0.08em', userSelect: 'none',
      }}>
        {label}
        {required && <span style={{ color: '#6B3FA0', marginLeft: 4 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p style={{ fontSize: 12, color: '#d1d5db', marginTop: 2 }}>{hint}</p>
      )}
      {error && (
        <p style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
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
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-[15px] text-gray-900 ' +
  'placeholder:text-gray-300 transition-all duration-150 ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-300';

export const selectCls =
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-[15px] text-gray-900 ' +
  'cursor-pointer transition-all duration-150 ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-300';
