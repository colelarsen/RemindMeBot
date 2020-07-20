
var Jimp = require('jimp');
const Discord = require('discord.js');
module.exports.convertImage = convertImage;
module.exports.leftXFlip = leftXFlip; 
module.exports.rightXFlip = rightXFlip;
module.exports.topYFlip = topYFlip;
module.exports.botYFlip = botYFlip;
module.exports.enhance = enhance;


async function convertImage(imgLink, channel, cb) {
    var image = await Jimp.read(imgLink)
    image = await cb(image);

    var imgBuf = await image.getBufferAsync(Jimp.AUTO); 
    var discordAttachment = new Discord.APIMessage(channel, {files: [imgBuf]});

    channel.send(discordAttachment);
}

function leftXFlip(img) {
    var w = img.bitmap.width;
    var h = img.bitmap.height;
    for (x = 0; x < w / 2; x++) {
        for (y = 0; y < h; y++) {
            var color = img.getPixelColour(x, y);
            img.setPixelColour(color, Math.round(w - x), y);
        }
    }
    return img;
}

function rightXFlip(img) {
    var w = img.bitmap.width;
    var h = img.bitmap.height;
    for (x = w - 1; x >= w / 2; x--) {
        for (y = 0; y < h; y++) {
            var color = img.getPixelColour(x, y);
            img.setPixelColour(color, w - x, y);
        }
    }
    return img;
}
function topYFlip(img) {
    var w = img.bitmap.width;
    var h = img.bitmap.height;
    for (x = 0; x < w; x++) {
        for (y = 0; y < h / 2; y++) {
            var color = img.getPixelColour(x, y);
            img.setPixelColour(color, x, Math.round(h - y));
        }
    }
    return img;
}
function botYFlip(img) {
    var w = img.bitmap.width;
    var h = img.bitmap.height;
    for (x = 0; x < w; x++) {
        for (y = w - 1; y >= h / 2; y--) {
            var color = img.getPixelColour(x, y);
            img.setPixelColour(color, x, h - y);
        }
    }
    return img;
}


function enhance(img)
{
    var w = img.bitmap.width;
    var h = img.bitmap.height;



    var w5 = w/5;
    var h5 = h/5;


    var blockW = Math.floor((Math.random() * 5));
    var blockY = Math.floor((Math.random() * 5));

    for(x = blockW*w5; x < w && x < blockW*(w5+1); x++)
    {
        for(y = blockY*h5; y < h && y < blockY*(h5+1); y++)
        {
            var color = img.getPixelColour(x, y);
            img.setPixelColour(color, x, h - y);
        }
	}
    return img;
}
