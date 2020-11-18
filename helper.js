module.exports.react = react;


function react(message, isGood)
{
    if(isGood)
    {
        message.react('✅');
    }
    else
    {
        message.react('❎');
    }
}