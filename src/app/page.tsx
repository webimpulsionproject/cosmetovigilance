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

/* ─── Progress ─── */
function Progress({ step, type }: { step: number; type: ReclamationType }) {
  const steps = type === 'cosmetovigilance' ? STEPS_CV : STEPS_QU;
  const cur = step - 1;
  return (
    <div className="mb-6">
      {/* Mobile */}
      <div className="flex items-center justify-between mb-2 sm:hidden">
        <span className="text-sm font-semibold text-gray-900">{steps[cur]}</span>
        <span className="text-xs text-gray-400">{step} / {steps.length}</span>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden sm:hidden">
        <div className="h-full bg-[#6B3FA0] rounded-full transition-all duration-500" style={{ width: `${(step / steps.length) * 100}%` }}/>
      </div>
      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-0">
        {steps.map((label, i) => {
          const done = i < cur, active = i === cur, isLast = i === steps.length - 1;
          return (
            <div key={i} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  done  ? 'bg-[#6B3FA0] border-[#6B3FA0] text-white' :
                  active ? 'bg-white border-[#6B3FA0] text-[#6B3FA0]' :
                  'bg-white border-gray-200 text-gray-400'
                }`}>
                  {done ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-[11px] font-semibold whitespace-nowrap ${active ? 'text-[#6B3FA0]' : done ? 'text-gray-400' : 'text-gray-300'}`}>
                  {label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-px mx-2 mb-5 transition-all ${done ? 'bg-[#6B3FA0]' : 'bg-gray-200'}`}/>
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
    <div className="py-10 flex flex-col items-center gap-6 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Déclaration enregistrée</h2>
        <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
          Votre déclaration de {type === 'cosmetovigilance' ? 'cosmétovigilance' : 'qualité'} a bien été transmise.
        </p>
      </div>
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 bg-[#6B3FA0] text-white text-center">
          <p className="text-[10px] tracking-widest uppercase opacity-70 mb-1">Numéro de réclamation</p>
          <p className="text-2xl font-bold tracking-widest">{numero}</p>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          {['Dossier enregistré', 'Email envoyé au client', 'PDF transmis à Marionnaud'].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <polyline points="2 6 5 9 10 3" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {item}
            </div>
          ))}
        </div>
      </div>
      <button type="button" onClick={onReset}
        className="text-sm font-semibold text-white bg-[#6B3FA0] hover:bg-[#5a2d8a] px-6 py-2.5 rounded-lg transition-colors">
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
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* Panneau gauche */}
        <div className="lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col justify-between px-8 py-10 lg:px-10 lg:min-h-screen bg-[#6B3FA0]">
          <div>
            <Image src="/logo-marionnaud.png" alt="Marionnaud" width={120} height={32}
              style={{ height: 26, width: 'auto', filter: 'brightness(0) invert(1)' }}
              className="object-contain mb-14" priority/>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-4">
              Déclaration<br/>client
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Signalez un effet indésirable ou un problème de qualité sur un produit Marionnaud Paris.
            </p>
          </div>
          <div className="space-y-2.5 mt-10 lg:mt-0">
            {['Données protégées — RGPD', 'Processus guidé en 5 étapes', 'Confirmation automatique par email'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/60 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"/>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Panneau droit */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex items-center justify-end px-8 sm:px-12 lg:px-16 pt-8">
            <span className="text-[11px] font-bold tracking-widest uppercase text-gray-300">
              Formulaire de déclaration
            </span>
          </div>

          <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-12">
            <div className="w-full max-w-md">
              <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-4">
                Type de déclaration
              </p>
              <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-8">
                Choisissez le motif correspondant à votre situation.
              </h2>

              <div className="border-t border-gray-100">
                {([
                  { value: 'cosmetovigilance' as const, label: 'Cosmétovigilance', desc: "Effet indésirable à un produit : irritation, rougeurs, brûlures, démangeaisons, yeux gonflés…" },
                  { value: 'qualite' as const, label: 'Qualité', desc: "Dysfonctionnement, dérive de couleur ou d'odeur, remarques sur l'efficacité du produit…" },
                ] as const).map((opt) => {
                  const active = selectedType === opt.value;
                  return (
                    <label key={opt.value} className="flex items-start gap-4 py-5 border-b border-gray-100 cursor-pointer group select-none">
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${active ? 'border-[#6B3FA0]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {active && <div className="w-2 h-2 rounded-full bg-[#6B3FA0]"/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-0.5">{opt.label}</p>
                        <p className={`text-sm leading-relaxed transition-colors ${active ? 'text-[#6B3FA0]' : 'text-gray-400 group-hover:text-gray-500'}`}>{opt.desc}</p>
                      </div>
                      <input type="radio" name="type" value={opt.value} checked={active} onChange={() => setSelectedType(opt.value)} className="sr-only"/>
                    </label>
                  );
                })}
              </div>

              <div className="mt-8">
                <button type="button" onClick={handleStart} disabled={!selectedType}
                  className="text-sm font-bold text-white bg-[#6B3FA0] hover:bg-[#5a2d8a] px-7 py-3 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
                  Commencer
                </button>
              </div>
            </div>
          </div>

          <p className="px-8 sm:px-12 lg:px-16 pb-8 text-xs text-gray-300">
            © {new Date().getFullYear()} Marionnaud Lafayette — Données protégées conformément au RGPD
          </p>
        </div>
      </div>
    );
  }

  /* ══ ÉTAPES ══ */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Image src="/logo-marionnaud.png" alt="Marionnaud Paris" width={110} height={30}
            style={{ height: 24, width: 'auto' }} className="object-contain"/>
          {step < 99 && (
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-purple-50 text-[#6B3FA0] border border-purple-100">
              {data.type === 'cosmetovigilance' ? 'Cosmétovigilance' : 'Qualité'}
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {step > 0 && step < 99 && <Progress step={step} type={data.type}/>}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 sm:p-8">
            {step === 1 && <StepCoordonnees   value={data.coordonnees}        onChange={(v) => setData((d) => ({...d,coordonnees:v}))}        onBack={goBack}      onNext={goNext}/>}
            {step === 2 && <StepProduit        value={data.produits}           onChange={(v) => setData((d) => ({...d,produits:v}))}           onBack={goBack}      onNext={goNextStep2}/>}
            {step === 3 && isCosmetov && <StepEffetIndesirable value={data.effetIndesirable} onChange={(v) => setData((d) => ({...d,effetIndesirable:v}))} onBack={goBack} onNext={goNext}/>}
            {step === 4 && <StepAccordClient   value={data.accordClient}       onChange={(v) => setData((d) => ({...d,accordClient:v}))}       onBack={goBackStep4} onNext={goNext}/>}
            {step === 5 && (
              <>
                {submitError && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                    {submitError}
                  </div>
                )}
                <StepInfosComplementaires value={data.infosComplementaires} onChange={(v) => setData((d) => ({...d,infosComplementaires:v}))} onBack={goBack} onSubmit={handleSubmit} isLoading={isLoading}/>
              </>
            )}
            {step === 99 && <Confirmation numero={successNumero} type={data.type} onReset={reset}/>}
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          © {new Date().getFullYear()} Marionnaud Lafayette — Données protégées conformément au RGPD
        </p>
      </main>
    </div>
  );
}
