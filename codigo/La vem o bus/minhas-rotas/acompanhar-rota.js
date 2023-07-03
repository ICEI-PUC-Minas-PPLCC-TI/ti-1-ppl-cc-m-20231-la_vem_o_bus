document.addEventListener("DOMContentLoaded", async function() {
    let rotaAtual = JSON.parse(localStorage.getItem('rotaAtual'));
    const orsKey = '5b3ce3597851110001cf624862e8cd6327b04ab3902533c08464a987';
  
    console.log("Rota Atual: ", JSON.stringify(rotaAtual, null, 2)); 
  
    // Configurar mapa Leaflet
    const map = L.map('map').setView([-19.920830, -43.937780], 14);
  
    // Adicionar camada do mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    const createBusRoute = async (point1, point2, description, color, htmlPath) => {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsKey}&start=${point1.lng},${point1.lat}&end=${point2.lng},${point2.lat}`;
      try {
        const response = await fetch(url);
        const json = await response.json();
  
        console.log("JSON Response: ", json);
  
        if (json.features && json.features.length > 0) {
          const routeCoordinates = json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          const busRoute = L.polyline(routeCoordinates, { color: color }).addTo(map);
  
          let startButton = document.createElement('button');
          startButton.textContent = 'Iniciar Rota';
          startButton.addEventListener('click', function () {
            localStorage.setItem('selectedRoute', JSON.stringify({ description, color, coordinates: [point1, point2] }));
            window.location.href = htmlPath; // Redireciona para o arquivo HTML da rota selecionada
          });
          busRoute.bindPopup(startButton);
  
          return {
            route: busRoute,
            description: description
          };
        } else {
          console.error('No route found');
        }
      } catch (error) {
        console.error('Error fetching route', error);
      }
    };
  
    // descrição da rota
    const displayRouteDescription = () => {
      console.log("Exibindo descrição das rotas...");
      const routeList = document.getElementById('route-list');
  
      rotaAtual.routes.forEach((route) => {
        const listItem = document.createElement('li');
        const routeLegend = document.createElement('span');
        const routeDescription = document.createElement('span');
  
        routeLegend.className = 'route-legend';
        routeLegend.style.backgroundColor = route.color;
  
        routeDescription.className = 'route-description';
        routeDescription.textContent = route.description;
  
        listItem.appendChild(routeLegend);
        listItem.appendChild(routeDescription);
        routeList.appendChild(listItem);
      });
    };
  
    // Desenhar rotas
    const drawRoutes = async () => {
      for(let i = 0; i < rotaAtual.routes.length; i++) {
        let route = rotaAtual.routes[i];
        console.log("Desenhando rota: ", route.description);
  
        if (route.coordinates.length > 0) {
          let point1 = route.coordinates[0];
          let point2 = route.coordinates[route.coordinates.length - 1];
          console.log("De: ", point1, " Para: ", point2);
          await createBusRoute(point1, point2, route.description, route.color, route.htmlPath);
        }
      }
  
      // Exibir a descrição das rotas
      displayRouteDescription();
  
      // Adicionar pontos de notificação
      rotaAtual.notificationPoints.forEach(np => {
        let marker = L.marker([np.lat, np.lng], { icon: notificationIcon }).addTo(map);
        marker.bindPopup("Ponto de Notificação");
        notificationPoints.push(np);
      });
    };
  
    console.log("Desenhando rotas...");
    await drawRoutes();
  
    // GPS
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 0
      };
  
      const successCallback = function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
  
        // Atualize a posição do usuário no mapa ou realize outras ações necessárias
        // Exemplo: updateUserLocation(latitude, longitude);
        updateUserLocation(latitude, longitude);
      };
  
      const errorCallback = function (error) {
        console.error('Error getting location', error);
      };
  
      const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  
    // Ícone personalizado para o marcador de localização do usuário
    const userIcon = L.icon({
      iconUrl: '../rotas/imagens/posicao.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });
  
    // Definindo o marcador de localização do usuário
    let userLocationMarker = L.marker([0, 0], { icon: userIcon }).addTo(map);
    userLocationMarker.bindPopup('Você está aqui');
  
    // Função para atualizar a posição do usuário no mapa
    function updateUserLocation(lat, lng) {
      userLocationMarker.setLatLng([lat, lng]);
      userLocationMarker.getPopup().setContent('Você está aqui');
      userLocationMarker.openPopup();
    }
  
    // Se a geolocalização estiver disponível, pegue a posição atual do usuário
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 0
      };
  
      const successCallback = function (position) {
        updateUserLocation(position.coords.latitude, position.coords.longitude);
      };
  
      const errorCallback = function (error) {
        console.error('Error getting location', error);
      };
  
      // Inicie a observação da localização do usuário
      const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  
    const notificationIcon = L.icon({
      iconUrl: '../rotas/imagens/pin.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });
  
    setInterval(() => {
      if (notificationPoints.length > 0) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
  
          notificationPoints.forEach((notificationLatLng, index) => {
            const notificationPoint = L.latLng(notificationLatLng.lat, notificationLatLng.lng);
            if (userLatLng.distanceTo(notificationPoint) <= 40) {
              alert('Você está a 40 metros do ponto');
              const audio = new Audio('sounds/BOLSO.mp3');
              audio.play();
  
              // Remova o notificationPoint do mapa
              map.removeLayer(notificationMarkers[index]);
  
              const userEmail = isLoggedIn();
              if (userEmail) {
                const savedRoutesJSON = localStorage.getItem(userEmail);
                const savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
  
                savedRoutes.forEach((savedRoute) => {
                  const notificationPointIndex = savedRoute.notificationPoints.findIndex(np => np.lat === notificationLatLng.lat && np.lng === notificationLatLng.lng);
                  if (notificationPointIndex !== -1) {
                    savedRoute.notificationPoints.splice(notificationPointIndex, 1);
                  }
                });
  
                localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
              }
  
              // Remova o notificationPoint do array local
              notificationPoints.splice(index, 1);
            }
          });
        });
      }
    }, 1000);
  });
  