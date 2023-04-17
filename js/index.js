const { bot, commands } = require("./telegram");
const { automateJournal, automateTranscript, login } = require("./selenium");
const fs = require("fs");
bot.setMyCommands(commands);
let users = [];
bot.onText(/\/journal/, async (msg) => {
  const chatId = msg.chat.id;
  const user = users.find((el) => el.chatId == chatId);
  if (user?.data.username) {
    const { result } = await automateJournal(
      user.data.username,
      user.data.password
    );
    bot.sendMessage(chatId, result);
  } else {
    bot.sendMessage(chatId, "Please login");
  }
});
bot.onText(/\/transcript/, async (msg) => {
  const chatId = msg.chat.id;
  if (username) {
    await automateTranscript(username, password);
    const pdf = fs.createReadStream("./etranscript.pdf");
    bot.sendDocument(chatId, pdf);
  } else {
    bot.sendMessage(chatId, "Please login");
  }
});
bot.onText(/\/login/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Enter username and password(for login)\nFor example: s.salahov1,rsha123"
  );
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    let text = msg.text;
    text = text.split(",");
    if (text[1]) {
      const { result, status } = await login(text[0], text[1]);
      if (status) {
        let user = {
          chatId: chatId,
          data: {
            username: text[0],
            password: text[1],
          },
        };
        users.push(user);
        console.log(users);
        bot.sendMessage(chatId, result);
      } else {
        bot.sendMessage(chatId, result);
      }
    }
  });
});
