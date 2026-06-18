import { Navigation } from "@/components/landing/navigation";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ds-true-white selection:bg-ds-pure-black selection:text-ds-true-white">
      <Navigation />

      <section className="py-32 px-6 max-w-[800px] mx-auto text-ds-dark-text">
        <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-[16px] text-ds-mid-grey mb-16">Last updated: June 7, 2026</p>

        <div className="space-y-12 text-[16px] leading-[1.8] text-ds-mid-grey">
          
          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">1. Acceptable use</h2>
            <p>
              DriveStack is designed for accounts you personally own and control. Connecting 
              someone else's account without their explicit permission is strictly prohibited 
              and constitutes a violation of these terms.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">2. Subscriptions and billing</h2>
            <p>
              By subscribing to DriveStack Pro, you agree to pay the stated fees (monthly or 
              annually). Payments are processed securely via our payment partners. Your subscription 
              will automatically renew unless cancelled prior to the renewal date.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">3. Cancellation and refunds</h2>
            <p>
              You may cancel your subscription at any time. Upon cancellation, your account will 
              remain on the Pro tier until the end of your current billing cycle, after which it 
              will revert to the Free tier. We do not offer prorated refunds for partial months.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">4. Account termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms 
              of Service, abuse the platform, or engage in activities that harm our infrastructure 
              or other users.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ds-dark-text mb-4">5. Limitation of liability</h2>
            <p>
              DriveStack provides tools to manage Google Drive metadata. We are not responsible for 
              lost files, accidental deletions, or service interruptions on Google's end. Use the 
              service at your own risk. DriveStack is provided "as is" without any warranties.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
