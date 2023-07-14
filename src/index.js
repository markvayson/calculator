let DIGIT_OBJECT = [];
let FIRST_NUMBER = null;
let SECOND_NUMBER = null;
let OPERATOR = "";
let TOTAL = null;
let PREVIOUS = [];
let prevInfo = false;

const numText = document.getElementById("numText");
const numBtns = document.querySelectorAll(".number");
const history = document.getElementById("history");
const prev = document.getElementById("prev");
const ac = document.getElementById("ac");
const pre = document.getElementById("pre");
ac.addEventListener("click", clear);

window.addEventListener("keydown", (e) => {
  let key = e.key;
  const allowedKeys = /[0-9+\-*/]/;
  const ONLY_NUMBER = /[0-9]/;
  const ONLY_SIGN = /[+\-*/]/;
  if (key === "c") {
    return clear();
  }
  if (key === "Enter") {
    return equal();
  }
  if (key === ".") {
    return period(".");
  }
  if (key === "Backspace") {
    DIGIT_OBJECT.pop();
    let Number = DIGIT_OBJECT.join("");
    return (numText.textContent = Number);
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
  console.log(PREVIOUS);
  if (FIRST_NUMBER !== null && OPERATOR !== null && SECOND_NUMBER !== null) {
    operate();
    DIGIT_OBJECT = [];
    SECOND_NUMBER = null;
    OPERATOR = "";
  }
}
function period(e) {
  if (FIRST_NUMBER === null && e === ".") return;
  if (e === "." && DIGIT_OBJECT.indexOf(".") !== -1) return;
  DIGIT_OBJECT.push(e);
}
function handleNumClick(number) {
  prevInfo = false;
  showDiv();
  if (TOTAL !== null) {
    FIRST_NUMBER = TOTAL;
    TOTAL = null;
    SECOND_NUMBER = null;
    history.textContent = `= ${FIRST_NUMBER} ${OPERATOR}`;
  }
  let n = number;
  if (DIGIT_OBJECT[0] === 0 && n === 0) {
    return;
  }
  if (DIGIT_OBJECT.length < 12) {
    DIGIT_OBJECT.push(n);
  }
  let NUMBER = DIGIT_OBJECT.join("");
  if (OPERATOR === "") {
    FIRST_NUMBER = NUMBER;
  } else {
    SECOND_NUMBER = NUMBER;
  }
  numText.textContent = NUMBER;
  ac.textContent = "C";
}
function operation(e) {
  if (TOTAL !== null) {
    FIRST_NUMBER = TOTAL;
    TOTAL = null;
    OPERATOR = e;
    SECOND_NUMBER = null;
    return (history.textContent = `= ${FIRST_NUMBER} ${OPERATOR}`);
  }
  prevInfo = false;
  showDiv();
  if (OPERATOR !== "" && SECOND_NUMBER !== null) {
    operate();
    history.textContent = `= ${FIRST_NUMBER} ${OPERATOR} ${SECOND_NUMBER}`;
  }
  if (FIRST_NUMBER !== null) {
    OPERATOR = e;
  }
  if (FIRST_NUMBER !== null && SECOND_NUMBER === null) {
    history.textContent = `= ${FIRST_NUMBER} ${OPERATOR}`;
  }
  DIGIT_OBJECT = [];
}

function operate() {
  let op;
  switch (OPERATOR) {
    case "+":
      op = "+";
      TOTAL = Number(FIRST_NUMBER) + Number(SECOND_NUMBER);

      break;
    case "-":
      op = "-";
      TOTAL = Number(FIRST_NUMBER) - Number(SECOND_NUMBER);

      break;
    case "*":
      op = "x";
      TOTAL = Number(FIRST_NUMBER) * Number(SECOND_NUMBER);

      break;
    case "/":
      if (SECOND_NUMBER === 0) {
        clear();
        history.textContent = "ERROR";
        PREVIOUS.push(`ERROR`);
        break;
      }
      op = "÷";
      TOTAL = FIRST_NUMBER / SECOND_NUMBER;
      break;
  }
  console.log(PREVIOUS);
  if (PREVIOUS.length > 0) {
    pre.classList.remove("opacity-0");
  }
  TOTAL = parseFloat(TOTAL.toFixed(2));
  addText(op);
}
function addText(e) {
  PREVIOUS.push(`${FIRST_NUMBER} ${e} ${SECOND_NUMBER} =  <b>${TOTAL}</b>`);
  numText.textContent = TOTAL;
}

function clear() {
  if (ac.textContent === "C") {
    DIGIT_OBJECT = [];
    numText.textContent = 0;
    ac.textContent = "AC";
    return;
  }

  DIGIT_OBJECT = [];
  FIRST_NUMBER = null;
  SECOND_NUMBER = null;
  OPERATOR = "";
  history.textContent = "=";
  TOTAL = null;
}
function showDiv() {
  if (prevInfo === true) {
    prev.classList.remove("opacity-0");
  }
  if (prevInfo === false) {
    prev.classList.add("opacity-0");
  }
}
function Prev() {
  if (PREVIOUS.length === 0) return;
  prevInfo = !prevInfo;
  showDiv();
  while (prev.firstChild) {
    prev.removeChild(prev.firstChild);
  }
  for (let i = PREVIOUS.length - 1; i >= 0; i--) {
    const span = document.createElement("span");
    span.innerHTML = `${PREVIOUS[i]} [${i + 1}]`;
    prev.appendChild(span);
  }
}
