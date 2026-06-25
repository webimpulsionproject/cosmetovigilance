import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToBuffer,
} from '@react-pdf/renderer';
import { ReclamationFormData } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PURPLE = '#6B3FA0';
const PURPLE_LIGHT = '#f5f0ff';
const PURPLE_MID = '#d8b4fe';
const GRAY = '#6b7280';
const GRAY_LIGHT = '#f9fafb';
const SEPARATOR = '#f0ebfa';

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#111827',
    backgroundColor: 'white',
  },

  /* ── Header ── */
  header: {
    marginBottom: 32,
  },
  headerBand: {
    backgroundColor: PURPLE,
    borderRadius: 6,
    padding: '20 24',
    marginBottom: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  headerMetaText: {
    fontSize: 9,
    color: GRAY,
  },

  /* ── Section ── */
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    backgroundColor: PURPLE,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: PURPLE,
    letterSpacing: 0.2,
  },

  /* ── Field rows ── */
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottom: `0.5pt solid ${SEPARATOR}`,
  },
  label: {
    width: 155,
    fontSize: 9.5,
    color: GRAY,
    paddingRight: 8,
    flexShrink: 0,
  },
  value: {
    flex: 1,
    fontSize: 9.5,
    color: '#111827',
    fontFamily: 'Helvetica-Bold',
  },

  /* ── Columns ── */
  cols: {
    flexDirection: 'row',
    gap: 24,
  },
  col: { flex: 1 },

  /* ── Product card ── */
  produitCard: {
    borderRadius: 6,
    border: `1pt solid ${PURPLE_MID}`,
    marginBottom: 12,
    overflow: 'hidden',
  },
  produitCardHead: {
    backgroundColor: PURPLE_LIGHT,
    padding: '8 14',
    borderBottom: `0.5pt solid ${PURPLE_MID}`,
  },
  produitCardHeadText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: PURPLE,
  },
  produitCardBody: {
    padding: '10 14 14',
  },

  /* ── Tags (checkboxes) ── */
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 4,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: PURPLE_LIGHT,
    color: PURPLE,
    fontSize: 9,
    borderRadius: 99,
    padding: '3 9',
    fontFamily: 'Helvetica-Bold',
  },

  /* ── Sub-label ── */
  subLabel: {
    fontSize: 9,
    color: GRAY,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    marginTop: 10,
  },

  /* ── Signature ── */
  signatureBox: {
    border: `0.5pt solid #e5e7eb`,
    borderRadius: 5,
    marginTop: 6,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY_LIGHT,
  },
  signatureImg: { maxHeight: 62, maxWidth: 200 },

  /* ── Photos ── */
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 8,
  },
  photoThumb: {
    width: 85,
    height: 85,
    objectFit: 'cover',
    borderRadius: 5,
    border: `0.5pt solid ${PURPLE_MID}`,
  },

  /* ── Footer ── */
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `0.5pt solid #e5e7eb`,
    paddingTop: 7,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
});

/* ── Components ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function Tags({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.subLabel}>{label}</Text>
      <View style={styles.tagRow}>
        {items.map((item, i) => (
          <Text key={i} style={styles.tag}>{item}</Text>
        ))}
      </View>
    </View>
  );
}

function PhotoGrid({ photos, label }: { photos: string[]; label?: string }) {
  if (!photos || photos.length === 0) return null;
  return (
    <View style={{ marginTop: 10 }}>
      {label && <Text style={styles.subLabel}>{label}</Text>}
      <View style={styles.photoGrid}>
        {photos.map((src, i) => (
          <Image key={i} src={src} style={styles.photoThumb} />
        ))}
      </View>
    </View>
  );
}

function PageFooter({ numero }: { numero: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>Réclamation {numero} — Marionnaud</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

/* ── PDF Document ── */

function ReclamationPDF({
  data,
  numeroReclamation,
  dateDeclaration,
}: {
  data: ReclamationFormData;
  numeroReclamation: string;
  dateDeclaration: string;
}) {
  const { coordonnees: c, produits, effetIndesirable: ei, accordClient: ac, infosComplementaires: ic } = data;
  const isCv = data.type === 'cosmetovigilance';

  const adresse = [
    [c.numeroRue, c.nomRue].filter(Boolean).join(' '),
    [c.codePostal, c.ville].filter(Boolean).join(' '),
    c.pays,
  ].filter(Boolean).join(' — ');

  return (
    <Document>
      {/* ── Page 1 ── */}
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBand}>
            <Text style={styles.headerTitle}>
              Déclaration {isCv ? 'Cosmétovigilance' : 'Qualité produit'}
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>N° {numeroReclamation}</Text>
            <Text style={styles.headerMetaText}>{dateDeclaration}</Text>
          </View>
        </View>

        {/* Coordonnées */}
        <View style={styles.section}>
          <SectionTitle>Coordonnées du client</SectionTitle>
          <View style={styles.cols}>
            <View style={styles.col}>
              <Field label="Nom" value={c.nom} />
              <Field label="Prénom" value={c.prenom} />
              <Field label="Genre" value={c.genre} />
              <Field label="Âge" value={c.age ? `${c.age} ans` : null} />
              <Field label="Langue" value={
                c.langueParlée === 'Autre' && c.langueAutre ? c.langueAutre : c.langueParlée
              } />
            </View>
            <View style={styles.col}>
              <Field label="Email" value={c.email} />
              <Field label="Téléphone" value={c.telephone} />
              <Field label="Adresse" value={adresse} />
            </View>
          </View>
        </View>

        {/* Produits */}
        <View style={styles.section}>
          <SectionTitle>Informations produit{produits.length > 1 ? 's' : ''}</SectionTitle>
          {produits.map((p, i) => (
            <View key={p.id} style={styles.produitCard}>
              <View style={styles.produitCardHead}>
                <Text style={styles.produitCardHeadText}>
                  Produit {i + 1}{p.denomination ? ` — ${p.denomination}` : ''}
                </Text>
              </View>
              <View style={styles.produitCardBody}>
                <View style={styles.cols}>
                  <View style={styles.col}>
                    <Field label="Marque" value={p.marque === 'Autre' ? p.marqueAutre : p.marque} />
                    <Field label="Dénomination" value={p.denomination} />
                    <Field label="Code barres" value={p.codeBarres} />
                    <Field label="N° de lot" value={p.numeroDeLot} />
                  </View>
                  <View style={styles.col}>
                    <Field label="Date d'expiration" value={p.dateExpiration} />
                    <Field label="Prix net" value={p.prixNet ? `${p.prixNet} €` : null} />
                    <Field label="Date d'achat" value={p.dateAchat} />
                    <Field label="Quantité" value={p.quantite} />
                  </View>
                </View>
                <PhotoGrid photos={p.photos} label="Photos du produit" />
              </View>
            </View>
          ))}
        </View>

        <PageFooter numero={numeroReclamation} />
      </Page>

      {/* ── Page 2 (CV) ou suite qualité ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerBand}>
            <Text style={styles.headerTitle}>
              {isCv ? 'Cosmétovigilance — Suite' : 'Qualité produit — Suite'}
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>N° {numeroReclamation}</Text>
            <Text style={styles.headerMetaText}>{dateDeclaration}</Text>
          </View>
        </View>

        {/* Effet indésirable (CV uniquement) */}
        {isCv && (
          <View style={styles.section}>
            <SectionTitle>Effet indésirable</SectionTitle>
            <Field label="Date d'apparition" value={ei.dateApparition} />
            <Field label="Date de disparition" value={ei.dateDisparition || 'Toujours présent'} />
            <Field label="Description" value={ei.description} />
            <Tags label="Conséquences" items={ei.consequences} />
            <Tags label="Localisation" items={ei.localisation} />
            <PhotoGrid photos={ei.ticketCaissePhoto ? [ei.ticketCaissePhoto] : []} label="Ticket de caisse" />
            <PhotoGrid photos={ei.documentsPhotos ?? []} label="Documents / photos" />
          </View>
        )}

        {/* Accord client */}
        <View style={styles.section}>
          <SectionTitle>Accord du client</SectionTitle>
          <Field
            label="Accord RGPD"
            value={ac.accordRGPD === 'oui' ? 'Oui — accord donné' : ac.accordRGPD === 'non' ? 'Non — refus' : null}
          />
          <Field label="Nom / Prénom client" value={ac.nomPrenomClient} />
          <Text style={styles.subLabel}>Signature du client</Text>
          {ac.signatureClient ? (
            <View style={styles.signatureBox}>
              <Image src={ac.signatureClient} style={styles.signatureImg} />
            </View>
          ) : (
            <View style={styles.signatureBox}>
              <Text style={{ fontSize: 9, color: '#9ca3af' }}>Non fournie</Text>
            </View>
          )}
        </View>

        {/* Infos magasin */}
        <View style={styles.section}>
          <SectionTitle>Informations magasin</SectionTitle>
          <View style={styles.cols}>
            <View style={styles.col}>
              <Field label="Magasin" value={ic.nomMagasin} />
              <Field label="N° magasin" value={ic.numeroDuMagasin} />
              <Field label="Email magasin" value={ic.emailMagasin} />
            </View>
            <View style={styles.col}>
              <Field label="RRV" value={ic.nomPrenomRRV} />
              <Field label="Responsable" value={ic.nomPrenomResponsable} />
              <Field label="Salarié" value={ic.nomPrenomSalarie} />
            </View>
          </View>
          <Tags label="Actions effectuées en magasin" items={ic.actionsEnMagasin} />
          <Text style={styles.subLabel}>Signature du salarié</Text>
          {ic.signatureSalarie ? (
            <View style={styles.signatureBox}>
              <Image src={ic.signatureSalarie} style={styles.signatureImg} />
            </View>
          ) : (
            <View style={styles.signatureBox}>
              <Text style={{ fontSize: 9, color: '#9ca3af' }}>Non fournie</Text>
            </View>
          )}
        </View>

        <PageFooter numero={numeroReclamation} />
      </Page>
    </Document>
  );
}

export async function generatePDF(
  data: ReclamationFormData,
  numeroReclamation: string
): Promise<Buffer> {
  const dateDeclaration = format(new Date(), 'dd MMMM yyyy', { locale: fr });
  const element = React.createElement(ReclamationPDF, {
    data,
    numeroReclamation,
    dateDeclaration,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await renderToBuffer(element as any);
}
