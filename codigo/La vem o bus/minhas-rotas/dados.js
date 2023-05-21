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
    let imagem = document.createElement("img")
    let conteudorota = document.createElement("div")

    rota.classList.add("rota")
    imagem.src = receberrota.imagem
    conteudorota.classList.add("conteudo-rota")

    let titulo = document.createElement("h2")
    titulo.innerHTML = receberrota.titulo
    let descricao = document.createElement("h3")
    descricao.innerHTML = receberrota.descricao

    rota.append(imagem)
    rota.append(conteudorota)
    conteudorota.append(titulo)
    conteudorota.append(descricao)
    let rotas = document.querySelector(".rotas")
    rotas.append(rota)
})
