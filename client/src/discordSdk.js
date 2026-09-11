import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK("1547857715450093568");

export const initializeDiscord = async () => {
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