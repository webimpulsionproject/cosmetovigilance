interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-gray-500 select-none">
        {label}{required && <span className="text-[#6B3FA0] ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
      {error && <p className="text-[11px] text-red-500">⚠ {error}</p>}
    </div>
  );
}

export const inputCls =
  'w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-[14px] text-gray-900 ' +
  'placeholder:text-gray-300 transition-colors ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-400';

export const selectCls =
  'w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-[14px] text-gray-900 ' +
  'cursor-pointer transition-colors ' +
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ' +
  'hover:border-gray-400';
