// ========================================
// DIGITAL CLOCK - JavaScript & DOM
// ========================================

// ==============================================
// 1. DOM SELECTION & CACHING
// ==============================================

// Method 1: getElementById() - Get element by ID
const clockDisplay = document.getElementById('clockDisplay');
const dateDisplay = document.getElementById('dateDisplay');

// Method 2: querySelector() - CSS selector (more flexible)
const btn12Hour = document.querySelector('#btn12Hour');
const container = document.querySelector('.clock-container');

// Method 3: querySelectorAll() - Select multiple elements
const allButtons = document.querySelectorAll('button');

// Best Practice: Cache DOM references outside functions
// This avoids repeatedly querying the DOM


// ==============================================
// 2. DATE OBJECT - Getting Time
// ==============================================

// Create new Date object (current date and time)
const now = new Date();

// Get time components
const hours = now.getHours();       // 0-23
const minutes = now.getMinutes();   // 0-59
const seconds = now.getSeconds();   // 0-59
const day = now.getDate();          // 1-31
const month = now.getMonth();       // 0-11
const year = now.getFullYear();     // 2024

// Create specific date
const specificDate = new Date(2024, 0, 15);  // Jan 15, 2024

// Get milliseconds since epoch
const timestamp = now.getTime();

// Format date nicely
const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',    // Monday
    year: 'numeric',    // 2024
    month: 'long',      // January
    day: 'numeric'      // 15
});


// ==============================================
// 3. SETINTERVAL() - Repeated Execution
// ==============================================

// Run function every X milliseconds
setInterval(() => {
    console.log('This runs every 1 second');
}, 1000);  // 1000 milliseconds = 1 second

// Store interval ID for later clearing
const clockInterval = setInterval(() => {
    updateDisplay();
}, 1000);

// Stop the interval when needed
// clearInterval(clockInterval);

// Alternatives:
// setTimeout() - Run once after delay
setTimeout(() => {
    console.log('Runs once after 2 seconds');
}, 2000);

// requestAnimationFrame() - Optimized for animations
// requestAnimationFrame(updateDisplay);


// ==============================================
// 4. DOM MANIPULATION - Changing Content
// ==============================================

// Method 1: textContent - Set/get text (plain text only)
clockDisplay.textContent = '12:30:45';
const currentText = clockDisplay.textContent;

// Method 2: innerHTML - Set/get HTML (dangerous with user input!)
container.innerHTML = '<p>New content with <strong>HTML</strong></p>';

// Method 3: innerText - Like textContent but respects CSS visibility
clockDisplay.innerText = '12:30:45';

// Difference Example:
// <div id="test">Hello <span style="display:none;">World</span></div>
// textContent returns: "Hello World"
// innerText returns:   "Hello"  (hidden text ignored)


// ==============================================
// 5. DOM MANIPULATION - Attributes
// ==============================================

// Get attribute value
const id = clockDisplay.getAttribute('id');
const dataValue = clockDisplay.getAttribute('data-time');

// Set attribute value
clockDisplay.setAttribute('data-time', '12:30:45');
clockDisplay.setAttribute('class', 'active-clock');

// Remove attribute
clockDisplay.removeAttribute('disabled');

// Shorthand for common attributes
clockDisplay.id = 'newId';
clockDisplay.className = 'clock-active';  // Sets entire class
clockDisplay.title = 'Digital Clock';
clockDisplay.value = '10';


// ==============================================
// 6. DOM MANIPULATION - Classes
// ==============================================

// Method 1: Add a class
clockDisplay.classList.add('active');

// Method 2: Remove a class
clockDisplay.classList.remove('inactive');

// Method 3: Toggle a class (add if not present, remove if present)
clockDisplay.classList.toggle('dark-mode');

// Method 4: Check if element has class
if (clockDisplay.classList.contains('active')) {
    console.log('Element has active class');
}

// Method 5: Replace a class
clockDisplay.classList.replace('old-class', 'new-class');

// Multiple classes at once
clockDisplay.classList.add('active', 'highlight', 'bold');

// Clear all classes
clockDisplay.className = '';


// ==============================================
// 7. DOM MANIPULATION - Styles
// ==============================================

// Method 1: Inline styles (direct style object)
clockDisplay.style.color = '#FF0000';
clockDisplay.style.fontSize = '24px';
clockDisplay.style.backgroundColor = '#FFF';

// Method 2: CSS properties (camelCase)
clockDisplay.style.cssText = 'color: red; font-size: 24px;';

// Get computed style
const computedStyle = window.getComputedStyle(clockDisplay);
const fontSize = computedStyle.fontSize;
const color = computedStyle.color;

// Better approach: Use CSS classes instead
// clockDisplay.classList.add('large-font');  // In CSS: .large-font { font-size: 24px; }


// ==============================================
// 8. DOM EVENTS - User Interaction
// ==============================================

// Method 1: Inline HTML event handlers
// <button onclick="handleClick()">Click me</button>

// Method 2: addEventListener() - Recommended
btn12Hour.addEventListener('click', () => {
    is24HourFormat = false;
    updateDisplay();
});

// Method 3: Direct event handler
btn12Hour.onclick = () => {
    console.log('Button clicked');
};

// Remove event listener
function handleClick() {}
btn12Hour.removeEventListener('click', handleClick);

// Common events:
// - click
// - change
// - input
// - submit
// - keypress
// - keydown
// - keyup
// - mouseenter
// - mouseleave
// - focus
// - blur
// - load
// - resize
// - scroll


// ==============================================
// 9. DOM TRAVERSAL - Navigate the DOM Tree
// ==============================================

// Parent element
const parent = clockDisplay.parentElement;
const parentNode = clockDisplay.parentNode;

// Child elements
const firstChild = container.firstElementChild;
const lastChild = container.lastElementChild;
const children = container.children;  // HTMLCollection

// Siblings
const nextSibling = clockDisplay.nextElementSibling;
const previousSibling = clockDisplay.previousElementSibling;

// Find closest ancestor matching selector
const activeContainer = clockDisplay.closest('.active');

// Get all descendants matching selector
const buttons = container.querySelectorAll('button');


// ==============================================
// 10. COMPLETE CLOCK EXAMPLE
// ==============================================

let is24HourFormat = false;
let isDarkMode = false;

function updateClock() {
    // Step 1: Get current time
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Step 2: Format time
    let timeString;
    if (is24HourFormat) {
        timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    }

    // Step 3: Update DOM
    document.getElementById('clockDisplay').textContent = timeString;
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function pad(num) {
    return String(num).padStart(2, '0');
}

function toggleFormat() {
    is24HourFormat = !is24HourFormat;
    updateClock();
    
    // Update button states
    document.getElementById('btn12Hour').classList.toggle('active', !is24HourFormat);
    document.getElementById('btn24Hour').classList.toggle('active', is24HourFormat);
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
}

// Initialize
updateClock();
setInterval(updateClock, 1000);

// Add event listeners
document.getElementById('btn12Hour').addEventListener('click', () => {
    is24HourFormat = false;
    updateClock();
});

document.getElementById('btn24Hour').addEventListener('click', () => {
    is24HourFormat = true;
    updateClock();
});

document.getElementById('btnDarkMode').addEventListener('click', toggleDarkMode);


// ==============================================
// 11. DOM MANIPULATION BEST PRACTICES
// ==============================================

// ✅ DO: Cache DOM references
const myElement = document.getElementById('myId');
myElement.textContent = 'Content 1';
myElement.textContent = 'Content 2';  // Reuses cached reference

// ❌ DON'T: Query DOM repeatedly
document.getElementById('myId').textContent = 'Content 1';
document.getElementById('myId').textContent = 'Content 2';  // Queries twice

// ✅ DO: Use classList for styling
element.classList.add('active');

// ❌ DON'T: Manipulate inline styles
element.style.color = 'red';
element.style.fontSize = '16px';

// ✅ DO: Use textContent for security
element.textContent = userInput;

// ❌ DON'T: Use innerHTML with user input (XSS vulnerability)
element.innerHTML = userInput;

// ✅ DO: Event delegation for dynamic elements
document.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        console.log('Button clicked');
    }
});

// ✅ DO: Use requestAnimationFrame for smooth animations
function animate() {
    // Update DOM
    requestAnimationFrame(animate);
}
animate();

// ❌ DON'T: Overuse setInterval (can cause lag)
setInterval(() => {
    // Heavy DOM manipulation
}, 16);  // ~60 FPS