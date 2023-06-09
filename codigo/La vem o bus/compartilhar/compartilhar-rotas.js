document.addEventListener('DOMContentLoaded', async () => {

    const jsonData = {
      "savedRoutes": {
        "localStorageKey": "userEmail",
        "routeData": {
          "name": "routeName",
          "routes": [
            {
              "coordinates": "routeLatLngs",
              "color": "routeColor"
            }
          ]
        }
      }
    };
  
    loadSavedRoutes();
  
    const map = L.map('map').setView([-19.920830, -43.937780], 14);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    const orsKey = '5b3ce3597851110001cf624862e8cd6327b04ab3902533c08464a987';
  
    const busroute = async (start, end) => {
      const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${orsKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
  
      try {
        const response = await fetch(url);
        const json = await response.json();
  
        if (json.features && json.features.length > 0) {
          return json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        } else {
          console.error('No route found');
        }
      } catch (error) {
        console.error('Error fetching route', error);
      }
    };
  
    const createWalkingRoute = async (point1, point2) => {
      const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${orsKey}&start=${point1.lng},${point1.lat}&end=${point2.lng},${point2.lat}`;
  
      try {
        const response = await fetch(url);
        const json = await response.json();
  
        if (json.features && json.features.length > 0) {
          const routeCoordinates = json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          const walkingRoute = L.polyline(routeCoordinates, { color: 'green', dashArray: '5, 10' }).addTo(map);
          return walkingRoute;
        } else {
          console.error('No route found');
        }
      } catch (error) {
        console.error('Error fetching route', error);
      }
    };
  
    let selectedPoints = [];
    let currentRoutes = [];
  
    const onMapClick = async (e) => {
      selectedPoints.push(e.latlng);
      if (selectedPoints.length === 2) {
        if (addingBusRoute) {
          const busRouteColor = document.getElementById('busRouteColor').value;
          const newRoute = await createBusRoute(selectedPoints[0], selectedPoints[1], busRouteColor);
          currentRoutes.push(newRoute);
          addingBusRoute = false;
        } else {
          const newRoute = await createWalkingRoute(selectedPoints[0], selectedPoints[1]);
          currentRoutes.push(newRoute);
        }
        selectedPoints = [];
      }
    };
  
    document.getElementById('addWalkingRoute').addEventListener('click', () => {
      map.on('click', onMapClick);
    });
  
    // verifica se esta logado 
    function isLoggedIn() {
      const email = localStorage.getItem('email');
      return email || null;
    }
  
    // salvar rotas a pé
    const saveCurrentRoute = () => {
      const userEmail = isLoggedIn();
      if (userEmail) {
        if (currentRoutes.length > 0) {
          const routeName = prompt("Digite um nome para a rota:");
          if (routeName) {
            const savedRoute = {
              name: routeName,
              routes: currentRoutes.map(route => ({
                coordinates: route.getLatLngs(),
                color: route.options.color
              }))
            };
            const savedRoutesJSON = localStorage.getItem(userEmail);
            let savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
            savedRoutes.push(savedRoute);
            localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
  
            const newRouteButton = document.createElement('button');
            newRouteButton.innerText = routeName;
            newRouteButton.classList.add('route-button');
            newRouteButton.addEventListener('click', () => {
              // Remova as rotas atuais do mapa, se houver
              currentRoutes.forEach(route => map.removeLayer(route));
  
              // Limpa currentRoutes
              currentRoutes = [];
  
              // Adicione as rotas salvas ao mapa
              savedRoute.routes.forEach(routeCoordinates => {
                const savedRouteLine = L.polyline(routeCoordinates, { color: 'green', dashArray: '5, 10' }).addTo(map);
                currentRoutes.push(savedRouteLine);
              });
            });
  
            const shareRouteButton = document.createElement('button');
            shareRouteButton.innerText = 'Compartilhar';
            shareRouteButton.classList.add('share-route-button');
            shareRouteButton.addEventListener('click', () => {
              const routeURL = window.location.href;
              const shareText = `Confira a rota "${routeName}" que eu salvei: ${routeURL}`;
              navigator.share({ title: 'Compartilhar Rota', text: shareText });
            });
  
            const routeButtonContainer = document.createElement('div');
            routeButtonContainer.appendChild(newRouteButton);
            routeButtonContainer.appendChild(shareRouteButton);
            document.getElementById('routes').appendChild(routeButtonContainer);
  
            alert('Rota salva com sucesso!');
            currentRoutes = [];
            location.reload();
          } else {
            alert('Nenhuma rota para salvar. Por favor, crie uma rota primeiro.');
          }
        }
      } else {
        alert('Por favor, faça login para salvar a rota.');
      }
    };
  
    // salvamento no local storage
    function loadSavedRoutes() {
      const userEmail = isLoggedIn();
      if (userEmail) {
        const savedRoutesJSON = localStorage.getItem(userEmail);
        const savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
  
        savedRoutes.forEach((savedRoute, index) => {
          const routeContainer = document.createElement('div');
          routeContainer.classList.add('route-container');
  
          const newRouteButton = document.createElement('button');
          newRouteButton.innerText = savedRoute.name;
          newRouteButton.classList.add('route-button');
          newRouteButton.addEventListener('click', () => {
            // Remova as rotas atuais do mapa, se houver
            currentRoutes.forEach(route => map.removeLayer(route));
  
            // Limpa currentRoutes
            currentRoutes = [];
  
            // Adicione as rotas salvas ao mapa
            savedRoute.routes.forEach(routeCoordinates => {
              const polylineOptions = {
                color: routeCoordinates.color,
              };
  
              if (routeCoordinates.color === 'green') {
                polylineOptions.dashArray = '5, 10';
              }
  
              const savedRouteLine = L.polyline(routeCoordinates.coordinates, polylineOptions).addTo(map);
              currentRoutes.push(savedRouteLine);
            });
          });
  
          const shareRouteButton = document.createElement('button');
          shareRouteButton.innerText = 'Compartilhar';
          shareRouteButton.classList.add('share-route-button');
          shareRouteButton.addEventListener('click', () => {
            const routeURL = window.location.href;
            const shareText = `Confira a rota "${savedRoute.name}" que eu salvei: ${routeURL}`;
            navigator.share({ title: 'Compartilhar Rota', text: shareText });
          });
  
          const deleteRouteButton = document.createElement('button');
          deleteRouteButton.innerText = 'Excluir';
          deleteRouteButton.classList.add('delete-route-button');
          deleteRouteButton.addEventListener('click', () => {
            savedRoutes.splice(index, 1);
            localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
            routeContainer.remove();
          });
  
          routeContainer.appendChild(newRouteButton);
          routeContainer.appendChild(shareRouteButton);
          routeContainer.appendChild(deleteRouteButton);
          document.getElementById('routes').appendChild(routeContainer);
        });
      }
    }
  });