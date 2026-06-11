'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ReclamationType, ReclamationFormData, Produit } from '@/types';
import StepPrerequis from '@/components/forms/StepPrerequis';
import StepCoordonnees from '@/components/forms/StepCoordonnees';
import StepProduit from '@/components/forms/StepProduit';
import StepEffetIndesirable from '@/components/forms/StepEffetIndesirable';
import StepAccordClient from '@/components/forms/StepAccordClient';
import StepInfosComplementaires from '@/components/forms/StepInfosComplementaires';

const STEPS_CV = ['Coordonnées', 'Produit', 'Effet indésirable', 'Accord client', 'Infos magasin'];
const STEPS_QU = ['Coordonnées', 'Produit', 'Accord client', 'Infos magasin'];

const mkProduit = (): Produit => ({
  id: Math.random().toString(36).slice(2), marque: '', marqueAutre: '', denomination: '', codeBarres: '',
  numeroDeLot: '', dateExpiration: '', prixNet: '', dateAchat: '', quantite: '1', photos: [],
});

const blank: ReclamationFormData = {
  type: 'cosmetovigilance',
  coordonnees: { nom: '', prenom: '', genre: '', age: '', langueParlée: '', langueAutre: '', email: '', telephone: '', numeroRue: '', nomRue: '', ville: '', codePostal: '', pays: '' },
  produits: [mkProduit()],
  effetIndesirable: { dateApparition: '', dateDisparition: '', consequences: [], consequencesAutre: '', localisation: [], localisationAutre: '', description: '', ticketCaissePhoto: '', documentsPhotos: [] },
  accordClient: { accordRGPD: '', signatureClient: '', nomPrenomClient: '' },
  infosComplementaires: { actionsEnMagasin: [], nomMagasin: '', numeroDuMagasin: '', emailMagasin: '', nomPrenomRRV: '', nomPrenomResponsable: '', nomPrenomSalarie: '', signatureSalarie: '' },
};

const PURPLE = '#6B3FA0';

/* ─── Progress horizontal ─── */
function TopProgress({ step, type }: { step: number; type: ReclamationType }) {
  const steps = type === 'cosmetovigilance' ? STEPS_CV : STEPS_QU;
  const cur = step - 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, padding: '18px 32px 20px' }}>
      {steps.map((label, i) => {
        const done = i < cur, active = i === cur;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: done ? PURPLE : active ? 'white' : 'rgba(255,255,255,0.2)',
                border: `2px solid ${done || active ? 'white' : 'rgba(255,255,255,0.35)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? '0 0 0 4px rgba(255,255,255,0.2)' : 'none',
                transition: 'all 0.2s',
              }}>
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, color: active ? PURPLE : 'rgba(255,255,255,0.5)' }}>{i + 1}</span>
                )}
              </div>
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 400, marginTop: 5, textAlign: 'center', lineHeight: 1.3,
                color: active ? 'white' : done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                transition: 'color 0.15s',
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginTop: 13,
                background: done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                borderRadius: 2, transition: 'background 0.3s',
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Confirmation ─── */
function Confirmation({ numero, type, onReset }: { numero: string; type: ReclamationType; onReset: () => void }) {
  return (
    <div style={{ padding: '32px 0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 8 }}>Déclaration enregistrée</h2>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
          Votre déclaration de {type === 'cosmetovigilance' ? 'cosmétovigilance' : 'qualité'} a bien été transmise au service concerné.
        </p>
      </div>
      <div style={{ width: '100%', borderRadius: 14, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '20px 24px', background: PURPLE, textAlign: 'center', color: 'white' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.65, marginBottom: 6, fontWeight: 600 }}>Numéro de réclamation</p>
          <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.06em' }}>{numero}</p>
        </div>
        <div style={{ padding: '16px 20px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {['Dossier enregistré en base', 'Confirmation email envoyée', 'PDF transmis au service qualité'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <polyline points="2 6 5 9 10 3" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>
      <button onClick={onReset} style={{ background: PURPLE, color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 10px rgba(107,63,160,0.25)', transition: 'background 0.15s', letterSpacing: '0.01em' }}>
        Nouvelle déclaration
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function HomePage() {
  const [step, setStep] = useState(0);
  const [checklistVisible, setChecklistVisible] = useState(false);
  const [data, setData] = useState<ReclamationFormData>(blank);
  const [selectedType, setSelectedType] = useState<ReclamationType | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successNumero, setSuccessNumero] = useState('');
  const [submitError, setSubmitError] = useState('');

  const isCosmetov = data.type === 'cosmetovigilance';

  const handleStart = () => {
    if (!selectedType) return;
    setData((d) => ({ ...d, type: selectedType }));
    setChecklistVisible(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true); setSubmitError('');
    try {
      const res = await fetch('/api/reclamations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (json.success) { setSuccessNumero(json.numeroReclamation); setStep(99); }
      else setSubmitError(json.error || 'Une erreur est survenue.');
    } catch { setSubmitError('Impossible de joindre le serveur.'); }
    finally { setIsLoading(false); }
  };

  const reset = () => { setStep(0); setChecklistVisible(false); setSelectedType(''); setData(blank); setSuccessNumero(''); setSubmitError(''); };
  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);
  const goNextStep2 = () => setStep(isCosmetov ? 3 : 4);
  const goBackStep4 = () => setStep(isCosmetov ? 3 : 2);

  /* ══ ACCUEIL ══ */
  if (step === 0 && !checklistVisible) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f5f0ff 0%, #ede4fa 50%, #e8ddf7 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: -140, right: -140, width: 440, height: 440, borderRadius: '50%', background: 'rgba(107,63,160,0.07)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 340, height: 340, borderRadius: '50%', background: 'rgba(107,63,160,0.05)', pointerEvents: 'none' }}/>

        {/* Carte */}
        <div style={{
          width: '100%', maxWidth: 500,
          background: 'white', borderRadius: 22,
          boxShadow: '0 12px 48px rgba(107,63,160,0.18), 0 2px 6px rgba(0,0,0,0.04)',
          overflow: 'hidden', position: 'relative', zIndex: 1,
        }}>
          {/* Header violet */}
          <div style={{
            background: 'linear-gradient(160deg, #5a2d8a 0%, #6B3FA0 55%, #7c52b0 100%)',
            padding: '30px 40px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}/>
            <div style={{ background: 'white', borderRadius: 10, padding: '8px 20px', display: 'inline-block', marginBottom: 18, boxShadow: '0 2px 14px rgba(0,0,0,0.18)' }}>
              <Image src="/logo-marionnaud.webp" alt="Marionnaud Paris" width={768} height={278}
                quality={100} style={{ height: 26, width: 'auto', display: 'block' }} className="object-contain" priority/>
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
              Outil interne — Personnel magasin
            </p>
            <h1 style={{ fontSize: 21, fontWeight: 800, color: 'white', lineHeight: 1.3, letterSpacing: '-0.01em', margin: 0 }}>
              Déclaration cosmétovigilance<br/>& qualité produit
            </h1>
          </div>

          {/* Corps */}
          <div style={{ padding: '28px 36px 32px' }}>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, textAlign: 'center', marginBottom: 22 }}>
              Signalez un effet indésirable ou un défaut produit via ce formulaire officiel Marionnaud.
            </p>

            {/* Type sélection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {([
                {
                  value: 'cosmetovigilance' as const,
                  label: 'Cosmétovigilance',
                  tag: 'Effet indésirable',
                  desc: "Irritation, démangeaisons, brûlures, rougeurs, allergie, yeux gonflés…",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                      <path d="M12 2C8 2 4.5 5 4.5 9c0 2.5 1.2 4.7 3 6.1V17a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1.9c1.8-1.4 3-3.6 3-6.1C19.5 5 16 2 12 2z"/>
                      <line x1="9" y1="21" x2="15" y2="21"/>
                      <line x1="10" y1="17" x2="10" y2="21"/>
                      <line x1="14" y1="17" x2="14" y2="21"/>
                    </svg>
                  ),
                },
                {
                  value: 'qualite' as const,
                  label: 'Qualité produit',
                  tag: 'Défaut produit',
                  desc: "Dysfonctionnement, dérive de couleur ou d'odeur, packaging défectueux, corps étranger…",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                      <path d="M12 2l2.4 4.9 5.6.8-4 3.9.9 5.4L12 14.5l-4.9 2.5.9-5.4-4-3.9 5.6-.8z"/>
                    </svg>
                  ),
                },
              ] as const).map((opt) => {
                const active = selectedType === opt.value;
                return (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '15px 18px',
                    border: `1.5px solid ${active ? PURPLE : '#e5e7eb'}`,
                    borderRadius: 13, cursor: 'pointer', userSelect: 'none',
                    background: active ? 'rgba(107,63,160,0.04)' : '#fafafa',
                    boxShadow: active ? `0 0 0 3px rgba(107,63,160,0.09)` : 'none',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                      background: active ? PURPLE : '#ede9f6',
                      color: active ? 'white' : PURPLE,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {opt.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: active ? PURPLE : '#111827', transition: 'color 0.15s' }}>{opt.label}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: active ? PURPLE : '#eef0f2', color: active ? 'white' : '#6b7280', transition: 'all 0.15s' }}>{opt.tag}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>{opt.desc}</p>
                    </div>
                    <div style={{ marginTop: 10, width: 16, height: 16, borderRadius: '50%', border: `2px solid ${active ? PURPLE : '#d1d5db'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}>
                      {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: PURPLE }}/>}
                    </div>
                    <input type="radio" name="type" value={opt.value} checked={active} onChange={() => setSelectedType(opt.value)} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}/>
                  </label>
                );
              })}
            </div>

            {/* Bouton */}
            <button
              onClick={handleStart}
              disabled={!selectedType}
              style={{
                width: '100%', border: 'none', borderRadius: 12, padding: '14px 0',
                fontSize: 14, fontWeight: 700, cursor: selectedType ? 'pointer' : 'not-allowed',
                background: selectedType ? PURPLE : '#e9e9ef',
                color: selectedType ? 'white' : '#aaa',
                boxShadow: selectedType ? '0 4px 18px rgba(107,63,160,0.32)' : 'none',
                letterSpacing: '0.01em', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (selectedType) (e.currentTarget as HTMLButtonElement).style.background = '#5a2d8a'; }}
              onMouseLeave={e => { if (selectedType) (e.currentTarget as HTMLButtonElement).style.background = PURPLE; }}
            >
              Démarrer la saisie →
            </button>

            {/* Features */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20, paddingTop: 18, borderTop: '1px solid #f3f4f6', flexWrap: 'wrap' }}>
              {([
                {
                  text: 'Données RGPD',
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
                },
                {
                  text: 'Email automatique',
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 4 12 13 22 4"/></svg>,
                },
                {
                  text: 'PDF généré',
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>,
                },
              ]).map((f) => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#b8a8d0' }}>
                  <span style={{ color: '#c4b5d8' }}>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ marginTop: 20, fontSize: 11, color: '#c4b5d8', position: 'relative', zIndex: 1 }}>
          © {new Date().getFullYear()} Marionnaud Lafayette
        </p>
      </div>
    );
  }

  /* ══ ÉTAPES ══ */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #f5f0ff 0%, #ede4fa 50%, #e8ddf7 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 24px 48px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Cercles décoratifs */}
      <div style={{ position: 'absolute', top: -140, right: -140, width: 440, height: 440, borderRadius: '50%', background: 'rgba(107,63,160,0.07)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 340, height: 340, borderRadius: '50%', background: 'rgba(107,63,160,0.05)', pointerEvents: 'none' }}/>

      {/* Carte */}
      <div style={{
        width: '100%', maxWidth: 780, position: 'relative', zIndex: 1,
        background: 'white', borderRadius: 22,
        boxShadow: '0 12px 48px rgba(107,63,160,0.18), 0 2px 6px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        {/* Header violet */}
        <div style={{
          background: 'linear-gradient(160deg, #5a2d8a 0%, #6B3FA0 55%, #7c52b0 100%)',
          padding: '20px 32px 0', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}/>

          {/* Logo + badge type */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ background: 'white', borderRadius: 9, padding: '6px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
              <Image src="/logo-marionnaud.webp" alt="Marionnaud" width={768} height={278}
                quality={100} style={{ height: 22, width: 'auto', display: 'block' }} className="object-contain"/>
            </div>
            {step < 99 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 999, padding: '5px 13px', backdropFilter: 'blur(4px)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.8)', flexShrink: 0 }}/>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {isCosmetov ? 'Cosmétovigilance' : 'Qualité produit'}
                </span>
              </div>
            )}
            {step === 99 && (
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Déclaration transmise
              </span>
            )}
          </div>

          {/* Progress */}
          {step < 99 && !checklistVisible && (
            <TopProgress step={step} type={data.type}/>
          )}
          {(checklistVisible || step === 99) && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', paddingBottom: 18, marginTop: -4 }}>
              {checklistVisible ? 'Préparez les éléments nécessaires avant de démarrer la saisie.' : ''}
            </p>
          )}
        </div>

        {/* Corps */}
        <div style={{ padding: '32px 40px' }}>
          {submitError && (
            <div style={{ marginBottom: 20, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
              {submitError}
            </div>
          )}

          {checklistVisible && (
            <StepPrerequis onConfirm={() => { setChecklistVisible(false); setStep(1); }} onBack={() => setChecklistVisible(false)}/>
          )}
          {!checklistVisible && step === 1 && (
            <StepCoordonnees value={data.coordonnees} onChange={(v) => setData((d) => ({ ...d, coordonnees: v }))} onBack={goBack} onNext={goNext}/>
          )}
          {!checklistVisible && step === 2 && (
            <StepProduit value={data.produits} onChange={(v) => setData((d) => ({ ...d, produits: v }))} onBack={goBack} onNext={goNextStep2}/>
          )}
          {!checklistVisible && step === 3 && isCosmetov && (
            <StepEffetIndesirable value={data.effetIndesirable} onChange={(v) => setData((d) => ({ ...d, effetIndesirable: v }))} onBack={goBack} onNext={goNext}/>
          )}
          {!checklistVisible && step === 4 && (
            <StepAccordClient value={data.accordClient} onChange={(v) => setData((d) => ({ ...d, accordClient: v }))} onBack={goBackStep4} onNext={goNext} type={data.type}/>
          )}
          {!checklistVisible && step === 5 && (
            <StepInfosComplementaires value={data.infosComplementaires} onChange={(v) => setData((d) => ({ ...d, infosComplementaires: v }))} onBack={goBack} onSubmit={handleSubmit} isLoading={isLoading}/>
          )}
          {step === 99 && (
            <Confirmation numero={successNumero} type={data.type} onReset={reset}/>
          )}
        </div>
      </div>

      <p style={{ marginTop: 20, fontSize: 11, color: '#c4b5d8', position: 'relative', zIndex: 1 }}>
        © {new Date().getFullYear()} Marionnaud Lafayette
      </p>
    </div>
  );
}
