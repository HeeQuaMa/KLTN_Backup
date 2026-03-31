import { Header, Navigation, Footer } from "@/components/layout";
import { ScrollToTop } from "@/components/shared";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Navigation />

      {/* Dynamic Content */}
      <main className="grow">{children}</main>

      <ScrollToTop />
      <Footer />
    </>
  );
}
