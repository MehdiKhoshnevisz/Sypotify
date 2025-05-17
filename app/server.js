const app = require("./index");
const bot = require("./bot");

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`ᯤ Sypotify server is running on port ${PORT}`);
});
