import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const SITE_URL = "https://vascoco.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Vascoco",
  title: "Vascoco | Barbería Exclusiva en Junín de los Andes",
  description:
    "Barbería exclusiva en Junín de los Andes, Neuquén. Cortes de pelo, barba, perfilado de cejas, shaving tradicional y color. Reservá tu turno online.",
  keywords: [
    "barbería",
    "junín de los andes",
    "corte de pelo",
    "barba",
    "vascoco",
    "neuquén",
    "turnos",
  ],
  openGraph: {
    title: "Vascoco | Barbería Exclusiva",
    description: "Reservá tu turno online en Vascoco, Junín de los Andes.",
    type: "website",
    url: SITE_URL,
    siteName: "Vascoco",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className="bg-[var(--color-bg-main)] text-[var(--color-text-main)] font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
