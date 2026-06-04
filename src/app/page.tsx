'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ReclamationType, ReclamationFormData, Produit } from '@/types';
import StepCoordonnees from '@/components/forms/StepCoordonnees';
import StepProduit from '@/components/forms/StepProduit';
import StepEffetIndesirable from '@/components/forms/StepEffetIndesirable';
import StepAccordClient from '@/components/forms/StepAccordClient';
import StepInfosComplementaires from '@/components/forms/StepInfosComplementaires';

const STEPS_CV = ['Coordonnées', 'Produit', 'Effet', 'Accord', 'Magasin'];
const STEPS_QU = ['Coordonnées', 'Produit', 'Accord', 'Magasin'];

const mkProduit = (): Produit => ({
  id: Math.random().toString(36).slice(2), marque: '', denomination: '', codeBarres: '',
  numeroDeLot: '', dateExpiration: '', prixNet: '', dateAchat: '', quantite: '1',
});

const blank: ReclamationFormData = {
  type: 'cosmetovigilance',
  coordonnees: { nom: '', prenom: '', genre: '', age: '', langueParlée: '', langueAutre: '', email: '', telephone: '', numeroRue: '', nomRue: '', ville: '', codePostal: '', pays: '' },
  produits: [mkProduit()],
  effetIndesirable: { dateApparition: '', dateDisparition: '', consequences: [], localisation: [], description: '' },
  accordClient: { accordRGPD: '', signatureClient: '', nomPrenomClient: '' },
  infosComplementaires: { actionsEnMagasin: [], nomMagasin: '', numeroDuMagasin: '', emailMagasin: '', nomPrenomRRV: '', nomPrenomResponsable: '', nomPrenomSalarie: '', signatureSalarie: '' },
};

const PURPLE = '#6B3FA0';
const PURPLE_DARK = '#5a2d8a';

/* ─── Progress ─── */
function Progress({ step, type }: { step: number; type: ReclamationType }) {
  const steps = type === 'cosmetovigilance' ? STEPS_CV : STEPS_QU;
  const cur = step - 1;
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Barre mobile */}
      <div className="flex items-center justify-between sm:hidden" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: PURPLE }}>{steps[cur]}</span>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{step} / {steps.length}</span>
      </div>
      <div className="sm:hidden" style={{ height: 4, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: PURPLE, borderRadius: 4, width: `${(step / steps.length) * 100}%`, transition: 'width 0.4s' }}/>
      </div>
      {/* Cercles desktop */}
      <div className="hidden sm:flex" style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {steps.map((label, i) => {
          const done = i < cur, active = i === cur, last = i === steps.length - 1;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: last ? undefined : 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: `2px solid ${done || active ? PURPLE : '#d1d5db'}`,
                  background: done ? PURPLE : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: active ? PURPLE : done ? '#fff' : '#9ca3af',
                  boxShadow: active ? `0 0 0 4px rgba(107,63,160,0.1)` : 'none',
                }}>
                  {done ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : i + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', color: active ? PURPLE : done ? '#9ca3af' : '#d1d5db' }}>
                  {label}
                </span>
              </div>
              {!last && (
                <div style={{ flex: 1, height: 1, marginTop: 16, marginLeft: 8, marginRight: 8, marginBottom: 0, background: done ? PURPLE : '#e5e7eb', transition: 'background 0.3s' }}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Confirmation ─── */
function Confirmation({ numero, type, onReset }: { numero: string; type: ReclamationType; onReset: () => void }) {
  return (
    <div style={{ padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Déclaration enregistrée</h2>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
          Votre déclaration de {type === 'cosmetovigilance' ? 'cosmétovigilance' : 'qualité'} a bien été transmise.
        </p>
      </div>
      <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '20px 24px', background: PURPLE, textAlign: 'center', color: 'white' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 6 }}>Numéro de réclamation</p>
          <p style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.1em' }}>{numero}</p>
        </div>
        <div style={{ padding: '16px 20px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {['Dossier enregistré', 'Email envoyé au client', 'PDF transmis à Marionnaud'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <polyline points="2 6 5 9 10 3" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {item}
            </div>
          ))}
        </div>
      </div>
      <button onClick={onReset} style={{ background: PURPLE, color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        Nouvelle déclaration
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function HomePage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ReclamationFormData>(blank);
  const [selectedType, setSelectedType] = useState<ReclamationType | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successNumero, setSuccessNumero] = useState('');
  const [submitError, setSubmitError] = useState('');

  const isCosmetov = data.type === 'cosmetovigilance';

  const handleStart = () => {
    if (!selectedType) return;
    setData((d) => ({ ...d, type: selectedType }));
    setStep(1);
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

  const reset = () => { setStep(0); setSelectedType(''); setData(blank); setSuccessNumero(''); setSubmitError(''); };
  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);
  const goNextStep2 = () => setStep(isCosmetov ? 3 : 4);
  const goBackStep4 = () => setStep(isCosmetov ? 3 : 2);

  /* ══ ACCUEIL ══ */
  if (step === 0) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Panneau gauche */}
        <div style={{
          width: 380, flexShrink: 0, background: PURPLE,
          display: 'flex', flexDirection: 'column',
          padding: '48px 40px',
        }}>
          {/* Logo */}
          <div style={{ background: 'white', borderRadius: 10, padding: '10px 18px', display: 'inline-block', marginBottom: 56, alignSelf: 'flex-start' }}>
            <Image src="/logo-marionnaud.png" alt="Marionnaud Paris" width={140} height={38}
              style={{ height: 28, width: 'auto', display: 'block' }} className="object-contain" priority/>
          </div>

          {/* Texte principal */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
              Outil interne — Personnel magasin
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: 'white', lineHeight: 1.25, marginBottom: 20 }}>
              Déclaration<br/>cosmétovigilance<br/>& qualité
            </h1>
            <div style={{ width: 28, height: 2, background: 'rgba(255,255,255,0.2)', margin: '20px 0' }}/>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 280 }}>
              À utiliser pour toute remontée client relative à un effet indésirable ou un défaut qualité sur un produit cosmétique.
            </p>
          </div>

          {/* Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              'Formulaire officiel Marionnaud Lafayette',
              'Saisie guidée étape par étape',
              'Transmission automatique au service qualité',
            ].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <polyline points="2 6 5 9 10 3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Panneau droit */}
        <div style={{ flex: 1, background: '#f9fafb', display: 'flex', flexDirection: 'column' }}>

          {/* Zone centrée */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
            <div style={{ width: '100%', maxWidth: 520, background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '40px 40px 36px' }}>

              {/* En-tête */}
              <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                  Formulaire de déclaration client
                </h2>
                <p style={{ fontSize: 13, color: '#9ca3af' }}>
                  Sélectionnez le type de remontée pour démarrer la saisie.
                </p>
              </div>

              {/* Label */}
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 14 }}>
                Type de réclamation
              </p>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {([
                  {
                    value: 'cosmetovigilance' as const,
                    label: 'Cosmétovigilance',
                    tag: 'Effet indésirable',
                    desc: "Réaction indésirable à un produit : irritation, démangeaisons, brûlures, rougeurs, yeux gonflés, boutons, allergie… Le mauvais usage du produit ne relève pas de la cosmétovigilance.",
                  },
                  {
                    value: 'qualite' as const,
                    label: 'Qualité produit',
                    tag: 'Défaut qualité',
                    desc: "Toute autre remontée : dysfonctionnement, dérive de couleur ou d'odeur, efficacité insuffisante, packaging défectueux, corps étranger...",
                  },
                ] as const).map((opt) => {
                  const active = selectedType === opt.value;
                  return (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '16px 18px',
                      border: `1.5px solid ${active ? PURPLE : '#e5e7eb'}`,
                      borderRadius: 10,
                      cursor: 'pointer', userSelect: 'none',
                      background: active ? '#f5f3ff' : '#fafafa',
                      boxShadow: active ? `0 0 0 3px rgba(107,63,160,0.08)` : 'none',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{
                        marginTop: 3, width: 18, height: 18, borderRadius: '50%',
                        border: `2px solid ${active ? PURPLE : '#d1d5db'}`,
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE }}/>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: active ? PURPLE : '#111827' }}>{opt.label}</span>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                            background: active ? PURPLE : '#eff0f1',
                            color: active ? 'white' : '#6b7280',
                            letterSpacing: '0.03em',
                          }}>{opt.tag}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{opt.desc}</p>
                      </div>
                      <input type="radio" name="type" value={opt.value} checked={active} onChange={() => setSelectedType(opt.value)} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}/>
                    </label>
                  );
                })}
              </div>

              {/* Bouton */}
              <button onClick={handleStart} disabled={!selectedType} style={{
                width: '100%',
                background: selectedType ? PURPLE : '#e5e7eb',
                color: selectedType ? 'white' : '#9ca3af',
                border: 'none', borderRadius: 10, padding: '14px 0',
                fontSize: 14, fontWeight: 700,
                cursor: selectedType ? 'pointer' : 'not-allowed',
                boxShadow: selectedType ? '0 4px 16px rgba(107,63,160,0.3)' : 'none',
                letterSpacing: '0.02em',
                transition: 'all 0.15s',
              }}>
                Démarrer la saisie
              </button>

            </div>
          </div>

          <div style={{ padding: '0 64px 24px' }}>
            <p style={{ fontSize: 11, color: '#e5e7eb' }}>
              © {new Date().getFullYear()} Marionnaud Lafayette
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ══ ÉTAPES ══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f4f3f8', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #ebebeb', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image src="/logo-marionnaud.png" alt="Marionnaud Paris" width={160} height={44}
            style={{ height: 32, width: 'auto' }} className="object-contain"/>
          {step < 99 && (
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: PURPLE, background: '#f0ebfa', border: '1px solid #e0d4f5',
              padding: '5px 14px', borderRadius: 999,
            }}>
              {data.type === 'cosmetovigilance' ? 'Cosmétovigilance' : 'Qualité produit'}
            </span>
          )}
        </div>
      </header>

      {/* Contenu */}
      <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', width: '100%', padding: '28px 32px 48px' }}>
        {step > 0 && step < 99 && <Progress step={step} type={data.type}/>}

        <div style={{
          background: 'white', borderRadius: 14,
          border: '1px solid #e8e8e8',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          {/* Bande de couleur en haut */}
          {step < 99 && <div style={{ height: 3, background: `linear-gradient(90deg, ${PURPLE}, #9B6FD4)` }}/>}
          <div style={{ padding: '32px 36px' }}>
            {step === 1 && <StepCoordonnees   value={data.coordonnees}        onChange={(v) => setData((d) => ({...d,coordonnees:v}))}        onBack={goBack}      onNext={goNext}/>}
            {step === 2 && <StepProduit        value={data.produits}           onChange={(v) => setData((d) => ({...d,produits:v}))}           onBack={goBack}      onNext={goNextStep2}/>}
            {step === 3 && isCosmetov && <StepEffetIndesirable value={data.effetIndesirable} onChange={(v) => setData((d) => ({...d,effetIndesirable:v}))} onBack={goBack} onNext={goNext}/>}
            {step === 4 && <StepAccordClient   value={data.accordClient}       onChange={(v) => setData((d) => ({...d,accordClient:v}))}       onBack={goBackStep4} onNext={goNext}/>}
            {step === 5 && (
              <>
                {submitError && (
                  <div style={{ marginBottom: 20, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
                    {submitError}
                  </div>
                )}
                <StepInfosComplementaires value={data.infosComplementaires} onChange={(v) => setData((d) => ({...d,infosComplementaires:v}))} onBack={goBack} onSubmit={handleSubmit} isLoading={isLoading}/>
              </>
            )}
            {step === 99 && <Confirmation numero={successNumero} type={data.type} onReset={reset}/>}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#bbb', marginTop: 20 }}>
          © {new Date().getFullYear()} Marionnaud Lafayette
        </p>
      </main>
    </div>
  );
}
