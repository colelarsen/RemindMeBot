
var Jimp = require('jimp');
const Discord = require('discord.js');
module.exports.convertImage = convertImage;


async function convertImage(imgLink, channel) {
    var image = await Jimp.read(imgLink)
    image = await leftXFlip(image);

    var imgBuf = await image.getBufferAsync(Jimp.AUTO); 
    var discordAttachment = new Discord.Attachment(imgBuf, "img.png");

    channel.send({files: [discordAttachment]});
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
