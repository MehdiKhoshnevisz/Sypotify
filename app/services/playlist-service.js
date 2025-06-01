const axios = require("axios");
const Fuse = require("fuse.js");
const { getAuthHeaders } = require("../helpers");
const { addedToSpotifyText } = require("../data/texts");

const searchTrack = async ({ accessToken, query }) => {
  const res = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
    params: {
      q: query,
      type: "track",
    },
    headers: { ...getAuthHeaders(accessToken) },
  });

  const result = res?.data?.tracks?.items || [];
  return result;
};

const findBestMatch = (title, tracks = []) => {
  if (!tracks?.length) return null;

  const titles = tracks?.map((track) => track?.name);

  const fuse = new Fuse(titles, {
    includeScore: true,
    threshold: 0.1, // Adjust for sensitivity, lower = stricter
  });

  const fuseResult = fuse.search(title);

  const bestMatch = tracks?.find(
    (track) => track?.name === fuseResult?.[0]?.item
  );

  return bestMatch ?? null;
};

const addTrackToUserPlaylist = async (title, track, user) => {
  if (track) {
    const uri = track?.uri;

    await axios.post(
      `${process.env.SPOTIFY_API_URL}/playlists/${user.playlist.id}/tracks`,
      { uris: [uri] },
      { headers: getAuthHeaders(user?.spotify?.accessToken) }
    );

    return (bot) => {
      bot.sendMessage(user?.id, addedToSpotifyText);
    };
  }

  return (bot) => {
    bot.sendMessage(user?.id, `❌ No matching track found for "${title}".`);
  };
};

module.exports = {
  searchTrack,
  findBestMatch,
  addTrackToUserPlaylist,
};
