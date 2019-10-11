
const request = require('request');
const cheerio = require('cheerio');
const Discord = require('discord.js');

module.exports.randomCaps = randomCaps;
module.exports.setLastChannel = setLastChannel;
module.exports.handleImageSearch = handleImageSearch;
module.exports.zalgo = zalgo;
module.exports.findNWords = findNWords;

var LASTCHANNEL = "";



function setLastChannel(last) {
    LASTCHANNEL = last;
}


var allMessages = [];
var messArray = [];
var lastMessage = "";
var totalMessageCount = 0;

function findNWords(channel) {
    channel.fetchMessages()
        .then(messages => {
            messArray = messages.array();
            lastMessage = messArray[messArray.length - 1].id;
            messArray.forEach(msg => {
                if (msg.content.toLowerCase().includes("nigga") || msg.content.toLowerCase().includes("nigger")) {
                    allMessages.push(msg);
                }
            });
            totalMessageCount = totalMessageCount + messArray.length;
            recurseMessages(channel);
        });
}

function recurseMessages(channel) {
    channel.fetchMessages({ before: lastMessage })
        .then(messages2 => {
            messArray = messages2.array();
            lastMessage = messArray[messArray.length - 1].id;
            messArray.forEach(msg => {
                if (msg.content.toLowerCase().includes("nigg")) {
                    allMessages.push(msg);
                    authorList[msg.author] = msg.author;
                    if (counter[msg.author]) {
                        counter[msg.author] = counter[msg.author] + 1;
                    }
                    else {
                        counter[msg.author] = 1;
                    }
                    console.log(counter);
                    console.log(totalMessageCount);
                }
            });
            totalMessageCount = totalMessageCount + messArray.length;

            if (messArray.length >= 50) {
                recurseMessages(channel);
            }
            else {
                console.log(totalMessageCount);
                determineNWord(channel);
            }
        }).catch((error) => {
            console.log(error);
            console.log(counter);
            console.log(totalMessageCount);
            console.log(lastMessage);
        });
}

var authorList = [];
var counter = [];
function determineNWord(channel) {




    var authors = Object.keys(counter);
    for (i in authors) {
        var author = authors[i];
        author = authorList[author];
        var newMessage = author.username + " has said the nword " + counter[author] + " times";
        channel.send(newMessage);
    }
    // allMessages = [];
    // messArray = [];
    // lastMessage = "";
    // totalMessageCount = 0;
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
    mesg.channel.send(newMessage);
    mesg.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);
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
    mesg.channel.send(newMessage);
    mesg.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);
}


const GoogleImages = require('google-images');

function handleImageSearch(msgContent) {
    var sniff = msgContent.split("image: ")[1];
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
            LASTCHANNEL.send(embed);
        })
        .catch((err) => { console.log(err) });
}

