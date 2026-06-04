const PURPLE = '#6B3FA0';

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
      <button type="button" onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 13, fontWeight: 600, color: '#9ca3af',
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '6px 10px', borderRadius: 8,
        flexShrink: 0,
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
          <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Retour
      </button>

      <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{subtitle}</p>}
      </div>

      <button type="button" onClick={onNext} disabled={nextDisabled || isLoading} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, fontWeight: 700, color: 'white',
        background: PURPLE, border: 'none', borderRadius: 8,
        padding: '10px 20px', cursor: nextDisabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: nextDisabled || isLoading ? 0.4 : 1,
        flexShrink: 0, boxShadow: '0 2px 8px rgba(107,63,160,0.25)',
        transition: 'opacity 0.15s',
      }}>
        {isLoading ? (
          <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        ) : (
          <>
            {nextLabel}
            <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
