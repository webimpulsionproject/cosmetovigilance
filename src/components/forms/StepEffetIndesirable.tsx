'use client';

import { useState } from 'react';
import { EffetIndesirable } from '@/types';
import StepHeader from '@/components/ui/StepHeader';
import { FormField, inputCls } from '@/components/ui/FormField';

const CONSEQUENCES = [
  "Consultation d'un médecin ou d'un spécialiste",
  'Incapacité fonctionnelle',
  'Invalidité / infirmité',
  'Hospitalisation',
  'Anomalie congénitale',
  'Risque vital immédiat',
];
const LOCALISATIONS = ['Yeux','Bouche','Visage','Corps','Cuir chevelu','Autre'];

function Bloc({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] font-bold tracking-[0.1em] text-[#6B3FA0] uppercase">{title}</span>
        <div className="flex-1 h-px bg-[#f0ebf8]"/>
      </div>
      {children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 select-none text-[14px] min-h-[44px] ${
      checked ? 'bg-[#f5f1fb] text-[#6B3FA0] font-medium' : 'hover:bg-[#faf8fd] text-[#333] active:bg-[#f5f1fb]'
    }`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-[#6B3FA0] border-[#6B3FA0]' : 'border-[#ccc] bg-white'}`}>
        {checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span className="leading-tight">{label}</span>
    </label>
  );
}

export default function StepEffetIndesirable({ value, onChange, onBack, onNext }: {
  value: EffetIndesirable; onChange: (v: EffetIndesirable) => void; onBack: () => void; onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof EffetIndesirable, string>>>({});
  const [toujoursPresent, setToujoursPresent] = useState(!value.dateDisparition);

  const set = (f: keyof EffetIndesirable, v: EffetIndesirable[keyof EffetIndesirable]) => { onChange({ ...value, [f]: v }); setErrors((e) => ({ ...e, [f]: undefined })); };
  const toggle = (f: 'consequences'|'localisation', item: string) => { const c = value[f]; set(f, c.includes(item) ? c.filter((x) => x !== item) : [...c, item]); };

  const validate = () => {
    const e: Partial<Record<keyof EffetIndesirable, string>> = {};
    if (!value.dateApparition) e.dateApparition = 'Requis';
    if (!value.description.trim()) e.description = 'Requis';
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <div>
      <StepHeader title="Effet indésirable" subtitle="Étape 3 sur 5" onBack={onBack} onNext={() => { if (validate()) onNext(); }}/>

      <Bloc title="Dates de l'effet">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date d'apparition" required error={errors.dateApparition}>
            <input className={`${inputCls}${errors.dateApparition ? ' !border-red-300' : ''}`} type="date" value={value.dateApparition} onChange={(e) => set('dateApparition', e.target.value)}/>
          </FormField>
          <div>
            <FormField label="Date de disparition">
              <input className={`${inputCls}${toujoursPresent ? ' opacity-40 pointer-events-none' : ''}`} type="date" value={value.dateDisparition} disabled={toujoursPresent} onChange={(e) => set('dateDisparition', e.target.value)}/>
            </FormField>
            <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none min-h-[44px]">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${toujoursPresent ? 'bg-[#6B3FA0] border-[#6B3FA0]' : 'border-[#ccc] bg-white'}`}
                onClick={() => { const v = !toujoursPresent; setToujoursPresent(v); if (v) set('dateDisparition', ''); }}
              >
                {toujoursPresent && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-[13px] text-[#666]">Toujours présent</span>
            </label>
          </div>
        </div>
      </Bloc>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Bloc title="L'effet a provoqué">
          <div className="space-y-0.5">
            {CONSEQUENCES.map((c) => <CheckRow key={c} label={c} checked={value.consequences.includes(c)} onChange={() => toggle('consequences', c)}/>)}
          </div>
        </Bloc>
        <Bloc title="Localisation">
          <div className="space-y-0.5">
            {LOCALISATIONS.map((l) => <CheckRow key={l} label={l} checked={value.localisation.includes(l)} onChange={() => toggle('localisation', l)}/>)}
          </div>
        </Bloc>
      </div>

      <Bloc title="Description détaillée">
        <textarea
          className={`w-full border rounded-xl px-4 py-3 text-[15px] text-[#111] placeholder:text-[#ccc] resize-none h-32 transition-all duration-150 focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/15 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${errors.description ? 'border-red-300' : 'border-[#e6e6e6]'}`}
          placeholder="Réaction constatée, durée, intensité, contexte d'utilisation du produit..."
          value={value.description}
          onChange={(e) => set('description', e.target.value)}
        />
        {errors.description && <p className="text-[11px] text-red-500 mt-1">⚠ {errors.description}</p>}
      </Bloc>

      <button type="button" className="text-[13px] text-[#999] hover:text-[#6B3FA0] transition-colors font-medium py-2">
        + Joindre des documents partagés par le client
      </button>
    </div>
  );
}
