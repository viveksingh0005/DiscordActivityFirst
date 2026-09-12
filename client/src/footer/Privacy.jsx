import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
              Privacy Policy
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
              <h2 className="text-white font-semibold text-lg mb-2">1. Introduction</h2>
              <p>
                This Privacy Policy explains how <strong>Alpha Memory</strong> (“we”, “our”, or “the Activity”) collects, uses, and protects your information when you use our Discord Activity.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">2. Information We Collect</h2>
              <p className="mb-2">When you use Alpha Memory, we may collect the following information:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-100/80">
                <li>Discord user ID</li>
                <li>Username and global display name</li>
                <li>Avatar (if available)</li>
                <li>Game progress and scores (if leaderboard features are used)</li>
              </ul>
              <p className="mt-2">
                We do not collect email addresses, phone numbers, or payment information.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">3. How We Use Your Information</h2>
              <p className="mb-2">We use the collected information to:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-100/80">
                <li>Provide and operate the Activity</li>
                <li>Display your username and avatar within the game</li>
                <li>Save your game progress and scores</li>
                <li>Improve the Activity experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">4. Data Storage</h2>
              <p>
                Some data (such as your Discord user information) may be stored locally in your browser using localStorage. Game scores and leaderboard data may be stored on our servers if those features are enabled.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">5. Data Sharing</h2>
              <p>
                We do not sell, rent, or share your personal information with third parties, except as required to operate the Activity (for example, through Discord’s platform services) or when required by law.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">6. Third-Party Services</h2>
              <p>
                Alpha Memory runs as a Discord Activity and relies on Discord’s platform. Your use of Discord is also subject to Discord’s own Privacy Policy and Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">7. Data Retention</h2>
              <p>
                We retain your information only as long as necessary to provide the Activity. You may request deletion of your data by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">8. Children’s Privacy</h2>
              <p>
                The Activity is intended for users who meet Discord’s minimum age requirements. We do not knowingly collect personal information from children under the age required by Discord.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-lg mb-2">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact the developer through the official support channels or Discord server.
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

export default Privacy;