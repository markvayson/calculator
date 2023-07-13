let num = [];
let x = null;
let y = null;
let operator = null;
let ans = null;
const numText = document.getElementById("numText");
const numBtns = document.querySelectorAll(".number");
x;
const hist = document.getElementById("history");
const ac = document.getElementById("ac");

ac.addEventListener("click", clear);

function handleNumClick(number) {
  let n = number;
  let period = ".";
  if (n === "0" && num.length < 1) {
    return (numText.value = 0);
  }
  if (n === period && !num.includes(period)) {
    num.push(n);
  } else if (n !== period) {
    num.push(n);
  }
  if (operator === null) {
    x = num.join("");
    if (x[x.length - 1] !== period) {
      numText.value = x;
    }
    hist.textContent = `= ${x}`;
    ac.textContent = "C";
  } else {
    y = num.join("");
    if (y[y.length - 1] !== period) {
      numText.value = y;
      ac.textContent = "C";
    }
    hist.textContent = `= ${x} ${operator} ${y}`;
  }
}
function operate(e) {
  if (operator !== null) {
    switch (operator) {
      case "+":
        x = parseFloat(x) + parseFloat(y);
        hist.textContent = `= ${x} ${operator}`;
        break;
      case "-":
        x = parseFloat(x) - parseFloat(y);
        hist.textContent = `= ${x} ${operator}`;
        break;
      case "*":
        x = parseFloat(x) * parseFloat(y);
        hist.textContent = `= ${x} ${operator}`;
        break;
      case "/":
        x = parseFloat(x) / parseFloat(y);
        hist.textContent = `= ${x} ${operator}`;
        break;
    }
  }
  if (e === "=") {
    hist.textContent = `= ${x}`;
    operator = null;
  }
  y = null;
  num = [];
  numText.value = x;
  x;
}

function clear() {
  if (ac.textContent !== "C") {
    x = null;
    y = null;
    operator = null;
  }
  numText.value = 0;
  if (operator !== null) {
    hist.textContent = `= ${x} ${operator}`;
  } else {
    hist.textContent = "=";
  }
  num = [];
  ac.textContent = "AC";
}

function operation(e) {
  if (x === null) return;
  console.log(e);
  if (y !== null) {
    operate(e);
  }
  operator = e;
  hist.textContent = `= ${x} ${operator}`;
  num = [];
}
