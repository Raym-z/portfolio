import { CertificateGallery } from "@/components/certificates/certificate-gallery";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { T } from "@/components/ui/translated-text";
import { ErrorState } from "@/components/ui/states";
import { getCertificates } from "@/lib/services/certificates";

export async function CertificatesSection() {
  let certificates = [] as Awaited<ReturnType<typeof getCertificates>>;
  let error: string | null = null;

  try {
    certificates = await getCertificates();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Could not load certificates.";
  }

  return (
    <section
      id="certificates"
      className="section-shell scroll-mt-24 py-12 sm:py-14"
    >
      <Reveal>
        <SectionHeading
          eyebrow={<T k="certificates.eyebrow" />}
          title={
            <>
              <T k="certificates.titleLead" /> <span className="text-gradient"><T k="certificates.titleHighlight" /></span>
            </>
          }
          description={<T k="certificates.description" />}
        />
      </Reveal>

      <div className="mt-10">
        {error ? (
          <ErrorState
            title={<T k="certificates.errorTitle" />}
            description={error}
          />
        ) : (
          <CertificateGallery certificates={certificates} />
        )}
      </div>
    </section>
  );
}
