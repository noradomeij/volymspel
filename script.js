// --- DOM Elementer (Ingen ändring) ---
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const questionTextElement = document.getElementById('question-text');
const shapeDiagramElement = document.getElementById('shape-diagram');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer');
const feedbackArea = document.getElementById('feedback-area');
const nextButton = document.getElementById('next-button');

// --- Spelvariabler (Ingen ändring) ---
let score = 0;
let level = 1;
let currentCorrectAnswer = 0;
let consecutiveCorrectAnswers = 0;
const QUESTIONS_PER_LEVEL = 3; 

// Funktion för att generera slumpmässigt heltal
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funktion för att runda till heltal
function roundAnswer(num) {
    // Vi avrundar till närmaste heltal här för att säkerställa att svaret är ett heltal.
    return Math.round(num); 
}

// --- Problemgenerator (UPPDATERAD) ---
function generateProblem(currentLevel) {
    let shapeType = 'prisma';
    if (currentLevel >= 2) {
        shapeType = Math.random() < 0.5 ? 'prisma' : 'pyramid';
    }

    let baseType = Math.random() < 0.5 ? 'rektangel' : 'triangel';
    let baseArea, volume, question;
    let w, l, b, h_base, h_shape;

    // Bestäm gränser baserat på nivå
    const minDim = 3 + currentLevel;
    const maxDim = 10 + currentLevel * 2;

    // Steg 1: Generera dimensioner
    h_shape = getRandomInt(minDim, maxDim); // Höjd för formen (prisma/pyramid)

    if (baseType === 'rektangel') {
        w = getRandomInt(minDim, maxDim); // Bredd
        l = getRandomInt(minDim, maxDim); // Längd
        baseArea = w * l;
        
        // UPPDATERAD FRÅGETEXT (utan asterisker)
        question = `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} med en rektangulär bas (Längd: ${l} cm, Bredd: ${w} cm) och en höjd på ${h_shape} cm.`;

        // Diagram-tagg
        const diagramLabel = shapeType === 'prisma' 
            ? `rectangular prism with L=${l}, W=${w}, H=${h_shape}` 
            : `rectangular pyramid with base L=${l}, W=${w}, and height H=${h_shape}`;
        shapeDiagramElement.innerHTML = `

[Image of ${diagramLabel}]
`;

    } else { // Triangel
        // För att få heltal i pyramidvolymer (V=1/3*A*H) MÅSTE antingen BaseArea eller H vara delbart med 3.
        b = getRandomInt(minDim, maxDim); // Basens bas (b)
        h_base = getRandomInt(minDim, maxDim); // Basens höjd (h_base)
        baseArea = 0.5 * b * h_base;

        // UPPDATERAD FRÅGETEXT (utan asterisker)
        question = `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} med en triangulär bas (Bas: ${b} cm, Basens höjd: ${h_base} cm) och en höjd på ${h_shape} cm.`;

        // Diagram-tagg
        const diagramLabel = shapeType === 'prisma' 
            ? `triangular prism with base B=${b}, base height h_base=${h_base}, and shape height H=${h_shape}` 
            : `triangular pyramid with base B=${b}, base height h_base=${h_base}, and shape height H=${h_shape}`;
        shapeDiagramElement.innerHTML = `

[Image of ${diagramLabel}]
`;
    }

    // Steg 2: Beräkna volym
    if (shapeType === 'prisma') {
        // Volym för Prisma: V = Basarea * Höjd. (Ska alltid vara heltal om dimensionerna är heltal)
        volume = baseArea * h_shape;
        question = `Beräkna volymen för en rät ${question}`;
    } else { // Pyramid
        // Volym för Pyramid: V = (1/3) * Basarea * Höjd.
        // Vi behöver garantera att (Basarea * H) är delbart med 3.
        let V_product = baseArea * h_shape;
        
        // Justera höjden om produkten inte är delbar med 3
        if (V_product % 3 !== 0) {
            // Vi multiplicerar h_shape med 3 om V_product inte är delbart med 3.
            // Detta garanterar att den nya produkten är delbar med 3.
            h_shape *= 3; 
            
            // Uppdatera frågetexten med den nya, justerade höjden
            question = question.replace(`och en höjd på ${h_shape / 3} cm.`, `och en höjd på ${h_shape} cm.`);

            // Uppdatera diagram-taggen med den nya höjden
            shapeDiagramElement.innerHTML = shapeDiagramElement.innerHTML.replace(`H=${h_shape / 3}`, `H=${h_shape}`);
        }
        
        // Beräkna den korrekta, heltaliga volymen
        volume = (baseArea * h_shape) / 3;
        question = `Beräkna volymen för en rät ${question}`;
    }
    
    questionTextElement.textContent = question;
    currentCorrectAnswer = roundAnswer(volume); // Avrundar till närmaste heltal
    
    // Sätt input-steget till 1, eftersom svaret ska vara ett heltal
    answerInput.step = "1";
    answerInput.min = "1";
}

// --- Spel-logik (små ändringar för att hantera heltal) ---
function checkAnswer(event) {
    event.preventDefault();

    // Vi jämför med heltal (vilket roundAnswer garanterar)
    const userAnswer = Math.round(parseFloat(answerInput.value)); 
    const isCorrect = userAnswer === currentCorrectAnswer;

    feedbackArea.textContent = '';
    feedbackArea.classList.remove('correct', 'incorrect');
    
    if (isCorrect) {
        score++;
        consecutiveCorrectAnswers++;
        // Ändrat texten för att reflektera heltal
        feedbackArea.textContent = `Rätt! Volymen är ${currentCorrectAnswer} cm³ (heltal).`; 
        feedbackArea.classList.add('correct');
        
        if (consecutiveCorrectAnswers % QUESTIONS_PER_LEVEL === 0) {
            level++;
            alert(`Grattis! Du har nått nivå ${level}! Svårighetsgraden ökar.`);
            consecutiveCorrectAnswers = 0;
        }
    } else {
        // Ändrat texten för att reflektera heltal
        feedbackArea.textContent = `Fel. Rätt svar är ${currentCorrectAnswer} cm³ (heltal). Försök igen.`; 
        feedbackArea.classList.add('incorrect');
        consecutiveCorrectAnswers = 0;
    }

    updateUI();
    answerInput.disabled = true;
    nextButton.style.display = 'block';
    answerForm.querySelector('button').disabled = true;
}

// --- Nästa fråga och UI (Ingen ändring) ---
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
