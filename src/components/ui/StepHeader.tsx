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
    <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Retour
      </button>

      <div className="text-center min-w-0 flex-1">
        <h2 className="text-lg font-bold text-gray-900 leading-snug">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || isLoading}
        className="flex items-center gap-2 text-sm font-bold text-white bg-[#6B3FA0] hover:bg-[#5a2d8a] active:bg-[#4e2a70] px-5 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        ) : (
          <>
            {nextLabel}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
