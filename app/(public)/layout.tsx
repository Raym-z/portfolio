import { AmbientBackground } from "@/components/layout/ambient-background";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { I18nProvider } from "@/lib/i18n/provider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <AmbientBackground />
      <SiteHeader />
      <PageIntro>
        <main className="relative z-10 flex-1">{children}</main>
        <SiteFooter />
      </PageIntro>
    </I18nProvider>
  );
}
