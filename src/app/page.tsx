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
  accordClient: { accordRGPD: '', signatureClient: '' },
  infosComplementaires: { actionsEnMagasin: [], nomMagasin: '', numeroDuMagasin: '', emailMagasin: '', nomPrenomRRV: '', nomPrenomResponsable: '', nomPrenomSalarie: '', signatureSalarie: '' },
};

/* ── Barre de progression ── */
function Progress({ step, type }: { step: number; type: ReclamationType }) {
  const steps = type === 'cosmetovigilance' ? STEPS_CV : STEPS_QU;
  const cur = step - 1;

  return (
    <div className="mb-8">
      {/* Mobile : texte uniquement */}
      <div className="flex items-center justify-between mb-3 sm:hidden">
        <span className="text-[12px] font-semibold text-[#6B3FA0]">{steps[cur]}</span>
        <span className="text-[12px] text-[#aaa]">{step} / {steps.length}</span>
      </div>
      {/* Barre */}
      <div className="relative h-1 bg-[#e6e6e6] rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[#6B3FA0] rounded-full transition-all duration-500"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>
      {/* Desktop : points numérotés */}
      <div className="hidden sm:flex items-start justify-between mt-3">
        {steps.map((label, i) => {
          const done = i < cur, active = i === cur;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                done   ? 'bg-[#6B3FA0] border-[#6B3FA0] text-white' :
                active ? 'bg-white border-[#6B3FA0] text-[#6B3FA0] shadow-[0_0_0_3px_rgba(107,63,160,0.15)]' :
                         'bg-white border-[#ddd] text-[#ccc]'
              }`}>
                {done
                  ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : i + 1}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide uppercase text-center leading-tight ${active ? 'text-[#6B3FA0]' : done ? 'text-[#bbb]' : 'text-[#ddd]'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Confirmation ── */
function Confirmation({ numero, type, onReset }: { numero: string; type: ReclamationType; onReset: () => void }) {
  return (
    <div className="py-10 sm:py-14 flex flex-col items-center gap-7 text-center max-w-sm mx-auto fade-up">
      <div className="relative w-20 h-20">
        <div className="pulse-ring absolute inset-0 rounded-full bg-[#6B3FA0]/20" />
        <div className="relative w-20 h-20 rounded-full bg-[#f5f1fb] border-2 border-[#6B3FA0] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.12em] uppercase font-bold text-[#6B3FA0] mb-2">Déclaration enregistrée</p>
        <h2 className="text-2xl font-bold text-[#111] tracking-tight">Merci !</h2>
        <p className="text-[#777] text-sm mt-2 leading-relaxed">
          Votre déclaration de {type === 'cosmetovigilance' ? 'cosmétovigilance' : 'qualité'} a bien été transmise.
        </p>
      </div>

      <div className="w-full rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(107,63,160,0.2)]">
        <div className="bg-[#6B3FA0] px-6 py-5 text-white">
          <p className="text-[10px] tracking-[0.14em] uppercase opacity-70 mb-1">Numéro de réclamation</p>
          <p className="text-3xl font-bold tracking-widest">{numero}</p>
        </div>
        <div className="bg-[#f5f1fb] px-6 py-4 space-y-2.5">
          {['Dossier enregistré en base de données', 'Email de confirmation envoyé au client', 'PDF transmis à l\'équipe Marionnaud'].map((item) => (
            <div key={item} className="flex items-center gap-3 text-[13px] text-[#555]">
              <div className="w-5 h-5 rounded-full bg-white border border-[#ddd0f0] flex items-center justify-center shrink-0">
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <polyline points="2 6 5 9 10 3" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-left">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-[13px] font-semibold text-[#6B3FA0] border-2 border-[#6B3FA0] hover:bg-[#6B3FA0] hover:text-white px-8 py-3 rounded-xl transition-all duration-200 w-full sm:w-auto"
      >
        Nouvelle déclaration
      </button>
    </div>
  );
}

/* ── Page principale ── */
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
    setIsLoading(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/reclamations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (json.success) { setSuccessNumero(json.numeroReclamation); setStep(99); }
      else setSubmitError(json.error || 'Une erreur est survenue.');
    } catch { setSubmitError('Impossible de joindre le serveur. Vérifiez votre connexion.'); }
    finally { setIsLoading(false); }
  };

  const reset = () => { setStep(0); setSelectedType(''); setData(blank); setSuccessNumero(''); setSubmitError(''); };
  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);
  const goNextStep2 = () => setStep(isCosmetov ? 3 : 4);
  const goBackStep4 = () => setStep(isCosmetov ? 3 : 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f3f7]">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-[#ebebeb] sticky top-0 z-40 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Image
            src="/logo-marionnaud.png"
            alt="Marionnaud Paris"
            width={120} height={34} priority
            style={{ height: 28, width: 'auto' }}
            className="object-contain sm:h-[32px]"
          />
          {step > 0 && step < 99 && (
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#6B3FA0] bg-[#f5f1fb] px-3 py-1.5 rounded-full border border-[#ddd0f0]">
              {data.type === 'cosmetovigilance' ? 'Cosmétovigilance' : 'Qualité'}
            </span>
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-10">

        {step > 0 && step < 99 && <Progress step={step} type={data.type} />}

        {/* ── ACCUEIL ── */}
        {step === 0 && (
          <div className="fade-up bg-white rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col md:flex-row">

              {/* Panneau gauche */}
              <div className="relative md:w-72 lg:w-80 bg-[#6B3FA0] p-7 sm:p-9 flex flex-col justify-between overflow-hidden min-h-[200px] md:min-h-0">
                {/* Décorations */}
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/[0.06]" aria-hidden="true"/>
                <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/[0.06]" aria-hidden="true"/>
                <div className="absolute top-1/2 -translate-y-1/2 right-3 w-20 h-20 rounded-full bg-white/[0.04]" aria-hidden="true"/>

                <div className="relative">
                  <p className="text-white/40 text-[10px] tracking-[0.18em] uppercase font-bold mb-5 sm:mb-7">Marionnaud Paris</p>
                  <h1 className="text-[22px] sm:text-[26px] font-bold text-white leading-tight tracking-tight">
                    Formulaire de<br className="hidden sm:block"/>déclaration client
                  </h1>
                  <p className="text-white/55 text-[13px] mt-3 leading-relaxed hidden sm:block">
                    Signalez un effet indésirable ou un problème de qualité sur un produit Marionnaud.
                  </p>
                </div>

                <div className="relative mt-6 sm:mt-10 hidden sm:flex flex-col gap-3">
                  {['Données protégées — RGPD', 'Formulaire guidé en 5 étapes', 'Confirmation par email automatique'].map((txt) => (
                    <div key={txt} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-white/60 text-[12px]">{txt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panneau droite */}
              <div className="flex-1 p-6 sm:p-9 flex flex-col justify-center">
                <p className="text-[11px] tracking-[0.1em] uppercase font-bold text-[#aaa] mb-1">Type de déclaration</p>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#111] tracking-tight mb-1.5">
                  Choisissez votre motif
                </h2>
                <p className="text-[13px] text-[#999] mb-6 leading-relaxed">
                  Sélectionnez le cas correspondant à votre situation.
                </p>

                <div className="space-y-3 mb-7">
                  {[
                    { value: 'cosmetovigilance' as const, label: 'Cosmétovigilance', desc: 'Réaction indésirable : irritation, rougeurs, brûlures, démangeaisons, yeux gonflés...' },
                    { value: 'qualite'           as const, label: 'Qualité',          desc: 'Dysfonctionnement, dérive de couleur/odeur, efficacité du produit...' },
                  ].map((opt) => {
                    const active = selectedType === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 sm:gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
                          active ? 'border-[#6B3FA0] bg-[#f5f1fb]' : 'border-[#ebebeb] hover:border-[#cbb8e8] hover:bg-[#fdfaff]'
                        }`}
                      >
                        {/* Radio custom */}
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${active ? 'border-[#6B3FA0]' : 'border-[#ccc]'}`}>
                          {active && <div className="w-2.5 h-2.5 rounded-full bg-[#6B3FA0]"/>}
                        </div>
                        <div>
                          <p className={`text-[14px] font-semibold transition-colors ${active ? 'text-[#6B3FA0]' : 'text-[#111]'}`}>{opt.label}</p>
                          <p className="text-[12px] text-[#999] mt-0.5 leading-relaxed">{opt.desc}</p>
                        </div>
                        <input type="radio" name="type" value={opt.value} checked={active} onChange={() => setSelectedType(opt.value)} className="sr-only"/>
                      </label>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!selectedType}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-[#6B3FA0] hover:bg-[#5a2d8a] active:bg-[#4e2a70] px-7 py-3.5 rounded-xl transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(107,63,160,0.35)] hover:shadow-[0_6px_20px_rgba(107,63,160,0.45)] disabled:shadow-none"
                  aria-disabled={!selectedType}
                >
                  Commencer le formulaire
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ÉTAPES ── */}
        {step > 0 && step < 99 && (
          <div className="fade-up bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="p-5 sm:p-8 md:p-10">
              {step === 1 && <StepCoordonnees   value={data.coordonnees}         onChange={(v) => setData((d) => ({ ...d, coordonnees: v }))}         onBack={goBack}      onNext={goNext}/>}
              {step === 2 && <StepProduit        value={data.produits}            onChange={(v) => setData((d) => ({ ...d, produits: v }))}            onBack={goBack}      onNext={goNextStep2}/>}
              {step === 3 && isCosmetov && <StepEffetIndesirable value={data.effetIndesirable} onChange={(v) => setData((d) => ({ ...d, effetIndesirable: v }))} onBack={goBack} onNext={goNext}/>}
              {step === 4 && <StepAccordClient   value={data.accordClient}        onChange={(v) => setData((d) => ({ ...d, accordClient: v }))}        onBack={goBackStep4} onNext={goNext}/>}
              {step === 5 && (
                <>
                  {submitError && (
                    <div role="alert" className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 rounded-xl px-4 py-3.5">
                      <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <p className="text-[13px] text-red-600">{submitError}</p>
                    </div>
                  )}
                  <StepInfosComplementaires value={data.infosComplementaires} onChange={(v) => setData((d) => ({ ...d, infosComplementaires: v }))} onBack={goBack} onSubmit={handleSubmit} isLoading={isLoading}/>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── CONFIRMATION ── */}
        {step === 99 && (
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-6 sm:p-10">
            <Confirmation numero={successNumero} type={data.type} onReset={reset}/>
          </div>
        )}

        <p className="text-center text-[11px] text-[#c0c0c0] mt-6 sm:mt-8">
          &copy; {new Date().getFullYear()} Marionnaud Lafayette &nbsp;&mdash;&nbsp; Données protégées conformément au RGPD
        </p>
      </main>
    </div>
  );
}
