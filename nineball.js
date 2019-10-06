const Eris = require("eris");
const bot = new Eris("");

const channelId = "574552831793692672"; //#ping-log

// moderator ids are collected because sometimes users will
// ping individual moderators rather than ping @Moderators
const modIds = [
    "109182240314912768", //Orangespire
    "201792847475638272", //Rasea
    "160648230781059073", //Storm Eagle
	"166346089761341451", //Desu
	"134118575525855232", //Ryan
    "260559519166365696", //Fupe
    "133303758854684672", //Grumpy
    "296772000800571393", //Lawns
    "137123044752621569", //MikeyRay
    "192890080212418560", //Emahusay
    "365187808580730881", //Shira
	"402980593723375626", //Edo
    "254403951015886848", //T3RRA
    "367322212233117697", //Unix
    "245462703571861504", //Xiniox
	"320942730039787521", //Osetor74
	"537307941699715072", //TheLostFridge
	"452233019105869834", //Pirek
    "149638052606640128", //Ytiev
	"587204985331253259", //Top_Situation
    "284015861440708618"  //IceMagma
];

const modRoleId = "562095691053400084"; //@Moderators
// checks if the message isn't from the bot itself and not
// from a private message
bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (!msg.channel.guild) return;
    const modPings = msg.mentions.filter(user => {
        return modIds.includes(user.id);
    });
    // modPings is referring to the array of mod IDs and
	// making a message if there are two or more moderator pings
    if ((modPings.length >= 2) || (msg.roleMentions.includes(modRoleId))){
        const guild = msg.channel.guild;
		const previousMessages = await msg.channel.getMessages(5, msg.id);
		previousMessages.sort((a, b) => a.id > b.id ? 1 : -1);
		
		var pmZero = false; //multiple bools used to prevent the flooding of #ping-log due to reports of spam
		var pmOne = false; //each bool represents one of the five messages pulled above for context to moderators
		var pmTwo = false;
		var pmThree = false;
		var pmFour = false;
		
		if (previousMessages[0].content.length > 375) // will not log messages with over 375 characters to
			pmZero = true;                            // prevent hitting the 2000 character limit discord has 
		if (previousMessages[1].content.length > 375)
			pmOne = true;
		if (previousMessages[2].content.length > 375)
			pmTwo = true;
		if (previousMessages[3].content.length > 375)
			pmThree = true;
		if (previousMessages[4].content.length > 375)
			pmFour = true;
		
		// show the message in question and url to the message
		// that pings the moderators 
		guild.channels.get(channelId).createMessage({
			embed: {
				"description": `__In channel__: ${msg.channel.mention} --- [MESSAGE LINK HERE](https://discordapp.com/channels/${guild.id}/${msg.channel.id}/${msg.id})`,
				"color": 8652567,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Hustler One"
				},
				"fields": [ 
					{
					"name": `**${previousMessages[0].author.username}#${previousMessages[0].author.discriminator}:**`,
					"value": `${pmZero ? "This message was too long to show. Likely spam." : previousMessages[0].cleanContent}`
					}, 
					{
					"name": `**${previousMessages[1].author.username}#${previousMessages[1].author.discriminator}:**`,
					"value": `${pmOne ? "This message was too long to show. Likely spam." : previousMessages[1].cleanContent}`
					},
					{
					"name": `**${previousMessages[2].author.username}#${previousMessages[2].author.discriminator}:**`,
					"value": `${pmTwo ? "This message was too long to show. Likely spam." : previousMessages[2].cleanContent}`
					},
					{
					"name": `**${previousMessages[3].author.username}#${previousMessages[3].author.discriminator}:**`,
					"value": `${pmThree ? "This message was too long to show. Likely spam." : previousMessages[3].cleanContent}`
					},
					{
					"name": `**${previousMessages[4].author.username}#${previousMessages[4].author.discriminator}:**`,
					"value": `${pmFour ? "This message was too long to show. Likely spam." : previousMessages[4].cleanContent}`
					},
					{
					"name": `**${msg.author.username}#${msg.author.discriminator}:**`,
					"value": `${msg.cleanContent}`
					}
				]}
			});
	}
});

bot.connect();