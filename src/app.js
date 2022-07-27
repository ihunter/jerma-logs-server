require("dotenv").config();
const tmi = require("tmi.js");
const {
  logMessage,
  groupMessage,
  groupMessageByYearAndMonth,
} = require("./utils");

// Create a client with options
const client = new tmi.client({
  skipMembership: true,
  channels: [process.env.CHANNEL],
});

// Register event handlers
client.on("message", (channel, tags, message, self) => {
  if (process.env.USER === tags.username) {
    logMessage(tags, message);
    groupMessage(tags, message);
    groupMessageByYearAndMonth(tags, message);
  }
});

// Connection events
client.on("connecting", (address, port) => {
  console.log("Connecting:", address, port);
});

client.on("connected", (address, port) => {
  console.log("Connected:", address, port);
});

client.on("disconnected", (reason) => {
  console.log("Disconnected:", reason);
});

client.on("reconnect", () => {
  console.log("Attempting to reconnect");
});

// Connect to Twitch
client.connect();
