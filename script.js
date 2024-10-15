const quizAPI = 'https://the-trivia-api.com/v2/questions';

let quizData = [];
let currentCategory = "";
let player1Score = 0;
let player2Score = 0;
let currentQuestionIndex = 0;
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
    fetch(`${quizAPI}?categories=${category}&limit=6`)
        .then(response => response.json())
        .then(data => {
            quizData = data;
            currentQuestionIndex = 0;
            showNextQuestion();
        })
        .catch(error => console.error('fetching data:', error));
}

function showNextQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        endGame();
        return;
    }

    const questionData = quizData[currentQuestionIndex];
    const difficulty = questionData.difficulty;

    const playerDivId = currentPlayer === 'Player 1' ? 'player-1-questions' : 'player-2-questions';

    document.getElementById(playerDivId).innerHTML = '';

    displayQuestion(playerDivId, questionData, difficulty, currentPlayer);

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
            ${allOptions.map((option, index) => `<li onclick="checkAnswer('${option}', '${correctAnswer}', '${difficulty}', '${player}')">${option}</li>`).join('')}
        </ul>
    `;

    document.getElementById(playerDivId).innerHTML += questionHTML;
}

function checkAnswer(selectedAnswer, correctAnswer, difficulty, player) {
    if (selectedAnswer === correctAnswer) {
        if (difficulty === 'easy') {
            player === 'Player 1' ? player1Score += 10 : player2Score += 10;
        } else if (difficulty === 'medium') {
            player === 'Player 1' ? player1Score += 15 : player2Score += 15;
        } else if (difficulty === 'hard') {
            player === 'Player 1' ? player1Score += 20 : player2Score += 20;
        }

        updateScores();
    }

    currentQuestionIndex++;
    showNextQuestion();
}

function updateScores() {
    document.getElementById('player1-score').innerText = player1Score;
    document.getElementById('player2-score').innerText = player2Score;
}

function endGame() {
    if (player1Score > player2Score) {
        alert('Player 1 wins with ' + player1Score + ' points!');
    } else if (player2Score > player1Score) {
        alert('Player 2 wins with ' + player2Score + ' points!');
    } else {
        alert('It\'s a tie!');
    }

    location.reload();
}
