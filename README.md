# GoogleMeetAPI

A Javascript package for interacting with a Google Meet, using Puppeteer.

- [GitHub Repository](https://github.com/shaunbharat/GoogleMeetAPI)
- [npm Package](https://www.npmjs.com/package/@shaunbharat/google-meet-api)
- [Documentation](https://shaunbharat.github.io/GoogleMeetAPI)

## Features

I have not written documentation for this package, but here is a quick list of some things that can be done with this package.

### Quick List of Features

- Sending Messages
- Reading and Handling Messages
- Handling Member Joins and Leaves
- Toggling Microphone and Video

### Main Functions

```javascript
client.sendMessage();

client.chatEnabled();

client.toggleMic();

client.toggleVideo();
```

### Events

```javascript
client.on('message', () => {});

client.on('memberJoin', () => {});

client.on('memberLeave', () => {});
```

## Install

```bash
npm install @shaunbharat/google-meet-api
```

## Usage

> examples/start.js

```javascript
const { Meet } = require('../meet');
const client = new Meet();

config = { meetingLink: 'https://meet.google.com/xyz-wxyz-xyz', email: '', pw: '' };

async function command(client, message) {
    if (message.content.startsWith("!quote")) {
        await client.sendMessage(`${message.author} said, "${message.content.replace("!quote ", "")}" at ${message.time}`);
    }

}

(async () => {

    await client.once('ready', async () => {
        console.log('ready');
    })

    await client.login(config);

    await client.on('message', async (message) => {
        command(client, message);
    })

    await client.on('memberJoin', async (member) => {
        await client.sendMessage(`Welcome, ${member.name}!`);
    })

    await client.on('memberLeave', async (member) => {
        await client.sendMessage(`Goodbye, ${member.name}!`);
    })

})()

/*
 Async/await syntax is required if you need to execute specific actions with Puppeteer or don't want to be limited to only the events already implemented.
*/

// If errors like "Node is detached" get thrown, restarting almost always fixes most errors
```

## License

Copyright © 2022 [Shaun Bharat](https://github.com/shaunbharat).

This project is licensed with the [MIT](https://github.com/shaunbharat/GoogleMeetAPI/blob/main/LICENSE) license.
