const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const kiranico = require('./scrapeKiranico.js');
const reminder = require('./reminder.js');
const miscCom = require('./MiscCommands.js');
const gunScrape = require('./scrapeGungeon');

var messageChannel = '428950203144470528'; //General
//var messageChannel = '521434157193232392'; //Bot Testing


/*
----------------------------------------
            STARTUP BOT
----------------------------------------
*/

console.log(config.getLogon());
client.login(config.getLogon())
.then(console.log)
.catch(console.err);


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

//Start the bot
var startUp = setTimeout(startUpBot, 5000);
function startUpBot() {
	var channel = client.channels.get(messageChannel);
	kiranico.setLastChannel(channel);
	miscCom.setLastChannel(channel);
	gunScrape.setLastChannel(channel);
	reminder.setLastChannel(channel);
	//channel.send("Remind me bot is up and running poi~");
	var intervalID = setInterval(() => {reminder.checkTimes(client);}, 10000);
}







/*
----------------------------------------
            BOT INPUT
----------------------------------------
*/

var LASTCHANNEL;
//If you get a message
client.on('message', msg => {
	//If the message author is not this bot
	LASTCHANNEL = msg.channel;

	try {
		if (msg.author.tag != client.user.tag) {
			kiranico.setLastChannel(LASTCHANNEL);
			miscCom.setLastChannel(LASTCHANNEL);
			gunScrape.setLastChannel(LASTCHANNEL);
			reminder.setLastChannel(LASTCHANNEL);
			if (msg.content.includes("/random")) {
				if (msg.content.startsWith("/random")) {
					miscCom.randomCaps(msg);
				}
			}

			if (msg.content.includes("spoiler:")) {
				if (msg.content.startsWith("spoiler:")) {
					miscCom.spoiler(msg);
				}
			}

			else if (msg.content.includes("/zalgo ")) {
				miscCom.zalgo(msg);
			}
			else if (msg.content.includes("/message ")) {
				client.users.find(msg.author.id).createDM();
				dmChan.then(chan => {
					chan.send("Ok");
				});
			}

			else if (msg.content.includes("nword count")) {
				miscCom.findNWords(msg.channel);
			}


			else if (msg.content.includes("image:")) {
				miscCom.handleImageSearch(msg.content);
			}

			else if (msg.content.includes("gun:")) {
				gunScrape.handleGungeonSearch(msg.content);
			}


			else if (msg.content.includes("monster:")) {
				kiranico.handleMonsterSearch(msg.content, true);
			}

			else if (msg.content.includes("weapon:")) {
				kiranico.handleWeaponSearch(msg.content);
			}


			else if (msg.content.includes("drops:")) {
				kiranico.handleMonsterSearch(msg.content, false);
			}


			else if (msg.content.includes("item:")) {
				kiranico.handleItemSearch(msg.content);
			}


			else if (msg.content.includes("set-kiranico-rank:")) {
				kiranico.setRank(msg.content.split("set-kiranico-rank: ")[1]);
			}


			else if (msg.content.includes("set-kiranico-database:")) {
				kiranico.setDatabase(msg.content.split("set-kiranico-database: ")[1].toUpperCase());
			}


			else if (msg.content === 'ping') {
				sg.reply('pong');
			}

			else if (msg.content === 'OH SHIT') {
				LASTCHANNEL.send('A RAT');
			}


		}
		//If the bot is tagged in the message
		if (msg.mentions.users.get(client.user.id) != null) {

			var attachment = processAttachment(msg.attachments);
			var incomingMessage = msg.content.split("> ")[1];
			incomingMessage = incomingMessage.toLowerCase();

			if (incomingMessage === "list reminders") {
				reminder.listReminders().then(message => {
					msg.reply(message);
				});
			}
			else if (incomingMessage.includes("remind me:")) {
				var respond = reminder.remindMeStart(msg.content, msg.author.id, attachment, msg.author.username);
				console.log(msg.author.id);
			}
		}
	}
	catch (error) {
		console.log(error);
		// LASTCHANNEL.send('' + error);
	}
})

function processAttachment(attachmentCollection) {
	var attachment = attachmentCollection.first();
	if (attachment != null) {
		//console.log("Has Attachment");
		var channel = client.channels.get(messageChannel);
		//channel.send(attachment.url);
		return attachment.url;
	}
	return "";
}

