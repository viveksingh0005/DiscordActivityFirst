import { DiscordSDK } from "@discord/embedded-app-sdk";

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

console.log("CLIENT ID:", clientId);

const discordSdk = new DiscordSDK(clientId);

export const initializeDiscord = async () => {
  console.log("========== DISCORD DEBUG ==========");

  try {
    console.log("STEP 1: Function started");

    console.log("STEP 2: Client ID:", clientId);

    console.log("STEP 3: Calling discordSdk.ready()");

    await discordSdk.ready();

    console.log("STEP 4: discordSdk.ready() SUCCESS");
    console.log("AAAAA");

try {
  console.log("BBBBB");

  const authorizeFunction = discordSdk.commands.authorize;

  console.log("CCCCC", authorizeFunction);

  console.log("DDDDD");

  const authResult = await authorizeFunction({
    client_id: clientId,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify"],
  });

  console.log("EEEEE");
  console.log("AUTH RESULT:", authResult);

} catch (error) {
  console.error("AUTHORIZE ERROR:", error);
}

    console.log("STEP 5: Calling authorize()");

    const authResult = await discordSdk.commands.authorize({
      client_id: clientId,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify"],
    });

    console.log("STEP 6: authorize SUCCESS");
    console.log("AUTHORIZE RESULT:", authResult);

    const { code } = authResult;

    console.log("STEP 7: Authorization code:", code);

    console.log("STEP 8: Calling backend");

    const response = await fetch("/api/auth/discord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    console.log("STEP 9: Backend status:", response.status);

    const text = await response.text();

    console.log("STEP 10: Backend response:", text);

    const data = JSON.parse(text);

    console.log("STEP 11: Backend JSON:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log("STEP 12: JWT SAVED");
    } else {
      console.error("STEP 12: NO JWT IN RESPONSE");
    }

    return discordSdk;

  } catch (error) {
    console.error("========== DISCORD ERROR ==========");
    console.error(error);
    console.error("========== END ERROR ==========");

    throw error;
  }
};

export default discordSdk;