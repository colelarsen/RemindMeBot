const miscCom = require('./MiscCommands.js');
const scraper = require('./EasyScraper');
const Discord = require('discord.js');

module.exports.handleGungeonSearch = handleGungeonSearch; 
module.exports.setLastChannel = setLastChannel;

var LASTCHANNEL = 0;
function setLastChannel(last)
{
    LASTCHANNEL = last;
}
/*
--------------------------------------------------------------------
    HANDLERS
--------------------------------------------------------------------
*/

//Gungeon Searcher
function handleGungeonSearch(content)
{
    var gun = "";
    var userInput = content.split("gun: ")[1];
    userInput = captilaizeFirstOfWord(userInput);
    curGun = userInput;
    for(i = 0; i < userInput.length; i++)
	{
		if(userInput.charAt(i) == ' ')
		{
			gun += "_";
		}
		else
		{
			gun += userInput.charAt(i);
		}	
	}

    scraper.getPage('https://enterthegungeon.gamepedia.com/' + userInput, getSynergies);
}

//Capitalizes the first letter of every word
function captilaizeFirstOfWord(string) 
{
	var i = 0;
	var newS = "";
	var lastSpace = true;
	for(i = 0; i < string.length; i++)
	{
		if(lastSpace)
		{
			newS += string[i].toUpperCase();
			lastSpace = false;
		}
		else
		{
			newS += string[i];
			if(string[i] == ' ' || string[i] == '-') lastSpace = true;
		}
	}
	return newS
}

function getSynergies(html)
{
    var effects = scraper.easyGet('h2:contains("Effects") + ul', 'text', html);
	var synergies2 = scraper.easyGet('h2:contains("Notes") + ul:contains(" - ")', 'text', html).split('\n');
    //console.log(synergies2);
    var synergies = [];
    for(syn in synergies2)
    {
        if(synergies2[syn].includes(' - '))
        {
            synergies.push(synergies2[syn]);
        }
    }
    embedSynergies(effects, synergies);
}

var curGun = "";
function embedSynergies(effects, synergies)
{
    var embed = new Discord.RichEmbed()
	.setTitle(curGun)
	.setColor(3447003)
    var desc = "";
    
    /*
    "fields": [
      {
        "name": "🤔",
        "value": "some of these properties have certain limits..."
      },
      {
        "name": "😱",
        "value": "try exceeding some of them!"
      },
      {
        "name": "🙄",
        "value": "an informative error should show up, and this view will remain as-is until all issues are fixed"
      },
      {
        "name": "<:thonkang:219069250692841473>",
        "value": "these last two",
        "inline": true
      },
      {
        "name": "<:thonkang:219069250692841473>",
        "value": "are inline fields",
        "inline": true
      }
    ]
    */
    
    var fields = [];
    for(i = 0; i < synergies.length; i++)
	{
        var object = {
            "name": synergies[i].split(' - ')[0],
            "value": synergies[i].split(' - ')[1]
        };
		fields.push(object);
    }
    
	
    embed.fields = fields;
    if(effects.length > 0)
    {
        embed.description = effects;
    }
	LASTCHANNEL.send(embed);    
}
