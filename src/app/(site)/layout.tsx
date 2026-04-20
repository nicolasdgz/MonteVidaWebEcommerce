import type { Metadata } from 'next';
import ClientProviders from "./ClientProviders";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.montevida.pe'),
  title: {
    template: '%s | Montevida',
    default: 'Montevida | Suplementos y Productos Naturales',
  },
  description: 'Descubre los mejores suplementos y productos naturales en Montevida. Calidad, bienestar y salud en cada gota.',
  keywords: ['suplementos', 'natural', 'salud', 'bienestar', 'montevida', 'vitaminas', 'peru'],
  authors: [{ name: 'Montevida' }],
  openGraph: {
    title: 'Montevida | Suplementos y Productos Naturales',
    description: 'Descubre los mejores suplementos y productos naturales en Montevida. Calidad, bienestar y salud.',
    url: 'https://www.montevida.pe',
    siteName: 'Montevida',
    images: [
      {
        url: '/images/logo/LogoOficial-MonteVida-va.png',
        width: 800,
        height: 600,
        alt: 'Logo Montevida',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientProviders>{children}</ClientProviders>;
}
