const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const kiranico = require('./scrapeKiranico.js');
const reminder = require('./reminder.js');
const miscCom = require('./MiscCommands.js');
const gunScrape = require('./scrapeGungeon');
const imageConvert = require('./imgConvert');
const cardScrape = require('./scrapeYugioh.js');


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
				miscCom.reply(msg, "i love reisen");
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

			else if (msg.content.includes("spoiler:")) {
				miscCom.deleteLastMessage();
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
				var attachment = processAttachment(msg.attachments);
				msg.delete();
				imageConvert.convertImage(attachment, LASTCHANNEL, imageConvert.leftXFlip);
			}
			else if (msg.content == "image xr") {
				var attachment = processAttachment(msg.attachments);
				msg.delete();
				imageConvert.convertImage(attachment, LASTCHANNEL, imageConvert.rightXFlip);
			}
			else if (msg.content == "image yt") {
				var attachment = processAttachment(msg.attachments);
				msg.delete();
				imageConvert.convertImage(attachment, LASTCHANNEL, imageConvert.topYFlip);
			}
			else if (msg.content == "image yb") {
				var attachment = processAttachment(msg.attachments);
				msg.delete();
				imageConvert.convertImage(attachment, LASTCHANNEL, imageConvert.botYFlip);
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

			var attachment = processAttachment(msg.attachments);
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

function processAttachment(attachmentCollection) {
	var attachment = attachmentCollection.first();
	if (attachment != null) {
		return attachment.url;
	}
	return "";
}

