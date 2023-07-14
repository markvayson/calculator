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
const computations = document.createElement("ol");

computations.classList.add("gap-9", "flex", "flex-col");

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
  if (FIRST_NUMBER === null && e === ".") return;
  if (e === "." && DIGIT_OBJECT.indexOf(".") !== -1) return;
  DIGIT_OBJECT.push(e);
}
function handleNumClick(number) {
  styleIt(number);
  prevInfo = false;
  showDiv();
  if (TOTAL !== null) {
    FIRST_NUMBER = TOTAL;
    TOTAL = null;
    SECOND_NUMBER = null;
  }
  let n = number;
  if (DIGIT_OBJECT[0] === 0 && n === 0) {
    return;
  }
  if (DIGIT_OBJECT.length < 15) {
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
  if (TOTAL !== null) {
    FIRST_NUMBER = TOTAL;
    TOTAL = null;
    OPERATOR = e;
    SECOND_NUMBER = null;
  }
  prevInfo = false;
  showDiv();
  if (OPERATOR !== "" && SECOND_NUMBER !== null) {
    operate();
  }
  if (FIRST_NUMBER !== null) {
    OPERATOR = e;
    let op = OPERATOR;
    if (OPERATOR === "/") {
      op = "÷";
    }
    if (OPERATOR === "*") {
      op = "×";
    }
    history.textContent = `${FIRST_NUMBER} (${op})`;
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
      op = "×";
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
  if (PREVIOUS.length > 0) {
    pre.classList.remove("opacity-0");
  }
  let parsedTOTAL = parseFloat(TOTAL);
  if (Math.abs(TOTAL) >= 1e10 || Math.abs(TOTAL) < 1e-10) {
    TOTAL = parsedTOTAL.toExponential();
  } else {
    TOTAL = parsedTOTAL;
  }

  addText(op);
}
function addText(e) {
  history.textContent = `${FIRST_NUMBER} (${e})`;
  PREVIOUS.push(
    `${FIRST_NUMBER} ${e} ${SECOND_NUMBER} =  <b class='bg-gray-300 text-gray-800 border rounded-lg p-1'>${TOTAL}</b>`
  );
  numText.textContent = TOTAL;
}

function clear() {
  styleIt("ac");
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
  history.textContent = "";
  TOTAL = null;
}
function showDiv() {
  if (prevInfo === true) {
    prev.classList.remove("opacity-0", "pointer-events-none");
    pre.textContent = "(×) Close";
  }
  if (prevInfo === false) {
    prev.classList.add("opacity-0", "pointer-events-none");
    pre.textContent = "(+) History";
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
