// Caso precise limpar o LocalStorage, usar o código:
// localStorage.clear();

const data = {
  "commentsListSelector": ".comments",
  "commentSelector": ".comment",
  "authorSelector": ".author",
  "dateSelector": ".date",
  "textSelector": ".text",
  "likeButtonSelector": ".like-button",
  "likeCountSelector": ".like-count",
  "replyButtonSelector": ".reply-button",
  "commentFormSelector": ".comment-form",
  "commentInputSelector": ".comment-input",
  "deleteButtonSelector": ".delete-button"
};

// Aguarda o evento DOMContentLoaded para garantir que o documento foi completamente carregado
document.addEventListener("DOMContentLoaded", function() {
  const formulario = document.querySelector("form");
  const listaComentarios = document.querySelector(data.commentsListSelector);

  // Função para exibir um novo comentário
  function exibirComentario(comentario, parentElement) {
    const novoComentario = document.createElement("div");
    novoComentario.classList.add(data.commentSelector.slice(1));
    novoComentario.innerHTML = `
      <p class="${data.authorSelector.slice(1)}">${comentario.autor}</p>
      <p class="${data.dateSelector.slice(1)}">${comentario.data}</p>
      <p class="${data.textSelector.slice(1)}">${comentario.texto}</p>
      <button class="${data.likeButtonSelector.slice(1)}">❤️</button>
      <span class="${data.likeCountSelector.slice(1)}">${comentario.curtidas}</span>
      <button class="${data.replyButtonSelector.slice(1)}">Responder</button>
      <button class="${data.deleteButtonSelector.slice(1)}">Excluir</button>
    `;

    const likeButton = novoComentario.querySelector(data.likeButtonSelector);
    const likeCount = novoComentario.querySelector(data.likeCountSelector);

    // Manipulador de evento para curtir um comentário
    likeButton.addEventListener("click", () => {
      let currentLikes = parseInt(likeCount.textContent);
      const isLiked = likeButton.classList.contains("liked");

      if (isLiked) {
        currentLikes--;
        likeButton.classList.remove("liked");
      } else {
        currentLikes++;
        likeButton.classList.add("liked");
      }

      likeCount.textContent = currentLikes;
    });

    const replyButton = novoComentario.querySelector(data.replyButtonSelector);
    replyButton.addEventListener("click", () => {
      mostrarFormularioResposta(comentario, novoComentario);
    });

    const deleteButton = novoComentario.querySelector(data.deleteButtonSelector);
    deleteButton.addEventListener("click", () => {
      deletarComentario(comentario, parentElement, novoComentario);
    });

    parentElement.appendChild(novoComentario);
  }

  // Função para exibir o formulário de resposta a um comentário
  function mostrarFormularioResposta(comentarioPai, parentElement) {
    const formularioResposta = document.createElement("form");
    formularioResposta.classList.add(data.commentFormSelector.slice(1));
    formularioResposta.innerHTML = `
      <input type="text" class="${data.commentInputSelector.slice(1)}" placeholder="Escreva uma resposta">
      <button type="submit">Responder</button>
    `;

    // Manipulador de evento para submeter a resposta ao comentário
    formularioResposta.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const respostaInput = formularioResposta.querySelector(data.commentInputSelector);
      const textoResposta = respostaInput.value;

      if (textoResposta.trim() === "") {
        alert("Por favor, insira uma resposta válida.");
        return;
      }

      const resposta = {
        autor: "Usuário",
        data: new Date().toLocaleDateString(),
        texto: textoResposta,
        curtidas: 0
      };

      exibirComentario(resposta, parentElement);

      respostaInput.value = "";
      formularioResposta.remove();
    });

    parentElement.appendChild(formularioResposta);
  }

  // Função para deletar um comentário
  function deletarComentario(comentario, parentElement, elementoComentario) {
    if (comentario.autor !== "Usuário") {
      alert("Você só pode excluir seus próprios comentários.");
      return;
    }

    parentElement.removeChild(elementoComentario);
    removerComentario(comentario); // Remover o comentário do localStorage
  }

  // Manipulador de evento para submeter um novo comentário
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const comentarioInput = formulario.querySelector("#comment");
    const textoComentario = comentarioInput.value;

    if (textoComentario.trim() === "") {
      alert("Por favor, insira um comentário válido.");
      return;
    }

    const comentario = {
      autor: "Usuário",
      data: new Date().toLocaleDateString(),
      texto: textoComentario,
      curtidas: 0
    };

    exibirComentario(comentario, listaComentarios);
    comentarioInput.value = "";

    salvarComentario(comentario); // Salvar o novo comentário no localStorage
  });

  // Função para salvar um comentário no localStorage
  function salvarComentario(comentario) {
    let comentarios = carregarComentarios();
    comentarios.push(comentario);
    localStorage.setItem("comentarios", JSON.stringify(comentarios));
  }

  // Função para remover um comentário do localStorage
  function removerComentario(comentario) {
    let comentarios = carregarComentarios();
    const indice = comentarios.findIndex(
      (c) =>
        c.autor === comentario.autor &&
        c.data === comentario.data &&
        c.texto === comentario.texto
    );

    if (indice !== -1) {
      comentarios.splice(indice, 1);
      localStorage.setItem("comentarios", JSON.stringify(comentarios));
    }
  }

  // Função para carregar os comentários salvos no localStorage
  function carregarComentarios() {
    const comentariosArmazenados = localStorage.getItem("comentarios");

    if (comentariosArmazenados) {
      return JSON.parse(comentariosArmazenados);
    }

    return [];
  }

  // Função para exibir os comentários salvos no carregamento da página
  function exibirComentariosSalvos() {
    const comentarios = carregarComentarios();
    comentarios.forEach((comentario) => {
      exibirComentario(comentario, listaComentarios);
    });
  }

  exibirComentariosSalvos();
});
