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
ROTAS.forEach(receberrota => {
    let rota = document.createElement("div")
    let titulo = document.createElement("h2")
    let descricao = document.createElement("h3")
    let imagem = document.createElement("img")
    rota.classList.add("rota")
    titulo.innerHTML = receberrota.titulo
    descricao.innerHTML = receberrota.descricao
    imagem.src = receberrota.imagem
    let rotas = document.querySelector(".rotas")
    rota.append(imagem)
    rota.append(titulo)
    rota.append(descricao)
    rotas.append(rota)
})
