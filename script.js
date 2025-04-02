// Array de perguntas sobre Estado Liberal e Estado Socialista
const questions = [
    {
        question: "Qual movimento filosófico influenciou o surgimento do Estado Liberal?",
        options: ["Renascimento", "Iluminismo", "Romantismo", "Existencialismo"],
        answer: "b",
        hint: "Este movimento enfatiza a razão e a ciência."
    },
    {
        question: "Em que eventos históricos o Estado Liberal se fortaleceu?",
        options: ["Revolução Russa e Guerra Fria", "Revolução Francesa e Revolução Industrial", "Guerra dos Trinta Anos e Tratado de Vestfália", "Independência dos EUA e Guerra Civil Americana"],
        answer: "b",
        hint: "Esses eventos marcaram o fim do absolutismo e o início da era industrial."
    },
    {
        question: "Qual é o princípio econômico defendido pelo Estado Liberal?",
        options: ["Planejamento centralizado", "Intervencionismo estatal", "Laissez-faire", "Economia mista"],
        answer: "c",
        hint: "Este princípio defende a mínima interferência do Estado na economia."
    },
    {
        question: "Quem são os principais teóricos que inspiraram o Estado Socialista?",
        options: ["Adam Smith e David Ricardo", "John Locke e Montesquieu", "Karl Marx e Friedrich Engels", "Max Weber e Émile Durkheim"],
        answer: "c",
        hint: "Esses teóricos criticaram o capitalismo e propuseram uma sociedade sem classes."
    },
    {
        question: "No Estado Socialista, quem controla os meios de produção?",
        options: ["Indivíduos privados", "Empresas multinacionais", "O Estado", "Cooperativas de trabalhadores"],
        answer: "c",
        hint: "Neste modelo, a propriedade é coletiva."
    },
    {
        question: "Qual é o objetivo principal do Estado Socialista?",
        options: ["Maximizar lucros", "Promover a livre concorrência", "Acabar com as desigualdades sociais", "Estimular o empreendedorismo"],
        answer: "c",
        hint: "Este modelo busca uma distribuição mais equitativa de recursos."
    },
    {
        question: "Qual modelo econômico é associado ao Estado Liberal?",
        options: ["Socialismo", "Capitalismo", "Mercantilismo", "Feudalismo"],
        answer: "b",
        hint: "Este modelo é baseado na propriedade privada e na livre iniciativa."
    },
    {
        question: "O que o Estado Liberal defende em termos de intervenção na economia?",
        options: ["Intervenção total", "Intervenção moderada", "Pouca interferência", "Intervenção apenas em crises"],
        answer: "c",
        hint: "A ideia é que o mercado se autorregule."
    },
    {
        question: "Qual é uma crítica comum ao Estado Liberal?",
        options: ["Limita a liberdade individual", "Pode gerar desigualdades sociais", "Não permite a propriedade privada", "Centraliza o poder no Estado"],
        answer: "b",
        hint: "A livre concorrência pode levar a concentrações de riqueza."
    },
    {
        question: "Atualmente, muitos países adotam qual tipo de modelo econômico?",
        options: ["Estado Liberal puro", "Estado Socialista puro", "Modelo misto", "Anarquismo"],
        answer: "c",
        hint: "Este modelo combina elementos de ambos os sistemas."
    }
];

// Estado do quiz
const quizState = {
    currentQuestion: 0,
    score: 1000, // Começa com 1000 pontos
    helps: {
        skip: 1,
        hint: 1,
        fiftyFifty: 1
    },
    completed: false
};

// Temporizador
let timer;
const timePerQuestion = 30; // 30 segundos por pergunta

// Sons (arquivos correct.mp3 e wrong.mp3 devem estar na mesma pasta)
const correctSound = new Audio('correct.mp3');
const wrongSound = new Audio('wrong.mp3');

// Função para iniciar o temporizador
function startTimer() {
    let timeLeft = timePerQuestion;
    const timerDisplay = document.getElementById('timer') || document.createElement('div');
    timerDisplay.id = 'timer';
    document.getElementById('quiz-container').appendChild(timerDisplay);
    timer = setInterval(() => {
        timerDisplay.innerText = `Tempo restante: ${timeLeft}s`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            checkAnswer(null); // Tempo esgotado
        }
    }, 1000);
}

// Função para carregar a pergunta
function loadQuestion() {
    if (quizState.completed) {
        showAlreadyCompletedScreen();
        return;
    }
    const question = questions[quizState.currentQuestion];
    document.getElementById("question").innerText = question.question;
    const options = document.querySelectorAll(".option");
    options.forEach((option, index) => {
        option.innerText = question.options[index];
        option.dataset.option = String.fromCharCode(97 + index);
        option.style.display = "block";
        option.classList.remove('visible');
        setTimeout(() => {
            option.classList.add('visible');
        }, index * 100);
    });
    document.getElementById("score").innerText = `R$ ${quizState.score}`;
    startTimer();
}

// Função para verificar a resposta
function checkAnswer(selectedOption) {
    clearInterval(timer);
    const question = questions[quizState.currentQuestion];
    if (selectedOption === question.answer) {
        quizState.score += 500; // +500 pontos por resposta correta
        correctSound.play();
    } else {
        wrongSound.play();
        // Aqui poderia ser adicionada a lógica para a próxima equipe (simplificada por enquanto)
    }
    quizState.currentQuestion++;
    if (quizState.currentQuestion < questions.length) {
        loadQuestion();
    } else {
        quizState.completed = true;
        localStorage.setItem('quizCompleted', 'true');
        showEndScreen();
    }
}

// Função para exibir a tela final
function showEndScreen() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h1>Fim de Jogo!</h1>
        <p>Seu resultado final: R$ ${quizState.score}</p>
    `;
}

// Função para exibir a tela de "já completado"
function showAlreadyCompletedScreen() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h1>Você já completou o quiz!</h1>
        <p>Seu resultado foi salvo.</p>
        <button id="reset">Reiniciar Quiz</button>
    `;
    document.getElementById('reset').addEventListener('click', () => {
        localStorage.removeItem('quizCompleted');
        location.reload();
    });
}

// Eventos de clique para as opções
document.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", () => {
        checkAnswer(option.dataset.option);
    });
});

// Eventos de clique para as ajudas
document.getElementById("skip").addEventListener("click", () => {
    if (quizState.helps.skip > 0) {
        quizState.helps.skip--;
        document.getElementById("skip").innerText = `Pular (${quizState.helps.skip})`;
        quizState.currentQuestion++;
        if (quizState.currentQuestion < questions.length) {
            loadQuestion();
        } else {
            alert("Não há mais perguntas para pular.");
        }
    }
});

document.getElementById("hint").addEventListener("click", () => {
    if (quizState.helps.hint > 0) {
        quizState.helps.hint--;
        document.getElementById("hint").innerText = `Dica (${quizState.helps.hint})`;
        const question = questions[quizState.currentQuestion];
        alert(`Dica: ${question.hint}`);
    }
});

document.getElementById("fifty-fifty").addEventListener("click", () => {
    if (quizState.helps.fiftyFifty > 0) {
        quizState.helps.fiftyFifty--;
        document.getElementById("fifty-fifty").innerText = `50/50 (${quizState.helps.fiftyFifty})`;
        const question = questions[quizState.currentQuestion];
        const wrongOptions = question.options
            .map((option, index) => ({ option, index }))
            .filter(item => String.fromCharCode(97 + item.index) !== question.answer);
        const eliminatedOptions = wrongOptions.slice(0, 2);
        document.querySelectorAll(".option").forEach(option => {
            const optionLetter = option.dataset.option;
            if (eliminatedOptions.some(el => String.fromCharCode(97 + el.index) === optionLetter)) {
                option.style.display = "none";
            }
        });
    }
});

// Verificar o estado do jogo ao carregar a página
function checkGameStatus() {
    const gameStatus = localStorage.getItem('quizCompleted');
    if (gameStatus === 'true') {
        quizState.completed = true;
        showAlreadyCompletedScreen();
    } else {
        loadQuestion();
    }
}

checkGameStatus();