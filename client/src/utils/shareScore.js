// utils/shareScore.js
export async function shareScoreToDiscord({ discordSdk, accessToken, points, rank, name }) {
  const blob = await generateShareCardBlob({ points, rank, name });
  const imageFile = new File([blob], "score.png", { type: "image/png" });

  const body = new FormData();
  body.append("file", imageFile);

  const attachmentRes = await fetch(
    `https://discord.com/api/applications/${import.meta.env.VITE_DISCORD_CLIENT_ID}/attachment`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body,
    }
  );

  const attachmentJson = await attachmentRes.json();
  const mediaUrl = attachmentJson.attachment.url;

  await discordSdk.commands.openShareMomentDialog({ mediaUrl });
}