// =========================================
// WEEDCLOUD V0.1
// INTERACTIVE WEEDWOLF DIALOGUE
// =========================================


const messageBox = document.getElementById("weedwolf-message");
const messageText = document.getElementById("message-text");

const messages = [
  "Welcome to the WeedCloud, Growmie...",
  "Something's growing in the Cloud.",
  "Every great grow starts with a seed.",
  "The Garden is waiting for you.",
  "Stay Fresh.. Never stale.",
  "Click around. Explore the Cloud.",
  "You never know what you might find up here...",
  "Huff and I Puff.. burn the whole crop to smoke!",

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

messageBox.addEventListener("click", () => {
  // If the message is still typing, finish it immediately
  if (isTyping) {
    clearInterval(typingTimer);
    messageText.textContent = fullMessage;
    isTyping = false;
    return;
  }

  // Move to the next message
  currentMessage++;

  if (currentMessage >= messages.length) {
    currentMessage = 0;
  }

  typeMessage(messages[currentMessage]);
});