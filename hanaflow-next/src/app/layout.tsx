import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});
import { Providers } from "./providers";
import { ThemeScript } from "@/components/ThemeScript";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BadgeToast from "@/components/BadgeToast";
import ImpersonationBanner from "@/components/ImpersonationBanner";
import SiteBanner from "@/components/SiteBanner";
import MaintenanceGate from "@/components/MaintenanceGate";
import { getPublicSettings } from "@/lib/settings";
import { JsonLd } from "@/components/JsonLd";
import ErrorBoundary from "@/components/ErrorBoundary";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "HanaFlow",
    template: "%s | HanaFlow",
  },
  description:
    "Apprends les modules SAP FI, CO, MM, SD, HCM, PP et S/4HANA avec une plateforme éducative premium.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app"
  ),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "HanaFlow",
    title: "HanaFlow",
    description:
      "Apprends les modules SAP FI, CO, MM, SD, HCM, PP et S/4HANA avec une plateforme éducative premium.",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "HanaFlow" }],
  },
  twitter: {
    card: "summary",
    title: "HanaFlow",
    description:
      "Apprends les modules SAP FI, CO, MM, SD, HCM, PP et S/4HANA avec une plateforme éducative premium.",
    images: ["/icons/icon-512.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();
  return (
    <html lang="fr" suppressHydrationWarning className={plusJakartaSans.variable}>
      <head>
        <ThemeScript />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "HanaFlow",
          "url": BASE,
          "description": "Plateforme éducative SAP : cours FI, CO, MM, SD, HCM, PP, S/4HANA, simulateurs d'examens et roadmap consultant.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": { "@type": "EntryPoint", "urlTemplate": `${BASE}/modules-sap` },
            "query-input": "required name=search_term_string"
          }
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "HanaFlow",
          "url": BASE,
          "logo": `${BASE}/icons/icon-512.png`,
          "description": "Plateforme éducative dédiée à l'apprentissage de SAP pour les étudiants et futurs consultants.",
          "sameAs": []
        }} />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-sap-dark text-slate-900 dark:text-slate-100 antialiased">
        <Providers>
          <ImpersonationBanner />
          <SiteBanner enabled={settings.bannerEnabled} message={settings.bannerMessage} link={settings.bannerLink} />
          <Navbar />
          <main className="flex-1 pt-[4.5rem]">
            <ErrorBoundary>
              <MaintenanceGate enabled={settings.maintenanceEnabled} message={settings.maintenanceMessage}>
                {children}
              </MaintenanceGate>
            </ErrorBoundary>
          </main>
          <Footer />
          <BadgeToast />
        </Providers>
      </body>
    </html>
  );
}
