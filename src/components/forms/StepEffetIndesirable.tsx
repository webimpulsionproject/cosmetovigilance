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
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 select-none text-[14px] min-h-[44px] ${
      checked ? 'bg-purple-50 text-[#6B3FA0] font-medium' : 'hover:bg-gray-50 text-gray-700'
    }`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only"/>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-[#6B3FA0] border-[#6B3FA0]' : 'border-gray-300 bg-white'}`}>
        {checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span className="leading-tight">{label}</span>
    </label>
  );
}

export default function StepEffetIndesirable({ value, onChange, onBack, onNext }: {
  value: EffetIndesirable; onChange: (v: EffetIndesirable) => void; onBack: () => void; onNext: () => void;
}) {
  const [page, setPage] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Partial<Record<keyof EffetIndesirable | 'page2', string>>>({});
  const [toujoursPresent, setToujoursPresent] = useState(!value.dateDisparition);

  const set = (f: keyof EffetIndesirable, v: EffetIndesirable[keyof EffetIndesirable]) => {
    onChange({ ...value, [f]: v });
    setErrors((e) => ({ ...e, [f]: undefined }));
  };
  const toggle = (f: 'consequences' | 'localisation', item: string) => {
    const c = value[f];
    set(f, c.includes(item) ? c.filter((x) => x !== item) : [...c, item]);
  };

  const validatePage1 = () => {
    const e: typeof errors = {};
    if (!value.dateApparition) e.dateApparition = 'Requis';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validatePage2 = () => {
    const e: typeof errors = {};
    if (!value.description.trim()) e.description = 'Requis';
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ── Page 1 : Dates & Effets ── */
  if (page === 1) {
    return (
      <div>
        <StepHeader
          title="Effet indésirable"
          subtitle="Étape 3 sur 5 — Partie 1/2 : Dates & effets"
          onBack={onBack}
          onNext={() => { if (validatePage1()) setPage(2); }}
          nextLabel="Suite"
        />

        <Bloc title="Dates de l'effet">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date d'apparition" required error={errors.dateApparition}>
              <input className={`${inputCls}${errors.dateApparition ? ' !border-red-300' : ''}`} type="date" value={value.dateApparition} onChange={(e) => set('dateApparition', e.target.value)}/>
            </FormField>
            <div>
              <FormField label="Date de disparition">
                <input
                  className={`${inputCls}${toujoursPresent ? ' opacity-40 pointer-events-none' : ''}`}
                  type="date"
                  value={value.dateDisparition}
                  disabled={toujoursPresent}
                  onChange={(e) => set('dateDisparition', e.target.value)}
                />
              </FormField>
              <label className="flex items-center gap-2.5 mt-3 cursor-pointer select-none min-h-[44px]">
                <input
                  type="checkbox"
                  checked={toujoursPresent}
                  onChange={() => {
                    const next = !toujoursPresent;
                    setToujoursPresent(next);
                    if (next) set('dateDisparition', '');
                  }}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${toujoursPresent ? 'bg-[#6B3FA0] border-[#6B3FA0]' : 'border-gray-300 bg-white'}`}>
                  {toujoursPresent && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className="text-sm text-gray-600">L'effet est toujours présent au moment de la déclaration</span>
              </label>
            </div>
          </div>
        </Bloc>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Bloc title="L'effet a provoqué">
            <div className="space-y-0.5">
              {CONSEQUENCES.map((c) => (
                <CheckRow key={c} label={c} checked={value.consequences.includes(c)} onChange={() => toggle('consequences', c)}/>
              ))}
            </div>
          </Bloc>
          <Bloc title="Localisation">
            <div className="space-y-0.5">
              {LOCALISATIONS.map((l) => (
                <CheckRow key={l} label={l} checked={value.localisation.includes(l)} onChange={() => toggle('localisation', l)}/>
              ))}
            </div>
          </Bloc>
        </div>
      </div>
    );
  }

  /* ── Page 2 : Description & Documents ── */
  return (
    <div>
      <StepHeader
        title="Effet indésirable"
        subtitle="Étape 3 sur 5 — Partie 2/2 : Description & documents"
        onBack={() => setPage(1)}
        onNext={() => { if (validatePage2()) onNext(); }}
      />

      <Bloc title="Description détaillée de l'effet *">
        <p className="text-xs text-gray-400 mb-3">
          Décrivez précisément la réaction : zone touchée, intensité, durée, contexte d'utilisation du produit, soins réalisés...
        </p>
        <textarea
          className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none h-44 transition-all focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Ex : Apparition de rougeurs et démangeaisons sur le visage 2 heures après l'application de la crème. L'effet a duré 3 jours. Consultation chez le médecin traitant le lendemain..."
          value={value.description}
          onChange={(e) => set('description', e.target.value)}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">⚠ {errors.description}</p>}
        <p className="text-xs text-gray-400 mt-1">{value.description.length} caractère{value.description.length > 1 ? 's' : ''}</p>
      </Bloc>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Bloc title="Ticket de caisse / facture">
          <p className="text-xs text-gray-400 mb-3">Joindre le justificatif d'achat du produit concerné.</p>
          <button type="button" className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#6B3FA0] hover:bg-purple-50 rounded-xl py-5 text-sm font-medium text-gray-500 hover:text-[#6B3FA0] transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Joindre le ticket de caisse / la facture
          </button>
        </Bloc>

        <Bloc title="Autres documents">
          <p className="text-xs text-gray-400 mb-3">
            Ordonnances, résultats d'examens, attestation du médecin, photos de la réaction, factures de soins...
          </p>
          <button type="button" className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#6B3FA0] hover:bg-purple-50 rounded-xl py-5 text-sm font-medium text-gray-500 hover:text-[#6B3FA0] transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Joindre des documents
          </button>
        </Bloc>
      </div>
    </div>
  );
}
