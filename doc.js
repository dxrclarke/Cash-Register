const userInput = document.getElementById("cash");
const pbtn = document.getElementById("purchase-btn");
const priceElement = document.getElementById("price-span");
const changeDue = document.getElementById("change-due");
const register = document.getElementById("register");

let price = 19.5;
let cid = [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
let tempCid = [];
let tempPrice = 0;

const values = {
  "ONE HUNDRED": 100.00,
  "TWENTY": 20.00,
  "TEN": 10.00,
  "FIVE": 5.00,
  "ONE": 1.00,
  "QUARTER": 0.25,
  "DIME": 0.10,
  "NICKEL": 0.05,
  "PENNY": 0.01,
}

let change = {};
let changeOut = [];
let curStatus = "OPEN";

const baseLine = () => {
  setValues(); //create the temp variables to handle the input
  statusFunc(); //check if we can even give change
  console.log("changedue", changeDue.innerHTML);
  calculateChange(); //calculate change
  updatePage(); //display change to return
      console.log("changedue", changeDue.innerHTML);

  clearUp();
}

const setValues = () => {
  tempPrice = price;
  tempCid = JSON.parse(JSON.stringify(cid));
};

const clearUp = () => {
  userInput.value = "";
};

const calcCid = () => {
  let priceCents = price * 100;
  let cash = Number(userInput.value) * 100;
  if (Math.round(cash) === Math.round(priceCents)) {
    changeDue.innerHTML = "<p>No change due - customer paid with exact cash</p>";
    return; 
  } else if (priceCents > cash) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  
  let difPriceCash = cash - priceCents;
  for (let i = 8; i >= 0; i--) {
    let curCid = Math.round(tempCid[i][1] * 100); //current value of all money in particular tray
    let curVal = Math.round(values[tempCid[i][0]] * 100); //value of the denom. in the drawer
    //console.log(difPriceCash)
    while (difPriceCash > 0) {
      if (difPriceCash - curVal >= 0 && curCid - curVal >= 0) {
        difPriceCash -= curVal;
        curCid -= curVal;
        if (!change[tempCid[i][0]]) {
          change[tempCid[i][0]] = 1;
        } else {
          change[tempCid[i][0]] += 1;
        }
        tempCid[i][1] = Number((curCid / 100).toFixed(2));
      }
      else {
        break;
      }
    }}
    if (difPriceCash === 0 && totalCid(tempCid) === 0) {
      changeDue.innerHTML = "check";
      return;
    }
     else if (difPriceCash > 0 && totalCid(tempCid) > 0) {
      console.log("here ",difPriceCash)
      changeDue.innerHTML = "wrong";
      return;
    }
  }


const calculateChange = () => {
  
  changeOut = [];
  const changeArr = Object.keys(change).map((key) => [key, change[key]]);
  for (let i = 0; i < changeArr.length; i++) {
    if (values[changeArr[i][0]]) {
      let miniArr = [];
      miniArr.push(changeArr[i][0], Number((changeArr[i][1] * values[changeArr[i][0]]).toFixed(2)));
      changeOut.push(miniArr);
    }
  }
  change = {}; //resets the change dict after values are pushed to changeOut
}

const statusFunc = () => {
  if ((totalCid(tempCid) + price) < userInput.value) {
    curStatus = "CLOSED";
  } else {
    calcCid();
  }
};

const updatePage = () => {
  console.log("changeDue: ", changeDue.innerHTML);
  priceElement.innerHTML = price;
  if (changeDue.innerHTML === "<p>No change due - customer paid with exact cash</p>") {
    return
  };
  
  if (changeDue.innerHTML === "check") {
    changeDue.innerHTML = "Status: CLOSED " + changeOut.map(
      ([denomination, value]) =>
        ` ${denomination}: $${value}`
    ).join("");
    return;
  }
  if (changeDue.innerHTML === "wrong") {
    changeDue.innerHTML = "Status: INSUFFICIENT_FUNDS";
    return;
  };

  changeDue.innerHTML = `Status: ${curStatus}`;
  if (curStatus === "OPEN") {
    changeDue.innerHTML += changeOut.map(
      ([denomination, value]) =>
        ` ${denomination}: $${value}`
    ).join("");
    register.innerHTML = `${tempCid
    .map(
      ([denomination, amount]) => `<p>${[denomination]}: $${amount}</p>`
    )
    .join('')}`
  } else {
    changeDue.innerHTML = "Status: INSUFFICIENT_FUNDS"
  }
  if (changeDue.innerHTML === "Status: OPEN QUARTER: $0.5") {
  }
};

const totalCid = (arr) => {
  let num = 0;
  for (let i = arr.length - 1; i >= 0; i--){
    num += (arr[i][1] * 100);
  }
  num = Number((num / 100).toFixed(2));
  if(num === 0) {
  }
  return num;
}

pbtn.addEventListener("click", baseLine);
