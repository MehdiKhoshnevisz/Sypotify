require("dotenv").config();
const express = require("express");
// const TelegramBot = require("node-telegram-bot-api");

const app = express();

app.use(express.json());

module.exports = app;
