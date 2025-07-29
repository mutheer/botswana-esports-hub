import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="py-16 bg-gradient-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              Last updated: July 28, 2024
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              The Botswana Electronic Sports Federation ("BESF", "we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or use our services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Register as a member of BESF</li>
              <li>Register for tournaments or events</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us through our website</li>
              <li>Participate in surveys or feedback forms</li>
            </ul>
            <p>
              This information may include your name, email address, phone number, Omang number, 
              gaming identifiers, and other information relevant to your participation in esports activities.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and manage tournament registrations</li>
              <li>Communicate with you about events, news, and updates</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against 
              unauthorized or unlawful processing, accidental loss, destruction, or damage. We comply with Botswana's 
              Data Protection Act (Act No. 18 of 2024).
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Sharing and Disclosure</h2>
            <p>
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Tournament organizers and partners for event management purposes</li>
              <li>Service providers who perform services on our behalf</li>
              <li>Government authorities when required by law</li>
              <li>International esports bodies for registration and verification purposes</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data in certain circumstances</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@besf.co.bw<br />
              <strong>Phone:</strong> +267 123 4567<br />
              <strong>Address:</strong> Gaborone, Botswana
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;