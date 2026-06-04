'use client';

import { useState } from 'react';
import { Produit } from '@/types';
import StepHeader from '@/components/ui/StepHeader';
import { FormField, inputCls, selectCls } from '@/components/ui/FormField';

const MARQUES = ['Marque Propre Marionnaud','Lancôme',"L'Oréal Paris",'Vichy','La Roche-Posay','Nuxe','Clarins','Givenchy','Dior Beauty','Chanel Beauty','Autre'];
const QUANTITES = ['1','2','3','4','5','6','7','8','9','10','Plus de 10'];
const mk = (): Produit => ({ id: Math.random().toString(36).slice(2), marque:'', denomination:'', codeBarres:'', numeroDeLot:'', dateExpiration:'', prixNet:'', dateAchat:'', quantite:'1' });

export default function StepProduit({ value, onChange, onBack, onNext }: {
  value: Produit[]; onChange: (v: Produit[]) => void; onBack: () => void; onNext: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const upd = (id: string, f: keyof Produit, v: string) => {
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
      errs[p.id] = e;
    }
    setErrors(errs);
    return ok;
  };

  return (
    <div>
      <StepHeader
        title="Informations produit"
        subtitle={`Étape 2 sur 5 — ${value.length} produit${value.length > 1 ? 's' : ''}`}
        onBack={onBack}
        onNext={() => { if (validate()) onNext(); }}
      />

      <div className="space-y-5">
        {value.map((p, i) => (
          <div key={p.id} className="rounded-xl border border-[#ebebeb] overflow-hidden">
            {/* En-tête de la carte */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[#f5f1fb] to-[#faf8fd] border-b border-[#eee0f8]">
              <span className="text-[12px] font-bold text-[#6B3FA0] tracking-wide uppercase">
                Produit {i + 1}{p.denomination ? ` — ${p.denomination}` : ''}
              </span>
              {value.length > 1 && (
                <button type="button" onClick={() => onChange(value.filter((x) => x.id !== p.id))} className="text-[12px] text-[#bbb] hover:text-red-400 transition-colors font-medium py-1 px-2 min-h-[36px]">
                  Retirer
                </button>
              )}
            </div>

            {/* Champs */}
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
              <FormField label="Marque" required error={errors[p.id]?.marque}>
                <select className={`${selectCls}${errors[p.id]?.marque ? ' !border-red-300' : ''}`} value={p.marque} onChange={(e) => upd(p.id,'marque',e.target.value)}>
                  <option value="">Sélectionner</option>
                  {MARQUES.map((m) => <option key={m}>{m}</option>)}
                </select>
              </FormField>
              <FormField label="Dénomination" required error={errors[p.id]?.denomination}>
                <input className={`${inputCls}${errors[p.id]?.denomination ? ' !border-red-300' : ''}`} placeholder="Nom du produit" value={p.denomination} onChange={(e) => upd(p.id,'denomination',e.target.value)}/>
              </FormField>
              <FormField label="Code barres" hint="EAN-13 ou EAN-8">
                <input className={inputCls} placeholder="3614271892454" inputMode="numeric" value={p.codeBarres} onChange={(e) => upd(p.id,'codeBarres',e.target.value)}/>
              </FormField>
              <FormField label="Numéro de lot">
                <input className={inputCls} placeholder="12345678" value={p.numeroDeLot} onChange={(e) => upd(p.id,'numeroDeLot',e.target.value)}/>
              </FormField>
              <FormField label="Date d'expiration">
                <input className={inputCls} type="date" value={p.dateExpiration} onChange={(e) => upd(p.id,'dateExpiration',e.target.value)}/>
              </FormField>
              <FormField label="Prix net (€)">
                <input className={inputCls} placeholder="24.99" type="number" step="0.01" min="0" inputMode="decimal" value={p.prixNet} onChange={(e) => upd(p.id,'prixNet',e.target.value)}/>
              </FormField>
              <FormField label="Date d'achat">
                <input className={inputCls} type="date" value={p.dateAchat} onChange={(e) => upd(p.id,'dateAchat',e.target.value)}/>
              </FormField>
              <FormField label="Quantité">
                <select className={selectCls} value={p.quantite} onChange={(e) => upd(p.id,'quantite',e.target.value)}>
                  {QUANTITES.map((q) => <option key={q}>{q}</option>)}
                </select>
              </FormField>
            </div>
            <div className="px-4 sm:px-5 py-3 bg-[#fafafa] border-t border-[#f0f0f0]">
              <button type="button" className="text-[13px] text-[#6B3FA0] hover:text-[#5a2d8a] transition-colors font-medium min-h-[44px] flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                Prendre en photo le produit et sa boite (toutes les faces)
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => onChange([...value, mk()])}
          className="w-full py-4 border-2 border-dashed border-[#ddd0f0] rounded-xl text-[14px] font-semibold text-[#6B3FA0] hover:bg-[#faf8fd] hover:border-[#b89fd8] transition-all duration-200 min-h-[56px]"
        >
          + Ajouter un produit
        </button>
      </div>
    </div>
  );
}
