// =========================================
// WEEDCLOUD V0.1
// INTERACTIVE WEEDWOLF DIALOGUE
// =========================================

const messageBox = document.getElementById("weedwolf-message");
const messageText = document.getElementById("message-text");

if (messageBox && messageText) {

    const messages = [
        "Welcome to the WeedCloud, Growmie...",
        "Something's growing in the Cloud.",
        "Every great grow starts with a seed.",
        "The Garden is waiting for you.",
        "Stay Fresh.. Never stale.",
        "Click around. Explore the Cloud.",
        "You never know what you might find up here...",
        "Huff and I Puff.. burn the whole crop to smoke!"
    ];

    let currentMessage = 0;
    let isTyping = false;
    let typingTimer;
    let fullMessage = "";

    function typeMessage(message) {
        clearInterval(typingTimer);

        fullMessage = message;
        messageText.textContent = "";
        isTyping = true;

        let letterIndex = 0;

        typingTimer = setInterval(() => {
            messageText.textContent += fullMessage.charAt(letterIndex);
            letterIndex++;

            if (letterIndex >= fullMessage.length) {
                clearInterval(typingTimer);
                isTyping = false;
            }
        }, 45);
    }

    function advanceMessage() {
        if (isTyping) {
            clearInterval(typingTimer);
            messageText.textContent = fullMessage;
            isTyping = false;
            return;
        }

        currentMessage = (currentMessage + 1) % messages.length;
        typeMessage(messages[currentMessage]);
    }

    messageBox.addEventListener("click", advanceMessage);

    messageBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            advanceMessage();
        }
    });
}
