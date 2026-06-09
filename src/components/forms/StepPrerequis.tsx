'use client';

const PURPLE = '#6B3FA0';

const ITEMS = [
  {
    text: 'La preuve d\'achat (ticket de caisse, facture…)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2l1.5 1.5L7 2l1.5 1.5L10 2l1.5 1.5L13 2v17l-1.5-1.5L10 19l-1.5 1.5L7 19l-1.5 1.5L4 19V2z"/><line x1="7" y1="8" x2="13" y2="8"/><line x1="7" y1="12" x2="11" y2="12"/>
      </svg>
    ),
  },
  {
    text: 'Le produit ou son emballage',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    text: 'Tout élément utile à verser au dossier (ordonnances, attestations, factures de soins…)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

export default function StepPrerequis({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  return (
    <div>
      <div style={{ marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <button type="button" onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, color: '#9ca3af',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '6px 10px', borderRadius: 8, flexShrink: 0,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#f9fafb'; b.style.color = '#374151'; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'transparent'; b.style.color = '#9ca3af'; }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
            <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </button>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.3, margin: 0 }}>Avant de commencer</h2>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Éléments nécessaires</p>
        </div>

        <button type="button" onClick={onConfirm} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 700, color: 'white',
          background: PURPLE, border: 'none', borderRadius: 9,
          padding: '10px 22px', cursor: 'pointer',
          flexShrink: 0,
          boxShadow: '0 2px 10px rgba(107,63,160,0.3)',
          transition: 'opacity 0.15s',
        }}>
          Commencer
          <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '8px 0 16px' }}>
        <div style={{ background: '#fdf8ff', border: '1px solid #e8d9f8', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>
            Assurez-vous d'avoir les éléments suivants en votre possession avant de démarrer le remplissage du cas,{' '}
            <strong style={{ color: '#6B3FA0' }}>car il n'est pas possible d'enregistrer un brouillon.</strong>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ITEMS.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              background: 'white', border: '1px solid #ebebeb',
              borderRadius: 10, padding: '14px 18px',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: '#f5f1fb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0, paddingTop: 8 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
