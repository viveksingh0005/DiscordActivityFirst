import User from "../models/User.js"; 

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "username globalName avatar discordId points gamesPlayed gamesWon"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      globalName: user.globalName,
      avatar: user.avatar,
      discordId: user.discordId,
      totalScore: user.points || 0,
      gamesPlayed: user.gamesPlayed || 0,
      gamesWon: user.gamesWon || 0,
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


// =========================
// GET LEADERBOARD (TOP 10 + MY RANK)
// =========================
export const getLeaderboard = async (req, res) => {
  try {
    // Top 10 players by points
    const topPlayers = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select("username globalName avatar discordId points gamesPlayed gamesWon");

    // Current user's points
    const currentUser = await User.findById(req.user._id).select("points");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Rank = 1 + number of players with strictly more points
    const higherScoreCount = await User.countDocuments({
      points: { $gt: currentUser.points || 0 },
    });

    const myRank = higherScoreCount + 1;

    res.json({
      topPlayers: topPlayers.map((u, index) => ({
        rank: index + 1,
        username: u.username,
        globalName: u.globalName,
        avatar: u.avatar,
        discordId: u.discordId,
        points: u.points || 0,
        gamesPlayed: u.gamesPlayed || 0,
        gamesWon: u.gamesWon || 0,
      })),
      myRank,
      myPoints: currentUser.points || 0,
    });

  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};