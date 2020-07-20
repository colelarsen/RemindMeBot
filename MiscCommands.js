
const request = require('request');
const cheerio = require('cheerio');
const Discord = require('discord.js');
const resources = require('./resources.json');

module.exports.randomCaps = randomCaps;
module.exports.setLastChannel = setLastChannel;
module.exports.handleImageSearch = handleImageSearch;
module.exports.zalgo = zalgo;
module.exports.findNWords;
module.exports.spoiler = spoiler;
module.exports.dude = dude;
module.exports.getHelp = getHelp;

module.exports.roll = roll;
module.exports.tell = tell;
module.exports.reply = reply;

var LASTCHANNEL = "";



function setLastChannel(last) {
    LASTCHANNEL = last;
}



function roll(mesg)
{
    var messageResponse = "";
    var number = parseInt(mesg.content.split('/roll d')[1], 10);
    
    var messageResponse = Math.floor((Math.random() * number) + 1);
    reply(mesg, messageResponse);

}

function tell(mesg)
{
    
    reply(mesg, mesg.content.split('/tell ')[1]);
    mesg.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);
}

function reply(mesg, content)
{
    mesg.channel.send(content);
}


var zalg = {
    'a': "a̱͔̺͎͇̲̙",
    'b': "b̴͇̠̻",
    'c': "c͙̗̦",
    'd': "d̨̀͏̰",
    'e': "e͚͉̩͇̭͍",
    'f': "f̛̮̖̩̳̦̘̘̱̟͡͝",
    'g': "g̨̠̲̼̭͠",
    'h': "h̷͔̹̦͚̰͓̻͞",
    'i': "i̩̖̮̺͈̦",
    'j': "j̠͖̖ͅ",
    'k': "k̡͕̘͓̹̲̹̦̗̀",
    'l': "ĺ̡̛͉̯",
    'm': "m̘̗͚",
    'n': "n̷͘͏̻̥̪̫͈̳ͅ",
    'o': "ọ̣̗̤͍̤̺",
    'p': "p̮͕͚̗̜͍̺͟",
    'q': "q̪̱͙̬͓̳",
    'r': "r̡͙͉̩̤̀͝",
    's': "s̢̟͎͕͈",
    't': "t̶̵̳̩̤̱̯",
    'u': "u͢͏͎̘̫͇͉̫",
    'v': "v̰͇̗̰̬̪ͅ",
    'w': "w̵̢̺̘̻͙͘",
    'x': "x̶̗̰̪͓̙͞",
    'y': "ỳ̛̺͖͕̻̲̟͕͖͝",
    'z': "z̞̤̦̙͚"
}

function zalgo(mesg) {
    var messageContent = "";
    messageContent = mesg.content.toLowerCase();
    var newMessage = "";

    for (i = 7; i < messageContent.length; i++) {
        if (messageContent.charAt(i).match(/[a-z]/i)) {
            newMessage += zalg[messageContent.charAt(i)];
        }
        else {
            newMessage += messageContent.charAt(i);
        }
    }

     reply(mesg, newMessage);

    mesg.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);
}

function spoiler(mesg)
{
    var messageResponse = "";
    var messageContent = mesg.content.split('spoiler: ')[1];
    for(i = 0; i < messageContent.length; i++)
    {
        var char = messageContent[i];
        messageResponse += '||' + char + '||';
    }
    reply(mesg, messageResponse);
    mesg.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);
}

function dude(mesg)
{
    reply(mesg, "HAHA DUDE WEED");
    handleImageSearch(mesg);
    reply(mesg, "HAHA DUDE");
}

function getHelp()
{
    var embed = new Discord.RichEmbed()
	.setColor(3447003)
    .setDescription('Commands');
    var commands = resources.commands;
    for(key of Object.keys(commands))
    {
        embed.addField(key, commands[key]);
    }
    return embed;
}


function randomCaps(mesg) {
    var messageContent = "";
    messageContent = mesg.content;
    var newMessage = "";

    for (i = 7; i < messageContent.length; i++) {
        var math = Math.random();
        console.log(math);
        if (math < 0.5) {
            newMessage = newMessage + messageContent[i].toUpperCase();
        }
        else {
            newMessage = newMessage + messageContent[i];
        }
    }
   reply(mesg, newMessage);
    mesg.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);
}


const GoogleImages = require('google-images');

function handleImageSearch(mesg) {
    var sniff = mesg.content.split("image: ")[1];
    var imageNum = 1;
    var client = new GoogleImages('001240387052449260152:yrizystafyw', 'AIzaSyA2U3DQF9AHMofsy2CtoP035jg-S1BP6Yc');
    client.search(sniff)
        .then(images => {
            let index = Math.round(Math.random()*images.length);
            var embed = new Discord.RichEmbed()
                .setColor(3447003)
                .setTitle(sniff)
                .setImage(images[index].url)
                .setDescription(" ");
            reply(mesg, embed);
        })
        .catch((err) => { console.log(err) });
}

