import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeScript } from "@/components/ThemeScript";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BadgeToast from "@/components/BadgeToast";

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
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    siteName: "HanaFlow",
    title: "HanaFlow",
    description:
      "Apprends les modules SAP FI, CO, MM, SD, HCM, PP et S/4HANA avec une plateforme éducative premium.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-sap-dark text-slate-900 dark:text-slate-100 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-[4.5rem]">
            {children}
          </main>
          <Footer />
          <BadgeToast />
        </Providers>
      </body>
    </html>
  );
}
