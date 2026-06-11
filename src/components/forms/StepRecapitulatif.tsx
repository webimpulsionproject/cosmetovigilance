'use client';

import { ReclamationFormData, ReclamationType } from '@/types';

const PURPLE = '#6B3FA0';

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid #f5f3fa' }}>
      <span style={{ fontSize: 12, color: '#9ca3af', minWidth: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#1f2937', fontWeight: 500, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 14, border: '1px solid #ede5f8', overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'linear-gradient(135deg, #f5f0ff 0%, #faf8fd 100%)', borderBottom: '1px solid #ede5f8' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</span>
      </div>
      <div style={{ padding: '4px 18px 10px', background: 'white' }}>
        {children}
      </div>
    </div>
  );
}

function SignatureMini({ data }: { data: string }) {
  if (!data) return null;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={data} alt="Signature" style={{ height: 48, maxWidth: 180, objectFit: 'contain', border: '1px solid #ede5f8', borderRadius: 8, background: 'white', padding: 4 }}/>
  );
}

export default function StepRecapitulatif({ data, type, onBack, onSubmit, isLoading }: {
  data: ReclamationFormData; type: ReclamationType; onBack: () => void; onSubmit: () => void; isLoading?: boolean;
}) {
  const { coordonnees: c, produits, effetIndesirable: ei, accordClient: ac, infosComplementaires: ic } = data;
  const isCv = type === 'cosmetovigilance';

  const adresse = [
    [c.numeroRue, c.nomRue].filter(Boolean).join(' '),
    [c.codePostal, c.ville].filter(Boolean).join(' '),
    c.pays,
  ].filter(Boolean).join(', ');

  return (
    <div>
      {/* Titre */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 4 }}>Récapitulatif</h2>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>Vérifiez les informations avant d'envoyer la déclaration.</p>
      </div>

      {/* Badge type */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(107,63,160,0.08)', borderRadius: 999, padding: '6px 14px', marginBottom: 20 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: PURPLE }}/>
        <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {isCv ? 'Cosmétovigilance' : 'Qualité produit'}
        </span>
      </div>

      {/* Coordonnées */}
      <Section title="Coordonnées client" icon={
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      }>
        <Row label="Nom / Prénom" value={[c.prenom, c.nom].filter(Boolean).join(' ')}/>
        <Row label="Genre" value={c.genre}/>
        <Row label="Âge" value={c.age ? `${c.age} ans` : null}/>
        <Row label="Langue" value={c.langueParlée === 'Autre' ? c.langueAutre : c.langueParlée}/>
        <Row label="Email" value={c.email}/>
        <Row label="Téléphone" value={c.telephone}/>
        <Row label="Adresse" value={adresse}/>
      </Section>

      {/* Produits */}
      {produits.map((p, i) => (
        <Section key={p.id} title={`Produit ${i + 1}${p.denomination ? ` — ${p.denomination}` : ''}`} icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
        }>
          <Row label="Marque" value={p.marque === 'Autre' ? p.marqueAutre : p.marque}/>
          <Row label="Dénomination" value={p.denomination}/>
          <Row label="Code barres" value={p.codeBarres}/>
          <Row label="N° de lot" value={p.numeroDeLot}/>
          <Row label="Date d'expiration" value={p.dateExpiration}/>
          <Row label="Prix net" value={p.prixNet ? `${p.prixNet} €` : null}/>
          <Row label="Date d'achat" value={p.dateAchat}/>
          <Row label="Quantité" value={p.quantite}/>
          {p.photos.length > 0 && (
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', padding: '8px 0' }}>
              {p.photos.map((src, j) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={j} src={src} alt={`Photo ${j + 1}`} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', border: '1px solid #ede5f8' }}/>
              ))}
            </div>
          )}
        </Section>
      ))}

      {/* Effet indésirable (CV uniquement) */}
      {isCv && (
        <Section title="Effet indésirable" icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        }>
          <Row label="Date d'apparition" value={ei.dateApparition}/>
          <Row label="Date de disparition" value={ei.dateDisparition}/>
          {ei.consequences.length > 0 && (
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', padding: '7px 0', borderBottom: '1px solid #f5f3fa' }}>
              <span style={{ fontSize: 12, color: '#9ca3af', minWidth: 160, flexShrink: 0 }}>Conséquences</span>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {ei.consequences.map((c) => (
                  <span key={c} style={{ fontSize: 11.5, background: 'rgba(107,63,160,0.08)', color: PURPLE, borderRadius: 99, padding: '2px 10px', fontWeight: 500 }}>{c}</span>
                ))}
              </div>
            </div>
          )}
          {ei.localisation.length > 0 && (
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', padding: '7px 0', borderBottom: '1px solid #f5f3fa' }}>
              <span style={{ fontSize: 12, color: '#9ca3af', minWidth: 160, flexShrink: 0 }}>Localisation</span>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {ei.localisation.map((l) => (
                  <span key={l} style={{ fontSize: 11.5, background: 'rgba(107,63,160,0.08)', color: PURPLE, borderRadius: 99, padding: '2px 10px', fontWeight: 500 }}>{l}</span>
                ))}
              </div>
            </div>
          )}
          <Row label="Description" value={ei.description}/>
        </Section>
      )}

      {/* Accord client */}
      <Section title="Accord client" icon={
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      }>
        <Row label="Accord RGPD" value={ac.accordRGPD === 'oui' ? 'Oui — accord donné' : ac.accordRGPD === 'non' ? 'Non — refus' : null}/>
        <Row label="Nom / Prénom client" value={ac.nomPrenomClient}/>
        {ac.signatureClient && (
          <div style={{ padding: '8px 0', borderBottom: '1px solid #f5f3fa' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>Signature client</span>
            <SignatureMini data={ac.signatureClient}/>
          </div>
        )}
      </Section>

      {/* Infos magasin */}
      <Section title="Informations magasin" icon={
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      }>
        <Row label="Magasin" value={ic.nomMagasin}/>
        <Row label="N° magasin" value={ic.numeroDuMagasin}/>
        <Row label="Email magasin" value={ic.emailMagasin}/>
        <Row label="RRV" value={ic.nomPrenomRRV}/>
        <Row label="Salarié" value={ic.nomPrenomSalarie}/>
        {ic.actionsEnMagasin.length > 0 && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', padding: '7px 0', borderBottom: '1px solid #f5f3fa' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', minWidth: 160, flexShrink: 0 }}>Actions effectuées</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ic.actionsEnMagasin.map((a) => (
                <span key={a} style={{ fontSize: 12, color: '#374151' }}>• {a}</span>
              ))}
            </div>
          </div>
        )}
        {ic.signatureSalarie && (
          <div style={{ padding: '8px 0' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>Signature salarié</span>
            <SignatureMini data={ic.signatureSalarie}/>
          </div>
        )}
      </Section>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            flex: 1, padding: '13px 0', border: '1.5px solid #e5e7eb', borderRadius: 11,
            background: 'white', color: '#6b7280', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          ← Modifier
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          style={{
            flex: 2, padding: '13px 0', border: 'none', borderRadius: 11,
            background: isLoading ? '#e9e9ef' : PURPLE,
            color: isLoading ? '#aaa' : 'white',
            fontSize: 14, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: isLoading ? 'none' : '0 4px 18px rgba(107,63,160,0.32)',
            letterSpacing: '0.01em', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {isLoading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Envoi en cours…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Envoyer la déclaration
            </>
          )}
        </button>
      </div>
    </div>
  );
}
