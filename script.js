const CHARACTERS = ["Tom", "Jerry", "Spike"];

let state;
let selectedCharacter = null;

const leftContainer = document.getElementById("left-characters");
const rightContainer = document.getElementById("right-characters");
const charButtonsContainer = document.getElementById("character-buttons");
const moveButton = document.getElementById("move-button");
const resetButton = document.getElementById("reset-button");
const chatLog = document.getElementById("chat-log");

function initState() {
  state = {
    left: ["Tom", "Jerry", "Spike", "Házvezetőnő"],
    right: [],
    boatSide: "left"
  };
  selectedCharacter = null;
  render();
  clearChat();
  addChat("Házvezetőnő", "Na gyerekek, indul a folyóátkelés!", "left");
}

function render() {
  leftContainer.innerHTML = "";
  rightContainer.innerHTML = "";
  charButtonsContainer.innerHTML = "";

  state.left.forEach(ch => leftContainer.appendChild(createCharacterElement(ch)));
  state.right.forEach(ch => rightContainer.appendChild(createCharacterElement(ch)));

  const currentSideChars = state[state.boatSide].filter(c => c !== "Házvezetőnő");

  currentSideChars.forEach(ch => {
    const btn = document.createElement("button");
    btn.textContent = ch;
    if (selectedCharacter === ch) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      selectedCharacter = selectedCharacter === ch ? null : ch;
      render();
    });
    charButtonsContainer.appendChild(btn);
  });
}

function createCharacterElement(name) {
  const div = document.createElement("div");
  div.className = "character";
  div.textContent = name;
  return div;
}

function isValidSide(side) {
  const hasTom = side.includes("Tom");
  const hasJerry = side.includes("Jerry");
  const hasSpike = side.includes("Spike");
  const hasHousekeeper = side.includes("Házvezetőnő");

  if (hasHousekeeper) return true;

  if (hasTom && hasJerry) return false;
  if (hasJerry && hasSpike) return false;

  return true;
}

function isStateValid(newState) {
  return isValidSide(newState.left) && isValidSide(newState.right);
}

function moveBoat() {
  const from = state.boatSide;
  const to = from === "left" ? "right" : "left";

  const newState = {
    left: [...state.left],
    right: [...state.right],
    boatSide: to
  };

  moveCharacter(newState[from], newState[to], "Házvezetőnő");

  let passengerText = "egyedül megyek.";
  if (selectedCharacter) {
    if (!newState[from].includes(selectedCharacter)) {
      addChat("Házvezetőnő", "Nem vagyunk egy parton!", "left");
      return;
    }
    moveCharacter(newState[from], newState[to], selectedCharacter);
    passengerText = `magammal viszem: ${selectedCharacter}.`;
  }

  if (!isStateValid(newState)) {
    addChat("Spike", "Hé! Ez így nem lesz jó!", "right");
    addChat("Házvezetőnő", "Ez szabálytalan lenne.", "left");
    return;
  }

  state = newState;
  addChat("Házvezetőnő", `Átértem a ${to} partra, ${passengerText}`, "left");
  selectedCharacter = null;
  render();
  checkWin();
}

function moveCharacter(fromArr, toArr, name) {
  const i = fromArr.indexOf(name);
  if (i !== -1) fromArr.splice(i, 1);
  toArr.push(name);
}

function checkWin() {
  if (state.right.length === 4) {
    addChat("Jerry", "Mindenki átért! 🎉", "right");
    addChat("Házvezetőnő", "Szép munka volt!", "left");
  }
}

function addChat(sender, text, side) {
  const msg = document.createElement("div");
  msg.className = "chat-message " + (side === "left" ? "chat-left" : "chat-right");
  msg.textContent = sender + ": " + text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function clearChat() {
  chatLog.innerHTML = "";
}

moveButton.addEventListener("click", moveBoat);
resetButton.addEventListener("click", initState);

initState();
