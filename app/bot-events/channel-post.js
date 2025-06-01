const {
  searchTrack,
  findBestMatch,
  addTrackToUserPlaylist,
} = require("../services/playlist-service");
const { getUsers } = require("../services/user-service");

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
