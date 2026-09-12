import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Terms of Service
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-purple-200 hover:text-white transition-colors px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
              ← Back
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 text-purple-100/90 text-sm md:text-base leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
            
            <section>
              <h2 className="text-white font-semibold text-lg mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using <strong>Alpha Memory</strong> (the “Activity”), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Activity.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">2. Description of Service</h2>
              <p>
                Alpha Memory is a Discord Activity that provides a memory-based number and letter challenge game. The Activity is provided for entertainment purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">3. Eligibility</h2>
              <p>
                You must have a valid Discord account to use this Activity. By using the Activity, you represent that you meet Discord’s age and eligibility requirements.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">4. User Conduct</h2>
              <p>
                You agree not to misuse the Activity, including but not limited to attempting to cheat, exploit bugs, harass other users, or interfere with the normal operation of the Activity.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">5. Intellectual Property</h2>
              <p>
                All content, design, and code related to Alpha Memory remain the property of the developer. You may not copy, modify, or distribute any part of the Activity without permission.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">6. Disclaimer of Warranties</h2>
              <p>
                The Activity is provided “as is” and “as available” without any warranties of any kind, either express or implied. We do not guarantee that the Activity will be uninterrupted, error-free, or secure.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, the developer shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Activity.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">8. Changes to Terms</h2>
              <p>
                We reserve the right to update or modify these Terms of Service at any time. Continued use of the Activity after changes are posted constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">9. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact the developer through the official Discord server or support channels.
              </p>
            </section>

            <p className="text-purple-200/60 text-sm pt-4">
              Last updated: September 12, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;