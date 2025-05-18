const onPollingError = (bot) => {
  bot.on("polling_error", (error) => {
    console.error("Polling error:", error);
  });
};

module.exports = onPollingError;
