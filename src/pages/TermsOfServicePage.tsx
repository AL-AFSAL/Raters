import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing and using Raters, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <div className="space-y-4 text-text-secondary">
              <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
              <p>You are responsible for safeguarding the password and for all activities that occur under your account.</p>
              <p>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Content</h2>
            <div className="space-y-4 text-text-secondary">
              <p>Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post, including its legality, reliability, and appropriateness.</p>
              <p>By posting Content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through our service.</p>
              <p>You agree that this license includes the right for us to make your Content available to other users of the service, who may also use your Content subject to these Terms.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Prohibited Activities</h2>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Using the service for any illegal purpose or in violation of any laws</li>
              <li>Posting unauthorized commercial communications</li>
              <li>Engaging in unauthorized framing of or linking to the service</li>
              <li>Uploading or transmitting viruses or other malicious code</li>
              <li>Interfering with or disrupting the service or servers</li>
              <li>Impersonating others or providing inaccurate information</li>
              <li>Collecting users' content or information without their consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <div className="space-y-4 text-text-secondary">
              <p>The service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Raters and its licensors.</p>
              <p>Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-text-secondary leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              In no event shall Raters, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p className="text-text-secondary mt-4">
              Last Updated: March 15, 2024
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about these Terms, please contact us at:
              <br />
              Email: terms@raters.com
              <br />
              Address: 123 Movie Street, Cinema City, CC 12345
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;