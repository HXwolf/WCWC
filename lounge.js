// =========================================================
// WEEDCLOUD LOUNGE
// Room navigation + stereo music player
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("lounge-stage");
  const image = document.getElementById("lounge-room-image");
  const hotspots = document.querySelectorAll(".lounge-hotspot");

  const detail = document.getElementById("lounge-detail");
  const closeButton = document.getElementById("lounge-close");
  const returnButton = document.getElementById("lounge-return");

  const title = document.getElementById("lounge-detail-title");
  const kicker = document.getElementById("lounge-detail-kicker");
  const copy = document.getElementById("lounge-detail-copy");
  const note = document.getElementById("lounge-detail-note");
  const status = document.getElementById("lounge-status");
  const linkWall = document.getElementById("lounge-link-wall");
  const arcadeGrid = document.getElementById("lounge-arcade-grid");
  const arcadeScreen = document.getElementById("lounge-arcade-screen");

  // PLAYER ELEMENTS
  const player = document.getElementById("stereo-player");
  const audio = document.getElementById("lounge-audio");
  const trackName = document.getElementById("track-name");
  const playButton = document.getElementById("play-track");
  const stopButton = document.getElementById("stop-track");
  const previousButton = document.getElementById("previous-track");
  const nextButton = document.getElementById("next-track");
  const trackSelect = document.getElementById("track-select");
  const playbackMode = document.getElementById("playback-mode");
  const progress = document.getElementById("track-progress");
  const currentTimeDisplay = document.getElementById("current-time");
  const totalTimeDisplay = document.getElementById("total-time");

  if (!stage || !image) return;

  // ROOM HOTSPOTS
  const areas = {
    couch: {
      x: 39, y: 69, zoom: 2.25,
      kicker: "LOUNGE COMFORT",
      title: "THE COUCH",
      copy: "Take a closer look around the lounge seating area.",
      note: "COUCH AREA"
    },

    shoutouts: {
      x: 10, y: 28, zoom: 2.15,
      kicker: "PROJECTS · COLLABORATORS · FRIENDS",
      title: "SHOUT OUTS",
      copy: "A link wall celebrating projects, collaborators and related sites.",
      note: "MORE LOGOS AND LINKS CAN BE ADDED OVER TIME"
    },

    arcade: {
      x: 33, y: 43, zoom: 2.15,
      kicker: "WEEDCLOUD ARCADE",
      title: "SELECT YOUR GAME",
      copy: "Choose a game from the arcade. Each playable title will open on its own page.",
      note: "TWO GAMES READY · TWO MORE COMING SOON"
    },

    stereo: {
      x: 48, y: 41, zoom: 2.35,
      kicker: "WEEDCLOUD AUDIO",
      title: "THE STEREO",
      copy: "The home of the WeedCloud music player, Now Playing display, mixes and playlists.",
      note: "WEEDCLOUD AUDIO TRANSMISSION"
    },

    gallery: {
      x: 70, y: 27, zoom: 2.15,
      kicker: "IN-HOUSE PRODUCTIONS",
      title: "THE PROJECT WALL",
      copy: "Click through the wall to explore in-house albums, mixtapes and creative projects.",
      note: "PROJECT GALLERY · COMING IN A LATER BUILD"
    },

    computer: {
      x: 75, y: 48, zoom: 2.25,
      kicker: "STUDIO STATUS",
      title: "WORK IN PROGRESS",
      copy: "A look at projects currently being developed, works in progress, previews and behind-the-scenes material.",
      note: "DEVELOPMENT DESK · COMING IN A LATER BUILD"
    },

    booth: {
      x: 94, y: 43, zoom: 2.35,
      kicker: "WEEDCLOUD RECORDING ROOM",
      title: "RECORDING BOOTH",
      copy: "A place to choose a beat, record your verse and listen back. The recording experience is still being developed.",
      note: "COMING SOON"
    }
  };

  // ARCADE GAME CATALOG
  // Add future games here. Playable games open their own HTML pages.
  const arcadeGames = [
    { title: "WOLF TOKIN'", image: "assets/wolftokincab.png", status: "coming-soon", page: "" },
    { title: "ALIEN KUSH", image: "assets/alienkushcab.png", status: "playable", page: "alien-kush.html" },
    { title: "BUD-WOLF", image: "assets/budwolfcab.png", status: "playable", page: "bud-wolf.html" },
    { title: "THE ROLLING TABLE", image: "assets/rollingtablecab.png", status: "coming-soon", page: "" }
  ];

  function buildArcadeSelection() {
    if (!arcadeGrid) return;
    arcadeGrid.innerHTML = "";

    arcadeGames.forEach((game) => {
      const card = document.createElement(game.status === "playable" ? "a" : "article");
      card.className = `lounge-game-card ${game.status === "playable" ? "is-playable" : "is-coming-soon"}`;

      if (game.status === "playable") {
        card.href = game.page;
        card.setAttribute("aria-label", `Play ${game.title}`);
      } else {
        card.setAttribute("aria-label", `${game.title}, coming soon`);
        card.setAttribute("aria-disabled", "true");
      }

      const art = document.createElement("div");
      art.className = "lounge-game-art";
      const img = document.createElement("img");
      img.src = game.image;
      img.alt = `${game.title} arcade cabinet`;
      img.loading = "lazy";
      img.draggable = false;
      art.appendChild(img);

      const info = document.createElement("div");
      info.className = "lounge-game-info";
      const heading = document.createElement("h3");
      heading.textContent = game.title;
      const badge = document.createElement("span");
      badge.className = `game-status ${game.status === "playable" ? "game-status-ready" : ""}`;
      badge.textContent = game.status === "playable" ? "PLAY NOW" : "COMING SOON";
      info.append(heading, badge);
      card.append(art, info);
      arcadeGrid.appendChild(card);
    });
  }

  buildArcadeSelection();

  // MUSIC LIBRARY
  const tracks = Array.from({ length: 9 }, (_, index) => ({
    name: `TRACK ${index + 1}`,
    src: `audio/track-${String(index + 1).padStart(2, "0")}.mp3`
  }));

  let currentTrack = 0;
  let isSeeking = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function updatePlayButton(playing) {
    playButton.textContent = playing ? "Ⅱ" : "▶";
    playButton.setAttribute("aria-label", playing ? "Pause" : "Play");
  }

  function loadTrack(index) {
    currentTrack = (index + tracks.length) % tracks.length;

    const track = tracks[currentTrack];

    audio.src = track.src;
    trackName.textContent = track.name;
    trackSelect.value = String(currentTrack);

    progress.value = 0;
    currentTimeDisplay.textContent = "0:00";
    totalTimeDisplay.textContent = "0:00";

    updatePlayButton(false);
  }

  async function playTrack() {
    try {
      await audio.play();
      updatePlayButton(true);
      status.textContent = `PLAYING · ${tracks[currentTrack].name}`;
    } catch (error) {
      updatePlayButton(false);
      status.textContent = `UNABLE TO PLAY · CHECK ${tracks[currentTrack].src}`;
    }
  }

  function pauseTrack() {
    audio.pause();
    updatePlayButton(false);
    status.textContent = `PAUSED · ${tracks[currentTrack].name}`;
  }

  function stopTrack() {
    audio.pause();

    try {
      audio.currentTime = 0;
    } catch (error) {
      // Playback position will reset when the track loads.
    }

    progress.value = 0;
    currentTimeDisplay.textContent = "0:00";
    updatePlayButton(false);

    status.textContent = `STOPPED · ${tracks[currentTrack].name}`;
  }

  function nextTrack() {
    let nextIndex;

    if (playbackMode.value === "random") {
      if (tracks.length < 2) {
        nextIndex = currentTrack;
      } else {
        do {
          nextIndex = Math.floor(Math.random() * tracks.length);
        } while (nextIndex === currentTrack);
      }
    } else {
      nextIndex = (currentTrack + 1) % tracks.length;
    }

    loadTrack(nextIndex);
    playTrack();
  }

  function previousTrack() {
    const previousIndex = (currentTrack - 1 + tracks.length) % tracks.length;

    loadTrack(previousIndex);
    playTrack();
  }

  // PLAYER CONTROLS
  if (audio && player) {
    loadTrack(0);

    playButton.addEventListener("click", () => {
      if (audio.paused) {
        playTrack();
      } else {
        pauseTrack();
      }
    });

    stopButton.addEventListener("click", stopTrack);
    nextButton.addEventListener("click", nextTrack);
    previousButton.addEventListener("click", previousTrack);

    trackSelect.addEventListener("change", () => {
      loadTrack(Number(trackSelect.value));
      playTrack();
    });

    audio.addEventListener("ended", nextTrack);

    audio.addEventListener("play", () => updatePlayButton(true));
    audio.addEventListener("pause", () => updatePlayButton(false));

    audio.addEventListener("loadedmetadata", () => {
      totalTimeDisplay.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      if (isSeeking) return;

      currentTimeDisplay.textContent = formatTime(audio.currentTime);

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
      }
    });

    progress.addEventListener("input", () => {
      isSeeking = true;

      if (Number.isFinite(audio.duration)) {
        const previewTime = (Number(progress.value) / 100) * audio.duration;
        currentTimeDisplay.textContent = formatTime(previewTime);
      }
    });

    progress.addEventListener("change", () => {
      if (Number.isFinite(audio.duration)) {
        audio.currentTime = (Number(progress.value) / 100) * audio.duration;
      }

      isSeeking = false;
    });

    audio.addEventListener("error", () => {
      updatePlayButton(false);
      status.textContent = `TRACK FILE NOT FOUND · ${tracks[currentTrack].src}`;
    });
  }
  // OPEN A ROOM AREA
  function openArea(key) {
    const area = areas[key];
    if (!area) return;

    const bounds = stage.getBoundingClientRect();
    const scale = area.zoom;

    const targetX = bounds.width * (area.x / 100);
    const targetY = bounds.height * (area.y / 100);

    const moveX = (bounds.width / 2) - (targetX * scale);
    const moveY = (bounds.height / 2) - (targetY * scale);

    image.style.transform =
      `translate(${moveX}px, ${moveY}px) scale(${scale})`;

    stage.classList.add("is-zoomed");

    title.textContent = area.title;
    kicker.textContent = area.kicker;
    copy.textContent = area.copy;
    note.textContent = area.note;

    // Show only the content belonging to the selected room area.
    // Hiding the stereo player does NOT stop the music.
    if (player) player.hidden = key !== "stereo";
    if (linkWall) linkWall.hidden = key !== "shoutouts";

    if (key === "arcade" && arcadeScreen) {
      detail.hidden = true;
      arcadeScreen.hidden = false;
      arcadeScreen.classList.remove("arcade-screen-visible");
      window.setTimeout(() => arcadeScreen.classList.add("arcade-screen-visible"), 1150);
    } else {
      if (arcadeScreen) {
        arcadeScreen.hidden = true;
        arcadeScreen.classList.remove("arcade-screen-visible");
      }
      detail.hidden = false;
    }

    returnButton.hidden = false;
    status.textContent = `AREA SELECTED · ${area.title}`;
  }

  // RETURN TO FULL ROOM
  function returnToRoom() {
    image.style.transform = "translate(0, 0) scale(1)";

    stage.classList.remove("is-zoomed");

    detail.hidden = true;
    returnButton.hidden = true;

    if (arcadeScreen) {
      arcadeScreen.hidden = true;
      arcadeScreen.classList.remove("arcade-screen-visible");
    }

    // Music deliberately continues playing.
    status.textContent = "TRANSMISSION READY · SELECT A HOTSPOT";
  }

  // CONNECT HOTSPOTS
  hotspots.forEach((button) => {
    button.addEventListener("click", () => {
      openArea(button.dataset.area);
    });
  });

  // BACK BUTTONS
  closeButton.addEventListener("click", returnToRoom);
  returnButton.addEventListener("click", returnToRoom);

  // RESIZE HANDLING
  window.addEventListener("resize", () => {
    if (detail.hidden) return;

    const activeTitle = title.textContent;

    const activeKey = Object.keys(areas).find(
      (key) => areas[key].title === activeTitle
    );

    if (activeKey) openArea(activeKey);
  });

  // MISSING IMAGE WARNING
  image.addEventListener("error", () => {
    status.textContent = "IMAGE NOT FOUND · CHECK assets/lounge-room.png";
    stage.classList.add("lounge-image-missing");
  });
});

// =========================================================
// WEEDCLOUD MINI PLAYER
// Persistent controls while exploring the Lounge
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("lounge-audio");
  const fullPlayer = document.getElementById("stereo-player");
  const detail = document.getElementById("lounge-detail");
  const detailTitle = document.getElementById("lounge-detail-title");
  const trackName = document.getElementById("track-name");

  if (!audio || !fullPlayer || !detail || !trackName) return;

  let hasStarted = false;

  // Create the mini player
  const mini = document.createElement("div");
  mini.id = "lounge-mini-player";

  mini.innerHTML = `
    <div class="mini-player-top">
      <span class="mini-player-label">WEEDCLOUD AUDIO</span>
      <span class="mini-player-live">● LIVE</span>
    </div>

    <button class="mini-track-name" id="mini-track-name" type="button">
      TRACK 1
    </button>

    <div class="mini-player-controls">
      <button id="mini-previous" type="button" aria-label="Previous track">|◀</button>
      <button id="mini-play" type="button" aria-label="Play">▶</button>
      <button id="mini-stop" type="button" aria-label="Stop">■</button>
      <button id="mini-next" type="button" aria-label="Next track">▶|</button>
    </div>
  `;

  document.body.appendChild(mini);

  const miniName = document.getElementById("mini-track-name");
  const miniPlay = document.getElementById("mini-play");

  const fullPlay = document.getElementById("play-track");
  const fullStop = document.getElementById("stop-track");
  const fullPrevious = document.getElementById("previous-track");
  const fullNext = document.getElementById("next-track");

  function updateMini() {
    const inStereo =
      !detail.hidden &&
      detailTitle.textContent === "THE STEREO";

    miniName.textContent = trackName.textContent;
    miniPlay.textContent = audio.paused ? "▶" : "Ⅱ";
    miniPlay.setAttribute(
      "aria-label",
      audio.paused ? "Play" : "Pause"
    );

    mini.hidden = !hasStarted || inStereo;
  }

  // Mini player controls use the existing full-player controls.
  miniName.addEventListener("click", () => {
    const stereoHotspot = document.querySelector(
      '.lounge-hotspot[data-area="stereo"]'
    );

    if (stereoHotspot) stereoHotspot.click();
  });

  miniPlay.addEventListener("click", () => {
    if (fullPlay) fullPlay.click();
  });

  document.getElementById("mini-stop").addEventListener("click", () => {
    if (fullStop) fullStop.click();
  });

  document.getElementById("mini-previous").addEventListener("click", () => {
    if (fullPrevious) fullPrevious.click();
  });

  document.getElementById("mini-next").addEventListener("click", () => {
    if (fullNext) fullNext.click();
  });

  // Remember that playback has been started at least once.
  audio.addEventListener("play", () => {
    hasStarted = true;
    updateMini();
  });

  audio.addEventListener("pause", updateMini);
  audio.addEventListener("ended", updateMini);
  audio.addEventListener("loadedmetadata", updateMini);

  // Keep the mini player updated when the track changes.
  new MutationObserver(updateMini).observe(trackName, {
    childList: true,
    characterData: true,
    subtree: true
  });

  // Detect when the user opens or leaves the stereo area.
  new MutationObserver(updateMini).observe(detail, {
    attributes: true,
    attributeFilter: ["hidden"]
  });

  new MutationObserver(updateMini).observe(detailTitle, {
    childList: true,
    characterData: true,
    subtree: true
  });

  updateMini();
});
