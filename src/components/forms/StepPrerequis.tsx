'use client';

import StepHeader from '@/components/ui/StepHeader';

const PURPLE = '#6B3FA0';

const ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2l1.5 1.5L7 2l1.5 1.5L10 2l1.5 1.5L13 2v17l-1.5-1.5L10 19l-1.5 1.5L7 19l-1.5 1.5L4 19V2z"/>
        <line x1="7" y1="8" x2="13" y2="8"/><line x1="7" y1="12" x2="11" y2="12"/>
      </svg>
    ),
    title: 'La preuve d\'achat',
    desc: 'Ticket de caisse, facture ou tout justificatif d\'achat du produit.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    title: 'Le produit ou son emballage',
    desc: 'Si disponible, conservez le produit et/ou son emballage intact.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Documents complémentaires',
    desc: 'Ordonnances, attestations médicales, résultats d\'examens, factures de soins…',
  },
];

export default function StepPrerequis({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  return (
    <StepHeader
      title="Avant de commencer"
      subtitle="Éléments nécessaires"
      onBack={onBack}
      onNext={onConfirm}
      nextLabel="Commencer la saisie"
    >
      <div style={{ background: 'rgba(107,63,160,0.05)', border: '1px solid rgba(107,63,160,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>
          Assurez-vous d'avoir les éléments suivants avant de démarrer,{' '}
          <strong style={{ color: PURPLE, fontWeight: 600 }}>car il n'est pas possible d'enregistrer un brouillon.</strong>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ITEMS.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 16,
            background: '#fafafa', border: '1px solid #f0f0f0',
            borderRadius: 12, padding: '16px 18px',
            transition: 'border-color 0.15s',
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(107,63,160,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.icon}
            </div>
            <div style={{ paddingTop: 2 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', marginBottom: 3 }}>{item.title}</p>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </StepHeader>
  );
}
