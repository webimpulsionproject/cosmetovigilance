'use client';

import { useState, useRef, useEffect } from 'react';
import { ClientCoordonnees } from '@/types';
import StepHeader from '@/components/ui/StepHeader';
import { Bloc } from '@/components/ui/Bloc';
import { FormField, inputCls, selectCls } from '@/components/ui/FormField';

const PAYS = [
  'France','Afghanistan','Afrique du Sud','Albanie','Algérie','Allemagne','Andorre','Angola',
  'Antigua-et-Barbuda','Arabie saoudite','Argentine','Arménie','Australie','Autriche','Azerbaïdjan',
  'Bahamas','Bahreïn','Bangladesh','Barbade','Belgique','Belize','Bénin','Bhoutan',
  'Biélorussie','Birmanie (Myanmar)','Bolivie','Bosnie-Herzégovine','Botswana','Brésil','Brunei',
  'Bulgarie','Burkina Faso','Burundi','Cabo Verde','Cambodge','Cameroun','Canada','Centrafrique',
  'Chili','Chine','Chypre','Colombie','Comores','Congo (Brazzaville)','Congo (RDC)',
  'Corée du Nord','Corée du Sud','Costa Rica',"Côte d'Ivoire",'Croatie','Cuba',
  'Danemark','Djibouti','Dominique','Égypte','Émirats arabes unis','Équateur','Érythrée',
  'Espagne','Estonie','Eswatini','États-Unis','Éthiopie','Fidji','Finlande',
  'Gabon','Gambie','Géorgie','Ghana','Grèce','Grenade','Guatemala',
  'Guinée','Guinée-Bissau','Guinée équatoriale','Guyana','Haïti','Honduras','Hongrie',
  'Inde','Indonésie','Irak','Iran','Irlande','Islande','Israël','Italie',
  'Jamaïque','Japon','Jordanie','Kazakhstan','Kenya','Kirghizistan','Kiribati','Kosovo','Koweït',
  'Laos','Lesotho','Lettonie','Liban','Liberia','Libye','Liechtenstein','Lituanie','Luxembourg',
  'Madagascar','Malaisie','Malawi','Maldives','Mali','Malte','Maroc','Îles Marshall',
  'Maurice','Mauritanie','Mexique','Micronésie','Moldavie','Monaco','Mongolie','Monténégro','Mozambique',
  'Namibie','Nauru','Népal','Nicaragua','Niger','Nigeria','Norvège','Nouvelle-Zélande',
  'Oman','Ouganda','Ouzbékistan','Pakistan','Palaos','Palestine','Panama',
  'Papouasie-Nouvelle-Guinée','Paraguay','Pays-Bas','Pérou','Philippines','Pologne','Portugal',
  'Qatar','République dominicaine','République tchèque','Roumanie','Royaume-Uni','Russie','Rwanda',
  'Saint-Christophe-et-Niévès','Sainte-Lucie','Saint-Marin','Saint-Vincent-et-les-Grenadines',
  'Salvador','Samoa','São Tomé-et-Príncipe','Sénégal','Serbie','Seychelles',
  'Sierra Leone','Singapour','Slovaquie','Slovénie','Somalie','Soudan','Soudan du Sud',
  'Sri Lanka','Suède','Suisse','Suriname','Syrie','Tadjikistan','Tanzanie','Tchad',
  'Thaïlande','Timor oriental','Togo','Tonga','Trinité-et-Tobago','Tunisie','Turkménistan','Turquie','Tuvalu',
  'Ukraine','Uruguay','Vanuatu','Vatican','Venezuela','Vietnam','Yémen','Zambie','Zimbabwe','Autre',
];
const LANGUES = ['Français','Anglais','Espagnol','Arabe','Portugais','Italien','Allemand','Autre'];

function PaysCombobox({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query.trim().length === 0
    ? PAYS
    : PAYS.filter((p) => p.toLowerCase().includes(query.toLowerCase()));

  const select = (p: string) => { onChange(p); setQuery(p); setOpen(false); };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          className={`${inputCls}${error ? ' !border-red-300' : ''}`}
          placeholder="Rechercher un pays…"
          value={query}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onChange(''); }}
        />
        <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
          background: 'white', border: '1px solid #e5e7eb', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto',
        }}>
          {filtered.map((p) => (
            <div
              key={p}
              onMouseDown={() => select(p)}
              style={{
                padding: '8px 14px', fontSize: 13, cursor: 'pointer',
                background: p === value ? 'rgba(107,63,160,0.07)' : 'white',
                color: p === value ? '#6B3FA0' : '#374151',
                fontWeight: p === value ? 600 : 400,
              }}
            >
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type E = Partial<Record<keyof ClientCoordonnees, string>>;

export default function StepCoordonnees({ value, onChange, onBack, onNext }: {
  value: ClientCoordonnees; onChange: (v: ClientCoordonnees) => void; onBack: () => void; onNext: () => void;
}) {
  const [errors, setErrors] = useState<E>({});
  const s = (f: keyof ClientCoordonnees, v: string) => { onChange({ ...value, [f]: v }); if (errors[f]) setErrors((e) => ({ ...e, [f]: undefined })); };

  const validate = () => {
    const e: E = {};
    if (!value.nom.trim())        e.nom = 'Requis';
    if (!value.prenom.trim())     e.prenom = 'Requis';
    if (!value.email.trim())      e.email = 'Requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) e.email = 'Format invalide';
    if (!value.telephone.trim())  e.telephone = 'Requis';
    if (!value.nomRue.trim())     e.nomRue = 'Requis';
    if (!value.ville.trim())      e.ville = 'Requis';
    if (!value.codePostal.trim()) e.codePostal = 'Requis';
    if (!value.pays)              e.pays = 'Requis';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const ic = (f: keyof ClientCoordonnees) => `${inputCls}${errors[f] ? ' !border-red-300' : ''}`;
  const sc = (f: keyof ClientCoordonnees) => `${selectCls}${errors[f] ? ' !border-red-300' : ''}`;

  return (
    <StepHeader title="Coordonnées du client" subtitle="Étape 1 sur 5" onBack={onBack} onNext={() => { if (validate()) onNext(); }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">

        {/* Colonne gauche */}
        <div>
          <Bloc title="Identité">
            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
              <FormField label="Nom de famille" required error={errors.nom}>
                <input className={ic('nom')} placeholder="Dupont" value={value.nom} onChange={(e) => s('nom', e.target.value)} autoComplete="family-name"/>
              </FormField>
              <FormField label="Prénom" required error={errors.prenom}>
                <input className={ic('prenom')} placeholder="Marie" value={value.prenom} onChange={(e) => s('prenom', e.target.value)} autoComplete="given-name"/>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
              <FormField label="Genre">
                <select className={selectCls} value={value.genre} onChange={(e) => s('genre', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option>Femme</option><option>Homme</option><option>Non précisé</option>
                </select>
              </FormField>
              <FormField label="Âge">
                <input className={inputCls} placeholder="30" type="number" min="0" max="120" inputMode="numeric" value={value.age} onChange={(e) => s('age', e.target.value)}/>
              </FormField>
            </div>
            <FormField label="Langue parlée">
              <select className={selectCls} value={value.langueParlée} onChange={(e) => s('langueParlée', e.target.value)}>
                <option value="">Sélectionner</option>
                {LANGUES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </FormField>
            {value.langueParlée === 'Autre' && (
              <div style={{ marginTop: 16 }}>
                <FormField label="Préciser la langue">
                  <input className={inputCls} placeholder="Langue" value={value.langueAutre} onChange={(e) => s('langueAutre', e.target.value)}/>
                </FormField>
              </div>
            )}
          </Bloc>

          <Bloc title="Contact">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FormField label="Email" required error={errors.email}>
                <input className={ic('email')} placeholder="marie@email.com" type="email" inputMode="email" autoComplete="email" value={value.email} onChange={(e) => s('email', e.target.value)}/>
              </FormField>
              <FormField label="Téléphone" required error={errors.telephone}>
                <input className={ic('telephone')} placeholder="+33 6 00 00 00 00" type="tel" inputMode="tel" autoComplete="tel" value={value.telephone} onChange={(e) => s('telephone', e.target.value)}/>
              </FormField>
            </div>
          </Bloc>
        </div>

        {/* Colonne droite */}
        <div>
          <Bloc title="Adresse postale">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="grid grid-cols-4 gap-4">
                <FormField label="N° rue">
                  <input className={inputCls} placeholder="12" autoComplete="address-line1" value={value.numeroRue} onChange={(e) => s('numeroRue', e.target.value)}/>
                </FormField>
                <div className="col-span-3">
                  <FormField label="Nom de rue" required error={errors.nomRue}>
                    <input className={ic('nomRue')} placeholder="Rue de la Paix" autoComplete="street-address" value={value.nomRue} onChange={(e) => s('nomRue', e.target.value)}/>
                  </FormField>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Code postal" required error={errors.codePostal}>
                  <input className={ic('codePostal')} placeholder="75001" inputMode="numeric" autoComplete="postal-code" value={value.codePostal} onChange={(e) => s('codePostal', e.target.value)}/>
                </FormField>
                <FormField label="Ville" required error={errors.ville}>
                  <input className={ic('ville')} placeholder="Paris" autoComplete="address-level2" value={value.ville} onChange={(e) => s('ville', e.target.value)}/>
                </FormField>
              </div>
              <FormField label="Pays" required error={errors.pays}>
                <PaysCombobox value={value.pays} onChange={(v) => s('pays', v)} error={errors.pays}/>
              </FormField>
            </div>
          </Bloc>
        </div>

      </div>
    </StepHeader>
  );
}
