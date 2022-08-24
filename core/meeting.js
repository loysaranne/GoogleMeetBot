// Core meeting methods

async function toggleMic() {
    await this.page.keyboard.down('ControlLeft');
    await this.page.keyboard.press('KeyD');
    await this.page.keyboard.up('ControlLeft');
    this.isMicEnabled = !this.isMicEnabled;
}

async function toggleVideo() {
    await this.page.keyboard.down('ControlLeft');
    await this.page.keyboard.press('KeyE');
    await this.page.keyboard.up('ControlLeft');
    this.isVideoEnabled = !this.isVideoEnabled;
}

async function toggleChat() {
    var chatBtn = await this.page.waitForXPath(
        '//button[contains(@jsname,"A5il2e")][i[contains(text(), "chat_bubble")]]',
        { visible: true, timeout: 0 }
    );
    await chatBtn.click();
    await new Promise(resolve => setTimeout(resolve, 500));
}

async function toggleMemberList() {
    var memberListBtn = await this.page.waitForXPath(
        '//button[contains(@jsname,"A5il2e")][i[contains(text(), "people_outline")]]',
        { visible: true, timeout: 0 }
    );
    await memberListBtn.click();
    await new Promise(resolve => setTimeout(resolve, 500));
}

async function chatEnabled() {
    await this.page.waitForXPath('//*[@id="bfTqV"]');
    var disabled = await this.page.evaluate(() => {disabled = document.querySelector('#bfTqV'); if (disabled.disabled === false) {return true;} else if (disabled.disabled === true) {return false;}});
    return disabled;
}

async function sendMessage(message) {
    if (await this.chatEnabled()) {
        var chatBubble = await this.page.$x('//button[contains(@jsname,"A5il2e")][i[contains(text(), "chat_bubble")]][contains(@aria-pressed,"true")]');
        console.log(chatBubble);
        if (chatBubble.length === 0) {
            this.toggleChat();
        }
        var chat = await this.page.waitForXPath('//*[@id="bfTqV"]', { timeout: 0 }); await chat.focus();
        await this.page.$eval('#bfTqV', (input, message) => {input.value = message; console.log(input); console.log(message)}, message); // replaced `await page.keyboard.type(message)`, because this is a little more instant
        await this.page.keyboard.press('Enter');
    }
}

async function screenshot(path) {
    await this.page.screenshot({ path: path, fullPage: true });
}

module.exports = {
    toggleMic: toggleMic,
    toggleVideo: toggleVideo,
    toggleChat: toggleChat,
    toggleMemberList: toggleMemberList,
    chatEnabled: chatEnabled,
    sendMessage: sendMessage,
    screenshot: screenshot,

}
