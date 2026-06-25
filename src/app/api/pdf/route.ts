import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf';
import { ReclamationFormData } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReclamationFormData;
    const date = format(new Date(), 'yyyyMMdd', { locale: fr });
    const numero = `APERCU-${date}`;

    const pdfBuffer = await generatePDF(body, numero);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reclamation-${date}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF preview error:', err);
    return NextResponse.json({ error: 'Erreur lors de la génération du PDF.' }, { status: 500 });
  }
}
