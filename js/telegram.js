const TelegramBot = require("node-telegram-bot-api");
const token = "5643255151:AAFmoHIc4sczCHweVqhHa40R-G8w0qpFX4I";
const bot = new TelegramBot(token, { polling: true });
const fs = require("fs");
const {
  automateJournal,
  automateTranscript,
  automateLogin,
} = require("./selenium");
let commands = [
  { command: "logout", description: "Logout" },
  { command: "journal", description: "View the e-journal" },
  {
    command: "menu",
    description: "Show menu",
  },
  // { command: "transcript", description: "View the e-transcript" },
];
let initCommands = [
  { command: "login", description: "Login" },
  {
    command: "menu",
    description: "Show menu",
  },
];
const logout = async (chatId, users) => {
  const aviability = users.find((el) => el.chatId == chatId);
  if (aviability) {
    users = users.filter((el) => el.chatId != chatId);
    bot.sendMessage(chatId, "Logout is successfull");
    bot.setMyCommands(initCommands);
  }
};
const login = async (chatId, users) => {
  bot.sendMessage(
    chatId,
    "Enter username and password for login\nFor example: s.salahov1,rsha123"
  );
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    let text = msg.text;
    text = text.split(",");
    if (!msg?.entities && text?.[1]) {
      const { result, status } = await automateLogin(text[0], text[1]);
      if (status) {
        let user = {
          chatId: chatId,
          data: {
            username: text[0],
            password: text[1],
          },
        };
        const aviability = users.find((el) => el.chatId == chatId);
        if (aviability) {
          const index = users.indexOf(aviability);
          users[index] = user;
        } else {
          users.push(user);
        }
        bot.sendMessage(chatId, result);
        bot.setMyCommands(commands);
      } else {
        bot.sendMessage(chatId, result);
      }
    }
  });
};
const journal = async (chatId, users) => {
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
};
const transcript = async (chatId, users) => {
  const user = users.find((el) => el.chatId == chatId);
  if (user?.data.username) {
    await automateTranscript(user.data.username, user.data.password);
    // console.log(pdf);/Users/ismayilzada/Desktop/GitHub/unec-kabinet/etranscript.pdf.crdownload
    const pdf = fs.createReadStream("./etranscript.pdf.crdownload");
    bot.sendDocument(chatId, pdf);
  } else {
    bot.sendMessage(chatId, "Please login");
  }
};
const menu = async (chatId) => {
  let inline_keyboard = [];
  let commandsSec = [];
  commands.forEach((el, index) => {
    if (index >= 2 && index % 2 == 0) {
      inline_keyboard.push(commandsSec);
      commandsSec = [];
    }
    commandsSec.push({
      text: el.command,
      callback_data: el.command,
    });
  });
  inline_keyboard.push([...commandsSec]);
  // console.log(inline_keyboard);
  const opts = {
    reply_markup: {
      inline_keyboard: inline_keyboard,
    },
  };
  bot.sendMessage(chatId, "Choose one :", opts);
};
module.exports = {
  bot,
  initCommands,
  commands,
  funcs: {
    login,
    logout,
    journal,
    transcript,
    menu,
  },
};
