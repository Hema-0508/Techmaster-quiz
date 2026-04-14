let currentLanguage;
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

/* ---------------- LOGIN FUNCTION ---------------- */

function login() {
    const username = document.getElementById("username").value;

    if (username.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    localStorage.setItem("username", username);

    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("language-screen").classList.remove("hidden");
}

/* ---------------- START QUIZ ---------------- */

function startQuiz(lang) {
    currentLanguage = lang;
    currentIndex = 0;
    score = 0;

    document.getElementById("language-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");

    loadQuestion();
}

/* ---------------- LOAD QUESTION ---------------- */

function loadQuestion() {

    resetTimer();

    const questionObj = quizData[currentLanguage][currentIndex];

    document.getElementById("question").innerText = questionObj.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    questionObj.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index, btn);
        optionsDiv.appendChild(btn);
    });

    updateProgress();
    startTimer();
}

/* ---------------- CHECK ANSWER ---------------- */

function checkAnswer(selected, button) {

    const correctAnswer = quizData[currentLanguage][currentIndex].answer;

    const buttons = document.querySelectorAll("#options button");

    if (selected === correctAnswer) {
        score++;
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
        buttons[correctAnswer].classList.add("correct");
    }

    disableOptions();
}

/* ---------------- DISABLE OPTIONS ---------------- */

function disableOptions() {
    const buttons = document.querySelectorAll("#options button");
    buttons.forEach(btn => btn.disabled = true);
}

/* ---------------- NEXT QUESTION ---------------- */

function nextQuestion() {

    currentIndex++;

    if (currentIndex < quizData[currentLanguage].length) {
        loadQuestion();
    } else {
        showResult();
    }
}

/* ---------------- TIMER ---------------- */

function startTimer() {

    timeLeft = 15;
    document.getElementById("timer").innerText = timeLeft;

    timer = setInterval(() => {

        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }

    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
}

/* ---------------- PROGRESS BAR ---------------- */

function updateProgress() {
    let progress = ((currentIndex) / quizData[currentLanguage].length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
}

/* ---------------- SHOW RESULT ---------------- */

function showResult() {

    document.getElementById("quiz-screen").classList.add("hidden");

    const resultScreen = document.getElementById("result-screen");
    resultScreen.classList.remove("hidden");

    const username = localStorage.getItem("username");

    let percentage = (score / quizData[currentLanguage].length) * 100;

    let message;
    if (percentage >= 80) {
        message = "Excellent Performance 🎉";
    } else if (percentage >= 50) {
        message = "Good Job 👍";
    } else {
        message = "Keep Practicing 💪";
    }

    /* -------- SAVE TO LEADERBOARD -------- */

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({
        name: username,
        language: currentLanguage,
        score: score
    });

    // Sort highest score first
    leaderboard.sort((a, b) => b.score - a.score);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    /* -------- DISPLAY RESULT -------- */

    resultScreen.innerHTML = `
        <h2>${username}, Your Score: ${score}</h2>
        <p>${message}</p>
        <button onclick="showLeaderboard()">View Leaderboard</button>
        <button onclick="location.reload()">Restart Quiz</button>
    `;
}
function showLeaderboard() {

    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    let leaderboardHTML = "<h2>🏆 Leaderboard (Top 5)</h2>";

    if (leaderboard.length === 0) {
        leaderboardHTML += "<p>No scores yet.</p>";
    } else {
        leaderboard.slice(0, 5).forEach((player, index) => {
            leaderboardHTML += `
                <p>${index + 1}. ${player.name} - 
                ${player.language.toUpperCase()} - 
                ${player.score}</p>
            `;
        });
    }

    leaderboardHTML += `<button onclick="location.reload()">Back</button>`;

    document.getElementById("result-screen").innerHTML = leaderboardHTML;
}