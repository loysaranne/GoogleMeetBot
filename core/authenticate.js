// Main initializing function

// Only logs in, however we can skip this by just waiting for the chat button or the leave meeting button. Then signing in can be done manually with headless mode disabled, and the package just automates the other stuff
async function auth({ meetingLink, email, pw }) {

    if (!meetingLink.startsWith("https://meet.google.com/")) {throw("Meeting Link isn't valid. Make sure it looks like 'https://meet.google.com/xyz-wxyz-xyz'!");}
    if (!email.endsWith("@gmail.com")) {throw("Email isn't a Google Account");}

    this.meetingLink = meetingLink; this.email = email;
    this.browser = await this.puppeteer.launch({ headless: this.headless });
    this.page = await this.browser.newPage();
    this.ctx = await this.browser.defaultBrowserContext(); await this.ctx.overridePermissions('https://meet.google.com', ['microphone', 'camera', 'notifications']);
    await this.page.goto(meetingLink);
    // Authenticating with credentials
    console.log("Logging in...")
    try {
        var signInButton = await this.page.waitForSelector('.NPEfkd', { visible: true, timeout: 10000 }); await signInButton.focus(); await signInButton.click();
    } catch (e) {
        console.log(e)
        // Sign In button is not visible, so we assume the page has already redirected, and is not accepting anonymous meeting members - Support for anonymous joining may be implemented in the future
    }
    var input = await this.page.waitForSelector('input[type=email]', { visible: true, timeout: 0 }); await input.focus();
    await this.page.keyboard.type(email);
    await this.page.keyboard.press('Enter');
    var input = await this.page.waitForSelector('input[type=password]', { visible: true, timeout: 0 }); await input.focus();
    await this.page.keyboard.type(pw);
    await this.page.keyboard.press('Enter');
    console.log("Authenticated successfully!");
    await this.screenshot('logged-in.png'); // Double check that the meet is about to be joined to. Quickest way to make sure that there aren't any prompts (Like Google's "confirm recovery email" prompt), that can leave the browser hanging.
    // Although you can edit the package's code to fit your scenario, the easiest way to fix anything that leaves this program hanging, is to just run the package without headless mode. That way you can continue on any prompts or see issues fast.
    // Join Google Meet
    const join = await this.page.waitForXPath(
        '//*[contains(@jsname, "V67aGc")][contains(text(), "Pyydä saada liittyä") or contains(text(), "Liity nyt")]',
        { visible: true, timeout: 0 })
    // var button = await this.page.waitForSelector('[jsname="Qx7uuf"]', { visible: true, timeout: 0 });
    // await this.screenshot('ready-to-join.png');
    // var join = await button.waitForSelector('[jsname="V67aGc"]', { visible: true, timeout: 0 });
    // // for (var i = 3; i > 0; i--) {await this.toggleMic(this.page); await this.toggleVideo(this.page);} // toggle mic and video 3 times because Google Meet glitches and leaves mic on if it's toggled as soon as page loads
    await this.screenshot('waiting-to-join.png');
    await join.click();

    // const [join] = await this.page.$x("//button[contains(., 'Liity nyt')]");
    // if (join) {
    //     await join.evaluate(b => b.click());
    //     // await join.click();
    // }
    
    // Beyond, is code separate from logging in. You could log in manually and just wait for the chat button to show up to start the bot, for example.
    await this.page.waitForXPath(
        '//button[contains(@jsname,"A5il2e")][i[contains(text(), "chat_bubble")]]',
        { visible: true, timeout: 0 }
    );

    await this.toggleMemberList(); await this.toggleChat();
    this.message.messageListener(this); this.member.memberListener(this); // Start listeners
    this.isChatEnabled = this.chatEnabled;
    this.Audio = new this.audio(this.page);

    console.log("Meeting joined, and listeners are listening!");

    await new Promise(resolve => setTimeout(resolve, 500));

    this.emit('ready');
}

module.exports = {
    auth: auth
}
