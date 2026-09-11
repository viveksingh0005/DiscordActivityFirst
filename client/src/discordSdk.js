import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK(
  import.meta.env.VITE_DISCORD_CLIENT_ID
);

export const initializeDiscord = async () => {
  console.log("1. Initializing Discord SDK...");

  try {
    console.log("BEFORE READY");

    await discordSdk.ready();

    console.log("AFTER READY");

    console.log("3. Starting Discord authorize...");

    const authResult = await discordSdk.commands.authorize({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify"],
    });

    console.log("4. Discord authorize result:", authResult);

    const { code } = authResult;

    // -----------------------------
    // BACKEND
    // -----------------------------
    console.log("5. Sending code to backend...");

    const response = await fetch("/api/auth/discord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    console.log("6. Backend status:", response.status);
    console.log("7. Backend content-type:", response.headers.get("content-type"));

    const text = await response.text();

    console.log("8. Backend raw response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("9. Backend returned HTML/non-JSON!");
      throw error;
    }

    console.log("10. Backend JSON:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return discordSdk;

  } catch (error) {
    console.error("Discord SDK initialization failed:", error);
  }
};

export default discordSdk;