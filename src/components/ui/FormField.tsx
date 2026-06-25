interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest select-none">
        {label}
        {required && <span className="text-[#6B3FA0] ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] text-gray-400 leading-tight">{hint}</p>}
      {error && (
        <p className="text-[12px] text-red-500 leading-tight flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="shrink-0">
            <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm.6 9H5.4V7.8h1.2V9zm0-2.4H5.4V3h1.2v3.6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export const inputCls =
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-900 ' +
  'placeholder:text-gray-300 transition-all duration-150 ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-300';

export const selectCls =
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-900 ' +
  'cursor-pointer transition-all duration-150 ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-300';
