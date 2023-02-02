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

let sus = false

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

  // if (messageData.username === process.env.USER || (messageData.mod && messageData.username !== "nightbot")) {
  //   logSus(messageData);
  // }

  if (messageData.mod && messageData.username === "nightbot" && sus) {
    console.log("SUS =", messageData.message)
    logSus(messageData);
    sus = false
  }

  if (messageData.message === "!sus") {
    console.log("SUS! was cast")
    sus = true
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
