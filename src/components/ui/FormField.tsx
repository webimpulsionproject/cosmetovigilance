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
      <label className="text-[11px] font-bold tracking-[0.09em] text-[#666] uppercase select-none">
        {label}
        {required && <span className="text-[#6B3FA0] ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-[#aaa] leading-tight">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 leading-tight flex items-center gap-1">
        <span>⚠</span>{error}
      </p>}
    </div>
  );
}

/* font-size: 16px empêche le zoom iOS */
export const inputCls = [
  'w-full bg-white rounded-lg border border-[#e6e6e6]',
  'px-4 py-3 text-[15px] text-[#111] leading-tight',
  'placeholder:text-[#ccc]',
  'transition-all duration-150',
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/15',
  'hover:border-[#c0c0c0]',
  'shadow-[0_1px_3px_rgba(0,0,0,0.05)]',
  '[-webkit-appearance:none]',
].join(' ');

export const selectCls = [
  'w-full bg-white rounded-lg border border-[#e6e6e6]',
  'px-4 py-3 text-[15px] text-[#111] leading-tight',
  'transition-all duration-150 cursor-pointer',
  'focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/15',
  'hover:border-[#c0c0c0]',
  'shadow-[0_1px_3px_rgba(0,0,0,0.05)]',
  '[-webkit-appearance:none] appearance-none',
  'bg-[url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'><polyline points=\'6 9 12 15 18 9\'></polyline></svg>")] bg-no-repeat bg-[right_12px_center]',
  'pr-10',
].join(' ');
