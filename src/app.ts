import "dotenv/config";
import tmi from "tmi.js";

import {
  formatMessage,
  logSus,
  logMessage,
  logTestMessage,
  groupMessage,
  groupMessageByYearAndMonth,
} from "./utils";

// Create a client with options
const client = new tmi.client({
  channels: [process.env.CHANNEL || "jerma985"],
});

// Register event handlers
client.on("message", (channel, tags, message, self) => {
  const messageData = formatMessage(tags, message);

  if (messageData.username === "moduspwnens") {
    console.log(`${messageData.username}: ${messageData.message}`);
    logTestMessage(messageData);
  }

  if (messageData.username === process.env.USER) {
    logMessage(messageData);
    groupMessage(messageData);
    groupMessageByYearAndMonth(messageData);
  }

  if (
    messageData.username === process.env.USER ||
    (messageData.mod && messageData.username !== "nightbot")
  ) {
    logSus(messageData);
  }
});

// Connection events
client.on("connecting", (address, port) => {
  console.log("Connecting:", process.env.CHANNEL, address, port);
});

client.on("connected", (address, port) => {
  console.log("Connected:", process.env.CHANNEL, address, port);
});

client.on("disconnected", (reason) => {
  console.log("Disconnected:", reason);
});

client.on("reconnect", () => {
  console.log("Attempting to reconnect");
});

// Connect to Twitch
client.connect();
