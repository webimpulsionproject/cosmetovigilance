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

/* ─── Sidebar progress vertical ─── */
function SidebarProgress({ step, type }: { step: number; type: ReclamationType }) {
  const steps = type === 'cosmetovigilance' ? STEPS_CV : STEPS_QU;
  const cur = step - 1;
  return (
    <nav style={{ padding: '20px 16px', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginBottom: 16, paddingLeft: 4 }}>
        Progression
      </p>
      {steps.map((label, i) => {
        const done = i < cur, active = i === cur;
        return (
          <div key={i} style={{ position: 'relative', marginBottom: 2 }}>
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute', left: 15, top: 32, height: 16, width: 1,
                background: done ? PURPLE : '#e9e9e9', borderRadius: 1, zIndex: 0,
              }}/>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 10,
              background: active ? 'rgba(107,63,160,0.07)' : 'transparent',
              transition: 'background 0.15s',
              position: 'relative', zIndex: 1,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: done ? PURPLE : 'white',
                border: `2px solid ${done || active ? PURPLE : '#ddd'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? `0 0 0 3px rgba(107,63,160,0.12)` : 'none',
                transition: 'all 0.2s',
              }}>
                {done ? (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 700, color: active ? PURPLE : '#bbb' }}>{i + 1}</span>
                )}
              </div>
              <span style={{
                fontSize: 13, fontWeight: active ? 600 : done ? 500 : 400, lineHeight: 1.3,
                color: active ? PURPLE : done ? '#374151' : '#aaa',
                transition: 'color 0.15s',
              }}>{label}</span>
            </div>
          </div>
        );
      })}
    </nav>
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
      <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }}>
        {/* ── Panneau principal ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
          <div style={{ width: '100%', maxWidth: 460 }}>
            {/* Titre bloc */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 8 }}>
                Démarrer une déclaration
              </h2>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6 }}>
                Sélectionnez le type de remontée pour commencer la saisie.
              </p>
            </div>

            {/* Type sélection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {([
                {
                  value: 'cosmetovigilance' as const,
                  label: 'Cosmétovigilance',
                  tag: 'Effet indésirable',
                  desc: "Réaction indésirable : irritation, démangeaisons, brûlures, rougeurs, allergie, yeux gonflés…",
                  emoji: '⚠️',
                },
                {
                  value: 'qualite' as const,
                  label: 'Qualité produit',
                  tag: 'Défaut produit',
                  desc: "Dysfonctionnement, dérive de couleur ou d'odeur, efficacité insuffisante, packaging défectueux, corps étranger…",
                  emoji: '🔍',
                },
              ] as const).map((opt) => {
                const active = selectedType === opt.value;
                return (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '16px 18px',
                    border: `1.5px solid ${active ? PURPLE : '#e5e7eb'}`,
                    borderRadius: 12, cursor: 'pointer', userSelect: 'none',
                    background: active ? 'rgba(107,63,160,0.04)' : '#fafafa',
                    boxShadow: active ? `0 0 0 3px rgba(107,63,160,0.08)` : 'none',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ marginTop: 2, width: 18, height: 18, borderRadius: '50%', border: `2px solid ${active ? PURPLE : '#d1d5db'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}>
                      {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE }}/>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: active ? PURPLE : '#111827', transition: 'color 0.15s' }}>{opt.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: active ? PURPLE : '#eef0f2', color: active ? 'white' : '#6b7280', transition: 'all 0.15s' }}>{opt.tag}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: '#6b7280', lineHeight: 1.55, margin: 0 }}>{opt.desc}</p>
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
                width: '100%', border: 'none', borderRadius: 11, padding: '14px 0',
                fontSize: 14, fontWeight: 700, cursor: selectedType ? 'pointer' : 'not-allowed',
                background: selectedType ? PURPLE : '#e9e9ef',
                color: selectedType ? 'white' : '#aaa',
                boxShadow: selectedType ? '0 4px 16px rgba(107,63,160,0.3)' : 'none',
                letterSpacing: '0.01em', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (selectedType) (e.currentTarget as HTMLButtonElement).style.background = '#5a2d8a'; }}
              onMouseLeave={e => { if (selectedType) (e.currentTarget as HTMLButtonElement).style.background = PURPLE; }}
            >
              Démarrer la saisie →
            </button>

            <p style={{ textAlign: 'center', fontSize: 11.5, color: '#d1d5db', marginTop: 20 }}>
              © {new Date().getFullYear()} Marionnaud Lafayette — Données protégées RGPD
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ══ ÉTAPES ══ */
  const stepsArr = isCosmetov ? STEPS_CV : STEPS_QU;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 252, flexShrink: 0,
        background: 'white',
        borderRight: '1px solid #ebebeb',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <Image src="/logo-marionnaud.png" alt="Marionnaud" width={130} height={36}
            style={{ height: 26, width: 'auto' }} className="object-contain"/>
        </div>

        {/* Badge type */}
        {step < 99 && (
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #f8f8f8' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(107,63,160,0.07)', borderRadius: 999,
              padding: '5px 12px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: PURPLE, flexShrink: 0 }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: PURPLE, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {isCosmetov ? 'Cosmétovigilance' : 'Qualité produit'}
              </span>
            </div>
          </div>
        )}

        {/* Progress steps */}
        {step < 99 && !checklistVisible && (
          <SidebarProgress step={step} type={data.type}/>
        )}

        {(checklistVisible || step === 99) && (
          <div style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'flex-start' }}>
            <p style={{ fontSize: 12.5, color: '#bbb', lineHeight: 1.7 }}>
              {checklistVisible
                ? 'Préparez les éléments nécessaires avant de démarrer la saisie.'
                : 'Votre déclaration a été transmise avec succès.'}
            </p>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }}/>

        {/* Pied sidebar */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: 11, color: '#d0ccdb' }}>Outil interne — Marionnaud</p>
        </div>
      </aside>

      {/* ── Contenu principal ── */}
      <div style={{ flex: 1, background: '#f7f5fb', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, padding: '28px 32px 52px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Carte principale */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              border: '1px solid rgba(107,63,160,0.09)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 28px -4px rgba(107,63,160,0.1)',
              overflow: 'hidden',
            }}>
              {step < 99 && <div style={{ height: 3, background: `linear-gradient(90deg, ${PURPLE}, #a87fd4)` }}/>}
              <div style={{ padding: '32px 36px' }}>
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
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#ccc', paddingBottom: 20 }}>
          © {new Date().getFullYear()} Marionnaud Lafayette
        </p>
      </div>
    </div>
  );
}
