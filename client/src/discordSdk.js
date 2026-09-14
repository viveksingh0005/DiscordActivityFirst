import { DiscordSDK } from "@discord/embedded-app-sdk";

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
const discordSdk = new DiscordSDK(clientId);

let accessToken = null;
export const getAccessToken = () => accessToken;

export const initializeDiscord = async () => {
  try {
    if (!clientId) throw new Error("VITE_DISCORD_CLIENT_ID is undefined");

    await discordSdk.ready();

    const { code } = await discordSdk.commands.authorize({ /* ...unchanged... */ });
    if (!code) throw new Error("Discord did not return an authorization code");

    const response = await fetch("/.proxy/api/auth/discord", { /* ...unchanged... */ });
    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    if (data.access_token) {
      accessToken = data.access_token;
      await discordSdk.commands.authenticate({ access_token: data.access_token });
    }

    // NEW — connect the multiplayer socket now that we have instanceId + user
    if (data.user) {
      const { connectSocket } = await import("../socket/socket");
      connectSocket({ instanceId: discordSdk.instanceId, discordUser: data.user });
    }

    return discordSdk;
  } catch (error) {
    console.error("Discord auth error:", error);
    throw error;
  }
};

export default discordSdk;