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

const gradientPurple = 'linear-gradient(160deg,#3a1a6e 0%,#5a2d8a 50%,#7B4FB0 100%)';
const gradientBtn    = 'linear-gradient(135deg,#4a2878,#7B4FB0)';

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Progress bar (étapes) ─── */
function Progress({ step, type }: { step: number; type: ReclamationType }) {
  const steps = type === 'cosmetovigilance' ? STEPS_CV : STEPS_QU;
  const cur = step - 1;
  return (
    <div className="mb-8">
      {/* Mobile */}
      <div className="flex items-center justify-between mb-3 sm:hidden">
        <span className="text-[15px] font-bold text-[#6B3FA0]">{steps[cur]}</span>
        <span className="text-[13px] text-[#aaa] font-semibold">Étape {step} / {steps.length}</span>
      </div>
      <div className="h-1.5 bg-[#e8e8e8] rounded-full overflow-hidden sm:hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(step / steps.length) * 100}%`, background: gradientPurple }}/>
      </div>
      {/* Desktop */}
      <div className="hidden sm:flex items-start justify-between">
        {steps.map((label, i) => {
          const done = i < cur, active = i === cur, isLast = i === steps.length - 1;
          return (
            <div key={i} className={`flex items-start ${isLast ? 'shrink-0' : 'flex-1'}`}>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                    done ? 'text-white border-[#6B3FA0]' : active ? 'bg-white border-[#6B3FA0] text-[#6B3FA0]' : 'bg-white border-[#ddd] text-[#ccc]'
                  }`}
                  style={{
                    ...(done   ? { background: gradientPurple } : {}),
                    ...(active ? { boxShadow: '0 0 0 5px rgba(107,63,160,0.13)' } : {}),
                  }}
                >
                  {done ? <CheckIcon /> : i + 1}
                </div>
                <span className={`text-[12px] font-semibold whitespace-nowrap ${active ? 'text-[#6B3FA0]' : done ? 'text-[#aaa]' : 'text-[#ccc]'}`}>
                  {label}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 h-[2px] mx-3 mt-5 rounded-full transition-all duration-500"
                  style={{ background: i < cur ? gradientPurple : '#e8e8e8' }}/>
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
    <div className="py-12 flex flex-col items-center gap-7 text-center max-w-sm mx-auto">
      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{background: gradientPurple}}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div>
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#6B3FA0] mb-2">Déclaration enregistrée</p>
        <h2 className="text-[24px] font-bold text-[#0d0d0d]">Merci !</h2>
        <p className="text-[#525252] text-[15px] mt-2 leading-relaxed">
          Votre déclaration de {type === 'cosmetovigilance' ? 'cosmétovigilance' : 'qualité'} a bien été transmise.
        </p>
      </div>
      <div className="w-full rounded-2xl overflow-hidden border border-[#d8c8f0]">
        <div className="px-6 py-5 text-white" style={{background: gradientPurple}}>
          <p className="text-[11px] tracking-[0.16em] uppercase opacity-70 mb-1.5">Numéro de réclamation</p>
          <p className="text-[28px] font-bold tracking-widest">{numero}</p>
        </div>
        <div className="px-5 py-4 bg-[#f9f7fd] space-y-3">
          {['Dossier enregistré en base de données', 'Email de confirmation envoyé au client', 'PDF transmis à l\'équipe Marionnaud'].map((item) => (
            <div key={item} className="flex items-center gap-3 text-[14px] text-[#444]">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{background:'#6B3FA0'}}>
                <CheckIcon/>
              </div>
              <span className="text-left">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <button type="button" onClick={onReset} className="w-full text-[15px] font-bold text-white px-8 py-4 rounded-xl" style={{background: gradientBtn, boxShadow:'0 4px 16px rgba(107,63,160,0.35)'}}>
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
    setIsLoading(true);
    setSubmitError('');
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

  /* ══ PAGE ACCUEIL — split panel ══ */
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ── Panneau gauche (violet) ── */}
        <div
          className="lg:w-[360px] xl:w-[420px] flex-shrink-0 flex flex-col justify-between px-8 py-8 lg:px-10 lg:py-10"
          style={{ background: gradientPurple, minHeight: '100dvh' }}
        >
          {/* Logo */}
          <div>
            <div className="mb-12 lg:mb-16">
              <Image
                src="/logo-marionnaud.png"
                alt="Marionnaud Paris"
                width={130} height={36}
                style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)' }}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-[38px] lg:text-[44px] xl:text-[52px] font-bold text-white leading-[1.1] mb-5">
              Déclaration<br/>client
            </h1>
            <p className="text-white/65 text-[14px] lg:text-[15px] leading-relaxed max-w-xs">
              Signalez un effet indésirable ou un problème de qualité sur un produit Marionnaud Paris.
            </p>
          </div>

          {/* Bullets */}
          <div className="space-y-3 mt-10 lg:mt-0">
            {[
              'Données protégées — RGPD',
              'Processus guidé en 5 étapes',
              'Confirmation automatique par email',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/70 text-[13px]">
                <div className="w-4 h-4 rounded-full border border-white/35 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60"/>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── Panneau droit (blanc) ── */}
        <div className="flex-1 flex flex-col bg-white min-h-screen">
          {/* Top bar */}
          <div className="flex items-center justify-between px-8 sm:px-12 lg:px-16 pt-8">
            {/* Logo visible uniquement sur mobile (le panneau gauche est caché) */}
            <div className="lg:hidden">
              <Image
                src="/logo-marionnaud.png"
                alt="Marionnaud Paris"
                width={110} height={30}
                style={{ height: 24, width: 'auto' }}
                className="object-contain"
              />
            </div>
            <span className="ml-auto text-[11px] font-bold tracking-[0.18em] uppercase text-[#bbb]">
              Formulaire de déclaration
            </span>
          </div>

          {/* Contenu centré */}
          <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-12">
            <div className="w-full max-w-lg">

              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#999] mb-5">
                Type de déclaration
              </p>
              <h2 className="text-[22px] sm:text-[27px] font-bold text-[#111] leading-snug mb-8">
                Choisissez le motif correspondant à votre situation.
              </h2>

              {/* Options */}
              <div className="border-t border-[#ebebeb]">
                {([
                  {
                    value: 'cosmetovigilance' as const,
                    label: 'Cosmétovigilance',
                    desc: "Effet indésirable à un produit : irritation, rougeurs, brûlures, démangeaisons, yeux gonflés…",
                  },
                  {
                    value: 'qualite' as const,
                    label: 'Qualité',
                    desc: "Dysfonctionnement, dérive de couleur ou d'odeur, remarques sur l'efficacité du produit…",
                  },
                ] as const).map((opt) => {
                  const active = selectedType === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className="flex items-start gap-4 py-5 border-b border-[#ebebeb] cursor-pointer group select-none"
                    >
                      <div className={`mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        active ? 'border-[#6B3FA0]' : 'border-[#ccc] group-hover:border-[#aaa]'
                      }`}>
                        {active && <div className="w-2 h-2 rounded-full bg-[#6B3FA0]"/>}
                      </div>
                      <div>
                        <p className="text-[16px] font-bold text-[#111] mb-1">{opt.label}</p>
                        <p className={`text-[13px] leading-relaxed transition-colors ${active ? 'text-[#6B3FA0]' : 'text-[#aaa] group-hover:text-[#888]'}`}>
                          {opt.desc}
                        </p>
                      </div>
                      <input type="radio" name="type" value={opt.value} checked={active} onChange={() => setSelectedType(opt.value)} className="sr-only"/>
                    </label>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!selectedType}
                  className="text-[14px] font-bold text-white px-8 py-3.5 rounded-xl transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: selectedType ? gradientBtn : '#bbb',
                    boxShadow: selectedType ? '0 4px 16px rgba(107,63,160,0.35)' : 'none',
                  }}
                >
                  Commencer
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="px-8 sm:px-12 lg:px-16 pb-8 text-[11px] text-[#ccc]">
            &copy; {new Date().getFullYear()} Marionnaud Lafayette — Données protégées conformément au RGPD
          </p>
        </div>
      </div>
    );
  }

  /* ══ ÉTAPES DU FORMULAIRE ══ */
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6fb]">
      <header className="bg-white border-b border-[#e8e8e8] sticky top-0 z-40" style={{boxShadow:'0 1px 0 rgba(0,0,0,0.05)'}}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Image src="/logo-marionnaud.png" alt="Marionnaud Paris" width={120} height={34} style={{height:26,width:'auto'}} className="object-contain"/>
          {step < 99 && (
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-full border" style={{color:'#6B3FA0',background:'#f4f0fa',borderColor:'#d8c8f0'}}>
              {data.type === 'cosmetovigilance' ? 'Cosmétovigilance' : 'Qualité'}
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-10">
        {step > 0 && step < 99 && <Progress step={step} type={data.type}/>}

        <div className="bg-white rounded-2xl" style={{boxShadow:'0 4px 32px rgba(107,63,160,0.07),0 1px 4px rgba(0,0,0,0.05)'}}>
          <div className="p-6 sm:p-8 lg:p-10">
            {step === 1 && <StepCoordonnees   value={data.coordonnees}        onChange={(v) => setData((d) => ({...d,coordonnees:v}))}        onBack={goBack}      onNext={goNext}/>}
            {step === 2 && <StepProduit        value={data.produits}           onChange={(v) => setData((d) => ({...d,produits:v}))}           onBack={goBack}      onNext={goNextStep2}/>}
            {step === 3 && isCosmetov && <StepEffetIndesirable value={data.effetIndesirable} onChange={(v) => setData((d) => ({...d,effetIndesirable:v}))} onBack={goBack} onNext={goNext}/>}
            {step === 4 && <StepAccordClient   value={data.accordClient}       onChange={(v) => setData((d) => ({...d,accordClient:v}))}       onBack={goBackStep4} onNext={goNext}/>}
            {step === 5 && (
              <>
                {submitError && (
                  <div className="mb-6 border border-red-200 bg-red-50 rounded-xl px-4 py-3.5 text-[14px] text-red-600 font-medium">
                    ⚠ {submitError}
                  </div>
                )}
                <StepInfosComplementaires value={data.infosComplementaires} onChange={(v) => setData((d) => ({...d,infosComplementaires:v}))} onBack={goBack} onSubmit={handleSubmit} isLoading={isLoading}/>
              </>
            )}
            {step === 99 && <Confirmation numero={successNumero} type={data.type} onReset={reset}/>}
          </div>
        </div>

        <p className="text-center text-[12px] text-[#bbb] mt-6">
          &copy; {new Date().getFullYear()} Marionnaud Lafayette &nbsp;&mdash;&nbsp; Données protégées conformément au RGPD
        </p>
      </main>
    </div>
  );
}
