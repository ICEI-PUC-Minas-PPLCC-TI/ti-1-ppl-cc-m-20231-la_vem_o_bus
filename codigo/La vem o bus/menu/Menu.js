document.addEventListener('DOMContentLoaded', function () {
    const userEmail = localStorage.getItem('email');
  
    if (userEmail) {
      const savedRoutesJSON = localStorage.getItem(userEmail);
      const savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
  
      if (savedRoutes.length > 0) {
        const meuBusaoList = document.querySelector('.meu-busao ul');
        meuBusaoList.innerHTML = '';
  
        savedRoutes.forEach((savedRoute, i) => {
          const li = document.createElement('li');
          li.textContent = savedRoute.name;
          li.dataset.routeIndex = i;
          li.addEventListener('click', () => {
            localStorage.setItem('selectedRouteIndex', li.dataset.routeIndex);
            window.location.href = '../rotas/editar-rotas.html';
          });
  
          meuBusaoList.appendChild(li);
        });
      }
    }
  
    // Mudança do botão de login para usuário
    const loginBtn = document.querySelector('button:nth-of-type(1)');

    if (userEmail) {
      loginBtn.textContent = 'Usuário';
    }
  });
  