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
import path from 'path';
import fs from 'fs';

const PURPLE = '#6B3FA0';
const BLACK = '#111111';
const DARK = '#222222';
const MID = '#555555';
const BORDER = '#cccccc';
const LIGHT = '#f7f5fc';

/* ─── Styles ─── */
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 52,
    paddingHorizontal: 48,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: BLACK,
    backgroundColor: 'white',
    lineHeight: 1.45,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logoBox: {
    backgroundColor: PURPLE,
    borderRadius: 5,
    padding: '6 12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 96,
    height: 35,
    objectFit: 'contain',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerRightTitle: {
    fontSize: 8,
    color: MID,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerRightNumero: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    marginTop: 2,
  },
  headerRightDate: {
    fontSize: 8,
    color: MID,
    marginTop: 1,
  },
  headerRule: {
    borderBottom: `1.5pt solid ${PURPLE}`,
    marginBottom: 16,
  },

  /* Page title */
  pageTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    textAlign: 'center',
    textDecoration: 'underline',
    marginBottom: 20,
  },

  /* Section */
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    textDecoration: 'underline',
    marginBottom: 8,
  },

  /* Field table */
  fieldRow: {
    flexDirection: 'row',
    borderBottom: `0.5pt solid #e8e8e8`,
    paddingVertical: 5,
  },
  fieldLabel: {
    width: 150,
    fontSize: 9,
    color: MID,
    flexShrink: 0,
    paddingRight: 8,
  },
  fieldValue: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
  },

  /* 2-col layout */
  cols2: {
    flexDirection: 'row',
    gap: 20,
  },
  col: { flex: 1 },

  /* Bordered box */
  box: {
    border: `1pt solid ${BORDER}`,
    borderRadius: 3,
    padding: '10 14',
    marginBottom: 12,
  },
  boxTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    marginBottom: 6,
    paddingBottom: 5,
    borderBottom: `0.5pt solid ${BORDER}`,
  },

  /* Product box */
  produitBox: {
    border: `1pt solid ${BORDER}`,
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  produitHead: {
    backgroundColor: LIGHT,
    padding: '6 12',
    borderBottom: `0.5pt solid ${BORDER}`,
  },
  produitHeadText: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: PURPLE,
  },
  produitBody: {
    padding: '8 12 10',
  },

  /* Tags */
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 3,
  },
  tag: {
    backgroundColor: LIGHT,
    color: PURPLE,
    fontSize: 8.5,
    borderRadius: 3,
    border: `0.5pt solid #d8c8f0`,
    padding: '2 7',
    fontFamily: 'Helvetica-Bold',
  },

  /* Photos grid */
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  photoThumb: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 3,
    border: `0.5pt solid ${BORDER}`,
  },

  /* Accord box */
  accordBox: {
    border: `1.5pt solid ${BORDER}`,
    borderRadius: 3,
    padding: '12 16',
    marginBottom: 12,
  },
  accordText: {
    fontSize: 9,
    color: DARK,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.6,
    marginBottom: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  checkBox: {
    width: 10,
    height: 10,
    border: `1pt solid ${DARK}`,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxFilled: {
    width: 6,
    height: 6,
    backgroundColor: PURPLE,
    borderRadius: 1,
  },
  checkLabel: {
    fontSize: 9,
    color: DARK,
  },

  /* Signature area */
  signatureTable: {
    flexDirection: 'row',
    border: `1pt solid ${BORDER}`,
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  signatureCell: {
    flex: 1,
    padding: '8 10',
    borderRight: `0.5pt solid ${BORDER}`,
  },
  signatureCellLast: {
    flex: 2,
    padding: '8 10',
  },
  signatureCellLabel: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    marginBottom: 24,
  },
  signatureImg: {
    maxHeight: 40,
    maxWidth: 120,
    objectFit: 'contain',
  },

  /* Sub-label */
  subLabel: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: MID,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
    marginTop: 10,
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 48,
    right: 48,
    borderTop: `0.5pt solid ${BORDER}`,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    fontSize: 8,
    color: MID,
    fontFamily: 'Helvetica-Bold',
  },
  footerCenter: {
    fontSize: 8,
    color: MID,
    textAlign: 'center',
    flex: 1,
  },
  footerRight: {
    fontSize: 8,
    color: MID,
    textAlign: 'right',
  },
});

/* ── Sub-components ── */

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Tags({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.subLabel}>{label}</Text>
      <View style={styles.tagRow}>
        {items.map((item, i) => <Text key={i} style={styles.tag}>{item}</Text>)}
      </View>
    </View>
  );
}

function PhotoGrid({ photos, label }: { photos: string[]; label?: string }) {
  if (!photos || photos.length === 0) return null;
  return (
    <View style={{ marginTop: 8 }}>
      {label && <Text style={styles.subLabel}>{label}</Text>}
      <View style={styles.photoGrid}>
        {photos.map((src, i) => <Image key={i} src={src} style={styles.photoThumb} />)}
      </View>
    </View>
  );
}

function DocHeader({
  logoData,
  numero,
  dateDeclaration,
  type,
}: {
  logoData: string;
  numero: string;
  dateDeclaration: string;
  type: 'cosmetovigilance' | 'qualite';
}) {
  return (
    <View>
      <View style={styles.headerRow}>
        <View style={styles.logoBox}>
          <Image src={logoData} style={styles.logoImg} />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerRightTitle}>
            {type === 'cosmetovigilance' ? 'Cosmétovigilance' : 'Qualité produit'}
          </Text>
          <Text style={styles.headerRightNumero}>N° {numero}</Text>
          <Text style={styles.headerRightDate}>{dateDeclaration}</Text>
        </View>
      </View>
      <View style={styles.headerRule} />
    </View>
  );
}

function PageFooter({
  numero,
  type,
  year,
}: {
  numero: string;
  type: 'cosmetovigilance' | 'qualite';
  year: string;
}) {
  const title = type === 'cosmetovigilance'
    ? `Formulaire cosmétovigilance ${year}`
    : `Formulaire qualité produit ${year}`;
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerLeft}>Marionnaud</Text>
      <Text style={styles.footerCenter}>{title} — {numero}</Text>
      <Text
        style={styles.footerRight}
        render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
      />
    </View>
  );
}

/* ── Main PDF Document ── */

function ReclamationPDF({
  data,
  numeroReclamation,
  dateDeclaration,
  logoData,
}: {
  data: ReclamationFormData;
  numeroReclamation: string;
  dateDeclaration: string;
  logoData: string;
}) {
  const { coordonnees: c, produits, effetIndesirable: ei, accordClient: ac, infosComplementaires: ic } = data;
  const isCv = data.type === 'cosmetovigilance';
  const year = new Date().getFullYear().toString();

  const adresse = [
    [c.numeroRue, c.nomRue].filter(Boolean).join(' '),
    [c.codePostal, c.ville].filter(Boolean).join(' '),
    c.pays,
  ].filter(Boolean).join(', ');

  const langue = c.langueParlée === 'Autre' && c.langueAutre ? c.langueAutre : (c.langueParlée || null);

  const footerProps = { numero: numeroReclamation, type: data.type, year };
  const headerProps = { logoData, numero: numeroReclamation, dateDeclaration, type: data.type };

  return (
    <Document>

      {/* ══ Page 1 — Coordonnées + Produits ══ */}
      <Page size="A4" style={styles.page}>
        <DocHeader {...headerProps} />

        <Text style={styles.pageTitle}>
          {isCv
            ? 'Déclaration de cosmétovigilance — Information et accord pour transmission de données personnelles'
            : 'Déclaration qualité produit — Signalement défaut produit'}
        </Text>

        {/* Coordonnées */}
        <View style={styles.section}>
          <SectionTitle>Coordonnées du client</SectionTitle>
          <View style={styles.cols2}>
            <View style={styles.col}>
              <Field label="Nom de famille" value={c.nom} />
              <Field label="Prénom" value={c.prenom} />
              <Field label="Genre" value={c.genre} />
              <Field label="Âge" value={c.age ? `${c.age} ans` : null} />
              <Field label="Langue" value={langue} />
            </View>
            <View style={styles.col}>
              <Field label="Email" value={c.email} />
              <Field label="Téléphone" value={c.telephone} />
              <Field label="Adresse" value={adresse || null} />
            </View>
          </View>
        </View>

        {/* Produits */}
        <View style={styles.section}>
          <SectionTitle>Informations produit{produits.length > 1 ? 's' : ''}</SectionTitle>
          {produits.map((p, i) => (
            <View key={p.id} style={styles.produitBox}>
              <View style={styles.produitHead}>
                <Text style={styles.produitHeadText}>
                  Produit {i + 1}{p.denomination ? ` — ${p.denomination}` : ''}
                  {p.marque ? ` (${p.marque === 'Autre' ? p.marqueAutre : p.marque})` : ''}
                </Text>
              </View>
              <View style={styles.produitBody}>
                <View style={styles.cols2}>
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

        <PageFooter {...footerProps} />
      </Page>

      {/* ══ Page 2 — Effet (CV) + Accord ══ */}
      <Page size="A4" style={styles.page}>
        <DocHeader {...headerProps} />

        {/* Effet indésirable — CV seulement */}
        {isCv && (
          <View style={styles.section}>
            <SectionTitle>Effet indésirable constaté</SectionTitle>
            <View style={styles.cols2}>
              <View style={styles.col}>
                <Field label="Date d'apparition" value={ei.dateApparition} />
                <Field
                  label="Date de disparition"
                  value={ei.dateDisparition || 'Toujours présent au moment de la déclaration'}
                />
              </View>
              <View style={styles.col}>
                {ei.consequences?.length > 0 && (
                  <View style={{ marginBottom: 4 }}>
                    <Text style={styles.subLabel}>Conséquences</Text>
                    <View style={styles.tagRow}>
                      {ei.consequences.map((c, i) => <Text key={i} style={styles.tag}>{c}</Text>)}
                    </View>
                  </View>
                )}
                {ei.localisation?.length > 0 && (
                  <View style={{ marginTop: 6 }}>
                    <Text style={styles.subLabel}>Localisation</Text>
                    <View style={styles.tagRow}>
                      {ei.localisation.map((l, i) => <Text key={i} style={styles.tag}>{l}</Text>)}
                    </View>
                  </View>
                )}
              </View>
            </View>
            {ei.description && (
              <View style={[styles.box, { marginTop: 10 }]}>
                <Text style={styles.boxTitle}>Description détaillée de l'effet</Text>
                <Text style={{ fontSize: 9, color: DARK, lineHeight: 1.55 }}>{ei.description}</Text>
              </View>
            )}
            <View style={styles.cols2}>
              <PhotoGrid photos={ei.ticketCaissePhoto ? [ei.ticketCaissePhoto] : []} label="Ticket de caisse / facture" />
              <PhotoGrid photos={ei.documentsPhotos ?? []} label="Documents médicaux / autres" />
            </View>
          </View>
        )}

        {/* Accord du client */}
        <View style={styles.section}>
          <SectionTitle>Accord de transmission des données personnelles</SectionTitle>
          <View style={styles.accordBox}>
            <Text style={styles.accordText}>
              Je suis informé(e) de l'utilisation, par Marionnaud Lafayette, ses éventuels prestataires et les marques
              concernées le cas échéant, des données communiquées concernant ma santé dans le cadre du respect des lois
              applicables en matière de cosmétovigilance et de garanties des produits concernés.{'\n\n'}
              J'autorise Marionnaud Lafayette à transmettre mon nom complet, mon adresse email, mon adresse postale et
              mon numéro de téléphone à la ou aux marque(s) concernée(s).
            </Text>
            <View style={styles.checkRow}>
              <View style={styles.checkBox}>
                {ac.accordRGPD === 'oui' && <View style={styles.checkBoxFilled} />}
              </View>
              <Text style={styles.checkLabel}>Oui, j'accepte</Text>
            </View>
            <View style={styles.checkRow}>
              <View style={styles.checkBox}>
                {ac.accordRGPD === 'non' && <View style={styles.checkBoxFilled} />}
              </View>
              <Text style={styles.checkLabel}>Non, je refuse</Text>
            </View>
          </View>

          {/* Date / Nom / Signature */}
          <View style={styles.signatureTable}>
            <View style={styles.signatureCell}>
              <Text style={styles.signatureCellLabel}>Date</Text>
              <Text style={{ fontSize: 9, color: DARK }}>{dateDeclaration}</Text>
            </View>
            <View style={styles.signatureCell}>
              <Text style={styles.signatureCellLabel}>Nom et prénom du client</Text>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: DARK }}>{ac.nomPrenomClient || '—'}</Text>
            </View>
            <View style={styles.signatureCellLast}>
              <Text style={styles.signatureCellLabel}>Signature du client</Text>
              {ac.signatureClient ? (
                <Image src={ac.signatureClient} style={styles.signatureImg} />
              ) : (
                <Text style={{ fontSize: 8, color: '#aaa' }}>Non fournie</Text>
              )}
            </View>
          </View>
        </View>

        <PageFooter {...footerProps} />
      </Page>

      {/* ══ Page 3 — Infos magasin ══ */}
      <Page size="A4" style={styles.page}>
        <DocHeader {...headerProps} />

        <View style={styles.section}>
          <SectionTitle>Informations complémentaires — Magasin</SectionTitle>

          <View style={styles.cols2}>
            <View style={styles.col}>
              <Field label="Nom du magasin" value={ic.nomMagasin} />
              <Field label="N° magasin" value={ic.numeroDuMagasin} />
              <Field label="Email magasin" value={ic.emailMagasin} />
            </View>
            <View style={styles.col}>
              <Field label="RRV" value={ic.nomPrenomRRV} />
              <Field label="Responsable" value={ic.nomPrenomResponsable} />
              <Field label="Salarié" value={ic.nomPrenomSalarie} />
            </View>
          </View>

          {ic.actionsEnMagasin?.length > 0 && (
            <View style={[styles.box, { marginTop: 12 }]}>
              <Text style={styles.boxTitle}>Actions effectuées en magasin</Text>
              {ic.actionsEnMagasin.map((a, i) => (
                <View key={i} style={[styles.checkRow, { marginBottom: 3 }]}>
                  <View style={styles.checkBox}>
                    <View style={styles.checkBoxFilled} />
                  </View>
                  <Text style={styles.checkLabel}>{a}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Signature salarié */}
        <View style={styles.section}>
          <SectionTitle>Validation et signature du salarié</SectionTitle>
          <View style={styles.signatureTable}>
            <View style={styles.signatureCell}>
              <Text style={styles.signatureCellLabel}>Date</Text>
              <Text style={{ fontSize: 9, color: DARK }}>{dateDeclaration}</Text>
            </View>
            <View style={styles.signatureCell}>
              <Text style={styles.signatureCellLabel}>Nom et prénom du salarié</Text>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: DARK }}>{ic.nomPrenomSalarie || '—'}</Text>
            </View>
            <View style={styles.signatureCellLast}>
              <Text style={styles.signatureCellLabel}>Signature du salarié</Text>
              {ic.signatureSalarie ? (
                <Image src={ic.signatureSalarie} style={styles.signatureImg} />
              ) : (
                <Text style={{ fontSize: 8, color: '#aaa' }}>Non fournie</Text>
              )}
            </View>
          </View>
        </View>

        <PageFooter {...footerProps} />
      </Page>

    </Document>
  );
}

/* ── Export ── */

export async function generatePDF(
  data: ReclamationFormData,
  numeroReclamation: string
): Promise<Buffer> {
  const dateDeclaration = format(new Date(), 'dd MMMM yyyy', { locale: fr });

  // Load logo as base64 for react-pdf (webp not supported, uses pre-converted PNG)
  const logoPath = path.join(process.cwd(), 'public', 'logo-marionnaud.png');
  const logoBuffer = fs.readFileSync(logoPath);
  const logoData = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  const element = React.createElement(ReclamationPDF, {
    data,
    numeroReclamation,
    dateDeclaration,
    logoData,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await renderToBuffer(element as any);
}
