let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let userAnswers = [];

async function fetchQuestions() {
  const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
  const data = await res.json();
  questions = data.results.map(q => {
    let options = [...q.incorrect_answers, q.correct_answer];
    options.sort(() => Math.random() - 0.5); // shuffle
    return {
      question: q.question,
      options: options,
      answer: q.correct_answer
    };
  });
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    return showResult();
  }

  const qData = questions[currentQuestion];
  document.getElementById("question").innerHTML = qData.question;
  const optionsBox = document.getElementById("options");
  optionsBox.innerHTML = "";

  qData.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    btn.onclick = () => checkAnswer(option);
    optionsBox.appendChild(btn);
  });

  resetTimer();
}

function checkAnswer(selected) {
  const correct = questions[currentQuestion].answer;
  userAnswers.push({
    question: questions[currentQuestion].question,
    selected: selected,
    correct: correct
  });

  if (selected === correct) score++;
  currentQuestion++;
  updateScore();
  clearInterval(timer);
  setTimeout(loadQuestion, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("timer").textContent = `⏳ ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `⏳ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer("Time Up ⏰");
    }
  }, 1000);
}

function updateScore() {
  document.getElementById("scoreBoard").textContent = `Score: ${score}`;
}

function showResult() {
  document.getElementById("quizBox").classList.add("hidden");
  document.getElementById("resultBox").classList.remove("hidden");
  document.getElementById("score").textContent = `Your Score: ${score} / ${questions.length}`;
}

function showReview() {
  const reviewBox = document.getElementById("reviewBox");
  reviewBox.innerHTML = "";
  userAnswers.forEach((ans, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>Q${i+1}:</b> ${ans.question}</p>
      <p>✅ Correct: ${ans.correct}</p>
      <p>❌ Your Answer: ${ans.selected}</p>
      <hr>
    `;
    reviewBox.appendChild(div);
  });
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  document.getElementById("quizBox").classList.remove("hidden");
  document.getElementById("resultBox").classList.add("hidden");
  updateScore();
  fetchQuestions();
}

fetchQuestions();
