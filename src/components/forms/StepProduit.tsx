'use client';

import { useRef, useState } from 'react';
import { Produit } from '@/types';
import StepHeader from '@/components/ui/StepHeader';
import { FormField, inputCls, selectCls } from '@/components/ui/FormField';

const MARQUES = ['Marque Propre Marionnaud','Lancôme',"L'Oréal Paris",'Vichy','La Roche-Posay','Nuxe','Clarins','Givenchy','Dior Beauty','Chanel Beauty','Autre'];
const QUANTITES = ['1','2','3','4','5','6','7','8','9','10','Plus de 10'];
const mk = (): Produit => ({ id: Math.random().toString(36).slice(2), marque:'', marqueAutre:'', denomination:'', codeBarres:'', numeroDeLot:'', dateExpiration:'', prixNet:'', dateAchat:'', quantite:'1', photos:[] });

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 10, marginTop: 2 }}>
      {children}
    </p>
  );
}

function PhotoZone({ photos, onAdd }: { photos: string[]; onAdd: (photos: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const result: string[] = [];
    for (const file of Array.from(files)) result.push(await fileToBase64(file));
    onAdd([...photos, ...result]);
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}/>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragging ? '#6B3FA0' : '#ddd0f0'}`,
          borderRadius: 12, padding: '14px 20px', cursor: 'pointer',
          background: dragging ? 'rgba(107,63,160,0.04)' : '#fdfcff',
          transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: 'rgba(107,63,160,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B3FA0',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6B3FA0', margin: 0 }}>
            Photos du produit
            {photos.length > 0 && (
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, background: '#6B3FA0', color: 'white', borderRadius: 99, padding: '1px 8px' }}>
                {photos.length}
              </span>
            )}
          </p>
          <p style={{ fontSize: 11.5, color: '#9ca3af', margin: '2px 0 0', lineHeight: 1.4 }}>
            Photographiez le produit et sa boîte (toutes les faces)
          </p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b5d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      {photos.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {photos.map((src, i) => (
            <div key={i} style={{ position: 'relative', width: 60, height: 60, borderRadius: 10, overflow: 'hidden', border: '1px solid #ddd0f0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAdd(photos.filter((_, j) => j !== i)); }}
                style={{
                  position: 'absolute', top: 3, right: 3, width: 18, height: 18,
                  background: 'rgba(0,0,0,0.55)', borderRadius: '50%', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'white', fontSize: 12, lineHeight: 1,
                }}
                aria-label="Supprimer"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StepProduit({ value, onChange, onBack, onNext }: {
  value: Produit[]; onChange: (v: Produit[]) => void; onBack: () => void; onNext: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const upd = (id: string, f: keyof Produit, v: string | string[]) => {
    onChange(value.map((p) => p.id === id ? { ...p, [f]: v } : p));
    setErrors((e) => ({ ...e, [id]: { ...e[id], [f]: '' } }));
  };

  const validate = () => {
    const errs: Record<string, Record<string, string>> = {};
    let ok = true;
    for (const p of value) {
      const e: Record<string, string> = {};
      if (!p.denomination.trim()) { e.denomination = 'Requis'; ok = false; }
      if (!p.marque) { e.marque = 'Requis'; ok = false; }
      if (p.marque === 'Autre' && !p.marqueAutre.trim()) { e.marqueAutre = 'Requis'; ok = false; }
      if (!p.prixNet.trim()) { e.prixNet = 'Requis'; ok = false; }
      if (!p.dateAchat) { e.dateAchat = 'Requis'; ok = false; }
      errs[p.id] = e;
    }
    setErrors(errs);
    return ok;
  };

  const ic = (id: string, f: string) => `${inputCls}${errors[id]?.[f] ? ' !border-red-300' : ''}`;
  const sc = (id: string, f: string) => `${selectCls}${errors[id]?.[f] ? ' !border-red-300' : ''}`;

  return (
    <StepHeader
      title="Informations produit"
      subtitle={`Étape 2 sur 5 — ${value.length} produit${value.length > 1 ? 's' : ''}`}
      onBack={onBack}
      onNext={() => { if (validate()) onNext(); }}
    >
      <div className="space-y-5">
        {value.map((p, i) => (
          <div key={p.id} style={{ borderRadius: 16, border: '1px solid #e8e0f5', overflow: 'hidden', boxShadow: '0 2px 8px rgba(107,63,160,0.06)' }}>

            {/* En-tête produit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'linear-gradient(135deg, #f5f0ff 0%, #faf8fd 100%)', borderBottom: '1px solid #ede5f8' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#6B3FA0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6B3FA0' }}>Produit {i + 1}</span>
                {p.denomination && <span style={{ fontSize: 12, color: '#9b72cf', marginLeft: 6 }}>— {p.denomination}</span>}
              </div>
              {value.length > 1 && (
                <button type="button" onClick={() => onChange(value.filter((x) => x.id !== p.id))}
                  style={{ fontSize: 12, color: '#bbb', background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '4px 12px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#fca5a5'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#bbb'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; }}
                >
                  Retirer
                </button>
              )}
            </div>

            {/* Corps */}
            <div style={{ padding: '20px 20px 0', background: 'white' }}>

              {/* Identification */}
              <SectionLabel>Identification</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginBottom: 20 }}>
                <FormField label="Marque" required error={errors[p.id]?.marque}>
                  <select className={sc(p.id, 'marque')} value={p.marque} onChange={(e) => upd(p.id,'marque',e.target.value)}>
                    <option value="">Sélectionner</option>
                    {MARQUES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </FormField>
                <FormField label="Dénomination" required error={errors[p.id]?.denomination}>
                  <input className={ic(p.id, 'denomination')} placeholder="Nom du produit" value={p.denomination} onChange={(e) => upd(p.id,'denomination',e.target.value)}/>
                </FormField>
                {p.marque === 'Autre' && (
                  <div className="sm:col-span-2">
                    <FormField label="Préciser la marque" required error={errors[p.id]?.marqueAutre}>
                      <input className={ic(p.id, 'marqueAutre')} placeholder="Nom de la marque" value={p.marqueAutre} onChange={(e) => upd(p.id,'marqueAutre',e.target.value)}/>
                    </FormField>
                  </div>
                )}
              </div>

              {/* Références */}
              <div style={{ borderTop: '1px solid #f3f0fa', paddingTop: 16, marginBottom: 20 }}>
                <SectionLabel>Références</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField label="Code barres" hint="EAN-13 ou EAN-8">
                    <input className={inputCls} placeholder="3614271892454" inputMode="numeric" value={p.codeBarres} onChange={(e) => upd(p.id,'codeBarres',e.target.value)}/>
                  </FormField>
                  <FormField label="Numéro de lot">
                    <input className={inputCls} placeholder="12345678" value={p.numeroDeLot} onChange={(e) => upd(p.id,'numeroDeLot',e.target.value)}/>
                  </FormField>
                  <FormField label="Date d'expiration">
                    <input className={`${inputCls}${!p.dateExpiration ? ' text-gray-300' : ''}`} type="date" value={p.dateExpiration} onChange={(e) => upd(p.id,'dateExpiration',e.target.value)}/>
                  </FormField>
                </div>
              </div>

              {/* Achat */}
              <div style={{ borderTop: '1px solid #f3f0fa', paddingTop: 16, marginBottom: 20 }}>
                <SectionLabel>Achat</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField label="Prix net (€)" required error={errors[p.id]?.prixNet}>
                    <input className={ic(p.id, 'prixNet')} placeholder="24.99" type="number" step="0.01" min="0" inputMode="decimal" value={p.prixNet} onChange={(e) => upd(p.id,'prixNet',e.target.value)}/>
                  </FormField>
                  <FormField label="Date d'achat" required error={errors[p.id]?.dateAchat}>
                    <input className={`${ic(p.id, 'dateAchat')}${!p.dateAchat ? ' text-gray-300' : ''}`} type="date" value={p.dateAchat} onChange={(e) => upd(p.id,'dateAchat',e.target.value)}/>
                  </FormField>
                  <FormField label="Quantité" required>
                    <select className={selectCls} value={p.quantite} onChange={(e) => upd(p.id,'quantite',e.target.value)}>
                      {QUANTITES.map((q) => <option key={q}>{q}</option>)}
                    </select>
                  </FormField>
                </div>
              </div>
            </div>

            {/* Zone photo */}
            <div style={{ padding: '0 20px 20px', background: 'white' }}>
              <div style={{ borderTop: '1px solid #f3f0fa', paddingTop: 16 }}>
                <SectionLabel>Photos</SectionLabel>
                <PhotoZone photos={p.photos} onAdd={(photos) => upd(p.id, 'photos', photos)}/>
              </div>
            </div>
          </div>
        ))}

        {/* Ajouter un produit */}
        <button
          type="button"
          onClick={() => onChange([...value, mk()])}
          style={{
            width: '100%', padding: '16px 0',
            border: '2px dashed #ddd0f0', borderRadius: 16,
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            color: '#6B3FA0', fontSize: 14, fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#faf7ff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#b89fd8'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#ddd0f0'; }}
        >
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(107,63,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          Ajouter un produit
        </button>
      </div>
    </StepHeader>
  );
}
