import { submitGuess } from "../services/patternService.js";

export const registerPatternGameHandlers = (io, socket) => {
  const { instanceId, discordId } = socket.data;

  socket.on("submitGuess", ({ roundNumber, selectedIndexes }) => {
    submitGuess({ instanceId, discordId, roundNumber, selectedIndexes });
  });
};