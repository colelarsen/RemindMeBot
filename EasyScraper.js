const request = require('request');
const cheerio = require('cheerio');
const config = require('./config.js');
const fs = require('fs');


module.exports.getPage = getPage;
module.exports.easyGet = easyGet;

function getPage(url, cb)   {
    request(url, (error, resp, html) => {
        if(error)
        {
            cb({
                error: error
            });
        }
        cb(html);
    }); 
}

function easyGet(id, get, html){
        let $ = cheerio.load(html);
        //let $img = $('meta[property="og:image:secure_url"]').attr('content');
        var val = "";
        if(get == 'text')
        {
            val = $(id).text();
        }
        return val;
}