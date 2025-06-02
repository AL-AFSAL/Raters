import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-text-secondary leading-relaxed">
              At Raters, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our movie rating platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 text-text-secondary">
                <li>Name and email address when you create an account</li>
                <li>Profile information you choose to share</li>
                <li>Your movie ratings and reviews</li>
                <li>Comments and interactions with other users</li>
              </ul>

              <h3 className="text-xl font-medium">Usage Information</h3>
              <ul className="list-disc list-inside space-y-2 text-text-secondary">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and features used</li>
                <li>Time spent on pages</li>
                <li>Device information</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To provide you with personalized movie recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-text-secondary leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Data Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Right to access your personal data</li>
              <li>Right to rectify inaccurate personal data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@raters.com
              <br />
              Address: 123 Movie Street, Cinema City, CC 12345
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-text-secondary mt-4">
              Last Updated: March 15, 2024
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;