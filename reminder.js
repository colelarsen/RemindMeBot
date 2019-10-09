var messageChannel = '428950203144470528'; //General
//var messageChannel = '521434157193232392'; //Bot Testing

const Discord = require('discord.js');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const config = require('./config.js');



module.exports.checkTimes = checkTimes;
module.exports.clearReminders = clearReminders;
module.exports.removeReminder = removeReminder;
module.exports.listReminders = listReminders;
module.exports.findDateTimestamp = findDateTimestamp;
module.exports.remindMeStart = remindMeStart;
module.exports.remindFriendStart = remindFriendStart;

module.exports.setLastChannel = setLastChannel;


/*
        -------------------------------------------------
                TOP LEVEL REMINDER COMMANDS
        -------------------------------------------------
*/
var LASTCHANNEL = "";

function setLastChannel(last)
{
    LASTCHANNEL = last;
}

//Clears all reminders
function clearReminders()
{
    localStorage.clear();
    return "All reminders were cleared."
}

function removeReminder(indexString)
{
    var index = (indexString.split("remove reminder ")[1]) - 1;
    localStorage.removeItem(localStorage.key(index));
    return "Removed reminder " + (index+1);
}

//Lists all the reminders
function listReminders()
{
    var response = "";
    var i;
    for(i = 0; i < localStorage.length; i++)
    {
        var inStorage = localStorage.getItem(localStorage.key(i));
        if(inStorage != null)
        {
            console.log("TIMESTAMP IN STORAGE: " + inStorage.split("@@%^$@%&")[0])
            date = new Date(inStorage.split("@@%^$@%&")[0] - 0);

            var info = inStorage.split("@@%^$@%&")[1].split("\nATTCH")[0];
            response += "\n" + (i+1) + ": " + date.toString() + ": " + info;
        }
    }
    return response;
}

//Taken an incoming message and the Author and returns a response
function remindMeStart(incomingMessage, userTag, attachment, authorName)
{
    try{
        var messageLowerCase = incomingMessage.toLowerCase();
        var split = messageLowerCase.split("remind me: ");
        var timeStyle = split[1].split("@@")[0];
        var timestamp = findTimestamp(timeStyle)        
        var info = incomingMessage.split("@@")[1];
        if(attachment.length > 0)
        {
             info += "\nATTCH" + attachment;
        }

        var localLength = localStorage.length;

        localStorage.setItem(localLength, "" + timestamp + "@@%^$@%&" + " <@" + userTag + "> " + info);
        storeData(timestamp, authorName, " <@" + userTag + ">",  info);
	return "I will remind you\n" + info.split("\nATTCH")[0] + " \nIn " + timeStyle;
}
    catch(err) {
        console.log(err.message);
        return "Sorry there was an error";
      }
}

//Remind a friend
function remindFriendStart(incomingMessage, mentions, attachment, authorName)
{
    try {      
        var messageLowerCase = incomingMessage.toLowerCase();
        var split = messageLowerCase.split(": ");
        var timeStyle = split[1].split("@@")[0];
        var info = incomingMessage.split("@@")[1];
        if(attachment.length > 0)
        {
             info += "\nATTCH" + attachment;
        }
        var localLength = localStorage.length;
        var timestamp = findTimestamp(timeStyle)  
        var userTags = "";
	var userNames = "";
        mentions.forEach(element => {
	    if(element.id != client.user.id)
	    {
            	userTags += "<@" + element.id + ">" + " ";
            	userNames += element.username;
            }
	});
        storeData(timestamp, authorName, userNames,  info);
        localStorage.setItem(localLength, "" + timestamp + "@@%^$@%&" + userTags + " " + info);
        return "I will remind " + userTags + "\n" + info.split("\nATTCH")[0] + "\nIn " + timeStyle;
    }
catch(err) {
    console.log(err.message);
    return "Sorry there was an error";
  }
}











/*
        -------------------------------------------------
                LOCAL DATABASE FUNCTIONS
        -------------------------------------------------
*/
//Check the time for each entry in storage
function checkTimes() {
    var i;
    try
	{
			for(i = 0; i < localStorage.length; i++)
			{
				var inStorage = localStorage.getItem(localStorage.key(i));
				if(inStorage != null)
				{
					var array = inStorage.split("@@%^$@%&");
					var timeStamp = array[0];
					var dateInfo = array[1];
					if(Date.now() > timeStamp)
					{
						console.log(timeStamp + ":" + Date.now())
						//Do the reminder
						LASTCHANNEL.send(dateInfo);
						localStorage.removeItem(localStorage.key(i));
						return;
					}
				}
			}
	}
	catch(error)
	{
		LASTCHANNEL.send('' + error);
	}
}




/*
        -------------------------------------------------
                DATABASE FUNCTIONS
        -------------------------------------------------
*/
function storeData(timestamp, username, userID, text)
{
	var dates = config.database.child("reminders");
	dates.push({
	"info" : text,
	"timestamp" : timestamp,
	"username" : username,
	"userID": userID
	})
}





/*
        -------------------------------------------------
                HELPER FUNCTIONS
        -------------------------------------------------
*/
function findTimestamp(incomingStr)
{
    var incomingString = incomingStr;
    var hasDate = false;
    var dateOfHasDate = 0;
    if(incomingString.includes("/"))
    {
        hasDate = true;
        var spitArray = incomingString.split(" ");
        dateOfHasDate = findDateTimestamp(spitArray[0]);
        incomingString = incomingStr.substring(spitArray[0].length+1);
        //console.log("String split from date: " + incomingString);
    }
    try
    {
        var addToTimestamp = 0;
        var timeArray = incomingString.split(" ");
        var i = 0;
        for(i = 0; i < timeArray.length; i = i + 2)
        {
            if(timeArray[i] === "")
            {
                break;
            }
            var number = timeArray[i];
            var timeStyle = timeArray[i+1].toLowerCase();
            if(timeStyle === "sec" || timeStyle === "seconds" || timeStyle === "second" || timeStyle === "secs")
            {
                addToTimestamp += 1000 * number;
            }
            if(timeStyle === "hours" || timeStyle === "hour")
            {
                addToTimestamp += 1000 * number * 60 * 60;
            }
            if(timeStyle === "days" || timeStyle === "day")
            {
                addToTimestamp += 1000 * number * 60 * 60 * 24;
            }
            if(timeStyle === "week" || timeStyle === "weeks")
            {
                addToTimestamp += 1000 * number * 60 * 60 * 24 * 7;
            }
            if(timeStyle === "min" || timeStyle === "mins" || timeStyle === "minutes" || timeStyle === "minute")
            {
                addToTimestamp += 1000 * number * 60;
            }
        }
        
        var timestamp = Date.now() + addToTimestamp;
        if(hasDate)
        {
            timestamp = dateOfHasDate + addToTimestamp;
         //Convert to eastern from coordinated universal   
         timestamp += 1000 * 60 * 60 * 5;
            //console.log("Date and adding: " + timestamp);
        }
        return timestamp;
    }
    catch(err) {
        console.log(err.message);
        return 0;
      }
}
function findDateTimestamp(incomingString)
{
    date = new Date();
    date = Date.parse(incomingString);
    date = new Date(date);
    //console.log(date.getTime());
    return date.getTime();
}
