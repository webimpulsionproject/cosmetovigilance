interface StepHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
}

export default function StepHeader({
  title, subtitle, onBack, onNext,
  nextLabel = 'Continuer', nextDisabled = false, isLoading = false,
}: StepHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-8 pb-6 border-b border-[#f0f0f0]">
      <button
        type="button"
        onClick={onBack}
        className="group flex items-center gap-1.5 text-[13px] font-medium text-[#777] hover:text-[#111] transition-colors shrink-0 py-2"
        aria-label="Retour"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="hidden sm:inline">Retour</span>
      </button>

      <div className="text-center min-w-0">
        <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#111] leading-snug truncate">{title}</h2>
        {subtitle && <p className="text-[10px] sm:text-[11px] text-[#aaa] tracking-widest uppercase mt-0.5">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || isLoading}
        className="group flex items-center gap-2 text-[13px] font-semibold text-white bg-[#6B3FA0] hover:bg-[#5a2d8a] active:bg-[#4e2a70] px-4 sm:px-5 py-2.5 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_10px_rgba(107,63,160,0.3)] hover:shadow-[0_4px_14px_rgba(107,63,160,0.4)] disabled:shadow-none min-w-[90px] sm:min-w-[120px] justify-center shrink-0"
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-label="Chargement">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        ) : (
          <>
            <span className="hidden sm:inline">{nextLabel}</span>
            <span className="sm:hidden">{nextLabel === 'Continuer' ? '→' : nextLabel}</span>
            <svg className="w-3.5 h-3.5 hidden sm:block transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
