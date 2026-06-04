import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Reclamation } from '@/lib/models/Reclamation';
import { generatePDF } from '@/lib/pdf';
import { ReclamationFormData } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

async function generateNumero(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `REC-${year}-`;
  const last = await Reclamation.findOne(
    { numeroReclamation: { $regex: `^${prefix}` } },
    {},
    { sort: { createdAt: -1 } }
  );

  let seq = 1;
  if (last) {
    const parts = last.numeroReclamation.split('-');
    seq = parseInt(parts[parts.length - 1], 10) + 1;
  }

  return `${prefix}${String(seq).padStart(4, '0')}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReclamationFormData;

    await connectDB();
    const numero = await generateNumero();

    const doc = await Reclamation.create({
      numeroReclamation: numero,
      type: body.type,
      dateDeclaration: new Date(),
      coordonnees: body.coordonnees,
      produits: body.produits.map(({ id: _id, ...rest }) => rest),
      effetIndesirable: body.effetIndesirable,
      accordClient: body.accordClient,
      infosComplementaires: body.infosComplementaires,
    });

    let pdfGenerated = false;
    try {
      const pdfBuffer = await generatePDF(body, numero);

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const { sendReclamationEmail } = await import('@/lib/email');
        await sendReclamationEmail(body, numero, pdfBuffer);
      }
      pdfGenerated = true;
    } catch (pdfErr) {
      console.error('PDF/email error (non-blocking):', pdfErr);
    }

    return NextResponse.json(
      { success: true, numeroReclamation: numero, id: doc._id, pdfGenerated },
      { status: 201 }
    );
  } catch (err) {
    console.error('Reclamation API error:', err);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la réclamation.' },
      { status: 500 }
    );
  }
}
