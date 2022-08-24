const { Meet } = require('../meet');
const client = new Meet();

config = { meetingLink: 'https://meet.google.com/bzo-ewdm-wga', email: 'juho.meet.bot@gmail.com', pw: 'EjhMCzAPTHH2wPH' };

async function command(client, message) {
    if (message.content.startsWith("!quote")) {
        await client.sendMessage(`${message.author} said, "${message.content.replace("!quote ", "")}" at ${message.time}`);
    }
}

(async () => {

    await client.once('ready', async () => {
        console.log('Ready, let\'s battle');
    })

    await client.login(config);

    await client.sendMessage("I'm here and ready to roll! Just say !start to begin battle >:)");

    await client.on('message', async (message) => {
        command(client, message);
    })

    // await client.on('memberJoin', async (member) => {
    //     await client.sendMessage(`Welcome, ${member.name}!`);
    // })

    // await client.on('memberLeave', async (member) => {
    //     await client.sendMessage(`Goodbye, ${member.name}!`);
    // })

})()

/*
 Async/await syntax is required if you need to execute specific actions with Puppteer or don't want to be limited to only the events already implemented.
*/

// If errors like "Node is detached" get thrown, restarting almost always fixes most errors
