const TelegramBot = require('node-telegram-bot-api');
const Callback = require('./uptime.js');
const fs = require('fs');

const TOKEN = 'BOT_TOKEN';
const BOTNAME = 'Hello_Organic_bot';

const TIMEOUT = 60;
const bot = new TelegramBot(TOKEN, {polling: true});

console.log(BOTNAME+' login!');

let helloRegex = new RegExp('/hello@'+BOTNAME, 'i');
bot.onText(helloRegex, (msg,match)=>{
  let chatId = msg.chat.id;
  let message = `안녕하세요`;
  bot.sendMessage(chatId, message);
});

let uptimeRegex = new RegExp('/uptime@'+BOTNAME,'i');
bot.onText(uptimeRegex, (msg,match)=>{
  let chatId = msg.chat.id;
  let message = "";
  Callback(function(message){bot.sendMessage(chatId,message);});
});

var statusRegex = new RegExp('/status','i');
bot.onText(statusRegex, (msg,match)=>{
  let chatId = msg.chat.id;
  let message = "";
  message = fs.readFileSync('main.js','utf8').toString().split('\n').length;
  bot.sendMessage(chatId,message +" 줄로 구성되어있음");
});



// me Command

let meRegex = new RegExp('^/me(@' + BOTNAME + ')?$', 'i');

bot.onText(meRegex, (msg, match) => {
    let time = Date.now() / 1000;
    let date = msg.date;
    if (time - date > TIMEOUT) return;
    let messageId = msg.message_id;
    let chatId = msg.chat.id;
    let chatTitle = msg.chat.title || '';
    let chatType = msg.chat.type;
    let fromId = msg.from.id;
    let fromFirstName = msg.from.first_name || '';
    let fromLastName = msg.from.last_name || '';
    let userName = msg.from.username ? `@${msg.from.username}` : '';
    let res = `
\`Message ID:\` ${messageId}
*Chat*

\`ID        :\` ${chatId}
\`Title     :\` ${chatTitle}
\`Type      :\` ${chatType}
*User*

\`ID        :\` ${fromId}
\`First Name:\` ${fromFirstName}
\`Last  Name:\` ${fromLastName}
\`Username  :\` ${userName}`;
    bot.sendMessage(chatId, res, {reply_to_message_id: messageId, parse_mode: 'markdown'});
});
