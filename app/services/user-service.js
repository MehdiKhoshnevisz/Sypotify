const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "../data/users.json");

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({}));
}

function readUsers() {
  const raw = fs.readFileSync(dataFile);
  return JSON.parse(raw);
}

function saveUsers(users) {
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

function getUser(userId) {
  const users = readUsers();
  return users[userId] || null;
}

function saveUser(userId, data) {
  const users = readUsers();
  users[userId] = {
    ...users[userId],
    ...data,
  };
  saveUsers(users);
}

function hasUser(userId) {
  const users = readUsers();
  return !!users[userId];
}

module.exports = {
  hasUser,
  getUser,
  saveUser,
};
