'use client';

import { useState } from 'react';
import { ClientCoordonnees } from '@/types';
import StepHeader from '@/components/ui/StepHeader';
import { FormField, inputCls, selectCls } from '@/components/ui/FormField';

const PAYS = ['France','Belgique','Suisse','Luxembourg','Maroc','Tunisie','Algérie','Espagne','Italie','Allemagne','Portugal','Royaume-Uni','Autre'];
const LANGUES = ['Français','Anglais','Espagnol','Arabe','Portugais','Italien','Allemand','Autre'];

type E = Partial<Record<keyof ClientCoordonnees, string>>;

function Bloc({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function StepCoordonnees({ value, onChange, onBack, onNext }: {
  value: ClientCoordonnees; onChange: (v: ClientCoordonnees) => void; onBack: () => void; onNext: () => void;
}) {
  const [errors, setErrors] = useState<E>({});
  const s = (f: keyof ClientCoordonnees, v: string) => { onChange({ ...value, [f]: v }); if (errors[f]) setErrors((e) => ({ ...e, [f]: undefined })); };

  const validate = () => {
    const e: E = {};
    if (!value.nom.trim())       e.nom = 'Requis';
    if (!value.prenom.trim())    e.prenom = 'Requis';
    if (!value.age.trim())       e.age = 'Requis';
    if (!value.email.trim())     e.email = 'Requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) e.email = 'Format invalide';
    if (!value.telephone.trim()) e.telephone = 'Requis';
    if (!value.nomRue.trim())    e.nomRue = 'Requis';
    if (!value.ville.trim())     e.ville = 'Requis';
    if (!value.codePostal.trim()) e.codePostal = 'Requis';
    if (!value.pays)             e.pays = 'Requis';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const ic = (f: keyof ClientCoordonnees) => `${inputCls}${errors[f] ? ' !border-red-300 !ring-red-100/50' : ''}`;
  const sc = (f: keyof ClientCoordonnees) => `${selectCls}${errors[f] ? ' !border-red-300 !ring-red-100/50' : ''}`;

  return (
    <div>
      <StepHeader title="Coordonnées du client" subtitle="Étape 1 sur 5" onBack={onBack} onNext={() => { if (validate()) onNext(); }}/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
        <div>
          <Bloc title="Identité">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Nom de famille" required error={errors.nom}>
                <input className={ic('nom')} placeholder="Dupont" value={value.nom} onChange={(e) => s('nom', e.target.value)} autoComplete="family-name"/>
              </FormField>
              <FormField label="Prénom" required error={errors.prenom}>
                <input className={ic('prenom')} placeholder="Marie" value={value.prenom} onChange={(e) => s('prenom', e.target.value)} autoComplete="given-name"/>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Genre">
                <select className={selectCls} value={value.genre} onChange={(e) => s('genre', e.target.value)}>
                  <option value="">—</option>
                  <option>Femme</option><option>Homme</option><option>Non précisé</option>
                </select>
              </FormField>
              <FormField label="Âge" required error={errors.age}>
                <input className={ic('age')} placeholder="30" type="number" min="0" max="120" inputMode="numeric" value={value.age} onChange={(e) => s('age', e.target.value)}/>
              </FormField>
            </div>
            <FormField label="Langue parlée">
              <select className={selectCls} value={value.langueParlée} onChange={(e) => s('langueParlée', e.target.value)}>
                <option value="">—</option>
                {LANGUES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </FormField>
            {value.langueParlée === 'Autre' && (
              <FormField label="Préciser">
                <input className={inputCls} placeholder="Langue" value={value.langueAutre} onChange={(e) => s('langueAutre', e.target.value)}/>
              </FormField>
            )}
          </Bloc>
        </div>

        <div>
          <Bloc title="Contact">
            <FormField label="Email" required error={errors.email}>
              <input className={ic('email')} placeholder="marie@email.com" type="email" inputMode="email" autoComplete="email" value={value.email} onChange={(e) => s('email', e.target.value)}/>
            </FormField>
            <FormField label="Téléphone" required error={errors.telephone}>
              <input className={ic('telephone')} placeholder="+33 6 00 00 00 00" type="tel" inputMode="tel" autoComplete="tel" value={value.telephone} onChange={(e) => s('telephone', e.target.value)}/>
            </FormField>
          </Bloc>

          <Bloc title="Adresse">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="N° rue">
                <input className={inputCls} placeholder="12" autoComplete="address-line1" value={value.numeroRue} onChange={(e) => s('numeroRue', e.target.value)}/>
              </FormField>
              <div className="col-span-2">
                <FormField label="Nom de rue" required error={errors.nomRue}>
                  <input className={ic('nomRue')} placeholder="Rue de la Paix" autoComplete="street-address" value={value.nomRue} onChange={(e) => s('nomRue', e.target.value)}/>
                </FormField>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Ville" required error={errors.ville}>
                <input className={ic('ville')} placeholder="Paris" autoComplete="address-level2" value={value.ville} onChange={(e) => s('ville', e.target.value)}/>
              </FormField>
              <FormField label="Code postal" required error={errors.codePostal}>
                <input className={ic('codePostal')} placeholder="75001" inputMode="numeric" autoComplete="postal-code" value={value.codePostal} onChange={(e) => s('codePostal', e.target.value)}/>
              </FormField>
            </div>
            <FormField label="Pays" required error={errors.pays}>
              <select className={sc('pays')} autoComplete="country-name" value={value.pays} onChange={(e) => s('pays', e.target.value)}>
                <option value="">Sélectionner</option>
                {PAYS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </FormField>
          </Bloc>
        </div>
      </div>
    </div>
  );
}
