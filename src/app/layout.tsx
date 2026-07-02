import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";

const cairo = localFont({
  src: [
    { path: "./fonts/Cairo-ExtraLight.ttf", weight: "200" },
    { path: "./fonts/Cairo-Light.ttf",      weight: "300" },
    { path: "./fonts/Cairo-Regular.ttf",    weight: "400" },
    { path: "./fonts/Cairo-SemiBold.ttf",   weight: "600" },
    { path: "./fonts/Cairo-Bold.ttf",       weight: "700" },
    { path: "./fonts/Cairo-Black.ttf",      weight: "900" },
  ],
  variable: "--font-cairo",
});

const familjen = localFont({
  src: [
    { path: "./fonts/FamiljenGrotesk-Regular.ttf",          weight: "400", style: "normal" },
    { path: "./fonts/FamiljenGrotesk-Italic.ttf",           weight: "400", style: "italic" },
    { path: "./fonts/FamiljenGrotesk-Medium.ttf",           weight: "500", style: "normal" },
    { path: "./fonts/FamiljenGrotesk-MediumItalic.ttf",     weight: "500", style: "italic" },
    { path: "./fonts/FamiljenGrotesk-SemiBold.ttf",         weight: "600", style: "normal" },
    { path: "./fonts/FamiljenGrotesk-SemiBoldItalic.ttf",   weight: "600", style: "italic" },
    { path: "./fonts/FamiljenGrotesk-Bold.ttf",             weight: "700", style: "normal" },
    { path: "./fonts/FamiljenGrotesk-BoldItalic.ttf",       weight: "700", style: "italic" },
  ],
  variable: "--font-familjen",
});

export const metadata: Metadata = {
  title: "Grupo MIT — Medicina Interdisciplinaria y Trasplantes",
  description: "Centro médico líder del Litoral y segundo centro de trasplante renal en Argentina.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cairo.variable} ${familjen.variable}`}>
      <body className="min-h-screen flex flex-col bg-white">
        <ScrollToTop />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
