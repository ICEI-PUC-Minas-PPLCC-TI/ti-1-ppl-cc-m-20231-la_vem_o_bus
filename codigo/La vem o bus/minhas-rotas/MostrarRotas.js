document.addEventListener("DOMContentLoaded", function() {

    function isLoggedIn() {
        const email = localStorage.getItem('email');
        return email || null;
    }

    let userEmail = isLoggedIn();

    if (userEmail) {
        let savedRoutes = JSON.parse(localStorage.getItem(userEmail)) || [];
        console.log(savedRoutes);  // Log 1

        let routesContainer = document.querySelector(".rotas");
        routesContainer.innerHTML = '';

        savedRoutes.forEach((route, index) => {
            console.log(index);  // Log 4

            let routeElement = document.createElement("div");
            routeElement.id = "rota-" + index;
            routeElement.classList.add("rota");

            let titleElement = document.createElement("h2");
            titleElement.textContent = route.name;
            routeElement.appendChild(titleElement);

            let descriptionElement = document.createElement("h3");
            descriptionElement.textContent = route.routes.map(r => r.description).join(', ');
            routeElement.appendChild(descriptionElement);


            let startRouteButton = document.createElement("button");
            startRouteButton.textContent = "Iniciar Rota";
            startRouteButton.classList.add("start-button");  // Adicionando a classe CSS
            startRouteButton.addEventListener('click', function() {
                let url = "rotas-teste.html?id=" + index;
                window.location.href = url;
            });
            routeElement.appendChild(startRouteButton);

            console.log(routeElement);  // Log 2
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Apagar Rota";
            deleteButton.classList.add("delete-button");  // Adicionando a classe CSS
            deleteButton.addEventListener('click', function() {
                savedRoutes.splice(index, 1);
                localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
                routeElement.remove();
            });
            routeElement.appendChild(deleteButton);

            startRouteButton.addEventListener('click', function() {
                localStorage.setItem('rotaAtual', JSON.stringify(route));
                let url = "acompanhar-Rota.html";
                window.location.href = url;
            });
         

           

            routesContainer.appendChild(routeElement);
            console.log(routesContainer);  // Log 3
        });
    }
});

