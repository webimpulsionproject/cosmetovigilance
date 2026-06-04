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
      <label className="text-[13px] font-semibold text-[#444] select-none leading-none">
        {label}{required && <span className="text-[#6B3FA0] ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] text-[#a0a0a0]">{hint}</p>}
      {error && <p className="text-[12px] text-red-500">⚠ {error}</p>}
    </div>
  );
}

export const inputCls =
  'w-full bg-white border border-[#e0e0e0] rounded-xl px-4 py-3 text-[15px] text-[#0d0d0d] ' +
  'placeholder:text-[#c0c0c0] shadow-sm ' +
  'transition-all duration-150 focus:outline-none focus:border-[#6B3FA0] ' +
  'focus:ring-2 focus:ring-[#6B3FA0]/20 hover:border-[#b8b8b8]';

export const selectCls =
  'w-full bg-white border border-[#e0e0e0] rounded-xl px-4 py-3 text-[15px] text-[#0d0d0d] ' +
  'shadow-sm cursor-pointer ' +
  'transition-all duration-150 focus:outline-none focus:border-[#6B3FA0] ' +
  'focus:ring-2 focus:ring-[#6B3FA0]/20 hover:border-[#b8b8b8]';
