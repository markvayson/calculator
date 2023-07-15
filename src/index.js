let DIGIT_OBJECT = [];
let FIRST_NUMBER = null;
let SECOND_NUMBER = null;
let OPERATOR = "";
let TOTAL = null;
let PREVIOUS = [];
let prevInfo = false;
let prevMenu = false;
const numBtns = document.querySelectorAll(".number");
const history = document.getElementById("history");
const prev = document.getElementById("prev");
const computations = document.createElement("ol");
const menu = document.getElementById("menu");
const Items = document.getElementById("menu-items");

function menuItems() {
  prevMenu = !prevMenu;
  showMenu();
}

function showMenu() {
  if (prevMenu === true) {
    menu.innerHTML = `<span>×</span>`;
    Items.style.opacity = 1;
    Items.style.pointerEvents = "auto";
  }
  if (prevMenu === false) {
    menu.innerHTML = `<span>&#9776;</span>`;
    Items.style.opacity = 0;
    prev.style.opacity = 0;
    prevInfo = false;
    Items.style.pointerEvents = "none";
    prev.style.pointerEvents = "none";
  }
}

const pText = document.getElementById("pText");

computations.classList.add("gap-9", "flex", "flex-col");

const ac = document.getElementById("ac");
const pre = document.getElementById("pre");
ac.addEventListener("click", clear);
window.addEventListener("keydown", (e) => {
  let key = e.key;
  const allowedKeys = /[0-9+\-*/]/;
  const ONLY_NUMBER = /[0-9]/;
  const ONLY_SIGN = /[+\-*]/;
  if (key === "c") {
    return clear();
  }
  if (key === "Enter") {
    return equal();
  }
  if (key === ".") {
    return period(".");
  }
  if (key === "/") {
    return operation("÷");
  }
  if (key === "*") {
    return operation("×");
  }
  if (key === "Backspace") {
    DIGIT_OBJECT.pop();
    let Number = DIGIT_OBJECT.join("");
    let format = Number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (pText.textContent = format);
  }
  if (!allowedKeys.test(key)) {
    return e.preventDefault();
  }
  if (ONLY_NUMBER.test(key)) {
    return handleNumClick(key);
  }
  if (ONLY_SIGN.test(key)) {
    return operation(key);
  }
});
function equal() {
  styleIt("=");
  if (FIRST_NUMBER !== null && OPERATOR !== null && SECOND_NUMBER !== null) {
    operate();
    DIGIT_OBJECT = [];
    SECOND_NUMBER = null;
    OPERATOR = "";
  }
}
function period(e) {
  styleIt(e);
  if (DIGIT_OBJECT.length < 1) return;
  if (DIGIT_OBJECT.indexOf(".") !== -1) return;
  DIGIT_OBJECT.push(".");
  let NUMBER = DIGIT_OBJECT.join("");
  let format = NUMBER.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  pText.textContent = format;
}
function handleNumClick(number) {
  styleIt(number);
  prevInfo = false;
  prevMenu = false;
  showDiv();
  showMenu();
  if (TOTAL !== null) {
    FIRST_NUMBER = TOTAL;
    TOTAL = null;
    SECOND_NUMBER = null;
  }
  let n = number;
  if (DIGIT_OBJECT[0] === 0 && n === 0) {
    return;
  }
  let decimalIndex = DIGIT_OBJECT.indexOf(".");
  let maxLength = decimalIndex !== -1 ? decimalIndex : DIGIT_OBJECT.length;
  if (
    maxLength < 9 &&
    (decimalIndex === -1 || DIGIT_OBJECT.length - decimalIndex < 3)
  ) {
    DIGIT_OBJECT.push(n);
  }
  let NUMBER = DIGIT_OBJECT.join("");
  if (OPERATOR === "") {
    FIRST_NUMBER = NUMBER;
  } else {
    SECOND_NUMBER = NUMBER;
    history.textContent = `${FIRST_NUMBER} ${OPERATOR}`;
  }
  let format = NUMBER.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  pText.textContent = format;
  ac.textContent = "C";
}
function styleIt(e) {
  const clicked = document.getElementById(e);
  const ONLY_NUMBER = /[0-9.a-c]/;
  const ONLY_SIGN = /[+\-*/=]/;
  if (ONLY_SIGN.test(e)) {
    clicked.classList.add("bg-yellow-200");
    clicked.classList.remove("bg-yellow-400");
    setTimeout(() => {
      clicked.classList.remove("bg-yellow-200");
      clicked.classList.add("bg-yellow-400");
    }, 120);
  }
  if (ONLY_NUMBER.test(e)) {
    clicked.classList.add("bg-gray-200");
    clicked.classList.remove("bg-gray-600");
    setTimeout(() => {
      clicked.classList.remove("bg-gray-200");
      clicked.classList.add("bg-gray-600");
    }, 120);
  }
}
function operation(e) {
  styleIt(e);
  prevInfo = false;
  showDiv();
  OPERATOR = e;

  if (TOTAL !== null) {
    FIRST_NUMBER = format;
    TOTAL = null;
    SECOND_NUMBER = null;
  }
  if (FIRST_NUMBER !== null && SECOND_NUMBER === null) {
    pText.textContent = 0;
    history.textContent = `${FIRST_NUMBER} ${OPERATOR}`;
  }
  if (OPERATOR !== "" && SECOND_NUMBER !== null) {
    history.textContent = `${FIRST_NUMBER} ${OPERATOR} ${SECOND_NUMBER}`;

    operate();
  }
  DIGIT_OBJECT = [];
}

function operate() {
  switch (OPERATOR) {
    case "+":
      TOTAL = Number(FIRST_NUMBER) + Number(SECOND_NUMBER);

      break;
    case "-":
      TOTAL = Number(FIRST_NUMBER) - Number(SECOND_NUMBER);

      break;
    case "×":
      TOTAL = Number(FIRST_NUMBER) * Number(SECOND_NUMBER);

      break;
    case "÷":
      if (SECOND_NUMBER == 0) {
        clear();
        history.textContent = "Cannot divide by zero";
        pText.textContent = "ERROR";
        PREVIOUS.push(`ERROR`);
        break;
      }
      TOTAL = FIRST_NUMBER / SECOND_NUMBER;
      break;
  }
  if (PREVIOUS.length > 0) {
    pre.classList.remove("opacity-0", "line-through");
  }
  let parsedTOTAL = parseFloat(TOTAL);
  let decimal = parsedTOTAL.toString().split(".")[1];

  if (Math.abs(TOTAL) >= 1e9 || Math.abs(TOTAL) < 1e-2) {
    TOTAL = parsedTOTAL.toExponential(3);
  } else if (decimal && decimal.length >= 4) {
    TOTAL = parsedTOTAL.toFixed(2);
  } else {
    TOTAL = parsedTOTAL;
  }

  addText();
}
function addText() {
  PREVIOUS.push(
    `${FIRST_NUMBER} ${OPERATOR} ${SECOND_NUMBER} =  <b class='bg-gray-300 text-gray-800 border rounded-lg p-1'>${TOTAL}</b>`
  );
  let format = TOTAL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (pText.textContent !== "ERROR") {
    pText.textContent = format;
  }
}

function clear() {
  styleIt("ac");
  if (ac.textContent === "C") {
    DIGIT_OBJECT = [];
    pText.textContent = 0;
    ac.textContent = "AC";
    return;
  }

  DIGIT_OBJECT = [];
  FIRST_NUMBER = null;
  SECOND_NUMBER = null;
  OPERATOR = "";
  history.textContent = "";
  TOTAL = null;
}
function showDiv() {
  if (prevInfo === true) {
    prev.style.opacity = 1;
    Items.style.opacity = 0;
    prev.style.pointerEvents = "auto";
  }
  if (prevInfo === false) {
    prev.style.opacity = 0;
    prev.style.pointerEvents = "none";
    pre.textContent = "History";
  }
}
function Prev() {
  if (PREVIOUS.length === 0) return;
  prevInfo = !prevInfo;
  showDiv();
  while (computations.firstChild) {
    computations.removeChild(computations.firstChild);
  }
  for (let i = PREVIOUS.length - 1; i >= 0; i--) {
    const li = document.createElement("li");
    li.innerHTML = `${PREVIOUS[i]}`;
    li.classList.add(
      "before:mr-3",
      "before:bg-yellow-400",
      "before:rounded-lg",
      "before:text-gray-200",
      "before:p-2"
    );
    computations.appendChild(li);
  }
  prev.appendChild(computations);
}

window.onload = () => {
  showMenu();
  history.textContent = "0";
  pText.textContent = "Type or Click";
};
