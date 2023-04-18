const TelegramBot = require("node-telegram-bot-api");
const token = "5643255151:AAFmoHIc4sczCHweVqhHa40R-G8w0qpFX4I";
const bot = new TelegramBot(token, { polling: true });
let commands = [
  { command: "logout", description: "Logout" },
  { command: "journal", description: "View the e-journal" },
  // { command: "transcript", description: "View the e-transcript" },
];
let initCommands = [{ command: "login", description: "Login" }];
module.exports = {
  bot,
  initCommands,
  commands,
};
