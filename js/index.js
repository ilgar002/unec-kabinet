let { bot, initCommands, funcs } = require("./telegram");
bot.setMyCommands(initCommands);
let users = [];
bot.onText(/\/login/, (msg) => funcs.login(msg.chat.id, users));
bot.onText(/\/logout/, (msg) => funcs.logout(msg.chat.id, users));
bot.onText(/\/journal/, (msg) => funcs.journal(msg.chat.id, users));
bot.onText(/\/transcript/, (msg) => funcs.transcript(msg.chat.id, users));
bot.onText(/\/menu/, (msg) => funcs.transcript(msg.chat.id));
