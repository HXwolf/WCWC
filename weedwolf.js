// =========================================
// WEEDCLOUD
// WEEDWOLF CLICKABLE TIPS
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    const tipsMessage = document.getElementById("tips-message");
    const tipsNext = document.getElementById("tips-next");

    if (!tipsMessage || !tipsNext) {
        console.error("WeedWolf tips elements were not found.");
        return;
    }

    const weedwolfTips = [
      "The WeedCloud is a place for ideas, knowledge, music, and responsible exploration.",  
      "Learn before you grow. Good information helps prevent avoidable mistakes.",
        "Responsible choices include knowing your local jurisdiction and understanding your own limits.",
        "Keep plants, products, and growing materials away from children and pets.",
        "A healthy-looking plant is not automatically a safe or suitable product.",
        "Good records help you understand what works, what does not, and what needs improvement.",
        "The WeedCloud is built around creativity, knowledge, music, and responsible exploration.",
      "theWildCore makes dope hip-hop music to puff to!",
      "HigherEX HEXACHRON 6 vol.5 EP dropping 2026!",
      "New GUTTAWOLF music drops Fall 2026!",
      "The Wolf don't mess with that irradiated bud! Respect the proper cure process!",
        "Stay curious. Stay informed. Stay Fresh.. Fresh Never Stale."
    ];

    let currentTip = 0;
    let isTyping = false;
    let typingTimer;

    function typeTip(text) {
        clearInterval(typingTimer);

        tipsMessage.textContent = "";
        isTyping = true;

        let character = 0;

        typingTimer = setInterval(function () {
            tipsMessage.textContent += text.charAt(character);
            character++;

            if (character >= text.length) {
                clearInterval(typingTimer);
                isTyping = false;
            }
        }, 25);
    }

    function showNextTip() {
        if (isTyping) {
            clearInterval(typingTimer);
            tipsMessage.textContent = weedwolfTips[currentTip];
            isTyping = false;
            return;
        }

        currentTip++;

        if (currentTip >= weedwolfTips.length) {
            currentTip = 0;
        }

        typeTip(weedwolfTips[currentTip]);
    }

    tipsNext.addEventListener("click", showNextTip);

    typeTip(weedwolfTips[currentTip]);

  /* VIDEO CAROUSEL */

const videoPages = document.querySelectorAll(".weedwolf-video-page");
const videoDots = document.querySelectorAll(".video-dot");
const videoPrev = document.getElementById("video-prev");
const videoNext = document.getElementById("video-next");

let currentVideoPage = 0;

function showVideoPage(pageIndex) {
  if (!videoPages.length) return;

  currentVideoPage =
    (pageIndex + videoPages.length) % videoPages.length;

  videoPages.forEach(function (page, index) {
    page.classList.toggle("active", index === currentVideoPage);
  });

  videoDots.forEach(function (dot, index) {
    dot.classList.toggle("active", index === currentVideoPage);
  });
}

if (videoPrev && videoNext) {
  videoPrev.addEventListener("click", function () {
    showVideoPage(currentVideoPage - 1);
  });

  videoNext.addEventListener("click", function () {
    showVideoPage(currentVideoPage + 1);
  });
}

videoDots.forEach(function (dot) {
  dot.addEventListener("click", function () {
    showVideoPage(Number(dot.dataset.page));
  });
});

showVideoPage(0);
});