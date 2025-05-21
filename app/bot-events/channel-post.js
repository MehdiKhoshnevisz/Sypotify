const axios = require("axios");
const { getAuthHeaders } = require("../helpers");
const { getUsers } = require("../services/user-service");
const { addedToSpotifyText } = require("../data/texts");

const searchTrack = async ({ accessToken, query }) => {
  const res = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
    params: {
      q: query,
      limit: 3,
      type: "track",
    },
    headers: { ...getAuthHeaders(accessToken) },
  });

  const result = res?.data?.tracks?.items || [];
  return result;
};

const findBestMatch = (title, tracks = []) => {
  const bestMatch = tracks?.find((track) => track?.name?.includes(title));
  return bestMatch ?? null;
};

const addTrackToPlaylist = async (track) => {
  if (track) {
    const uri = track?.uri;

    await axios.post(
      `${process.env.SPOTIFY_API_URL}/playlists/${user.playlist.id}/tracks`,
      { uris: [uri] },
      { headers: getAuthHeaders(user?.spotify?.accessToken) }
    );

    bot.sendMessage(user?.id, addedToSpotifyText);
  } else {
    bot.sendMessage(
      user?.id,
      `❌ No matching track found for title "${title}" and artist similar to "${artist}".`
    );
  }
};

const channelPostEvent = async (bot, post) => {
  const users = getUsers();
  const channelId = post.sender_chat.id.toString();
  const user = users?.find((u) => u?.channel?.id.toString() === channelId);

  if (
    user.channel?.id?.toString() === channelId &&
    user?.spotify?.accessToken &&
    user?.playlist?.id
  ) {
    try {
      if (post?.audio?.file_id) {
        const title = post.audio.title || "";
        const artist = post.audio.performer || "";
        const query = `${artist} - ${title}`;
        const tracks = await searchTrack({
          accessToken: user?.spotify?.accessToken,
          query,
        });
        const bestMatchTrack = findBestMatch(title, tracks);
        addTrackToPlaylist(bestMatchTrack);
      }
    } catch (err) {
      console.error("Error processing post:", err);
    }
  }
};

const onChannelPost = (bot) => {
  bot.on("channel_post", (post) => channelPostEvent(bot, post));
};

module.exports = onChannelPost;
