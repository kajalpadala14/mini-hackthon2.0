const quizAPI = 'https://the-trivia-api.com/v2/questions';

let easyQuestions = [];
let mediumQuestions = [];
let hardQuestions = [];
let currentCategory = "";
let player1Score = 0;
let player2Score = 0;
let currentDifficulty = 'easy';
let currentEasyQuestionIndex = 0;
let currentMediumQuestionIndex = 0;
let currentHardQuestionIndex = 0;
let currentPlayer = 'Player 1';

document.querySelector('.form').addEventListener('submit', function (event) {
    event.preventDefault();

    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;
    currentCategory = document.getElementById('category').value;

    document.getElementById('player-1-heading').innerText = player1Name;
    document.getElementById('player-2-heading').innerText = player2Name;

    document.querySelector('.firstContainer').style.display = 'none';
    document.querySelector('.quiz').style.display = 'block';

    fetchQuestionsForCategory(currentCategory);
});

function fetchCategories() {
    fetch('https://the-trivia-api.com/api/categories')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category');
            for (const [key, value] of Object.entries(data)) {
                const option = document.createElement('option');
                option.value = key;
                option.innerText = value;
                categorySelect.appendChild(option);
            }
        })
        .catch(error => console.error('fetching categories:', error));
}

fetchCategories();

function fetchQuestionsForCategory(category) {
    let fetchCount = 0;

    fetch(`${quizAPI}?categories=${category}&limit=2&difficulty=easy`)
        .then(response => response.json())
        .then(data => {
            easyQuestions = data;
            fetchCount++;
            if (fetchCount === 3) {
                showNextQuestion();
            }
        })
        .catch(error => console.error('fetching easy questions:', error));

    fetch(`${quizAPI}?categories=${category}&limit=2&difficulty=medium`)
        .then(response => response.json())
        .then(data => {
            mediumQuestions = data;
            fetchCount++;
            if (fetchCount === 3) {
                showNextQuestion();
            }
        })
        .catch(error => console.error('fetching medium questions:', error));

    fetch(`${quizAPI}?categories=${category}&limit=2&difficulty=hard`)
        .then(response => response.json())
        .then(data => {
            hardQuestions = data;
            fetchCount++;
            if (fetchCount === 3) {
                showNextQuestion();
            }
        })
        .catch(error => console.error('fetching hard questions:', error));
}

function showNextQuestion() {
    let questionData;

    if (currentDifficulty === 'easy') {
        if (currentEasyQuestionIndex >= easyQuestions.length) {
            currentDifficulty = 'medium';
            showNextQuestion();
            return;
        }
        questionData = easyQuestions[currentEasyQuestionIndex];
        currentEasyQuestionIndex++;
    } else if (currentDifficulty === 'medium') {
        if (currentMediumQuestionIndex >= mediumQuestions.length) {
            currentDifficulty = 'hard';
            showNextQuestion();
            return;
        }
        questionData = mediumQuestions[currentMediumQuestionIndex];
        currentMediumQuestionIndex++;
    } else if (currentDifficulty === 'hard') {
        if (currentHardQuestionIndex >= hardQuestions.length) {
            endGame();
            return;
        }
        questionData = hardQuestions[currentHardQuestionIndex];
        currentHardQuestionIndex++;
    }

    const playerDivId = currentPlayer === 'Player 1' ? 'player-1-questions' : 'player-2-questions';
    document.getElementById(playerDivId).innerHTML = '';
    displayQuestion(playerDivId, questionData, currentDifficulty, currentPlayer);

    currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
}

function displayQuestion(playerDivId, questionData, difficulty, player) {
    const questionText = questionData.question.text;
    const correctAnswer = questionData.correctAnswer;
    const incorrectAnswers = questionData.incorrectAnswers;

    const allOptions = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

    const questionHTML = `
        <p><b>${difficulty.toUpperCase()} Question for ${player}:</b> ${questionText}</p>
        <ul>
            ${allOptions.map(option => `<li onclick="checkAnswer('${option}', '${correctAnswer}', '${difficulty}', '${player}')">${option}</li>`).join('')}
        </ul>
    `;

    document.getElementById(playerDivId).innerHTML += questionHTML;
}

function checkAnswer(selectedAnswer, correctAnswer, difficulty, player) {
    if (selectedAnswer === correctAnswer) {
        let scoreIncrement;
        if (difficulty === 'easy') {
            scoreIncrement = 10;
        } else if (difficulty === 'medium') {
            scoreIncrement = 15;
        } else if (difficulty === 'hard') {
            scoreIncrement = 20;
        }

        if (player === 'Player 1') {
            player1Score += scoreIncrement;
        } else {
            player2Score += scoreIncrement;
        }

        updateScores();
    }

    showNextQuestion();
}

function updateScores() {
    document.getElementById('player1-score').innerText = player1Score;
    document.getElementById('player2-score').innerText = player2Score;
}

function endGame() {
    let winner;
    if (player1Score > player2Score) {
        winner = 'Player 1 wins with ' + player1Score + ' points!';
    } else if (player2Score > player1Score) {
        winner = 'Player 2 wins with ' + player2Score + ' points!';
    } else {
        winner = "It's a tie!";
    }
    alert(winner);
    location.reload();
}