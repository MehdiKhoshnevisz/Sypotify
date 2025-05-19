const app = require("../index");
const authSpotifyController = require("../controllers/auth-spotify-controller");

app.get("/auth", authSpotifyController);
