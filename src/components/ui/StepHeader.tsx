interface StepHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
}

const gradientBtn = 'linear-gradient(135deg,#4a2878,#7B4FB0)';

export default function StepHeader({
  title, subtitle, onBack, onNext,
  nextLabel = 'Continuer', nextDisabled = false, isLoading = false,
}: StepHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[#f0f0f0]">
      <button
        type="button"
        onClick={onBack}
        className="group flex items-center gap-2 text-[13px] font-medium text-[#888] hover:text-[#333] hover:bg-[#f5f5f5] active:bg-[#ebebeb] transition-all px-3 py-2.5 rounded-xl shrink-0"
        aria-label="Retour"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Retour</span>
      </button>

      <div className="text-center min-w-0 flex-1">
        <h2 className="text-[18px] sm:text-[20px] font-bold text-[#111] leading-snug">{title}</h2>
        {subtitle && <p className="text-[11px] text-[#bbb] tracking-widest uppercase mt-1">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || isLoading}
        className="group flex items-center gap-2 text-[14px] font-bold text-white px-5 sm:px-6 py-3 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed min-w-[100px] justify-center shrink-0"
        style={{
          background: gradientBtn,
          boxShadow: '0 4px 16px rgba(107,63,160,0.35)',
        }}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-label="Chargement">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        ) : (
          <>
            <span>{nextLabel}</span>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
