const axios = require("axios");
const Fuse = require("fuse.js");
const { getAuthHeaders } = require("../helpers");
const { getUsers } = require("../services/user-service");
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

  console.log("titles: ", titles);

  const fuse = new Fuse(titles, {
    includeScore: true,
    threshold: 0.4, // Adjust for sensitivity, lower = stricter
  });

  const fuseResult = fuse.search(title);

  console.log("fuseResult:", fuseResult);

  // const bestMatch = tracks?.find((track) => title?.includes(track?.name));
  const bestMatch = tracks?.find((track) => track?.name === fuseResult[0]);

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
        const trackHandler = await addTrackToUserPlaylist(
          title,
          bestMatchTrack,
          user
        );
        trackHandler(bot);
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
