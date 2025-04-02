// Variáveis globais
let isCreator = false;
let roomCode = '';
let currentQuestion = 0;
let score = 0;
let quiz = [];
let prizes = [1000, 5000, 10000, 50000, 100000, 500000, 1000000]; // Recompensas chamativas

// Ir para a página de criação do quiz
function goToCreateQuiz() {
    const username = document.getElementById('username').value;
    if (!username) return alert("Digite seu nome!");
    localStorage.setItem('username', username);
    window.location.href = 'create-quiz.html';
}

// Adicionar pergunta ao quiz
function addQuestion() {
    const question = document.getElementById('question').value;
    const options = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value
    ];
    const correct = document.getElementById('correctOption').value;
    if (!question || options.some(opt => !opt) || !correct) return alert("Preencha todos os campos!");
    
    const correctAnswer = options[parseInt(correct) - 1];
    quiz.push({ question, options, correct: correctAnswer });
    
    // Exibir perguntas adicionadas
    const list = document.getElementById('questionsList');
    list.innerHTML += `<p>Pergunta: ${question}</p>`;
    
    // Limpar campos
    document.getElementById('question').value = '';
    document.getElementById('option1').value = '';
    document.getElementById('option2').value = '';
    document.getElementById('option3').value = '';
    document.getElementById('option4').value = '';
    document.getElementById('correctOption').value = '';
}

// Criar sala
function createRoom() {
    if (quiz.length === 0) return alert("Adicione pelo menos uma pergunta!");
    isCreator = true;
    roomCode = Math.random().toString(36).substring(7); // Código aleatório
    localStorage.setItem('quiz', JSON.stringify(quiz));
    window.location.href = `quiz.html?room=${roomCode}&creator=true`;
}

// Entrar na sala
function joinRoom() {
    const username = document.getElementById('username').value;
    const code = document.getElementById('roomCode').value;
    if (!username || !code) return alert("Digite seu nome e o código!");
    roomCode = code;
    window.location.href = `quiz.html?room=${code}`;
}

// Configuração inicial do quiz
if (window.location.pathname.includes('quiz.html')) {
    const params = new URLSearchParams(window.location.search);
    roomCode = params.get('room');
    isCreator = params.get('creator') === 'true';
    
    document.getElementById('roomTitle').textContent = `Sala: ${roomCode}`;
    if (!isCreator) {
        document.getElementById('startButton').style.display = 'none';
    }
    
    // Carregar quiz
    quiz = JSON.parse(localStorage.getItem('quiz')) || [];
    
    // Exibir escala de prêmios
    const prizeList = document.getElementById('prizeList');
    prizes.forEach((prize, index) => {
        prizeList.innerHTML += `<li>Pergunta ${index + 1}: R$${prize.toLocaleString()}</li>`;
    });
}

// Iniciar o jogo
function startGame() {
    if (!isCreator) return;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    showQuestion();
}

// Exibir pergunta
function showQuestion() {
    if (currentQuestion >= quiz.length) {
        showRanking();
        return;
    }
    const q = quiz[currentQuestion];
    document.getElementById('question').textContent = q.question;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option, q.correct);
        optionsDiv.appendChild(btn);
    });
}

// Verificar resposta
function checkAnswer(selected, correct) {
    if (selected === correct) {
        score = prizes[currentQuestion];
        currentQuestion++;
        showQuestion();
    } else {
        showRanking();
    }
}

// Exibir ranking
function showRanking() {
    document.getElementById('questionContainer').style.display = 'none';
    const rankingDiv = document.getElementById('ranking');
    rankingDiv.style.display = 'block';
    rankingDiv.innerHTML = `<h2>Fim de Jogo!</h2><p>Sua pontuação: R$${score.toLocaleString()}</p>`;
}