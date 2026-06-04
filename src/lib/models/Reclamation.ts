import mongoose, { Schema } from 'mongoose';

const ProduitSchema = new Schema({
  marque: String,
  denomination: { type: String, required: true },
  codeBarres: String,
  numeroDeLot: String,
  dateExpiration: String,
  prixNet: String,
  dateAchat: String,
  quantite: String,
});

const ReclamationSchema = new Schema(
  {
    numeroReclamation: { type: String, required: true, unique: true },
    type: { type: String, enum: ['cosmetovigilance', 'qualite'], required: true },
    dateDeclaration: { type: Date, default: Date.now },
    coordonnees: {
      nom: String,
      prenom: String,
      genre: String,
      age: String,
      langueParlée: String,
      langueAutre: String,
      email: String,
      telephone: String,
      numeroRue: String,
      nomRue: String,
      ville: String,
      codePostal: String,
      pays: String,
    },
    produits: [ProduitSchema],
    effetIndesirable: {
      dateApparition: String,
      dateDisparition: String,
      consequences: [String],
      localisation: [String],
      description: String,
    },
    accordClient: {
      accordRGPD: String,
      signatureClient: String,
    },
    infosComplementaires: {
      actionsEnMagasin: [String],
      nomMagasin: String,
      numeroDuMagasin: String,
      emailMagasin: String,
      nomPrenomRRV: String,
      nomPrenomResponsable: String,
      nomPrenomSalarie: String,
      signatureSalarie: String,
    },
  },
  { timestamps: true }
);

export const Reclamation =
  mongoose.models.Reclamation || mongoose.model('Reclamation', ReclamationSchema);
