import { SiteLayout } from "@/components/layouts/storefront/SiteLayout";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteLayout>{children}</SiteLayout>;
}
