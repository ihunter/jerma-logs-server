require("dotenv").config();
const tmi = require("tmi.js");
const {
  formatMessage,
  logSus,
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
  const messageData = formatMessage(tags, message);

  if (messageData.username === "moduspwnens") {
    console.log(`${messageData.username}: ${messageData.message}`);
  }

  if (messageData.username === process.env.USER) {
    logMessage(messageData);
    groupMessage(messageData);
    groupMessageByYearAndMonth(messageData);
  }

  if (messageData.username === process.env.USER || (messageData.mod && message.username !== "nightbot")) {
    logSus(messageData);
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
