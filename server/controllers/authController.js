import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const discordLogin = async (req, res) => {
  try {
    const { code } = req.body;

    // 1. Check authorization code
    if (!code) {
      return res.status(400).json({
        message: "Discord authorization code is required",
      });
    }

    // 2. Exchange Discord authorization code for access token
    const tokenResponse = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code,
          // redirect_uri: process.env.DISCORD_REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    console.log("Discord token response:", tokenData);

    if (!tokenResponse.ok) {
      return res.status(400).json({
        message: "Discord token exchange failed",
        error: tokenData,
      });
    }

    // 3. Get Discord user
    const userResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const discordUser = await userResponse.json();

    console.log("Discord user:", discordUser);

    if (!userResponse.ok) {
      return res.status(400).json({
        message: "Failed to get Discord user",
        error: discordUser,
      });
    }

    // 4. Find user in MongoDB
    let user = await User.findOne({
      discordId: discordUser.id,
    });

    // 5. Create user if they don't exist
    if (!user) {
      user = await User.create({
        discordId: discordUser.id,
        username: discordUser.username,
        globalName: discordUser.global_name || "",
        avatar: discordUser.avatar || "",
      });
    } else {
      // Update user information
      user.username = discordUser.username;
      user.globalName = discordUser.global_name || "";
      user.avatar = discordUser.avatar || "";

      await user.save();
    }

    // 6. Create your application JWT
    const token = jwt.sign(
      {
        userId: user._id,
        discordId: user.discordId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 7. Send response to React
    res.json({
      message: "Discord login successful",
      token,
       access_token: tokenData.access_token,
      user: {
        id: user._id,
        discordId: user.discordId,
        username: user.username,
        globalName: user.globalName,
        avatar: user.avatar,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
      },
    });
  } catch (error) {
    console.error("Discord login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};