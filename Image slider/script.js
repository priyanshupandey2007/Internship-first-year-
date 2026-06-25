const sliderContainer = document.getElementById('slider-container');
const slides = document.querySelectorAll('.slide');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');
const indicatorsContainer = document.getElementById('indicators');

let activeSlide = 0;
let slideInterval;
const autoSlideDelay = 4000; // 4 seconds

// 1. Dynamic Creation of Indicator Dots
function createIndicators() {
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        
        // Add click event listener to each dot
        dot.addEventListener('click', () => {
            activeSlide = idx;
            updateSlider();
            resetTimer(); // Reset auto-slide when user interacts
        });
        
        indicatorsContainer.appendChild(dot);
    });
}

// 2. Main DOM Update Logic
function updateSlider() {
    // Update Slide Classes
    slides.forEach(slide => slide.classList.remove('active'));
    slides[activeSlide].classList.add('active');

    // Update Dot Classes
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[activeSlide].classList.add('active');
}

// 3. Navigation Controls
function nextSlide() {
    activeSlide++;
    if (activeSlide > slides.length - 1) {
        activeSlide = 0;
    }
    updateSlider();
}

function prevSlide() {
    activeSlide--;
    if (activeSlide < 0) {
        activeSlide = slides.length - 1;
    }
    updateSlider();
}

// 4. Timer Logic (Auto-Slide)
function startTimer() {
    slideInterval = setInterval(nextSlide, autoSlideDelay);
}

function resetTimer() {
    clearInterval(slideInterval);
    startTimer();
}

// 5. Event Listeners
rightBtn.addEventListener('click', () => {
    nextSlide();
    resetTimer();
});

leftBtn.addEventListener('click', () => {
    prevSlide();
    resetTimer();
});

// Pause auto-slide when mouse hovers over slider
sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
sliderContainer.addEventListener('mouseleave', startTimer);

// Initialize Slider Features
createIndicators();
startTimer();