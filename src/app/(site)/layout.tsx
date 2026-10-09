import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import VisitTracker from "@/components/VisitTracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <VisitTracker />
    </>
  );
}
