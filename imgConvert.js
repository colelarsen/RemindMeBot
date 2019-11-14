
var Jimp = require('jimp');
module.exports.convertImage = convertImage;

function convertImage(imgLink, channel, grey) {
    Jimp.read(imgLink, (err, img) => {
        if (err) throw err;
        var sizeMod = 4;
        var xsize = 8 * sizeMod;
        var ysize = 3 * sizeMod;
        img
            .resize(xsize, ysize)
            .greyscale();

        var arrayToUse;
        if(grey)
        {
            arrayToUse = scaleArray;
        }
        else
        {
            arrayToUse = charArray;
        }

        var s = "";
        for (j = 0; j < ysize; j++) {
            for (i = 0; i < xsize; i++) {
                var color = Jimp.intToRGBA(img.getPixelColour(i, j)).r;
                s += getChar(color, arrayToUse);
            }
            s += "\n";
        }

        channel.send(s);
    });
}


var charArray = new Array(255);
charArray[0] = '#';
charArray[12] = '@'
charArray[25] = '%';
charArray[50] = '&'
charArray[175] = 'X';
charArray[100] = '0';
charArray[125] = 'O';
charArray[150] = 'x';
charArray[175] = 'o';
charArray[200] = '.';
charArray[255] = ' ';

var scaleArray = new Array(255);
scaleArray[63] = '░';
scaleArray[126] = '▒';
scaleArray[189] = '▓';
scaleArray[255] = '█';


function getChar(light, arry) {
    for (ind = light; ind <= 255; ind++) {
        if (arry[ind] != undefined) {
            return arry[ind];
        }
    }
    return arry[0];
}
