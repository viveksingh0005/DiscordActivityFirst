import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

export const initializeDiscord = async () => {
  console.log("Initializing Discord SDK...");
  try {
    // Discord से connection बनाना
    await discordSdk.ready();
    console.log("Discord SDK is ready!");

    // User से permission लेना (authorize)
    const { code } = await discordSdk.commands.authorize({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify"],
      
    });

    console.log("Got Discord auth code:", code);

    // यह code अपने backend को भेजना
    const response = await fetch("/api/auth/discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    console.log("Backend login response:", data);

    // Token को save करना (आगे इस्तेमाल के लिए)
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return discordSdk;
  } catch (error) {
    console.error("Discord SDK initialization failed:", error);
  }
};

export default discordSdk;