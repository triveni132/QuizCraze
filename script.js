// Quiz Data
const quizData = [{
    question: "What is the capital of France?",
    type: "single",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: [2],
    explanation: "Paris is the capital and largest city of France."
}, {
    question: "Which of the following are programming languages? (Select all that apply)",
    type: "multiple",
    options: ["JavaScript", "HTML", "Python", "CSS", "Java"],
    correct: [0, 2, 4],
    explanation: "JavaScript, Python, and Java are programming languages. HTML and CSS are markup and styling languages."
}, {
    question: "The largest planet in our solar system is ____.",
    type: "fill",
    correct: ["jupiter"],
    explanation: "Jupiter is the largest planet in our solar system."
}, {
    question: "What is 15 + 27?",
    type: "single",
    options: ["40", "42", "44", "46"],
    correct: [1],
    explanation: "15 + 27 equals 42."
}, {
    question: "Which of these are web browsers? (Select all that apply)",
    type: "multiple",
    options: ["Chrome", "Firefox", "Photoshop", "Safari", "Word"],
    correct: [0, 1, 3],
    explanation: "Chrome, Firefox, and Safari are web browsers. Photoshop and Word are software applications."
}, {
    question: "The process by which plants make their own food is called ____.",
    type: "fill",
    correct: ["photosynthesis"],
    explanation: "Photosynthesis is the process by which plants use sunlight to synthesize food."
}, {
    question: "Who wrote 'Romeo and Juliet'?",
    type: "single",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: [1],
    explanation: "Romeo and Juliet was written by William Shakespeare."
}, {
    question: "Which of these are primary colors? (Select all that apply)",
    type: "multiple",
    options: ["Red", "Green", "Blue", "Yellow", "Purple"],
    correct: [0, 2, 3],
    explanation: "Red, blue, and yellow are the primary colors in traditional color theory."
}, {
    question: "The chemical symbol for gold is ____.",
    type: "fill",
    correct: ["au"],
    explanation: "Au is the chemical symbol for gold, from the Latin word 'aurum'."
}, {
    question: "What is the smallest prime number?",
    type: "single",
    options: ["0", "1", "2", "3"],
    correct: [2],
    explanation: "2 is the smallest prime number and the only even prime number."
}];

// Quiz State
let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let showingFeedback = false;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const questionScreen = document.getElementById('questionScreen');
const resultScreen = document.getElementById('resultScreen');
const progressBar = document.getElementById('progressBar');
const questionCounter = document.getElementById('questionCounter');
const questionType = document.getElementById('questionType');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const feedbackMessage = document.getElementById('feedbackMessage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Start Quiz
function startQuiz() {
    startScreen.style.display = 'none';
    questionScreen.style.display = 'block';
    currentQuestion = 0;
    userAnswers = new Array(quizData.length).fill(null);
    score = 0;
    showingFeedback = false;
    displayQuestion();
}

// Display Current Question
function displayQuestion() {
    const question = quizData[currentQuestion];
    const progress = ((currentQuestion + 1) / quizData.length) * 100;

    progressBar.style.width = progress + '%';
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    questionText.textContent = question.question;

    // Set question type display
    const typeText = {
        'single': 'Single Choice',
        'multiple': 'Multiple Choice',
        'fill': 'Fill in the Blank'
    };
    questionType.textContent = typeText[question.type];

    // Clear previous options and feedback
    optionsContainer.innerHTML = '';
    feedbackMessage.className = 'feedback-message';
    feedbackMessage.textContent = '';

    // Generate options based on question type
    if (question.type === 'single' || question.type === 'multiple') {
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = `option ${question.type === 'multiple' ? 'checkbox-option' : ''}`;
            optionElement.innerHTML = `
                        <div class="option-icon"></div>
                        <span>${option}</span>
                    `;
            optionElement.onclick = () => selectOption(index, question.type);
            optionsContainer.appendChild(optionElement);
        });
    } else if (question.type === 'fill') {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.className = 'fill-blank-input';
        inputElement.placeholder = 'Type your answer here...';
        inputElement.oninput = (e) => handleFillAnswer(e.target.value);
        optionsContainer.appendChild(inputElement);
    }

    // Restore previous answers
    restorePreviousAnswer();

    // Update navigation buttons
    prevBtn.style.display = currentQuestion === 0 ? 'none' : 'block';
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Finish' : 'Next';
    nextBtn.innerHTML = currentQuestion === quizData.length - 1 ?
        '<i class="fas fa-flag-checkered"></i> Finish' :
        'Next <i class="fas fa-arrow-right"></i>';

    showingFeedback = false;
}

// Select Option (Single/Multiple Choice)
function selectOption(index, type) {
    if (showingFeedback) return;

    const options = document.querySelectorAll('.option');

    if (type === 'single') {
        // Single choice - clear all and select one
        options.forEach(opt => opt.classList.remove('selected'));
        options[index].classList.add('selected');
        userAnswers[currentQuestion] = [index];
    } else if (type === 'multiple') {
        // Multiple choice - toggle selection
        options[index].classList.toggle('selected');

        // Update user answers array
        if (!userAnswers[currentQuestion]) {
            userAnswers[currentQuestion] = [];
        }

        const answerIndex = userAnswers[currentQuestion].indexOf(index);
        if (answerIndex > -1) {
            userAnswers[currentQuestion].splice(answerIndex, 1);
        } else {
            userAnswers[currentQuestion].push(index);
        }
    }
}

// Handle Fill-in-the-Blank Answer
function handleFillAnswer(value) {
    userAnswers[currentQuestion] = value.toLowerCase().trim();
}

// Restore Previous Answer
function restorePreviousAnswer() {
    const question = quizData[currentQuestion];
    const answer = userAnswers[currentQuestion];

    if (!answer) return;

    if (question.type === 'single' || question.type === 'multiple') {
        const options = document.querySelectorAll('.option');
        if (Array.isArray(answer)) {
            answer.forEach(index => {
                if (options[index]) {
                    options[index].classList.add('selected');
                }
            });
        }
    } else if (question.type === 'fill') {
        const input = document.querySelector('.fill-blank-input');
        if (input && typeof answer === 'string') {
            input.value = answer;
        }
    }
}

// Show Feedback
function showFeedback() {
    const question = quizData[currentQuestion];
    const answer = userAnswers[currentQuestion];
    let isCorrect = false;

    // Check if answer is correct
    if (question.type === 'fill') {
        isCorrect = question.correct.some(correct =>
            answer && answer.toLowerCase().includes(correct.toLowerCase())
        );

        const input = document.querySelector('.fill-blank-input');
        input.className = `fill-blank-input ${isCorrect ? 'correct' : 'incorrect'}`;
    } else {
        if (Array.isArray(answer) && answer.length > 0) {
            if (question.type === 'single') {
                isCorrect = answer.length === 1 && question.correct.includes(answer[0]);
            } else {
                isCorrect = answer.length === question.correct.length &&
                    answer.every(a => question.correct.includes(a));
            }
        }

        // Highlight correct/incorrect options
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            if (question.correct.includes(index)) {
                option.classList.add('correct');
            } else if (answer && answer.includes(index)) {
                option.classList.add('incorrect');
            }
        });
    }

    // Show feedback message
    feedbackMessage.textContent = isCorrect ?
        `✅ Correct! ${question.explanation}` :
        `❌ Incorrect. ${question.explanation}`;
    feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'} show`;

    showingFeedback = true;
    return isCorrect;
}

// Next Question
function nextQuestion() {
    // Show feedback if not already shown
    if (!showingFeedback && userAnswers[currentQuestion] !== null && userAnswers[currentQuestion] !== undefined) {
        const isCorrect = showFeedback();
        if (isCorrect) score++;

        // Change button to "Continue" and wait for next click
        nextBtn.innerHTML = currentQuestion === quizData.length - 1 ?
            '<i class="fas fa-chart-bar"></i> View Results' :
            'Continue <i class="fas fa-arrow-right"></i>';
        return;
    }

    // Move to next question or finish quiz
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        finishQuiz();
    }
}

// Previous Question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

// Finish Quiz
function finishQuiz() {
    questionScreen.style.display = 'none';
    resultScreen.style.display = 'block';

    // Calculate final score if not already done
    if (!showingFeedback) {
        score = 0;
        userAnswers.forEach((answer, index) => {
            const question = quizData[index];
            let isCorrect = false;

            if (question.type === 'fill') {
                isCorrect = question.correct.some(correct =>
                    answer && answer.toLowerCase().includes(correct.toLowerCase())
                );
            } else if (Array.isArray(answer) && answer.length > 0) {
                if (question.type === 'single') {
                    isCorrect = answer.length === 1 && question.correct.includes(answer[0]);
                } else {
                    isCorrect = answer.length === question.correct.length &&
                        answer.every(a => question.correct.includes(a));
                }
            }

            if (isCorrect) score++;
        });
    }

    displayResults();
}

// Display Results
function displayResults() {
    const percentage = Math.round((score / quizData.length) * 100);
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultScore = document.getElementById('resultScore');
    const resultMessage = document.getElementById('resultMessage');

    // Set result icon and message based on score
    if (percentage >= 80) {
        resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        resultIcon.className = 'result-icon excellent';
        resultTitle.textContent = 'Excellent!';
        resultMessage.textContent = 'Outstanding performance! You really know your stuff and should be proud of your achievement!';
    } else if (percentage >= 60) {
        resultIcon.innerHTML = '<i class="fas fa-thumbs-up"></i>';
        resultIcon.className = 'result-icon good';
        resultTitle.textContent = 'Good Job!';
        resultMessage.textContent = 'Well done! You have a solid understanding of the topics and performed admirably.';
    } else {
        resultIcon.innerHTML = '<i class="fas fa-redo"></i>';
        resultIcon.className = 'result-icon poor';
        resultTitle.textContent = 'Keep Learning!';
        resultMessage.textContent = 'Don\'t worry! Every expert was once a beginner. Practice makes perfect - try again to improve your score!';
    }

    resultScore.textContent = `Your Score: ${score}/${quizData.length} (${percentage}%)`;

    // Update result details
    document.getElementById('correctCount').textContent = score;
    document.getElementById('incorrectCount').textContent = quizData.length - score;
    document.getElementById('accuracyRate').textContent = percentage + '%';
}

// Restart Quiz
function restartQuiz() {
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
    currentQuestion = 0;
    userAnswers = [];
    score = 0;
    showingFeedback = false;
}

// Review Answers (Future Enhancement)
function reviewAnswers() {
    alert('🔍 Review feature coming soon! \n\nFor now, you can restart the quiz to practice again and improve your score. Each attempt helps you learn better!');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('QuizCraze initialized successfully! 🎉');
});