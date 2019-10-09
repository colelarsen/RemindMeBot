const request = require('request');
const cheerio = require('cheerio');
var urlstart = 'https://db.ygoprodeck.com/card/?search=';
const Discord = require('discord.js');

module.exports.scrapeCard = scrapeCard;
//https://www.google.co.in/search?q={searchtext}&source=lnms&tbm=isch

var message;


function scrapeCard(msg)
{
	message = msg;
	userInput = msg.content.split("card: ")[1];
	var u = urlstart + convertCardToUrl(userInput)
	console.log(u);
	imgscrape(userInput, u, sendURL);
}

var image;
function sendURL()
{
	console.log(image);
	message.reply(image);
}



function imgscrape(name, url, cb){
    request(url, (error, resp, html) => {
        if(error)
        {
            cb({
                error: error
            });
        }
        
        let $ = cheerio.load(html);
        let $url = url;
        let $img = $('meta[property="og:image:secure_url"]').attr('content');
        image = $img
	setTimeout(sendURL, 3000);
    }); 

}

stripString = function(inputString)
{
    var j;
    var substitute = "";
    for(j = 0; j < inputString.length; j++)
    {
        if(inputString.charAt(j).match(/[a-z|A-Z|0-9| ]/i))
        {
            substitute += inputString.charAt(j);
        }
    }
    return substitute;
}

//Convert all spaces to '%20'
//Return the card as the url suppliment
function convertCardToUrl(cardName)
{
var cardNameLength = cardName.length;

var j;
var cardAsUrl = "";
for(j = 0; j < cardNameLength; j++)
{
    if(cardName.charAt(j) == ' ')
    {
	cardAsUrl += '%20';
    }
    else
    {
	cardAsUrl += cardName.charAt(j);
    }
}
return cardAsUrl;
}
