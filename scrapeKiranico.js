const request = require('request');
const cheerio = require('cheerio');
const Discord = require('discord.js');
const miscCom = require('./MiscCommands.js');

module.exports.monsterScrape = monsterScrape;
module.exports.scrapeKir = scrapeKir;
module.exports.scrapeKirItemList = scrapeKirItemList;
module.exports.handleItemSearch = handleItemSearch;
module.exports.handleMonsterSearch = handleMonsterSearch;
module.exports.setDatabase = setDatabase;
module.exports.setRank = setRank;
module.exports.handleWeaponSearch = handleWeaponSearch;

//https://www.google.co.in/search?q={searchtext}&source=lnms&tbm=isch



var MONDATABASE = 'MHGU';
function setDatabase(data)
{
    MONDATABASE = data;
}
var RANK = "G Rank"
function setRank(rank)
{
    RANK = rank;
}




/*
--------------------------------------------------------------------
    HANDLERS
--------------------------------------------------------------------
*/

//MONSTER SEARCHER
//If monster: search the wiki
//else search kiranico
//
//
//weapon: longsword: 5: Rare X, Purple: affinity, damage
function handleMonsterSearch(mesg, wiki)
{
	var userInput = "";
	if(wiki) userInput = mesg.content.split("monster: ")[1].toLowerCase();
	else userInput = mesg.content.split("drops: ")[1].toLowerCase();

	if(monsterList[userInput] != null) userInput = monsterList[userInput];
	var monster = "";
 	var i = 0;
	for(i = 0; i < userInput.length; i++)
	{
		if(userInput.charAt(i) == ' ')
		{
			monster += "_";
		}
		else
		{
			monster += userInput.charAt(i);
		}	
	}
	userInput = captilaizeFirstOfWord(userInput);
	if(wiki)
	{
		monsterScrape("https://monsterhunter.fandom.com/wiki/" + monster, userInput, mesg);
	}
	else
	{
		scrapeKir("https://" + MONDATABASE + ".kiranico.com/", userInput, mesg);
	}
}



//ITEM SEARCHER
//scrapeKiranico
function handleItemSearch(mesg)
{
	var itemName = mesg.content.split("item: ")[1];
	itemName = captilaizeFirstOfWord(itemName);
	scrapeKirItemList("https://" + MONDATABASE + ".kiranico.com/item", itemName, mesg);
}


//WEAPON SEARCHER
//scrapeKiranico
function handleWeaponSearch(mesg)
{
	var weaponType = mesg.content.split(": ")[1];
	if(weaponType.split(" ").length >= 2)
	{
		weaponType = weaponType.toLowerCase().split(" ")[0] + weaponType.toLowerCase().split(" ")[1];
	}
	
	console.log(weaponType);
	var lengthOfList = msgContent.split(": ")[2];

    var needs = msgContent.split(": ")[3].split(", ");
    var needCount = 0;
    for(needCount = 0; needCount < needs.length; needCount++)
    {
        needs[needCount] = captilaizeFirstOfWord(needs[needCount]);

        if(sorterList[needs[needCount]] != null && sorterList[needs[needCount]] != "")
        {
            needs[needCount] = sorterList[needs[needCount]];
        }
    }
	

	if(msgContent.split(": ").length >= 4)
	{
        var sorts = msgContent.split(": ")[4].split(", ");
		var index = 0;
		for(index = 0; index < sorts.length; index++)
		{
			var sortBy = sorts[index];
			if(sorterList[sortBy] != null && sorterList[sortBy] != "")
			{
				sortBy = sorterList[sortBy];
			}

			if(index == 0)
			{
				sortWeaponBy1 = sortBy;
			}
			else if(index == 1)
			{
				sortWeaponBy2 = sortBy;
			}
			else
			{
				sortWeaponBy3 = sortBy;
			}

		}
		
	}
	console.log(sortWeaponBy1);
	scrapeKirWeapon("https://mhgu.kiranico.com/" + weaponType, needs, lengthOfList, mesg);
}



var sorterList = 
{
	"Thunder": "Thn",
	"Blast": "Bla",
	"Dragon": "Dra",
	"Fire": "Fir",
	"Ice": "Ice",
	"Water": "Wat",
	"Poison": "Psn",
	"Paralyze": "Par",
	"Purple": "purple",
	"White": "white",
	"Blue": "blue",
	"Green": "green",
	"Yellow": "yellow",
    "Red": "red",
	'Affinity': '%'
};






/*
--------------------------------------------------------------------
    SCRAPE MONSTERS WIKI
--------------------------------------------------------------------
*/
function monsterScrape(url, monsterName, mesg)
{
    //Send request
    request(url, (error, resp, html) => {
        if(error)
        {
            cb({
                error: error
            });
        }
        
        let $ = cheerio.load(html);
         var notFound = $('p').filter(function() {
            return $(this).text().trim() === 'What do you want to do?';
          })
	if(notFound.html() === 'What do you want to do?')
	{
		return;
	}

    //Get the icon
	var first = $('div[data-source="Weakest to"] div a.mw-redirect');
	var imageLink = $('td b').filter(function() {
            return $(this).text().trim() === 'Monster Hunter Generations';
          }).parent().parent().next().find('img').attr('data-src');	
        var i = 0;

	if(imageLink == "" || imageLink == null)
	{
		 imageLink = $('td b').filter(function() {
            return $(this).text().trim() === 'Monster Hunter Generations Ultimate';
          }).parent().parent().next().find('img').attr('data-src');
	}
	if(imageLink == "" || imageLink == null)
	{
		 imageLink = $('td b').filter(function() {
            return $(this).text().trim() === 'Monster Hunter 4 Ultimate';
          }).parent().parent().next().find('img').attr('data-src');
	}

	if(imageLink == "" || imageLink == null)
	{
		 imageLink = $('td b').filter(function() {
            return $(this).text().trim() === 'Monster Hunter Generations XX';
          }).parent().parent().next().find('img').attr('data-src');
	}
       
	if(imageLink == "" || imageLink == null)
        {
                 imageLink = $('td b').filter(function() {
            return $(this).text().trim() === 'Monster Hunter: World';
          }).parent().parent().next().find('img').attr('data-src');
        }
	if(imageLink == "" || imageLink == null)
        {	
		imageLink = 'https://i.kym-cdn.com/entries/icons/mobile/000/018/489/nick-young-confused-face-300x256-nqlyaa.jpg';
	}
 

    //Find monster title and species
	var send = "None";
	var title = $('div[data-source="English Title"] div').html();
	var species = $('div[data-source="Monster Type"] div a').html();

    var embed = new Discord.RichEmbed()
	.setColor(3447003)
	.setDescription('[' + monsterName + '](' + url + ')')
	.addField("Title", title)
	.addField("Species", species);
	
	
	for(i = 0; i < first.length; i++)
        {
	    if(i == 0) send = "";
	    send += first[i].attribs["title"] + "\n";
        }
	send += '';
	embed.addField("Weaknesses: ", send);
	embed.setThumbnail(imageLink);
    	miscCom.reply(mesg, embed);    
    }); 
}



/*
--------------------------------------------------------------------
    SCRAPE MONSTERS KIRANICO
--------------------------------------------------------------------
*/
//scrape kiranico main page for monster name and link
function scrapeKir(url, itemName, mesg)
{
    request(url, (error, resp, html) => {
        if(error)
        {
            cb({
                error: error
            });
        }
        let $ = cheerio.load(html);
        var imageLink = $('a:contains("' + itemName + '")').attr("href");  
        if(imageLink != "" && imageLink != undefined) scrapeKirMon(imageLink, RANK, itemName, mesg);
    }); 
}

//scrape go to link and find all the drops
function scrapeKirMon(url, rank, monName, mesg)
{
    request(url, (error, resp, html) => {
        if(error)
        {
            cb({
                error: error
            });
        }
        let $ = cheerio.load(html);
        var HEADERSNOTUNIFORM = cleanTable($('h6:contains("' + rank + '")').next("table").find("tr td[rowspan]").text(), true);
        var headers = HEADERSNOTUNIFORM.split(' ,');
        headers[0] = headers[0].substring(1, headers[0].length);
        headers[headers.length-1] = headers[headers.length-1].substring(0, headers[headers.length-1].length-1);
        

        var tableItems = $('h6:contains("' + rank + '")').next("table").find("tr").text();
        var tables = [];
        var i = 0;
        for(i = 0; i < headers.length-1; i++)
        {
            tables.push(cleanTable(tableItems.split(headers[i])[1].split(headers[i+1])[0], false).split('% '));
        }
        tables.push(cleanTable(tableItems.split(headers[headers.length-1])[1], false).split('% '));
	
        var embed = new Discord.RichEmbed()
	.setTitle(monName)
	.setColor(3447003)
	
	var links = [];	
	var a = $('h6:contains("' + rank + '")').next("table").find("a");
        $(a).each(function(i, a){
            links.push($(a).attr('href'));
          });



	var desc = "";

	i = 0;
	var j = 0;
	var totalLinks = 0;
	for(i = 0; i < headers.length; i++)
	{
		desc += headers[i] + "\n";
		for(j = 0; j < tables[i].length; j++)
		{
			if(tables[i][j] != '')
			{
				 desc += '[' + tables[i][j] + '%](' + links[totalLinks] + ')\n';
				totalLinks++;
			}
		}
		desc += "\n\n";
    }
    desc = desc.substring(0, 2047);
	embed.setDescription(desc);

		
	miscCom.reply(mesg, embed);    
    }); 
}










/*
--------------------------------------------------------------------
    SCRAPE ITEMS
--------------------------------------------------------------------
*/

//Scrape item page for item link
function scrapeKirItemList(url, itemName, mesg)
{
    request(url, (error, resp, html) => {
        if(error)
        {
            cb({
                error: error
            });
        }
        let $ = cheerio.load(html);
        var itemLink = $('a:contains("' + itemName + '")').attr("href");  
        if(itemLink != "" && itemLink != undefined) scrapeKirItem(itemLink, itemName, mesg);
    }); 
}

//Scrape item page for where to do percentages
function scrapeKirItem(url, itemName, mesg)
{
    request(url, (error, resp, html) => {
        if(error)
        {
            cb({
                error: error
            });
        }
        let $ = cheerio.load(html);

        var table = $('h5');
        var tables = [];

        $(table).each(function(i, table){
            var tableEntry = [];
            var rows = $(table).next().find("tr");
            if($(table).html() != "Weapon" && $(table).html() != "Armor" && $(table).html() != "Hunters for Hire" && $(table).html() != "Palico")
            { 
			tableEntry.push($(table).html());
			$(rows).each(function(i, row){

			var tds = $(row).find("td");
			var rowText = "";
			$(tds).each(function(i, tds){
			    if($(tds).html().startsWith("<a"))
			    {
				rowText += " [" + $(tds).children().first().text() + "](" + $(tds).children().first().attr("href") + ")";
			    }
			    else
			    {
				rowText += " " + $(tds).text();
			    }
			    rowText = cleanTable(rowText, false);
			});
			tableEntry.push(rowText);
			
		    	});
		    	tables.push(tableEntry);
	    }
          });
        

	var embed = new Discord.RichEmbed()
	.setTitle(itemName)
	.setColor(3447003)
    	var desc = "";
	for(i = 0; i < tables.length; i++)
	{
		desc += tables[i][0] + "\n";
		for(j = 1; j < 7 && j < tables[i].length; j++)
		{
			if(tables[i][j] != '')
			{
				desc += tables[i][j] + "\n";
			}
		}
		desc += "\n\n";
	}
	desc = desc.substring(0, 2047);
	embed.setDescription(desc);
	miscCom.reply(mesg, embed);    

}); 
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




/*
--------------------------------------------
			SCRAPE KIR WEAPONS
--------------------------------------------
*/

function filterWeapon(rows, needs)
{
    let $ = cheerio.load(rows);
    var weaponRows
        if(needs == "purple" || needs == "white" || needs == "blue" || needs == "green" || needs == "yellow")
		{
			weaponRows = $(rows).find('td div:first-child span.' + needs).filter(function() {
				return !($(this).css("width").startsWith("0px"));
		     }).parents('tr');
			
        }
        else
        {
            weaponRows = $(rows).find('small').filter(function() {
                var newText = cleanTable($(this).text());
                return newText.indexOf(needs) > -1;
            }).parents('tr');
        }
    return weaponRows;
}

function scrapeKirWeapon(url, needs, lengthOfList, mesg)
{
    request(url, (error, resp, html) => {
        if(error)
        {
            cb({
                error: error
            });
        }

        let $ = cheerio.load(html);
        
        var weaponRows =  $('tr');
        var needCount = 0;
        for(needCount = 0; needCount < needs.length; needCount++)
        {
            weaponRows = filterWeapon(weaponRows, needs[needCount]);
        }
        
        
          
          console.log(needs);
          console.log(weaponRows.length);
          
          


        var weapons = [];
        //GRAB ALL WEAPONS
        $(weaponRows).each(function(i, weaponRow){
            if($(weaponRow).find("td").length > 1)
            {
                var weaponSpecs = {};
                $(weaponRow).find('td').each(function(i, weaponSpecRow){
                    if($(weaponSpecRow).find('div.sharpness-bar').length > 1)
                    {
						var lastSharp = "red";
						weaponSpecs["sharp"] = "purple";
                        $(weaponSpecRow).find('div.sharpness-bar').first().find('span').each(function(j, sharpness){
                            var sharp = $(sharpness).css("width");
                            if(sharp == "0px")
                            {
                                weaponSpecs["sharp"] = lastSharp;
                            }
                            else
                            {
                                lastSharp = $(sharpness).attr('class');
                            }
                        });
                    }
                    else
                    {
                        var text = cleanTable($(weaponSpecRow).text());
                        if(text.charAt(text.length-1) == " ")
                        {
                            text = text.substring(0, text.length-1);
                        }




                        if(i == 0)
                        {
                            weaponSpecs["title"] = text;
                            weaponSpecs["link"] = $(weaponRow).prevAll().find('a').attr("href");
                        }
                        else if(i == 1)
                        {
                            weaponSpecs["damage"] = text;
                        }
                        else if(text == "―――" )
                        {
                            weaponSpecs["slots"] = "0 Slots";
                        }
                        else if(text == "◯――" )
                        {
                            weaponSpecs["slots"] = "1 Slot";
                        }
                        else if(text == "◯◯―" )
                        {
                            weaponSpecs["slots"] = "2 Slots";
                        }
                        else if(text == "◯◯◯" )
                        {
                            weaponSpecs["slots"] = "3 Slots";
                        }
                        else
                        {
                            
							if(text.startsWith("Normal") || text.startsWith("Wide") || text.startsWith("Long"))
							{
								weaponSpecs["shot"] = text;
							}
							else if(text.startsWith("Rare"))
                            {
                                weaponSpecs["rare"] = text;
                            }
                            else if(text.startsWith("Nrm"))
                            {
                                weaponSpecs["bowgunAmmo"] = text;
                            }
                            //Must be The percent element def table
                            else if((text.indexOf("Def+") != -1 || text.indexOf("%") != -1)) 
                            {
                                var tSplit = text.split(" ");
                                var sNum = 0;
                                for(sNum = 0; sNum < text.split(" ").length; sNum++)
                                {
                                    if(tSplit[sNum] != undefined)
                                    {
                                        if(tSplit[sNum].endsWith("%"))
                                        {
                                            weaponSpecs["affinity"] = tSplit[sNum];
                                        }
                                        else if(tSplit[sNum].startsWith("Def"))
                                        {
                                            weaponSpecs["def"] = tSplit[sNum];
                                        }
                                        else if(tSplit[sNum] != "undefined")
                                        {
                                            weaponSpecs["element"] += tSplit[sNum] + " ";
                                        }
                                    }
                                }

                                if(weaponSpecs["element"] == undefined)
                                {
                                    weaponSpecs["element"] = "No Element";
                                }
                                if(weaponSpecs["affinity"] == undefined)
                                {
                                    weaponSpecs["affinity"] = "0%";
                                }
                                if(weaponSpecs["def"] == undefined)
                                {
                                    weaponSpecs["def"] = "Def+0";
                                }
                            }
                            else
                            {
                                weaponSpecs["other"] += "\n" + text;
                            }
                        }
                    }
                });
            }
            if(weaponSpecs != undefined)
            {
                weapons.push(weaponSpecs);
            }
            else
            {
                return;
            }
            //console.log(weaponSpecs);

        });
        //console.log("a");
		weapons = weapons.sort(compare);
		
		
		
		var embed = new Discord.RichEmbed()
		.setTitle("Weapons")
		.setColor(3447003)

		var desc = "";
		var wep = 0;
		if(weapons.length < lengthOfList)
		{
			lengthOfList = weapons.length;
			if(weapons.length == 0)
			{
				desc = "No Weapons match your criteria";
			}
		}
		for(wep = 0; wep < lengthOfList; wep++)
		{
            desc += "[" + weapons[wep]["title"] + "](" + weapons[wep]["link"] + ")\n"
            
            
			desc +=  weapons[wep]["damage"] + "\n"
			if(weapons[wep]["element"] != undefined)
			{
				desc += "Element: " + weapons[wep]["element"] + "\n"
            }
            if(weapons[wep]["affinity"] != undefined)
			{
				desc +=  "Affinity: " + weapons[wep]["affinity"] + "\n"
            }
            if(weapons[wep]["sharp"] != undefined)
			{
				desc +=  "Sharpness: " +weapons[wep]["sharp"] + "\n"
			}
			if(weapons[wep]["shot"] != undefined)
			{
				desc +=  weapons[wep]["shot"] + "\n"
            }
            if(weapons[wep]["bowgunAmmo"] != undefined)
			{
				desc +=  "\nBowgun Ammo: " + weapons[wep]["bowgunAmmo"] + "\n\n"
            }
            if(weapons[wep]["other"] != undefined)
			{
				desc +=  weapons[wep]["other"] + "\n"
			}
			desc +=  weapons[wep]["slots"] + "\n"
			desc +=  weapons[wep]["rare"] + "\n"

			desc += "\n\n";
        }
        
        var otherS = desc.split("undefined");
        var undefCount = 0;
        desc = "";
        for(undefCount = 0; undefCount < otherS.length; undefCount++)
        {
            if(otherS[undefCount] != undefined) desc += otherS[undefCount] + " ";
        }

		embed.setDescription(desc);
		miscCom.reply(mesg, embed);
		
    });
}

var sortWeaponBy1 = "damage";
var sortWeaponBy2 = "element";
var sortWeaponBy3 = "affinity";

function compare(a, b)
{
    var comp = trueCompare(a, b, sortWeaponBy1);
    if(comp == 0)
    {
        comp = trueCompare(a, b, sortWeaponBy2);
    }
    if(comp == 0)
    {
        comp = trueCompare(a, b, sortWeaponBy3);
    }
    return comp;
}

function trueCompare(a, b, sortBy)
{
    var comp = 0;
    if(sortBy == "damage")
    {
        if(a[sortBy]*1 < b[sortBy]*1)
        {
            comp = -1;
        }
        else if(!(a[sortBy]*1 < b[sortBy]*1))
        {
            comp = 1;
        }
    }
    else if(sortBy == "element" || sortBy == "shot")
    {
        var ap = a[sortBy].split(" ")[1];
        var bp = b[sortBy].split(" ")[1];
        if(ap*1 < bp*1)
        {
            comp = -1;
        }
        else if(ap*1 > bp*1)
        {
            comp = 1;
        }
	}
	else if(sortBy == "sharpness" || sortBy == "Sharpness")
    {
        var ap = sharpList[a[sortBy]];
		var bp = sharpList[b[sortBy]];
		if(ap*1 < bp*1)
        {
            comp = -1;
        }
        else if(ap*1 > bp*1)
        {
            comp = 1;
        }
	}
	else if(sortBy == "slot")
    {
        var ap = a[sortBy].split(" ")[0];
        var bp = b[sortBy].split(" ")[0];
        if(ap*1 < bp*1)
        {
            comp = -1;
        }
        else if(ap*1 > bp*1)
        {
            comp = 1;
        }
    }
    else if(sortBy == "affinity")
    {
        var ap = a[sortBy].substring(0, a[sortBy].length-1);
        var bp = b[sortBy].substring(0, b[sortBy].length-1);
        if(ap*1 < bp*1)
        {
            comp = -1;
        }
        else if(ap*1 > bp*1)
        {
            comp = 1;
        }
	}
	comp = comp*-1;
    return comp;
}
var sharpList = 
{
	"purple": 10,
	'white': 9,
	'blue': 8,
	'green': 7,
	'yellow': 6,
	'orange': 5,
	'red': 4
};











/*
------------------------------------------
    STRING FORMATTERS
------------------------------------------
*/
//Removes all /n and spaces
//Keeps 1 space if the last char was a letter
function cleanTable(table, headers)
{
    var order = "";
    var lastWasChar = false;
    for(i = 0; i < table.length; i++)
    {
        if(table.charAt(i) != "\n" && table.charAt(i) != " ")
        {
            order += table.charAt(i);
            lastWasChar = true;
        }
        else if(lastWasChar && table.charAt(i) != '\n')
        {
            order += table.charAt(i);
            lastWasChar = false;
        }
        else if(table.charAt(i) == '\n' && !lastWasChar && headers)
        {
            order += ",";
        }
        
    }
    return order;
}



/*
-----------------------------------------
        MONSTER SHORTCUTS
-----------------------------------------
*/

var monsterList = 
{
	"lao": "Lao-Shan Lung",
	'dreadking': 'Dreadking Rathalos',
	'deviant rathalos': 'Dreadking Rathalos',
	'dreadqueen': 'Dreadqueen Rathian',
	'deviant rathian': 'Dreadking Rathalos',
	'soulseer': 'Soulseer Mizutsune',
	'deviant mizutsune': 'Soulseer Mizutsune',
	'tama': "Mizutsune",
	'deviant tama': 'Soulseer Mizutsune',
	'elderfrost': 'Elderfrost Gammoth',
	'deviant gammoth': 'Elderfrost Gammoth',
	'boltreaver': 'Boltreaver Astalos',
	'deviant astalos': 'Boltreaver Astalos',
	'rustrazor': 'Rustrazor Ceanataur',
	'deviant shogun': 'Rustrazor Ceanataur',
	'deviant sharp crab': 'Rustrazor Ceanataur',
	'redhelm': 'Redhelm Arzuros',
	'deviant arzuros': 'Redhelm Arzuros',
	'snowbaron': 'Snowbaron Lagombi',
	'deviant lagombi': 'Snowbaron Lagombi',
	'hellblade': 'Hellblade Glavenus',
	'deviant glavenus': 'Hellblade Glavenus',
	'silverwind': 'Silverwind Nargacuga',
	'deviant nargacuga': 'Silverwind Nargacuga',
	'drilltusk': 'Drilltusk Tetsucabra',
	'deviant tetsu': 'Drilltusk Tetsucabra',
	'tetsucabra': 'Tetsucabra',
	'deviant tetsucabra': 'Drilltusk Tetsucabra',
	'grimclaw': 'Grimclaw Tigrex',
	'deviant tigrex': 'Grimclaw Tigrex',
	'nightcloak': 'Nightcloak Malfestio',
	'deviant malfestio': 'Nightcloak Malfestio',
	'crystalbeard': 'Crystalbeard Uragaan',
	'deviant uragaan': 'Crystalbeard Uragaan',
	'deadeye': 'Deadeye Yian Garuga',
	'deviant garuga': 'Deadeye Yian Garuga',
	'deviant yian garuga': 'Deadeye Yian Garuga',
	'thunderlord': 'Thunderlord Zinogre',
	'deviant zinogre': 'Thunderlord Zinogre',
	'bloodbath': 'Bloodbath Diablos',
	'deviant diablos': 'Bloodbath Diablos',
	'raging': 'raging brachydios',
	'steve': 'seregios',
	'furious': 'Furious Rajang',
	'crab': 'Daimyo Hermitaur',
	'sharp crab': 'Shogun Ceanataur',
	'deviant crab': 'Stonefist Hermitaur',
	'stonefist': 'Stonefist Hermitaur'
};
