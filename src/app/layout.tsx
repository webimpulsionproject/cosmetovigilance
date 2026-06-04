import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Marionnaud — Déclaration Cosmétovigilance & Qualité',
  description: 'Formulaire de déclaration client pour la cosmétovigilance et la qualité des produits Marionnaud.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`h-full ${inter.className}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
