const BASE_URL ="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// 1. Dropdowns mein currency codes bharna
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// 2. Flag update karna
const updateFlag = (element) => {
  let countryCode = countryList[element.value];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// 3. Exchange rate nikalna
const updateExchangeRate = async () => {
  let amtVal = Number(amountInput.value);
  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  try {
    const response = await fetch(`${BASE_URL}/${from}.json`);
    const data = await response.json();
    const rate = data[from][to];

    if (!rate) {
      msg.innerText = "Is currency ka rate available nahi hai";
      return;
    }

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Rate load nahi ho saka, internet check karein";
    console.error(error);
  }
};

// 4. Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// 5. Page load par bhi rate dikhao
window.addEventListener("load", updateExchangeRate);