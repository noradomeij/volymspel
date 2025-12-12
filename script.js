// --- DOM Elementer ---
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const questionTextElement = document.getElementById('question-text');
const shapeDiagramElement = document.getElementById('shape-diagram');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer');
const feedbackArea = document.getElementById('feedback-area');
const nextButton = document.getElementById('next-button');

// --- Spelvariabler ---
let score = 0;
let level = 1;
let currentCorrectAnswer = 0;
let consecutiveCorrectAnswers = 0;
const QUESTIONS_PER_LEVEL = 3; 

// Funktion för att generera slumpmässigt heltal
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funktion för att runda till två decimaler
function roundAnswer(num) {
    return Math.round(num * 100) / 100;
}

// --- Problemgenerator ---
function generateProblem(currentLevel) {
    // Bestäm om det ska vara en prisma eller en pyramid baserat på nivå
    // Nivå 1: Endast prisma (enklare)
    // Nivå 2+: Slumpmässigt prisma eller pyramid
    
    let shapeType = 'prisma';
    if (currentLevel >= 2) {
        shapeType = Math.random() < 0.5 ? 'prisma' : 'pyramid';
    }

    let baseType = Math.random() < 0.5 ? 'rektangel' : 'triangel';
    let baseArea, height, volume, question;
    let w, l, b, h_base, h_shape;

    // Bestäm gränser baserat på nivå (Svårighetsgrad)
    const minDim = 2 + currentLevel;
    const maxDim = 10 + currentLevel * 2;

    h_shape = getRandomInt(minDim, maxDim); // Höjd för formen (prisma/pyramid)

    if (baseType === 'rektangel') {
        w = getRandomInt(minDim, maxDim); // Bredd
        l = getRandomInt(minDim, maxDim); // Längd
        baseArea = w * l;
        question = `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} med en **rektangulär bas** (Längd: ${l} cm, Bredd: ${w} cm) och en höjd på **${h_shape} cm**.`;
        
        // Infoga diagram
        shapeDiagramElement.innerHTML = ``;
    } else { // Triangel
        b = getRandomInt(minDim, maxDim); // Basens bas (b)
        h_base = getRandomInt(minDim, maxDim); // Basens höjd (h_base)
        baseArea = 0.5 * b * h_base;
        question = `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} med en **triangulär bas** (Bas: ${b} cm, Basens höjd: ${h_base} cm) och en höjd på **${h_shape} cm**.`;

        // Infoga diagram
        shapeDiagramElement.innerHTML = ``;
    }

    if (shapeType === 'prisma') {
        // Volym för Prisma: V = Basarea * Höjd
        volume = baseArea * h_shape;
        question = `Beräkna volymen för en rät **${question}**`;
    } else { // Pyramid
        // Volym för Pyramid: V = (1/3) * Basarea * Höjd
        volume = (1/3) * baseArea * h_shape;
        question = `Beräkna volymen för en rät **${question}**`;
    }
    
    questionTextElement.textContent = question;
    currentCorrectAnswer = roundAnswer(volume);
}

// --- Spel-logik ---
function checkAnswer(event) {
    event.preventDefault(); // Förhindra omladdning av sidan

    const userAnswer = parseFloat(answerInput.value);
    // Använd en liten tolerans för att hantera avrundningsfel
    const tolerance = 0.05;
    const isCorrect = Math.abs(userAnswer - currentCorrectAnswer) <= tolerance;

    feedbackArea.textContent = ''; // Rensa föregående feedback
    feedbackArea.classList.remove('correct', 'incorrect');
    
    if (isCorrect) {
        score++;
        consecutiveCorrectAnswers++;
        feedbackArea.textContent = `Rätt! Volymen är ${currentCorrectAnswer} cm³.`;
        feedbackArea.classList.add('correct');
        
        if (consecutiveCorrectAnswers % QUESTIONS_PER_LEVEL === 0) {
            level++;
            alert(`Grattis! Du har nått nivå ${level}! Svårighetsgraden ökar.`);
            consecutiveCorrectAnswers = 0; // Återställ för nya nivån
        }
    } else {
        feedbackArea.textContent = `Fel. Rätt svar är ${currentCorrectAnswer} cm³. Försök igen.`;
        feedbackArea.classList.add('incorrect');
        consecutiveCorrectAnswers = 0; // Återställ vid fel
    }

    updateUI();
    answerInput.disabled = true;
    nextButton.style.display = 'block';
    answerForm.querySelector('button').disabled = true;
}

function nextQuestion() {
    answerInput.value = '';
    answerInput.disabled = false;
    answerForm.querySelector('button').disabled = false;
    feedbackArea.textContent = '';
    feedbackArea.classList.remove('correct', 'incorrect');
    nextButton.style.display = 'none';
    answerInput.focus();

    generateProblem(level);
}

function updateUI() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
}

// --- Händelsehanterare ---
answerForm.addEventListener('submit', checkAnswer);
nextButton.addEventListener('click', nextQuestion);

// Starta spelet
nextQuestion();
