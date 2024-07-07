const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/youtube"];

class AuthController {
  static async getAuthUrl(req, res) {
    try {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });

      // Dynamically import the open module
      const { default: open } = await import("open");
      res.json({ authUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async oauth2Callback(req, res) {
    try {
      const { code } = req.query;
      const { tokens } = await oAuth2Client.getToken(code);

      console.log("Token Response:", tokens);

      oAuth2Client.setCredentials(tokens);
      console.log("Access Token:", tokens.access_token);
      console.log("Refresh Token:", tokens.refresh_token);
      res.send("Authentication successful! You can close this window.");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
