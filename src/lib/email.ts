import nodemailer from 'nodemailer';
import { ReclamationFormData } from '@/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendReclamationEmail(
  data: ReclamationFormData,
  numeroReclamation: string,
  pdfBuffer: Buffer
) {
  const { coordonnees, type } = data;
  const recipientEmail = process.env.RECIPIENT_EMAIL || 'cosmetovigilance@marionnaud.fr';

  await transporter.sendMail({
    from: `"Réclamations Marionnaud" <${process.env.SMTP_USER}>`,
    to: recipientEmail,
    subject: `[${type === 'cosmetovigilance' ? 'Cosmétovigilance' : 'Qualité'}] Nouvelle réclamation ${numeroReclamation}`,
    html: `
      <h2>Nouvelle réclamation ${numeroReclamation}</h2>
      <p><strong>Type :</strong> ${type === 'cosmetovigilance' ? 'Cosmétovigilance' : 'Qualité'}</p>
      <p><strong>Client :</strong> ${coordonnees.prenom} ${coordonnees.nom}</p>
      <p><strong>Email client :</strong> ${coordonnees.email}</p>
      <p><strong>Téléphone :</strong> ${coordonnees.telephone}</p>
      <p><strong>Magasin :</strong> ${data.infosComplementaires.nomMagasin} (${data.infosComplementaires.numeroDuMagasin})</p>
      <p>Veuillez trouver le formulaire complet en pièce jointe.</p>
    `,
    attachments: [
      {
        filename: `reclamation-${numeroReclamation}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  if (coordonnees.email) {
    await transporter.sendMail({
      from: `"Marionnaud" <${process.env.SMTP_USER}>`,
      to: coordonnees.email,
      subject: `Confirmation de votre réclamation ${numeroReclamation}`,
      html: `
        <h2>Votre réclamation a bien été enregistrée</h2>
        <p>Bonjour ${coordonnees.prenom} ${coordonnees.nom},</p>
        <p>Nous avons bien reçu votre déclaration de ${type === 'cosmetovigilance' ? 'cosmétovigilance' : 'qualité'} sous le numéro <strong>${numeroReclamation}</strong>.</p>
        <p>Notre équipe traitera votre dossier dans les meilleurs délais.</p>
        <p>Cordialement,<br>L'équipe Marionnaud</p>
      `,
      attachments: [
        {
          filename: `reclamation-${numeroReclamation}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
