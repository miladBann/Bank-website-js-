'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  username: "js"
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  username: 'jd'
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  username: "stw"
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  username: "ss"
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let count = 1

containerApp.style.opacity = 0

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = ""

  const movs = sort ? movements.slice().sort((a,b) => a -b) : movements

  movs.forEach(function(mov) {
    let type = mov > 0 ? "deposit": "withdrawal"
    let new_mov = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${count} ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
    </div>
    `
    count++
    containerMovements.insertAdjacentHTML("afterbegin", new_mov)
  })

}

displayMovements(account1.movements)

let time = 300

let timer
const StartTimer = function() {

  const timer = setInterval(function() {
    let minutes = Math.floor(time / 60)
    let seconds = time % 60
    
    labelTimer.textContent = `${minutes}:${seconds}`
    
    if (time == 0) {
        clearInterval(timer)
        containerApp.style.opacity = 0
        time = 300
    }
      time--
    }, 1000)

  return timer

}
  


const displayCurrentBalance = function(movs) {

  let deposites = []
  let withdrawals = []

  movs.forEach(function(mov) {
    mov > 0 ? deposites.push(mov) : withdrawals.push(mov)
  })

  let despositesSum = deposites.reduce((acc, mov) => acc + mov, 1)
  let withdrawalsSum = withdrawals.reduce((acc, mov) => acc + mov, 1)
  let intrest = despositesSum * 0.1

  labelSumIn.textContent = `${despositesSum}€`
  labelSumOut.textContent = `${withdrawalsSum}€`
  labelSumInterest.textContent = `${intrest}€`

  let sum = movs.reduce((acc, mov) => acc + mov, 1)
  let totalBalance = sum - intrest
  labelBalance.textContent = `${Math.round(totalBalance)}€`

}

displayCurrentBalance(account1.movements)


let currentAccount;
btnLogin.addEventListener("click", function(e) {
  e.preventDefault()

  let userName = inputLoginUsername.value
  let userPin = inputLoginPin.value

  currentAccount = accounts.find(acc => acc.username === userName)
  console.log(currentAccount)
  if (userPin == currentAccount.pin) {

    containerApp.style.opacity = 100
    displayCurrentBalance(currentAccount.movements)
    displayMovements(currentAccount.movements)

  }else {
    alert("user name or pin code is wrong")
  }

  
  if (timer) clearInterval(timer)
  timer = StartTimer()
})


btnTransfer.addEventListener("click", function(e) {
  e.preventDefault()

  let transferTo = inputTransferTo.value
  let ammount = Number(inputTransferAmount.value)

  let sendTo = accounts.find(acc => acc.username == transferTo)
  let currentAccountBalance = currentAccount.movements.reduce((acc, mov) => acc + mov, 1)
  console.log(currentAccountBalance)
  
  if (ammount > 0 && currentAccountBalance >= ammount) {

    sendTo.movements.push(ammount)
    currentAccount.movements.push(-ammount)

    displayMovements(currentAccount.movements)
    displayCurrentBalance(currentAccount.movements)

    inputTransferTo.value = ""
    inputTransferAmount.value = ""

  }

  clearInterval(timer)
  timer = StartTimer()

})

btnLoan.addEventListener("click", function(e) {
  e.preventDefault()

  let loan = Number(inputLoanAmount.value)
  
  displayCurrentBalance(currentAccount.movements)
  
  if (labelBalance.textContent < '100') {
    currentAccount.movements.push(loan)
    displayCurrentBalance(currentAccount.movements)
    displayMovements(currentAccount.movements)
    inputLoanAmount.value = ""
  } else {
    alert("you can't request a loan if your balance has over 100 euros in it")
  }

  clearInterval(timer)
  timer = StartTimer()

})

btnClose.addEventListener("click", function(e) {
  e.preventDefault()

  let confirmUser = inputCloseUsername.value
  let confirmPin = inputClosePin.value

  if (currentAccount.username == confirmUser && currentAccount.pin == confirmPin) {
    
    const index = accounts.findIndex((acc) => acc.username == confirmUser)
    accounts.splice(index, 1)
    containerApp.style.opacity = 0
    console.log(accounts)
    
  } else {
    alert("something went wrong! can't close the acccount")
  }

})

let sorted = false
btnSort.addEventListener("click", function(e) {
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted
})