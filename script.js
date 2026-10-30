const jardim = document.getElementById("jardim");

const totalPlantadas = document.getElementById("totalPlantadas");
const totalFlorescidas = document.getElementById("totalFlorescidas");

const modal = document.getElementById("modal");
const modalFlor = document.getElementById("modalFlor");
const mensagemFlor = document.getElementById("mensagemFlor");

const fecharModal = document.getElementById("fecharModal");
const botaoModal = document.getElementById("botaoModal");

const alternarTema = document.getElementById("alternarTema");
const notificacao = document.getElementById("notificacao");

// CONFIGURAÇÕES

const QUANTIDADE_VASOS = 8;

const flores = [
    "🌻", // 1 - Girassol
    "🌸", // 2 - Peônia
    "🌹", // 3 - Rosa
    "🌷", // 4 - Tulipa
    "🌼", // 5 - Margarida
    "💐", // 6 - Buquê
    "🌺", // 7 - Hibisco
    "🌸"  // 8 - Flor de cerejeira
];

// PERSONALIZE ESTAS MENSAGENS

const mensagens = [

    "Desde o dia em que eu te conheci, você deixa o meu mundo mais colorido. ❤️",

    "Você mudou a minha vida para melhor. Se eu pudesse escolher novamente, escolheria você todas as vezes. 💕",

    "Seu sorriso me encanta, seu sorriso me faz sorrir. Seu sorriso é uma das suas características mais bonitas. Eu me apaixono toda vez que o vejo. 🌷",

    "Você é minha pessoa favorita. Com você, eu me sinto confortável para conversar e falar qualquer coisa, porque sei que você vai me ouvir com atenção. Além disso, você me faz sentir seguro. 💗",

    "Quero continuar namorando com você e, depois, me casar e viver com você pelo resto da minha vida, construindo lembranças, conquistando e realizando todos os nossos objetivos. 🌸",

    "Cada momento ao seu lado é um momento que quero guardar para sempre. 💖",

    "Eu quero sua presença todos os dias. Mesmo que seja à distância, eu te quero comigo, porque você me faz muito bem. Você melhora todos os meus dias. Não importa o quanto meu dia tenha sido ruim, você sempre melhora ele. 🌻",

    "Assim como este jardim, espero que nosso amor continue florescendo. ❤️"
];

// ESTADO DO JARDIM

function criarJardimInicial() {
    return Array.from(
        { length: QUANTIDADE_VASOS },
        () => 0
    );
}

function carregarJardim() {
    try {
        const dados = JSON.parse(
            localStorage.getItem("jardimDoAmor")
        );

        if (
            Array.isArray(dados) &&
            dados.length === QUANTIDADE_VASOS &&
            dados.every(
                estado =>
                    Number.isInteger(estado) &&
                    estado >= 0 &&
                    estado <= 3
            )
        ) {
            return dados;
        }
    } catch (erro) {
        console.warn("Não foi possível carregar o jardim.");
    }

    return criarJardimInicial();
}

let estadoJardim = carregarJardim();

function salvarJardim() {
    try {
        localStorage.setItem(
            "jardimDoAmor",
            JSON.stringify(estadoJardim)
        );
    } catch (erro) {
        console.warn("Não foi possível salvar o jardim.");
    }
}

// NOTIFICAÇÕES

let tempoNotificacao;

function mostrarNotificacao(texto) {
    notificacao.textContent = texto;

    notificacao.classList.add("visivel");

    clearTimeout(tempoNotificacao);

    tempoNotificacao = setTimeout(() => {
        notificacao.classList.remove("visivel");
    }, 2500);
}

// DESENHAR JARDIM

function obterPlanta(estado, indice) {
    switch (estado) {
        case 0:
            return "";

        case 1:
            return "🌱";

        case 2:
            return "🌿";

        case 3:
            return flores[indice];

        default:
            return "";
    }
}

function obterDescricao(estado, indice) {
    switch (estado) {
        case 0:
            return `Vaso ${indice + 1}: plantar semente`;

        case 1:
            return `Vaso ${indice + 1}: regar semente`;

        case 2:
            return `Vaso ${indice + 1}: regar broto`;

        case 3:
            return `Vaso ${indice + 1}: ler mensagem da flor`;
    }
}

function renderizarJardim() {
    jardim.innerHTML = "";

    estadoJardim.forEach((estado, indice) => {
        const espaco = document.createElement("div");

        espaco.classList.add("espaco-planta");

        espaco.setAttribute("role", "button");
        espaco.setAttribute("tabindex", "0");
        espaco.setAttribute(
            "aria-label",
            obterDescricao(estado, indice)
        );

        const planta = document.createElement("div");

        planta.classList.add("planta");

        if (estado === 3) {
            planta.classList.add("flor");
        }

        planta.textContent = obterPlanta(estado, indice);

        const vaso = document.createElement("div");

        vaso.classList.add("vaso");

        const numero = document.createElement("span");

        numero.classList.add("numero-vaso");
        numero.textContent = indice + 1;

        vaso.appendChild(numero);

        espaco.appendChild(planta);
        espaco.appendChild(vaso);

        espaco.addEventListener("click", () => {
            interagirComPlanta(indice);
        });

        espaco.addEventListener("keydown", evento => {
            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {
                evento.preventDefault();
                interagirComPlanta(indice);
            }
        });

        jardim.appendChild(espaco);
    });

    atualizarEstatisticas();
}

// ESTATÍSTICAS

function atualizarEstatisticas() {
    const plantadas = estadoJardim.filter(
        estado => estado > 0
    ).length;

    const florescidas = estadoJardim.filter(
        estado => estado === 3
    ).length;

    totalPlantadas.textContent = plantadas;
    totalFlorescidas.textContent = florescidas;
}

// INTERAÇÃO COM AS FLORES

function interagirComPlanta(indice) {
    const estadoAtual = estadoJardim[indice];

    if (estadoAtual === 0) {
        estadoJardim[indice] = 1;

        mostrarNotificacao(
            "🌱 Uma sementinha de amor foi plantada!"
        );
    }

    else if (estadoAtual === 1) {
        estadoJardim[indice] = 2;

        mostrarNotificacao(
            "💧 Você regou a plantinha! Ela está crescendo."
        );
    }

    else if (estadoAtual === 2) {
        estadoJardim[indice] = 3;

        mostrarNotificacao(
            "🌸 Sua flor finalmente floresceu!"
        );

        setTimeout(() => {
            abrirMensagem(indice);
        }, 650);
    }

    else if (estadoAtual === 3) {
        abrirMensagem(indice);
    }

    salvarJardim();
    renderizarJardim();
}

// MODAL DE MENSAGEM

function abrirMensagem(indice) {
    modalFlor.textContent = flores[indice];

    mensagemFlor.textContent = mensagens[indice];

    modal.classList.add("ativo");

    document.body.style.overflow = "hidden";
}

function fecharMensagem() {
    modal.classList.remove("ativo");

    document.body.style.overflow = "";
}

fecharModal.addEventListener(
    "click",
    fecharMensagem
);

botaoModal.addEventListener(
    "click",
    fecharMensagem
);

modal.addEventListener("click", evento => {
    if (evento.target === modal) {
        fecharMensagem();
    }
});

document.addEventListener("keydown", evento => {
    if (
        evento.key === "Escape" &&
        modal.classList.contains("ativo")
    ) {
        fecharMensagem();
    }
});

// DIA E NOITE

function carregarTema() {
    try {
        return localStorage.getItem("temaJardim") === "noite";
    } catch (erro) {
        return false;
    }
}

function atualizarTema() {
    const noite = document.body.classList.contains("noite");

    alternarTema.textContent = noite
        ? "☀️ Modo dia"
        : "🌙 Modo noite";
}

alternarTema.addEventListener("click", () => {
    document.body.classList.toggle("noite");

    const noite = document.body.classList.contains("noite");

    try {
        localStorage.setItem(
            "temaJardim",
            noite ? "noite" : "dia"
        );
    } catch (erro) {
        console.warn("Não foi possível salvar o tema.");
    }

    atualizarTema();
});

// INICIALIZAÇÃO

if (carregarTema()) {
    document.body.classList.add("noite");
}

atualizarTema();
renderizarJardim();
