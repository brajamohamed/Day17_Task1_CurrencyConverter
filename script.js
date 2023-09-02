let from = document.getElementById("convertFrom");
let to = document.getElementById("convertTo");
let input1 = document.getElementById("input1");
let input2 = document.getElementById("input2");
let img = document.getElementById("img");
let io = document.querySelectorAll(".io");
let dropDown = document.querySelectorAll(".dropdownList");
let msg = document.getElementById("msg");

fetch("https://www.frankfurter.app/currencies")
  .then((res) => res.json())
  .then((data) => populateDropdown(data));

function populateDropdown(data) {
  let array = Object.entries(data);
  for (let i = 0; i < array.length; i++) {
    let option = `<option value="${array[i][0]}">${array[i][0]}</option>`;
    from.innerHTML += option;
    to.innerHTML += option;
  }
}
io.forEach((element) => {
  element.addEventListener("input", handleInputEvents);
});
dropDown.forEach((element) => {
  element.addEventListener("change", handleChangeEvent);
});
img.addEventListener("click", handleSwapEvent);
let currentInputElement;
function handleInputEvents(event) {
  currentInputElement = event.target.id;
  if (currentInputElement == "input1") {
    input1s();
  } else if (currentInputElement == "input2") {
    input2s();
  }
}
function handleSwapEvent() {
  let temp = to.value;
  to.value = from.value;
  from.value = temp;
  let changeEvent = new Event("change", { bubbles: true });
  from.dispatchEvent(changeEvent);
}
function handleChangeEvent() {
  console.log(currentInputElement);
  if (currentInputElement == "input1") input1s();
  else input2s();
}

async function input1s() {
  input2.value = "";
  console.log("from:", from.value, "to:", to.value);
  if (from.value == to.value) {
    msg.style.visibility = "visible";
  } else if (input1.value !== "") {
    msg.style.visibility = "hidden";
    input2.value = await Calculate(from.value, to.value, input1.value);
  }
}
async function input2s() {
  input1.value = "";
  if (from.value == to.value) msg.style.visibility = "visible";
  else if (input2.value !== "") {
    msg.style.visibility = "hidden";
    input1.value = await Calculate(to.value, from.value, input2.value);
  }
}

async function Calculate(from, to, amt) {
  try {
    const host = "api.frankfurter.app";
    const response = await fetch(
      `https://${host}/latest?amount=${amt}&from=${from}&to=${to}`
    );
    const data = await response.json();
    let rate = Object.values(data.rates);
    rate = rate[0];
    return rate;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
