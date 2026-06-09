'use client';

import { useRef, useState } from 'react';
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
  'Autre',
];
const LOCALISATIONS = ['Yeux','Bouche','Visage','Corps','Cuir chevelu','Autre'];

function Bloc({ title, hint, children, className }: { title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className ?? 'mb-6'}>
      <div className="mb-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B3FA0]">{title}</h3>
        {hint && <p className="text-[11px] text-gray-400 mt-0.5 italic">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none text-[14px] min-h-[40px] ${
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

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PhotoUploadButton({
  label, value, multiple, onChange,
}: { label: string; value: string | string[]; multiple?: boolean; onChange: (v: string | string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const photos = Array.isArray(value) ? value : (value ? [value] : []);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const results: string[] = [];
    for (const file of Array.from(files)) {
      results.push(await fileToBase64(file));
    }
    if (multiple) {
      onChange([...photos, ...results]);
    } else {
      onChange(results[0] ?? '');
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#6B3FA0] hover:bg-purple-50 rounded-xl py-5 text-[14px] font-medium text-gray-500 hover:text-[#6B3FA0] transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
        </svg>
        {label}
        {photos.length > 0 && (
          <span className="ml-1 text-[11px] bg-[#6B3FA0] text-white rounded-full px-2 py-0.5">{photos.length} photo{photos.length > 1 ? 's' : ''}</span>
        )}
      </button>
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {photos.map((src, i) => (
            <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#ddd0f0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover"/>
              <button
                type="button"
                onClick={() => {
                  if (multiple) {
                    onChange((photos as string[]).filter((_, j) => j !== i));
                  } else {
                    onChange('');
                  }
                }}
                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center text-white text-[10px] leading-none"
                aria-label="Supprimer"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
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
    if (!value.consequences.length) e.consequences = 'Sélectionner au moins un effet';
    if (!value.localisation.length) e.localisation = 'Sélectionner au moins une localisation';
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

        <Bloc title="Dates de l'effet" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date d'apparition" required error={errors.dateApparition}>
              <input
                className={`${inputCls}${errors.dateApparition ? ' !border-red-300' : ''}${!value.dateApparition ? ' text-gray-300' : ''}`}
                type="date"
                value={value.dateApparition}
                onChange={(e) => set('dateApparition', e.target.value)}
              />
            </FormField>
            <div>
              <FormField label="Date de disparition">
                <input
                  className={`${inputCls}${toujoursPresent ? ' opacity-40 pointer-events-none' : ''}${!value.dateDisparition ? ' text-gray-300' : ''}`}
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
                <span className="text-[14px] text-gray-600">L'effet est toujours présent au moment de la déclaration</span>
              </label>
            </div>
          </div>
        </Bloc>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Bloc title="L'effet a provoqué" hint="Plusieurs réponses possibles">
              <div className="space-y-0.5">
                {CONSEQUENCES.map((c) => (
                  <CheckRow key={c} label={c} checked={value.consequences.includes(c)} onChange={() => toggle('consequences', c)}/>
                ))}
              </div>
              {value.consequences.includes('Autre') && (
                <div className="mt-2">
                  <input
                    className={inputCls}
                    placeholder="Préciser l'effet…"
                    value={value.consequencesAutre}
                    onChange={(e) => set('consequencesAutre', e.target.value)}
                  />
                </div>
              )}
              {errors.consequences && <p className="text-[12px] text-red-500 mt-2">⚠ {errors.consequences}</p>}
            </Bloc>
          </div>
          <div>
            <Bloc title="Localisation" hint="Plusieurs réponses possibles">
              <div className="space-y-0.5">
                {LOCALISATIONS.map((l) => (
                  <CheckRow key={l} label={l} checked={value.localisation.includes(l)} onChange={() => toggle('localisation', l)}/>
                ))}
              </div>
              {value.localisation.includes('Autre') && (
                <div className="mt-2">
                  <input
                    className={inputCls}
                    placeholder="Préciser la localisation…"
                    value={value.localisationAutre}
                    onChange={(e) => set('localisationAutre', e.target.value)}
                  />
                </div>
              )}
              {errors.localisation && <p className="text-[12px] text-red-500 mt-2">⚠ {errors.localisation}</p>}
            </Bloc>
          </div>
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
        <p className="text-[12px] text-gray-400 mb-3">
          Décrivez précisément la réaction : zone touchée, intensité, durée, contexte d'utilisation du produit, soins réalisés...
        </p>
        <textarea
          className={`w-full border rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 resize-none h-44 transition-all focus:outline-none focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/10 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Ex : Apparition de rougeurs et démangeaisons sur le visage 2 heures après l'application de la crème. L'effet a duré 3 jours. Consultation chez le médecin traitant le lendemain..."
          value={value.description}
          onChange={(e) => set('description', e.target.value)}
        />
        {errors.description && <p className="text-[12px] text-red-500 mt-1">⚠ {errors.description}</p>}
      </Bloc>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Bloc title="Ticket de caisse / facture">
          <p className="text-[12px] text-gray-400 mb-3">Joindre la photo du ticket de caisse / facture.</p>
          <PhotoUploadButton
            label="Prendre en photo le ticket de caisse"
            value={value.ticketCaissePhoto}
            onChange={(v) => set('ticketCaissePhoto', v as string)}
          />
        </Bloc>

        <Bloc title="Autres documents">
          <p className="text-[12px] text-gray-400 mb-3">
            Joindre la photo de tout document utile (ordonnances, résultats d'examens, attestations…)
          </p>
          <PhotoUploadButton
            label="Prendre en photo les documents"
            value={value.documentsPhotos}
            multiple
            onChange={(v) => set('documentsPhotos', v as string[])}
          />
        </Bloc>
      </div>
    </div>
  );
}
