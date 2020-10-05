const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const kiranico = require('./scrapeKiranico.js');
const reminder = require('./reminder.js');
const miscCom = require('./MiscCommands.js');
const gunScrape = require('./scrapeGungeon');
const imageConvert = require('./imgConvert');
const cardScrape = require('./scrapeYugioh.js');
const fs = require('fs');

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

// //Start the bot
var startUp = setTimeout(startUpBot, 5000);



function startUpBot() {
	var intervalID = setInterval(() => { reminder.checkTimes(client); }, 10000);
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
	try {
		if (msg.author.tag != client.user.tag) {

			var rand = Math.floor((Math.random() * 1000) + 1);
			if(rand == 1)
			{
				let rawdata = fs.readFileSync('randomMessages.json');
				let messages = JSON.parse(rawdata);
				var randomMessages = messages.messages;
				var message = randomMessages[Math.floor(Math.random()*randomMessages.length)];
				miscCom.reply(msg, message);
			}

			else if (msg.content.includes("/randomMesageForce")) {
				let rawdata = fs.readFileSync('randomMessages.json');
				let messages = JSON.parse(rawdata);
				var randomMessages = messages.messages;
				var message = randomMessages[Math.floor(Math.random()*randomMessages.length)];
				miscCom.reply(msg, message);
			}


			else if (msg.content.includes("/random")) {
				if (msg.content.startsWith("/random")) {
					miscCom.randomCaps(msg);
				}
			}

			else if (msg.content.includes("spoiler:")) {
				if (msg.content.startsWith("spoiler:")) {
					miscCom.spoiler(msg);
				}
			}

			else if (msg.content.includes("/deleteLast")) {
				miscCom.deleteLastMessage(msg.channel);
				msg.delete()
				.then(mesg => console.log(`Deleted message from ${mesg.author.username}`))
				.catch(console.error);
			}


			else if (msg.content.includes("/zalgo ")) {
				miscCom.zalgo(msg);
			}
			else if (msg.content.includes("/tell ")) {
				miscCom.tell(msg);
			}
			else if (msg.content.includes("/roll ")) {
				miscCom.roll(msg);
			}
			else if (msg.content.includes("/message ")) {
				dmChan = client.users.find("id", msg.author.id).createDM();
				console.log(msg.author.id);
				dmChan.then(chan => {
					chan.send(msg.content.split("/message ")[1]);
				});
			}

			else if (msg.content.includes("image:")) {
				miscCom.handleImageSearch(msg);
			}

			else if (msg.content == "image xl") {
				var attachment = miscCom.processAttachment(msg.attachments);
				msg.delete();
				imageConvert.convertImage(attachment, msg.channel, imageConvert.leftXFlip);
			}
			else if (msg.content == "image xr") {
				var attachment = miscCom.processAttachment(msg.attachments);
				msg.delete();
				imageConvert.convertImage(attachment, msg.channel, imageConvert.rightXFlip);
			}
			else if (msg.content == "image yt") {
				var attachment = miscCom.processAttachment(msg.attachments);
				msg.delete();
				imageConvert.convertImage(attachment, msg.channel, imageConvert.topYFlip);
			}
			else if (msg.content == "image yb") {
				var attachment = miscCom.processAttachment(msg.attachments);
				msg.delete();
				imageConvert.convertImage(attachment, msg.channel, imageConvert.botYFlip);
			}

			else if (msg.content == "/enhance") {
				miscCom.enhanceImage(msg.channel);
			}

			else if (msg.content.includes("card: ")) {
				
				cardScrape.scrapeCard(msg);
			}

			else if (msg.content.toLowerCase().includes("dude weed")) {

				miscCom.dude(msg);
			}


			else if (msg.content.includes("gun:")) {
				gunScrape.handleGungeonSearch(msg);
			}


			else if (msg.content.includes("monster:")) {
				kiranico.handleMonsterSearch(msg, true);
			}

			else if (msg.content.includes("weapon:")) {
				kiranico.handleWeaponSearch(msg);
			}


			else if (msg.content.includes("drops:")) {
				kiranico.handleMonsterSearch(msg, false);
			}


			else if (msg.content.includes("item:")) {
				kiranico.handleItemSearch(msg);
			}

			else if (msg.content === 'ping') {
				msg.reply('pong');
			}

			else if (msg.content === 'get id') {
				msg.reply(msg.author.id);
			}

			else if (msg.content === 'OH SHIT') {
				miscCom.reply(msg, 'A RAT');
			}


		}
		//If the bot is tagged in the message
		if (msg.mentions.users.get(client.user.id) != null) {

			var attachment = miscCom.processAttachment(msg.attachments);
			var incomingMessage = msg.content.split("> ")[1];
			incomingMessage = incomingMessage.toLowerCase();

			if (incomingMessage.includes("remind me:")) {
				var respond = reminder.remindMeStart(msg.content, msg.author.id, attachment, msg.author.username);
				console.log(msg.author.id);
			}
			else if(incomingMessage.includes("help"))
			{
				msg.reply(miscCom.getHelp());
			}
		}
	}
	catch (error) {
		console.log(error);
		// LASTCHANNEL.send('' + error);
	}
})