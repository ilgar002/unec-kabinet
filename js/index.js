const { bot, commands } = require("./telegram");
const automateJournal = require("./selenium");
bot.setMyCommands(commands);
bot.onText(/\/journal/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Enter username and pasword\nFor example: s.salahov1,rsha123"
  );
});
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  let text = msg.text;
  text = text.split(",");
  if (text[1]) {
    const { result } = await automateJournal(text[0], text[1]);
    bot.sendMessage(chatId, result);
  }
});
