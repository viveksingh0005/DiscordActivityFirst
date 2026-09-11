import { DiscordSDK } from "@discord/embedded-app-sdk";

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

console.log("CLIENT ID:", clientId);

const discordSdk = new DiscordSDK(clientId);

export const initializeDiscord = async () => {
  console.log("========== DISCORD DEBUG ==========");

  try {
    // STEP 1
    console.log("STEP 1: Function started");

    // STEP 2
    console.log("STEP 2: Client ID:", clientId);

    if (!clientId) {
      throw new Error("VITE_DISCORD_CLIENT_ID is undefined");
    }

    // STEP 3
    console.log("STEP 3: Calling discordSdk.ready()");

    await discordSdk.ready();

    // STEP 4
    console.log("STEP 4: discordSdk.ready() SUCCESS");

    // STEP 5
    console.log("STEP 5: About to call authorize()");

    const authResult = await discordSdk.commands.authorize({
      client_id: clientId,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify"],
    });

    // STEP 6
    console.log("STEP 6: authorize SUCCESS");
    console.log("AUTHORIZE RESULT:", authResult);

    const { code } = authResult;

    if (!code) {
      throw new Error("Discord did not return an authorization code");
    }

    // STEP 7
    console.log("STEP 7: Authorization code received");

    // STEP 8
    console.log("STEP 8: Calling backend");

    const response = await fetch("/api/auth/discord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    // STEP 9
    console.log("STEP 9: Backend status:", response.status);

    const text = await response.text();

    // STEP 10
    console.log("STEP 10: Backend raw response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Backend returned non-JSON response");
      throw error;
    }

    // STEP 11
    console.log("STEP 11: Backend JSON:", data);

    // STEP 12
    if (data.token) {
      localStorage.setItem("token", data.token);

      console.log("STEP 12: JWT SAVED SUCCESSFULLY");
    } else {
      console.error("STEP 12: Backend did not return a token");
    }

    console.log("========== DISCORD AUTH COMPLETE ==========");

    return discordSdk;

  } catch (error) {
    console.error("========== DISCORD AUTH ERROR ==========");
    console.error(error);
    console.error("========== END ERROR ==========");

    throw error;
  }
};

export default discordSdk;