// channel_post

const axios = require("axios");
const { getAuthHeaders } = require("../helpers");
const { getUsers } = require("../services/user-service");

const searchSong = async ({ accessToken, query }) => {
  const res = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
    params: {
      q: query,
      limit: 1,
      type: "track",
    },
    headers: { ...getAuthHeaders(accessToken) },
  });

  const result = res?.data?.tracks?.items || [];
  return result;
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
        const songs = await searchSong({
          accessToken: user?.spotify?.accessToken,
          query,
        });
        const track = songs?.length ? songs[0] : null;

        if (track) {
          const uri = track?.uri;
          await axios.post(
            `${process.env.SPOTIFY_API_URL}/playlists/${user.playlist.id}/tracks`,
            { uris: [uri] },
            { headers: getAuthHeaders(user?.spotify?.accessToken) }
          );
          bot.sendMessage(user?.id, `✅ موزیکت به پلی‌لیست اضافه شد.`);
        } else {
          bot.sendMessage(
            user?.id,
            `❌ No matching track found for title "${title}" and artist similar to "${artist}".`
          );
        }
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
