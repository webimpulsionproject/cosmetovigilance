'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AccordClient } from '@/types';
import StepHeader from '@/components/ui/StepHeader';
import { FormField, inputCls } from '@/components/ui/FormField';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SignaturePad = dynamic(() => import('@/components/ui/SignaturePad'), { ssr: false });

function Bloc({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B3FA0] mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function StepAccordClient({ value, onChange, onBack, onNext }: {
  value: AccordClient; onChange: (v: AccordClient) => void; onBack: () => void; onNext: () => void;
}) {
  const [errors, setErrors] = useState<{ accordRGPD?: string; signatureClient?: string; nomPrenomClient?: string }>({});
  const [pdfOpen, setPdfOpen] = useState(false);

  const set = (f: keyof AccordClient, v: string) => { onChange({ ...value, [f]: v }); setErrors((e) => ({ ...e, [f]: undefined })); };

  const validate = () => {
    const e: typeof errors = {};
    if (!value.accordRGPD) e.accordRGPD = 'Veuillez choisir une option';
    if (!value.signatureClient) e.signatureClient = 'La signature est requise';
    if (!value.nomPrenomClient.trim()) e.nomPrenomClient = 'Requis';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });

  return (
    <div className="max-w-xl mx-auto">
      <StepHeader title="Accord du client" subtitle="Étape 4 sur 5" onBack={onBack} onNext={() => { if (validate()) onNext(); }}/>

      <Bloc title="Document officiel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#e6e6e6] bg-[#fafafa] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5f1fb] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#6B3FA0" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 4h8l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" strokeLinejoin="round"/>
                <polyline points="12 4 12 8 16 8" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#111] leading-snug">Accord de transmission des données personnelles</p>
              <p className="text-[11px] text-[#aaa] mt-0.5">Marionnaud Lafayette — document officiel</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <button onClick={() => setPdfOpen(true)} className="text-[12px] font-semibold text-[#6B3FA0] bg-[#f5f1fb] hover:bg-[#ede5f7] border border-[#ddd0f0] px-4 py-2.5 rounded-lg transition-colors min-h-[44px]">
              Consulter
            </button>
            <a href="/accord-client.pdf" download className="text-[12px] font-medium text-[#777] border border-[#e6e6e6] bg-white hover:bg-[#f5f5f5] px-4 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center">
              Télécharger
            </a>
          </div>
        </div>
      </Bloc>

      <Bloc title="Texte de l'accord">
        <div className="rounded-xl bg-[#faf8fd] border border-[#ddd0f0] px-5 py-4 text-[13px] sm:text-[14px] text-[#555] space-y-3 leading-relaxed">
          <p>Je suis informé(e) de l'utilisation, par Marionnaud Lafayette, de ses éventuels prestataires et les marques concernées le cas échéant, des données communiquées concernant ma santé dans le cadre du respect des incompatibilités ou maladies de cosmétovigilance et de garanties des produits concernés.</p>
          <p>J'autorise Marionnaud Lafayette à transmettre mon nom complet, mon adresse email, mon adresse postale et mon numéro de téléphone à la ou aux marque(s) concernée(s).</p>
        </div>
      </Bloc>

      <Bloc title="Autorisation">
        <div className="flex flex-col sm:flex-row gap-3">
          {(['oui','non'] as const).map((opt) => {
            const active = value.accordRGPD === opt;
            return (
              <label key={opt} className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-150 flex-1 text-[14px] font-semibold select-none min-h-[56px] ${active ? 'border-[#6B3FA0] bg-[#f5f1fb] text-[#6B3FA0]' : 'border-[#e6e6e6] bg-white text-[#666] hover:border-[#cbb8e8]'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${active ? 'border-[#6B3FA0]' : 'border-[#ccc]'}`}>
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-[#6B3FA0]"/>}
                </div>
                {opt === 'oui' ? "Oui, j'accepte" : 'Non, je refuse'}
                <input type="radio" name="accord" value={opt} checked={active} onChange={() => set('accordRGPD', opt)} className="sr-only"/>
              </label>
            );
          })}
        </div>
        {errors.accordRGPD && <p className="text-[12px] text-red-500 mt-2">⚠ {errors.accordRGPD}</p>}
        {value.accordRGPD === 'non' && (
          <p className="text-[13px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-3 leading-relaxed">
            Si votre réponse est &quot;non&quot;, nous vous conseillons de vous rapprocher de la marque directement.
          </p>
        )}
      </Bloc>

      <Bloc title="Signature du client">
        <SignaturePad value={value.signatureClient} onChange={(v) => set('signatureClient', v)}/>
        {errors.signatureClient && <p className="text-[12px] text-red-500 mt-2">⚠ {errors.signatureClient}</p>}
      </Bloc>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
        <div className="flex-1">
          <FormField label="Nom et prénom du client" required error={errors.nomPrenomClient}>
            <input
              className={`${inputCls}${errors.nomPrenomClient ? ' !border-red-300' : ''}`}
              placeholder="Marie Dupont"
              value={value.nomPrenomClient}
              onChange={(e) => set('nomPrenomClient', e.target.value)}
              autoComplete="name"
            />
          </FormField>
        </div>
        <p className="text-[12px] text-[#bbb] sm:text-right whitespace-nowrap">
          Date : <span className="text-[#888] font-medium">{today}</span>
        </p>
      </div>

      {/* Modal PDF */}
      {pdfOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" style={{backdropFilter:'blur(4px)'}} onClick={() => setPdfOpen(false)}>
          <div
            className="bg-white w-full sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{height:'92vh', maxWidth:'900px'}}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Document accord client"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb] shrink-0">
              <div>
                <p className="text-[14px] font-semibold text-[#111]">Accord de transmission des données personnelles</p>
                <p className="text-[11px] text-[#aaa]">Marionnaud Lafayette</p>
              </div>
              <div className="flex items-center gap-3">
                <a href="/accord-client.pdf" download className="text-[12px] font-semibold text-[#6B3FA0] hover:underline hidden sm:block">Télécharger</a>
                <button onClick={() => setPdfOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl text-[#aaa] hover:bg-[#f5f5f5] hover:text-[#333] transition-colors text-xl" aria-label="Fermer">×</button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe src="/accord-client.pdf" className="w-full h-full border-0" title="Accord client"/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
