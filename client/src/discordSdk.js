import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

export const initializeDiscord = async () => {
      console.log("Initializing Discord SDK...");
  try {
    // Wait for Discord to establish the connection
    await discordSdk.ready();

    console.log("Discord SDK is ready!");

    return discordSdk;
  } catch (error) {
    console.error("Discord SDK initialization failed:", error);
  }
};

export default discordSdk;