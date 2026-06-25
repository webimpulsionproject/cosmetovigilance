const PURPLE = '#6B3FA0';

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function StepHeader({
  title, subtitle, onBack, onNext,
  nextLabel = 'Continuer', nextDisabled = false, isLoading = false,
  children,
}: StepHeaderProps) {
  return (
    <div>
      {/* Titre */}
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #e5e0f0' }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.25, margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: 11, color: '#bbb', marginTop: 7, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{subtitle}</p>
        )}
      </div>

      {/* Contenu */}
      <div>{children}</div>

      {/* Navigation */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 32, paddingTop: 20, borderTop: '1px solid #f3f4f6',
      }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 13, fontWeight: 500, color: '#9ca3af',
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '9px 14px', borderRadius: 9,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
            <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || isLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, fontWeight: 600, color: 'white',
            background: nextDisabled ? '#e5e7eb' : PURPLE,
            border: 'none', borderRadius: 10,
            padding: '11px 24px',
            cursor: nextDisabled || isLoading ? 'not-allowed' : 'pointer',
            boxShadow: nextDisabled ? 'none' : '0 2px 12px rgba(107,63,160,0.28)',
            transition: 'all 0.15s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => { if (!nextDisabled && !isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#5a2d8a'; }}
          onMouseLeave={e => { if (!nextDisabled && !isLoading) (e.currentTarget as HTMLButtonElement).style.background = PURPLE; }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Envoi en cours…
            </>
          ) : (
            <>
              {nextLabel}
              <svg width="13" height="13" fill="none" viewBox="0 0 16 16">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
