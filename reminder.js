
const axios = require('axios');
const config = require('./config.js');
const helper = require('./helper.js');
const miscCom = require('./MiscCommands');

class Reminder {
    constructor(info, timestamp, username, userID, attachment, successMessage, failureMessage, authKey, ownerUsername, isPrivate) {
        this.info = info;
        this.timestamp = timestamp;
        this.username = username;
        this.userID = userID;
        this.attachment = attachment;
        this.authKey = authKey,
        this.ownerUsername = ownerUsername;
        this.successMessage = successMessage;
        this.failureMessage = failureMessage;
        this.isPrivate = isPrivate;
    }
}



module.exports.checkTimes = checkTimes;
module.exports.listReminders = listReminders;
module.exports.findDateTimestamp = findDateTimestamp;
module.exports.remindMeStart = remindMeStart;
module.exports.setLastChannel = setLastChannel;


/*
        -------------------------------------------------
                TOP LEVEL REMINDER COMMANDS
        -------------------------------------------------
*/
var LASTCHANNEL = "";

function setLastChannel(last) {
    LASTCHANNEL = last;
}

// http://remindmehome.com/reminders

async function getAllReminders() {
    try {
        let data = await axios.get("http://remindmehome.com/reminders/current-reminders/");
        let reminders = data.data.map((remObj) => {
            return new Reminder(remObj.info, remObj.timestamp, remObj.username, remObj.userID, remObj.attachment, remObj.id, "", "", remObj.authKey, remObj.ownerUsername, false);
        });
        await sleep(10000);
        // console.log(reminders);
        return reminders;
    }
    catch (err) {
        console.log(err);
    }
}
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function storeReminder(reminder, message) {
    try {
        let response = await axios.post("http://remindmehome.com/reminders/reminderbotpost/", reminder);
        try
        {
            if(response.data.successMessage == 'Successfully added!') helper.react(message, true);
            else
            {
                helper.react(message, false);
            }
            
        }
        catch(e)
        {
            helper.react(message, false);
        }
        
        //console.log(response);
    }
    catch (err) {
        console.log(err);
        helper.react(message, false);
    }
}

//Lists all the reminders
async function listReminders() {
    var response = "";
    var reminders = await getAllReminders();
    reminders.forEach((reminder) => {
        var date = new Date(reminder.timestamp);
        var info = reminder.info;
        response += "\n" + date.toString() + ": " + info;
    });
    return response;
}


//Taken an incoming message and the Author and returns a response
function remindMeStart(incomingMessage, userID, attachment, username, messageObj) {
    try {
        var messageLowerCase = incomingMessage.toLowerCase();
        var split = "";
        if (incomingMessage.startsWith("/remind "))
        {
            split = messageLowerCase.split("/remind ")[1];
        }
        else if(incomingMessage.startsWith("/r "))
        {
            split = messageLowerCase.split("/r ")[1];
        }

        
        var timestamp = findTimestamp(split.split("[")[1].slice(0, split.split("[")[1].length-1));
        var info = split.split("[")[0];


        var reminder = new Reminder(info, timestamp, username, userID, attachment, "", "", "", "", "", false);
        if (attachment.length > 0) {
            reminder.attachment = attachment;
        }
        storeReminder(reminder, messageObj);
    }
    catch (err) {
        console.log(err);
        // return "Sorry there was an error";
    }
}







//Check the time for each entry in storage
async function checkTimes(client) {
    try {
        let reminders = await getAllReminders();
        reminders.forEach(async (reminder) => {
            if (Date.now() > reminder.timestamp) {
                console.log(reminder);
                let userid = reminder.userID;
                
                var user = await client.users.fetch(userid);

                console.log("USER: " + user.id);

                var dmChan = user.createDM();
                dmChan.then(chan => {
                    if(reminder.attachment != undefined && reminder.attachment.length > 0)
                    {
                        chan.send(reminder.info, {files: [reminder.attachment]});
                    }
                    else
                    {
                        chan.send(reminder.info);
                    }
                });
            }
        });
    }
    catch (error) {
        // LASTCHANNEL.send('' + error);
    }
}



/*
        -------------------------------------------------
                HELPER FUNCTIONS
        -------------------------------------------------
*/
function findTimestamp(incomingStr) {
    var incomingString = incomingStr;
    var hasDate = false;
    var dateOfHasDate = 0;
    if (incomingString.includes("/")) {
        hasDate = true;
        var spitArray = incomingString.split(" ");
        dateOfHasDate = findDateTimestamp(spitArray[0]);
        incomingString = incomingStr.substring(spitArray[0].length + 1);
    }
    try {
        var addToTimestamp = 0;
        var timeArray = incomingString.split(" ");
        var i = 0;
        for (i = 0; i < timeArray.length; i = i + 2) {
            if (timeArray[i] === "") {
                break;
            }
            var number = timeArray[i];
            var timeStyle = timeArray[i + 1].toLowerCase();
            if (timeStyle === "sec" || timeStyle === "seconds" || timeStyle === "second" || timeStyle === "secs") {
                addToTimestamp += 1000 * number;
            }
            if (timeStyle === "hours" || timeStyle === "hour") {
                addToTimestamp += 1000 * number * 60 * 60;
            }
            if (timeStyle === "days" || timeStyle === "day") {
                addToTimestamp += 1000 * number * 60 * 60 * 24;
            }
            if (timeStyle === "week" || timeStyle === "weeks") {
                addToTimestamp += 1000 * number * 60 * 60 * 24 * 7;
            }
            if (timeStyle === "min" || timeStyle === "mins" || timeStyle === "minutes" || timeStyle === "minute") {
                addToTimestamp += 1000 * number * 60;
            }
        }

        var timestamp = Date.now() + addToTimestamp;
        if (hasDate) {
            timestamp = dateOfHasDate + addToTimestamp;
            //Convert to eastern from coordinated universal   
            timestamp += 1000 * 60 * 60 * 5;
        }
        return timestamp;
    }
    catch (err) {
        console.log(err.message);
        return 0;
    }
}
function findDateTimestamp(incomingString) {
    date = new Date();
    date = Date.parse(incomingString);
    date = new Date(date);
    return date.getTime();
}
