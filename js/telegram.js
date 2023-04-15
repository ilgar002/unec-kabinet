const TelegramBot = require("node-telegram-bot-api");
const token = "5643255151:AAFmoHIc4sczCHweVqhHa40R-G8w0qpFX4I";
const bot = new TelegramBot(token, { polling: true });
const commands = [{ command: "journal", description: "View the e-journal" }];
module.exports = {
  bot,
  commands,
};
