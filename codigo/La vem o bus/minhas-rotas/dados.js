const ROTAS = [
    {
        titulo: "Cachorro Quente",
        descricao: "rota que passa pelo cachorro quente",
        imagem: "https://www.google.com/logos/google.jpg",
        tempo: "60",
        dfinal: "a",
        dinicial: "casa",
        valor: "12"
    },
    {
        titulo: "Caminhada",
        descricao: "Rota longa que fiz para andar muito",
        imagem: "https://www.google.com/logos/google.jpg",
        tempo: "40",
        dfinal: "b",
        dinicial: "a",
        valor: "6"
    },
    {
        titulo: "Rota atrasado pro trabalho 30min",
        descricao: "Corre-Corre",
        imagem: "https://www.google.com/logos/google.jpg",
        tempo: "30",
        dfinal: "c",
        dinicial: "casa",
        valor: "6"
    },
    {
        titulo: "Casa da namorada",
        descricao: "Auto-explicativa",
        imagem: "https://www.google.com/logos/google.jpg",
        tempo: "40",
        dfinal: "liberdade",
        dinicial: "Faculdade",
        valor: "1"
    },
    {
        titulo: "Passando pela livraria",
        descricao: "Rota que deixa eu ficar 30min perdendo tempo na livraria",
        imagem: "https://www.google.com/logos/google.jpg",
        tempo: "50",
        dfinal: "casa",
        dinicial: "casa",
        valor: "18"
    },
    {
        titulo: "SINUQUINHAAAAAAAA",
        descricao: "Rota que leva pra sinuca do seu zé",
        imagem: "https://www.google.com/logos/google.jpg",
        tempo: "10",
        dfinal: "cachorro quente",
        dinicial: "Faculdade",
        valor: "12"
    },
    {
        titulo: "Entao, rota pra um dia triste",
        descricao: "Rota que demora bastante pra chegar em casa e da pra escutar musica",
        imagem: "https://www.google.com/logos/google.jpg",
        tempo: "20",
        dfinal: "casa",
        dinicial: "casa",
        valor: "6"
    },
    {
        titulo: "Cansei",
        descricao: "Sem ideias",
        imagem: "https://www.google.com/logos/google.jpg",
        tempo: "35",
        dfinal: "a",
        dinicial: "a",
        valor: "18"
    }
]
//localStorage.setItem("ROTAS", JSON.stringify(ROTAS))

if (localStorage.getItem("ROTAS") === null) {
    localStorage.setItem("ROTAS", JSON.stringify(ROTAS))
}

let rotassalvas = JSON.parse(localStorage.getItem("ROTAS"))
let contadorId = 0;
let idsRotas = [];

function construir(rotasatuais){
    rotasatuais.forEach(receberrota => {
        contadorId++;
    
    
        let rota = document.createElement("div");
        let imagem = document.createElement("img");
        let conteudorota = document.createElement("div");
        let botaoApagar = document.createElement("button")
        let popup = document.createElement("div")
        let botaovoltar = document.createElement("button")
        let botaoIniciarRota = document.createElement("button");
        let botoesContainer = document.createElement("div");
    
        rota.id = "rota-" + contadorId;
    
        popup.classList.add("popup")
        rota.classList.add("rota");
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
    
        botaoIniciarRota.innerHTML = "Iniciar Rota";
        botaoIniciarRota.onclick = function () {
            iniciarRota(contadorId);
        };
    
    
        botoesContainer.classList.add("botoes-container");
    
        botoesContainer.append(botaoApagar);
        botoesContainer.append(botaoIniciarRota);
        conteudorota.append(botoesContainer);
        conteudorota.append(botaoApagar);
    
        let rotas = document.querySelector(".rotas");
        rotas.append(rota);
    
        botaovoltar.onclick = function () {
            voltarpagina(popup)
        }
        document.querySelector(`#botoes-${contadorId}`).append(botaovoltar)
    });
}

function apagarRota(id) {

    let rota = document.getElementById("rota-" + id);
    if (rota) {
        let rotas = document.querySelector(".rotas");
        rotas.removeChild(rota);
    }
    let index = id - 1
    rotassalvas.splice(index, 1)
    localStorage.setItem("ROTAS", JSON.stringify(rotassalvas))
}
function confirmacao(popup) {
    popup.style.display = "block"
}
function voltarpagina(popup) {

    popup.style.display = "none";
}
function iniciarRota(id) {
    let url = "rotas-teste.html?id=" + id;
    window.location.href = url;
}
function ordenarPorTempo() {
    rotassalvas.sort((a, b) => a.tempo - b.tempo);
    document.querySelectorAll(".rotas .rota").forEach(rota=>{rota.remove()});
    construir(rotassalvas);
}

function ordenarPorValor() {
    
    rotassalvas.sort((a, b) => a.valor - b.valor);
    document.querySelectorAll(".rota").forEach(rota=>{rota.remove()});
    construir(rotassalvas);
}

function procurar (){
let input=document.querySelector("#opa");
document.querySelectorAll(".rota").forEach(rota=>{rota.remove()});
let novasrotas=rotassalvas.filter(rota=> rota.titulo.toLowerCase().includes(input.value.toLowerCase()));
construir(novasrotas);

}
function ordenarPorDestino() {
    rotassalvas.sort((a, b) => {
    if(a.dfinal < b.dfinal) { return -1; }
    if(a.dfinal > b.dfinal) { return 1; }
    return 0;
    });
    document.querySelectorAll(".rota").forEach(rota=>{rota.remove()});
    construir(rotassalvas);
}
construir(rotassalvas);
