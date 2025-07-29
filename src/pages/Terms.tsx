import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="py-16 bg-gradient-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              Last updated: July 28, 2024
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Botswana Electronic Sports Federation ("BESF") website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
            <p>
              To use certain services provided by BESF, you must:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Be a resident of Botswana or have appropriate authorization to participate in BESF activities</li>
              <li>Meet age requirements for specific tournaments and events</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Provide accurate and complete information during registration</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>
              When you create an account with BESF, you are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Code of Conduct</h2>
            <p>
              As a member of BESF, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Treat all participants, officials, and staff with respect</li>
              <li>Refrain from using offensive, discriminatory, or harassing language or behavior</li>
              <li>Compete fairly and follow all tournament rules</li>
              <li>Not engage in cheating, hacking, or exploiting game mechanics</li>
              <li>Accept the decisions of tournament officials</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
            <p>
              All content on the BESF website, including logos, text, graphics, and software, is the property of BESF or its content suppliers and is protected by Botswana and international copyright laws.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
            <p>
              BESF shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, our services or any content provided by BESF.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
            <p>
              BESF reserves the right to terminate or suspend your account and access to our services at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, BESF, or third parties, or for any other reason at our sole discretion.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
            <p>
              BESF may revise these Terms of Service at any time without notice. By continuing to use our services after any changes, you accept and agree to the revised terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of Botswana, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@besf.co.bw<br />
              <strong>Phone:</strong> +267 123 4567<br />
              <strong>Address:</strong> Gaborone, Botswana
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;