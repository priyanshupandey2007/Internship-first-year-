const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 1. Data Persistence (Local Storage Fetching)
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

// Fallback to empty array if local storage is clean
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// 2. Add New Transaction Logic
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: parseFloat(amount.value)
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Reset Form Input Fields
    text.value = '';
    amount.value = '';
}

// Helper to generate an unique ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// 3. Render Transaction List inside DOM
function addTransactionDOM(transaction) {
    // Check sign value to attach correct styling class
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// 4. Calculations Using Chainable Array Methods
function updateValues() {
    // Pull out amounts into an isolated array
    const amounts = transactions.map(transaction => transaction.amount);

    // Calculate Total Balance via reduce()
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    // Calculate Income via filter() and reduce()
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    // Calculate Expense via filter() and reduce()
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    // Update screen elements
    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;
}

// 5. Delete Transaction Logic
function removeTransaction(id) {
    // Filter out the selected transaction by ID
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    updateLocalStorage();
    init(); // Re-render application state
}

// Update Local Storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init App / Paint view initially
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Start app
init();

// Event Listeners
form.addEventListener('submit', addTransaction);