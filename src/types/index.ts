export type ReclamationType = 'cosmetovigilance' | 'qualite';

export interface ClientCoordonnees {
  nom: string;
  prenom: string;
  genre: string;
  age: string;
  langueParlée: string;
  langueAutre: string;
  email: string;
  telephone: string;
  numeroRue: string;
  nomRue: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export interface Produit {
  id: string;
  marque: string;
  denomination: string;
  codeBarres: string;
  numeroDeLot: string;
  dateExpiration: string;
  prixNet: string;
  dateAchat: string;
  quantite: string;
}

export interface EffetIndesirable {
  dateApparition: string;
  dateDisparition: string;
  consequences: string[];
  localisation: string[];
  description: string;
}

export interface AccordClient {
  accordRGPD: 'oui' | 'non' | '';
  signatureClient: string;
}

export interface InfosComplementaires {
  actionsEnMagasin: string[];
  nomMagasin: string;
  numeroDuMagasin: string;
  emailMagasin: string;
  nomPrenomRRV: string;
  nomPrenomResponsable: string;
  nomPrenomSalarie: string;
  signatureSalarie: string;
}

export interface ReclamationFormData {
  type: ReclamationType;
  coordonnees: ClientCoordonnees;
  produits: Produit[];
  effetIndesirable: EffetIndesirable;
  accordClient: AccordClient;
  infosComplementaires: InfosComplementaires;
}
