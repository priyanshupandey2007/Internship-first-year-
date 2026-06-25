// 1. App Database
const quizData = [
    {
        question: "Which programming language is known as the 'scripting language for the Web'?",
        a: "Java", b: "Python", c: "JavaScript", d: "C++",
        correct: "C"
    },
    {
        question: "What does CSS stand for?",
        a: "Creative Style Sheets", b: "Cascading Style Sheets",
        c: "Computer Style Sheets", d: "Colorful Style Sheets",
        correct: "B"
    },
    {
        question: "Which HTML element is used to link an external JavaScript file?",
        a: "<script>", b: "<javascript>", c: "<js>", d: "<link>",
        correct: "A"
    },
    {
        question: "What is the default value of the position property in CSS?",
        a: "absolute", b: "relative", c: "fixed", d: "static",
        correct: "D"
    }
];

// 2. State Management Objects
let currentQuizIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;
const TIME_LIMIT = 15;

// DOM Elements Selection
const quizEl = document.getElementById('quiz');
const resultPanelEl = document.getElementById('result-panel');
const progressText = document.getElementById('progress-text');
const timeClock = document.getElementById('time-clock');
const questionEl = document.getElementById('question');
const optionBtns = document.querySelectorAll('.option-btn');
const nextBtn = document.getElementById('next-btn');
const scoreText = document.getElementById('score-text');
const restartBtn = document.getElementById('restart-btn');

// 3. Application Workflow Bootstrapping
function loadQuiz() {
    resetOptionsState();
    timeLeft = TIME_LIMIT;
    timeClock.innerText = timeLeft;
    
    const currentQuiz = quizData[currentQuizIndex];
    
    // Dynamic UI Updates
    progressText.innerText = `Question ${currentQuizIndex + 1} of ${quizData.length}`;
    questionEl.innerText = currentQuiz.question;
    optionBtns[0].innerText = currentQuiz.a;
    optionBtns[1].innerText = currentQuiz.b;
    optionBtns[2].innerText = currentQuiz.c;
    optionBtns[3].innerText = currentQuiz.d;

    startTimer();
}

// 4. Timer Mechanics
function startTimer() {
    clearInterval(timerInterval); // Defensive clear
    timerInterval = setInterval(() => {
        timeLeft--;
        timeClock.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    // Lock matching user answer selection, reveal truth automatically
    const correctLetter = quizData[currentQuizIndex].correct;
    highlightCorrectAnswer(correctLetter);
    disableOptionButtons();
    nextBtn.disabled = false;
}

// 5. Answer Validation Rules
optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        clearInterval(timerInterval);
        const selectedAnswer = e.target.getAttribute('data-char');
        const correctAnswer = quizData[currentQuizIndex].correct;

        disableOptionButtons();

        if (selectedAnswer === correctAnswer) {
            e.target.classList.add('correct');
            score++;
        } else {
            e.target.classList.add('wrong');
            highlightCorrectAnswer(correctAnswer); // Show user what they missed
        }

        nextBtn.disabled = false;
    });
});

// Helper functions for options state
function disableOptionButtons() {
    optionBtns.forEach(btn => btn.disabled = true);
}

function highlightCorrectAnswer(letter) {
    optionBtns.forEach(btn => {
        if (btn.getAttribute('data-char') === letter) {
            btn.classList.add('correct');
        }
    });
}

function resetOptionsState() {
    nextBtn.disabled = true;
    optionBtns.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}

// 6. Navigation Progression Controls
nextBtn.addEventListener('click', () => {
    currentQuizIndex++;

    if (currentQuizIndex < quizData.length) {
        loadQuiz();
    } else {
        // Complete state swap
        quizEl.classList.add('hidden');
        resultPanelEl.classList.remove('hidden');
        scoreText.innerText = `${score} / ${quizData.length}`;
    }
});

// Restart functionality
restartBtn.addEventListener('click', () => {
    currentQuizIndex = 0;
    score = 0;
    resultPanelEl.classList.add('hidden');
    quizEl.classList.remove('hidden');
    loadQuiz();
});

// Initializing runtime lifecycle
loadQuiz();