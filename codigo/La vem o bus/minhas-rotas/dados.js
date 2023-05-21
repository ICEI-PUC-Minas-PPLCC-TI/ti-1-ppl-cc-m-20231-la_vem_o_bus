const ROTAS = [
    {
        titulo: "cachorro quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg"
    },
    {
        titulo: "cachorro quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg"
    },
    {
        titulo: "cachorro quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg"
    },
    {
        titulo: "cachorro quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg"
    },
    {
        titulo: "cachorro quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg"
    },
    {
        titulo: "cachorro quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg"
    },
    {
        titulo: "cachorro quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg"
    },
    {
        titulo: "cachorro quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg"
    }
]
localStorage.setItem("ROTAS", JSON.stringify(ROTAS))

if (localStorage.getItem("ROTAS") === null) {
    localStorage.setItem("ROTAS", JSON.stringify(ROTAS))
}

let rotassalvas = JSON.parse(localStorage.getItem("ROTAS"))
let contadorId = 0;
let idsRotas = [];

rotassalvas.forEach(receberrota => {
    contadorId++;

    let rota = document.createElement("div");
    let imagem = document.createElement("img");
    let conteudorota = document.createElement("div");
    let botaoApagar = document.createElement("button");
    let popup = document.createElement("div")
    let botaovoltar = document.createElement("button")
    rota.id = "rota-" + contadorId;

    popup.classList.add("popup")
    rota.classList.add("rota");
    rota.id = "rota-" + contadorId;
    idsRotas.push(rota.id);
    imagem.src = receberrota.imagem;
    conteudorota.classList.add("conteudo-rota");

    let titulo = document.createElement("h2");
    titulo.innerHTML = receberrota.titulo;
    let descricao = document.createElement("h3");
    descricao.innerHTML = receberrota.descricao;

    rota.append(imagem);
    rota.append(conteudorota);
    conteudorota.append(titulo);
    conteudorota.append(descricao);
    rota.append(popup);

    popup.innerHTML = `<div class='popup-content'><h2>Confirmação</h2><p>Você tem certeza disso?</p><div class='buttons'id="botoes-${contadorId}"><button onclick='apagarRota(${contadorId})'>Sim</button></div></div>`
    botaovoltar.innerHTML = "Voltar"
    botaoApagar.innerHTML = "Apagar Rota";
    botaoApagar.onclick = function () {
        confirmacao(popup);
    };

    conteudorota.append(botaoApagar);

    let rotas = document.querySelector(".rotas");
    rotas.append(rota);

    botaovoltar.onclick = function () {
        voltarpagina(popup)
    }
    document.querySelector(`#botoes-${contadorId}`).append(botaovoltar)
});
function apagarRota(id) {
    console.log(id)
    let rota = document.getElementById("rota-" + id);
    if (rota) {
        let rotas = document.querySelector(".rotas");
        rotas.removeChild(rota);
    }
    rotassalvas.splice(id, 1)
    localStorage.setItem("ROTAS", JSON.stringify(rotassalvas))
}
function confirmacao(popup) {
    popup.style.display = "block"
}
function voltarpagina(popup) {
    console.log(popup)
    popup.style.display = "none";
}
