'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { InfosComplementaires } from '@/types';
import StepHeader from '@/components/ui/StepHeader';
import { Bloc } from '@/components/ui/Bloc';
import { FormField, inputCls } from '@/components/ui/FormField';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SignaturePad = dynamic(() => import('@/components/ui/SignaturePad'), { ssr: false });

const ACTIONS = [
  { label: 'Constitution du dossier cosmétovigilance', warn: false },
  { label: 'Le client a gardé le produit (recommandé)', warn: false },
  { label: 'Remboursement (à éviter)', warn: true },
  { label: 'Échange (à éviter)', warn: true },
  { label: 'Produit récupéré par le magasin (à éviter)', warn: true },
];

type E = Partial<Record<keyof InfosComplementaires | 'actionsMin', string>>;

export default function StepInfosComplementaires({ value, onChange, onBack, onSubmit, isLoading }: {
  value: InfosComplementaires; onChange: (v: InfosComplementaires) => void;
  onBack: () => void; onSubmit: () => void; isLoading?: boolean;
}) {
  const [errors, setErrors] = useState<E>({});
  const set = (f: keyof InfosComplementaires, v: InfosComplementaires[keyof InfosComplementaires]) => { onChange({ ...value, [f]: v }); setErrors((e) => ({ ...e, [f]: undefined })); };
  const toggle = (a: string) => { const c = value.actionsEnMagasin; set('actionsEnMagasin', c.includes(a) ? c.filter((x) => x !== a) : [...c, a]); };

  const validate = () => {
    const e: E = {};
    if (!value.actionsEnMagasin.length) e.actionsMin = 'Sélectionner au moins une action';
    if (!value.nomMagasin.trim()) e.nomMagasin = 'Requis';
    if (!value.numeroDuMagasin.trim()) e.numeroDuMagasin = 'Requis';
    if (!value.emailMagasin.trim()) e.emailMagasin = 'Requis';
    if (!value.nomPrenomRRV.trim()) e.nomPrenomRRV = 'Requis';
    if (!value.nomPrenomSalarie.trim()) e.nomPrenomSalarie = 'Requis';
    if (!value.signatureSalarie) e.signatureSalarie = 'La signature est requise';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });

  return (
    <StepHeader title="Informations complémentaires" subtitle="Étape 5 sur 5" onBack={onBack} onNext={() => { if (validate()) onSubmit(); }} nextLabel="Soumettre" isLoading={isLoading}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
        <Bloc title="Actions effectuées en magasin">
          <div className="space-y-0.5">
            {ACTIONS.map(({ label, warn }) => {
              const checked = value.actionsEnMagasin.includes(label);
              return (
                <label key={label} className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none text-[14px] min-h-[40px] ${
                  checked
                    ? warn ? 'bg-amber-50 text-amber-700' : 'bg-[#f5f1fb] text-[#6B3FA0] font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(label)} className="sr-only"/>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    checked
                      ? warn ? 'bg-amber-400 border-amber-400' : 'bg-[#6B3FA0] border-[#6B3FA0]'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="leading-tight">{label}</span>
                </label>
              );
            })}
          </div>
          {errors.actionsMin && <p className="text-[12px] text-red-500 mt-2">⚠ {errors.actionsMin}</p>}
        </Bloc>

        <Bloc title="Informations du magasin">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Nom du magasin" required error={errors.nomMagasin}>
                <input className={`${inputCls}${errors.nomMagasin ? ' !border-red-300' : ''}`} placeholder="Paris Rivoli" value={value.nomMagasin} onChange={(e) => set('nomMagasin', e.target.value)}/>
              </FormField>
              <FormField label="N° magasin" required error={errors.numeroDuMagasin}>
                <input className={`${inputCls}${errors.numeroDuMagasin ? ' !border-red-300' : ''}`} placeholder="1234" inputMode="numeric" value={value.numeroDuMagasin} onChange={(e) => set('numeroDuMagasin', e.target.value)}/>
              </FormField>
            </div>
            <FormField label="Email du magasin" required error={errors.emailMagasin}>
              <input className={`${inputCls}${errors.emailMagasin ? ' !border-red-300' : ''}`} placeholder="magasin@marionnaud.com" type="email" inputMode="email" value={value.emailMagasin} onChange={(e) => set('emailMagasin', e.target.value)}/>
            </FormField>
            <FormField label="Nom / Prénom du RRV" required error={errors.nomPrenomRRV}>
              <input className={`${inputCls}${errors.nomPrenomRRV ? ' !border-red-300' : ''}`} placeholder="Jean Dupont" value={value.nomPrenomRRV} onChange={(e) => set('nomPrenomRRV', e.target.value)}/>
            </FormField>
          </div>
        </Bloc>
      </div>

      <div className="pt-6 border-t border-[#f0f0f0]">
        <Bloc title="Validation salarié">
          <div className="space-y-5 max-w-lg">
            <FormField label="Nom et prénom du salarié" required error={errors.nomPrenomSalarie}>
              <input className={`${inputCls}${errors.nomPrenomSalarie ? ' !border-red-300' : ''}`} placeholder="Jean Dupont" value={value.nomPrenomSalarie} onChange={(e) => set('nomPrenomSalarie', e.target.value)}/>
            </FormField>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Signature du salarié<span className="text-[#6B3FA0] ml-0.5">*</span>
              </p>
              <SignaturePad value={value.signatureSalarie} onChange={(v) => set('signatureSalarie', v)}/>
              {errors.signatureSalarie && <p className="text-[12px] text-red-500 mt-1.5">⚠ {errors.signatureSalarie}</p>}
            </div>
            <p className="text-[12px] text-[#bbb]">
              Date : <span className="text-[#888] font-medium">{today}</span>
            </p>
          </div>
        </Bloc>
      </div>
    </StepHeader>
  );
}
