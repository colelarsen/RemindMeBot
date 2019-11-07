
const axios = require('axios');

class Reminder {
    constructor(info, timestamp, username, userID, attachment, key) {
        this.info = info;
        this.timestamp = timestamp;
        this.username = username;
        this.userID = userID;
        this.attachment = attachment;
        this.key = key;
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
        let data = await axios.get("http://remindmehome.com/reminders");
        let keys = Object.keys(data.data);
        let reminders = keys.map((key) => {
            let remObj = data.data[key];
            return new Reminder(remObj.info, remObj.timestamp, remObj.username, remObj.userID, remObj.attachment, key);
        });        
        return reminders;
    }
    catch (err) {
        console.log(err);
    }
}

async function storeReminder(reminder) {
    try {
        let response = await axios.post("http://remindmehome.com/reminders", reminder);
        if (response.message == "success") {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        return true;
    }
}

async function deleteReminder(reminder)
{    
    try {
        // console.log(reminder); 
        let url = "http://remindmehome.com/reminders/delete";
        let response = await axios.post(url, reminder);
        if (response.message == "success") {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        // console.log(err);
        
        return true;
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
async function remindMeStart(incomingMessage, userTag, attachment, authorName) {
    try {
        var messageLowerCase = incomingMessage.toLowerCase();
        var split = messageLowerCase.split("remind me: ");

        var timestamp = findTimestamp(split[1].split("@@")[0]);
        var info = incomingMessage.split("@@")[1];
        var username = authorName;
        var userID = "<@" + userTag + ">";
        var reminder = new Reminder(info, timestamp, username, userID, attachment);
        if (attachment.length > 0) {
            reminder.attachment = attachment;
        }
        let result = await storeReminder(reminder);
        if(result){
            return "I will remind you\n" + info.split("\nATTCH")[0] + " \nIn " + timeStyle;
        }
        else {
            // return "Sorry there was an error";
        }
    }
    catch (err) {
        console.log(err.message);
        // return "Sorry there was an error";
    }
}







//Check the time for each entry in storage
async function checkTimes(client) {
    try {
        let reminders = await getAllReminders();
        reminders.forEach((reminder) => {            
            if (Date.now() > reminder.timestamp) {
                let userid = "<@"+reminder.userID+">";
                console.log("REMINDING " + userid);
                client.users.find(userid).createDM();
				dmChan.then(chan => {
                    chan.send(reminder.info);
                    deleteReminder(reminder);
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
        //console.log("String split from date: " + incomingString);
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
            //console.log("Date and adding: " + timestamp);
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
    //console.log(date.getTime());
    return date.getTime();
}
