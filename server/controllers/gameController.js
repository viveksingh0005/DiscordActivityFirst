import Game from "../models/Game.js";

export const startGame = async (req, res) => {
  try {
    // Generate 16 random numbers
    const numbers = Array.from(
      { length: 16 },
      () => Math.floor(Math.random() * 20) + 1
    );

    // Choose 2 or 3 numbers
    const count = Math.random() > 0.5 ? 2 : 3;

    const targetIndexes = [];

    while (targetIndexes.length < count) {
      const index = Math.floor(Math.random() * 16);

      if (!targetIndexes.includes(index)) {
        targetIndexes.push(index);
      }
    }

    // Calculate target sum
    const targetSum = targetIndexes.reduce(
      (sum, index) => sum + numbers[index],
      0
    );

    // Save game in MongoDB
    const game = await Game.create({
      player: req.user._id,
      numbers,
      targetSum,
      targetIndexes,
    });

    res.json({
      message: "Game started",

      gameId: game._id,

      numbers: game.numbers,

      targetSum: game.targetSum,
    });

  } catch (error) {
    console.error("Start game error:", error);

    res.status(500).json({
      message: "Failed to start game",
    });
  }
};
export const submitAnswer = async (req, res) => {
  try {
    const { gameId, selectedIndexes } = req.body;

    // 1. Validate input
    if (!gameId || !Array.isArray(selectedIndexes)) {
      return res.status(400).json({
        message: "Game ID and selected indexes are required",
      });
    }

    // 2. Find the game
    const game = await Game.findOne({
      _id: gameId,
      player: req.user._id,
    });

    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    // 3. Make sure game is still active
    if (game.status !== "active") {
      return res.status(400).json({
        message: "This game has already ended",
      });
    }

    // 4. Calculate the player's answer
    const selectedSum = selectedIndexes.reduce(
      (sum, index) => {
        return sum + game.numbers[index];
      },
      0
    );

    // 5. Check answer
    if (selectedSum === game.targetSum) {
      
      // Player won
      game.status = "won";
      game.pointsAwarded = true;

      await game.save();

      // Award points
      req.user.points += 10;
      req.user.gamesPlayed += 1;
      req.user.gamesWon += 1;

      await req.user.save();

      return res.json({
        result: "win",
        message: "🎉 You won!",
        pointsEarned: 10,
        points: req.user.points,
        gamesPlayed: req.user.gamesPlayed,
        gamesWon: req.user.gamesWon,
      });
    }

    // Player lost
    game.status = "lost";

    await game.save();

    req.user.gamesPlayed += 1;

    await req.user.save();

    return res.json({
      result: "lose",
      message: "❌ Wrong answer",
      points: req.user.points,
      gamesPlayed: req.user.gamesPlayed,
      gamesWon: req.user.gamesWon,
    });

  } catch (error) {
    console.error("Submit answer error:", error);

    res.status(500).json({
      message: "Failed to check answer",
    });
  }
};
export const winGame = async (req, res) => {
  try {

    // User comes from authMiddleware
    const user = req.user;

    // Give 10 points
    user.points += 10;

    // Increase games won
    user.gamesWon += 1;

    // Increase games played
    user.gamesPlayed += 1;

    // Save to MongoDB
    await user.save();

    res.json({
      message: "Game won!",
      points: user.points,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
    });

  } catch (error) {

    console.error("Win game error:", error);

    res.status(500).json({
      message: "Failed to update game result",
    });
  }
};