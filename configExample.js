var firebase = require('firebase');

module.exports.getLogon = function () { 
    return "discord logon";
};

var app = firebase.initializeApp({
    apiKey: 'firebase key',
    authDomain: '',
    databaseURL: '',
    projectId: '',
});

module.exports.database = firebase.app().database().ref();
