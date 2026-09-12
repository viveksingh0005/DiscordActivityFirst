// utils/generateShareCard.js
export function generateShareCardBlob({ points, rank, name }) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 315;
  const ctx = canvas.getContext("2d");

  // background
  const grad = ctx.createLinearGradient(0, 0, 600, 315);
  grad.addColorStop(0, "#3730a3");
  grad.addColorStop(1, "#a21caf");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 315);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px sans-serif";
  ctx.fillText(`${name}'s Score`, 40, 70);

  ctx.font = "bold 64px sans-serif";
  ctx.fillText(`${points} pts`, 40, 160);

  ctx.font = "32px sans-serif";
  ctx.fillText(`Rank #${rank}`, 40, 210);

  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#e9d5ff";
  ctx.fillText("Alpha Memory — can you beat me?", 40, 270);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}