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

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  header: {
    backgroundColor: '#6B3FA0',
    padding: 16,
    marginBottom: 20,
    borderRadius: 4,
  },
  headerTitle: { color: 'white', fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  headerSub: { color: '#e0d0f0', fontSize: 10, textAlign: 'center', marginTop: 4 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#6B3FA0',
    borderBottom: '1pt solid #6B3FA0',
    paddingBottom: 4,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 160, fontFamily: 'Helvetica-Bold', color: '#444' },
  value: { flex: 1, color: '#1a1a1a' },
  badge: {
    backgroundColor: '#f3e8ff',
    color: '#6B3FA0',
    padding: '2 6',
    borderRadius: 3,
    fontSize: 9,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  checkbox: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  checkmark: { width: 12, color: '#6B3FA0', fontFamily: 'Helvetica-Bold' },
  produitBox: {
    border: '1pt solid #d8b4fe',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#faf5ff',
  },
  signatureBox: {
    border: '1pt solid #ccc',
    borderRadius: 4,
    marginTop: 4,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  signatureImg: { maxHeight: 70, maxWidth: 200 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  photoThumb: { width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1pt solid #d8b4fe' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 8,
    borderTop: '1pt solid #eee',
    paddingTop: 8,
  },
  pageNumber: { position: 'absolute', bottom: 20, right: 40, fontSize: 8, color: '#999' },
});

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function PhotoGrid({ photos, label }: { photos: string[]; label?: string }) {
  if (!photos || photos.length === 0) return null;
  return (
    <View style={{ marginTop: 6, marginBottom: 4 }}>
      {label && <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#444', marginBottom: 4 }}>{label}</Text>}
      <View style={styles.photoGrid}>
        {photos.map((src, i) => (
          <Image key={i} src={src} style={styles.photoThumb} />
        ))}
      </View>
    </View>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.checkbox}>
          <Text style={styles.checkmark}>✓ </Text>
          <Text>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function ReclamationPDF({
  data,
  numeroReclamation,
  dateDeclaration,
}: {
  data: ReclamationFormData;
  numeroReclamation: string;
  dateDeclaration: string;
}) {
  const { coordonnees, produits, effetIndesirable, accordClient, infosComplementaires } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Formulaire de déclaration — {data.type === 'cosmetovigilance' ? 'Cosmétovigilance' : 'Qualité'}
          </Text>
          <Text style={styles.headerSub}>
            N° {numeroReclamation} — {dateDeclaration}
          </Text>
        </View>

        {/* Coordonnées client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Étape 1 — Coordonnées du client</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ flex: 1 }}>
              <Field label="Nom" value={coordonnees.nom} />
              <Field label="Prénom" value={coordonnees.prenom} />
              <Field label="Genre" value={coordonnees.genre} />
              <Field label="Âge" value={coordonnees.age} />
              <Field label="Langue parlée" value={
                coordonnees.langueParlée === 'Autre' && coordonnees.langueAutre
                  ? coordonnees.langueAutre
                  : coordonnees.langueParlée
              } />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Email" value={coordonnees.email} />
              <Field label="Téléphone" value={coordonnees.telephone} />
              <Field label="N° de rue" value={coordonnees.numeroRue} />
              <Field label="Rue" value={coordonnees.nomRue} />
              <Field label="Ville" value={coordonnees.ville} />
              <Field label="Code postal" value={coordonnees.codePostal} />
              <Field label="Pays" value={coordonnees.pays} />
            </View>
          </View>
        </View>

        {/* Produits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Étape 2 — Informations produit(s)</Text>
          {produits.map((p, i) => (
            <View key={p.id} style={styles.produitBox}>
              <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 6, color: '#6B3FA0' }}>
                Produit {i + 1}
              </Text>
              <Field label="Marque" value={p.marque} />
              <Field label="Dénomination" value={p.denomination} />
              <Field label="Code barres" value={p.codeBarres} />
              <Field label="N° de lot" value={p.numeroDeLot} />
              <Field label="Date expiration" value={p.dateExpiration} />
              <Field label="Prix net (€)" value={p.prixNet} />
              <Field label="Date d'achat" value={p.dateAchat} />
              <Field label="Quantité" value={p.quantite} />
              <PhotoGrid photos={p.photos} label="Photos du produit :" />
            </View>
          ))}
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Réclamation ${numeroReclamation} — Marionnaud — Page ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>

      {data.type === 'cosmetovigilance' && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Cosmétovigilance — Suite</Text>
            <Text style={styles.headerSub}>N° {numeroReclamation}</Text>
          </View>

          {/* Effet indésirable */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Étape 3 — Informations sur l'Effet Indésirable</Text>
            <Field label="Date d'apparition" value={effetIndesirable.dateApparition} />
            <Field
              label="Date de disparition"
              value={effetIndesirable.dateDisparition || 'Toujours présent'}
            />
            {effetIndesirable.consequences.length > 0 && (
              <View style={styles.section}>
                <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>
                  Conséquences :
                </Text>
                <CheckList items={effetIndesirable.consequences} />
              </View>
            )}
            {effetIndesirable.localisation.length > 0 && (
              <View style={styles.section}>
                <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>
                  Localisation :
                </Text>
                <CheckList items={effetIndesirable.localisation} />
              </View>
            )}
            <Field label="Description" value={effetIndesirable.description} />
            {effetIndesirable.ticketCaissePhoto && (
              <PhotoGrid photos={[effetIndesirable.ticketCaissePhoto]} label="Ticket de caisse :" />
            )}
            {effetIndesirable.documentsPhotos?.length > 0 && (
              <PhotoGrid photos={effetIndesirable.documentsPhotos} label="Documents / photos :" />
            )}
          </View>

          {/* Accord client */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Étape 4 — Accord du client</Text>
            <Field
              label="Accord transmission données"
              value={accordClient.accordRGPD === 'oui' ? 'Oui' : 'Non'}
            />
            <Text style={{ fontFamily: 'Helvetica-Bold', marginTop: 8, marginBottom: 4 }}>
              Signature du client :
            </Text>
            {accordClient.signatureClient ? (
              <View style={styles.signatureBox}>
                <Image src={accordClient.signatureClient} style={styles.signatureImg} />
              </View>
            ) : (
              <View style={styles.signatureBox}>
                <Text style={{ color: '#999' }}>Non fournie</Text>
              </View>
            )}
          </View>

          {/* Infos complémentaires */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Étape 5 — Informations complémentaires</Text>
            {infosComplementaires.actionsEnMagasin.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>
                  Actions effectuées en magasin :
                </Text>
                <CheckList items={infosComplementaires.actionsEnMagasin} />
              </View>
            )}
            <Field label="Nom du magasin" value={infosComplementaires.nomMagasin} />
            <Field label="N° magasin" value={infosComplementaires.numeroDuMagasin} />
            <Field label="Email magasin" value={infosComplementaires.emailMagasin} />
            <Field label="Nom/Prénom RRV" value={infosComplementaires.nomPrenomRRV} />
            <Field label="Nom/Prénom Responsable" value={infosComplementaires.nomPrenomResponsable} />
            <Field label="Salarié ayant rempli" value={infosComplementaires.nomPrenomSalarie} />
            <Text style={{ fontFamily: 'Helvetica-Bold', marginTop: 8, marginBottom: 4 }}>
              Signature du salarié :
            </Text>
            {infosComplementaires.signatureSalarie ? (
              <View style={styles.signatureBox}>
                <Image
                  src={infosComplementaires.signatureSalarie}
                  style={styles.signatureImg}
                />
              </View>
            ) : (
              <View style={styles.signatureBox}>
                <Text style={{ color: '#999' }}>Non fournie</Text>
              </View>
            )}
          </View>

          <Field label="Date de déclaration" value={dateDeclaration} />

          <Text
            style={styles.footer}
            render={({ pageNumber, totalPages }) =>
              `Réclamation ${numeroReclamation} — Marionnaud — Page ${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      )}
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
