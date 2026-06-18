import { Navigation } from "@/components/landing/navigation";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ds-true-white selection:bg-ds-pure-black selection:text-ds-true-white">
      <Navigation />

      <section className="py-32 px-6 max-w-[800px] mx-auto text-ds-dark-text">
        <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-[16px] text-ds-mid-grey mb-16">Last updated: June 7, 2026</p>

        <div className="space-y-12 text-[16px] leading-[1.8] text-ds-mid-grey">
          
          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">What data we collect</h2>
            <p>
              When you use DriveStack, we collect your Google account tokens and file metadata 
              (such as file names, sizes, creation dates, and account identifiers). We need this 
              metadata to provide the unified browser and storage visualisations.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">What we do NOT collect</h2>
            <p>
              DriveStack never collects, views, or stores your actual file contents. Your files 
              stay securely in Google Drive. We only retrieve and display metadata. We cannot see 
              your documents, photos, or data.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">How your data is stored</h2>
            <p>
              Your Google OAuth tokens are encrypted at rest using industry-standard AES-256 
              encryption. They are only decrypted in memory when an active session requires 
              them to perform an action on your behalf.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">Third-party services</h2>
            <p>
              We use third-party services to securely operate DriveStack:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Google OAuth:</strong> For connecting your Drive accounts.</li>
              <li><strong>Squad &amp; Lemon Squeezy:</strong> For processing payments. We do not store your credit card details.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">Your rights</h2>
            <p>
              You have full control over your data. You can disconnect any Google account at any 
              time, which instantly deletes its tokens and metadata from our servers. You may 
              also delete your DriveStack account entirely from your dashboard settings.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">Contact us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, 
              please reach out to us at <a href="mailto:hello@drivestack.app" className="text-ds-dark-text underline underline-offset-4">hello@drivestack.app</a>.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
