const spotify = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  SCOPES: ["playlist-modify-public", "playlist-modify-private"],
};

const spotifyAuthURL = (userId) =>
  `${process.env.SPOTIFY_ACCOUNT_URL}/authorize?client_id=${
    spotify.CLIENT_ID
  }&response_type=code&redirect_uri=${
    spotify.REDIRECT_URI
  }&scope=${spotify.SCOPES.join("%20")}&state=${userId}`;

module.exports = {
  spotify,
  spotifyAuthURL,
};
