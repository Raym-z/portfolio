import { CertificateGallery } from "@/components/certificates/certificate-gallery";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
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
          eyebrow="Research & credentials"
          title={
            <>
              Published <span className="text-gradient">research</span>
            </>
          }
          description="Peer-reviewed work on machine learning and AI-generated media, plus selected credentials. Click a card to open its publication or view it full size."
        />
      </Reveal>

      <div className="mt-10">
        {error ? (
          <ErrorState
            title="Research and credentials are temporarily unavailable"
            description={error}
          />
        ) : (
          <CertificateGallery certificates={certificates} />
        )}
      </div>
    </section>
  );
}
