const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate-btn');
const copyEl = document.getElementById('copy-btn');

const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~|}{[]:;?><,./-='
};

// Generate event listener
generateEl.addEventListener('click', () => {
    const length = parseInt(lengthEl.value);
    
    // Form Validation
    if (isNaN(length) || length < 4 || length > 32) {
        alert('Please enter a length between 4 and 32.');
        return;
    }

    let allowedChars = '';
    if (uppercaseEl.checked) allowedChars += charSets.uppercase;
    if (lowercaseEl.checked) allowedChars += charSets.lowercase;
    if (numbersEl.checked) allowedChars += charSets.numbers;
    if (symbolsEl.checked) allowedChars += charSets.symbols;

    if (allowedChars === '') {
        alert('Please select at least one character type!');
        return;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        generatedPassword += allowedChars[randomIndex];
    }

    resultEl.innerText = generatedPassword;
});

// Copy password to clipboard
copyEl.addEventListener('click', () => {
    const password = resultEl.innerText;
    
    if (!password || password === 'Select options below') {
        return;
    }
    
    navigator.clipboard.writeText(password).then(() => {
        alert('Password copied to clipboard!');
    });
});