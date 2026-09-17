import Room from "../models/Room.js";

const GRID_SIZE = 16;
const PATTERN_LENGTH = 6;
const SHOW_DURATION_MS = 10000;
const GUESS_DURATION_MS = 10000;
const RESULT_DURATION_MS = 6000;
const TOTAL_ROUNDS = 10;

// One entry per active instanceId — the whole session's live state
const sessions = new Map();

const randomPattern = () => {
  const indexes = new Set();
  while (indexes.size < PATTERN_LENGTH) {
    indexes.add(Math.floor(Math.random() * GRID_SIZE));
  }
  return [...indexes];
};

const scoreSubmission = (pattern, selected, submittedAt, phaseStart, phaseEndsAt) => {
  const correctSet = new Set(pattern);
  const selectedSet = new Set(selected);
  const correctCount = [...selectedSet].filter((i) => correctSet.has(i)).length;
  const isPerfect = correctCount === pattern.length && selectedSet.size === pattern.length;

  if (!isPerfect) return { correctCount, points: 0 };

  const totalWindow = phaseEndsAt - phaseStart;
  const timeUsed = Math.max(0, submittedAt - phaseStart);
  const speedRatio = Math.max(0, 1 - timeUsed / totalWindow);
  return { correctCount, points: Math.round(100 + speedRatio * 100) };
};

export const startPatternSession = (io, instanceId) => {
  if (sessions.has(instanceId)) return; // already running for this room

  sessions.set(instanceId, {
    roundNumber: 0,
    pattern: [],
    phaseStart: 0,
    phaseEndsAt: 0,
    submissions: new Map(),
    totals: new Map(),
    timer: null,
  });

  runNextRound(io, instanceId);
};

const runNextRound = (io, instanceId) => {
  const session = sessions.get(instanceId);
  if (!session) return;

  session.roundNumber += 1;
  session.pattern = randomPattern();
  session.submissions = new Map();
  session.phaseStart = Date.now();
  session.phaseEndsAt = session.phaseStart + SHOW_DURATION_MS;

  io.to(instanceId).emit("showPattern", {
    roundNumber: session.roundNumber,
    pattern: session.pattern,
    phaseEndsAt: session.phaseEndsAt,
  });

  session.timer = setTimeout(() => beginGuessing(io, instanceId), SHOW_DURATION_MS);
};

const beginGuessing = (io, instanceId) => {
  const session = sessions.get(instanceId);
  if (!session) return;

  session.phaseStart = Date.now();
  session.phaseEndsAt = session.phaseStart + GUESS_DURATION_MS;

  io.to(instanceId).emit("hidePattern", { phaseEndsAt: session.phaseEndsAt });

  session.timer = setTimeout(() => finishRound(io, instanceId), GUESS_DURATION_MS);
};

const finishRound = async (io, instanceId) => {
  const session = sessions.get(instanceId);
  if (!session) return;

  const room = await Room.findOne({ instanceId });
  if (!room) return sessions.delete(instanceId);

  const scores = room.players.map(({ discordId, username }) => {
    const sub = session.submissions.get(discordId);
    const { correctCount, points } = sub
      ? scoreSubmission(session.pattern, sub.selectedIndexes, sub.submittedAt, session.phaseStart, session.phaseEndsAt)
      : { correctCount: 0, points: 0 };

    session.totals.set(discordId, (session.totals.get(discordId) || 0) + points);
    return { discordId, username, correctCount, points, total: session.totals.get(discordId) };
  });

  io.to(instanceId).emit("roundResult", {
    roundNumber: session.roundNumber,
    correctPattern: session.pattern,
    scores,
  });

  session.timer = setTimeout(
    () => (session.roundNumber >= TOTAL_ROUNDS ? endSession(io, instanceId) : runNextRound(io, instanceId)),
    RESULT_DURATION_MS
  );
};

export const submitGuess = ({ instanceId, discordId, roundNumber, selectedIndexes }) => {
  const session = sessions.get(instanceId);
  if (!session || session.roundNumber !== roundNumber) return;
  if (session.submissions.has(discordId)) return; // one guess per round
  session.submissions.set(discordId, { selectedIndexes, submittedAt: Date.now() });
};

const endSession = async (io, instanceId) => {
  const session = sessions.get(instanceId);
  sessions.delete(instanceId);
  if (!session) return;

  const room = await Room.findOne({ instanceId });
  if (!room) return;

  const leaderboard = room.players
    .map(({ discordId, username }) => ({ discordId, username, total: session.totals.get(discordId) || 0 }))
    .sort((a, b) => b.total - a.total);

  room.status = "lobby";

  const openSlots = room.capacity - room.players.length;
  if (openSlots > 0 && room.spectators.length > 0) {
    room.players.push(...room.spectators.splice(0, openSlots));
  }
  await room.save();

  io.to(instanceId).emit("sessionEnded", { leaderboard });
  io.to(instanceId).emit("roomUpdate", {
    room: { instanceId: room.instanceId, hostId: room.hostId, status: room.status, capacity: room.capacity },
    players: room.players.map(({ discordId, username, avatar }) => ({
      discordId, username, avatar, isHost: discordId === room.hostId,
    })),
    spectators: room.spectators.map(({ discordId, username, avatar }) => ({ discordId, username, avatar })),
  });
};