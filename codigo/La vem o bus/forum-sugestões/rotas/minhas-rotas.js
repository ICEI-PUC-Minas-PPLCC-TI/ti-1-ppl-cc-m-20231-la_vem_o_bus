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

    //Ajuda
    document.getElementById('helpButton').addEventListener('click', () => {
        alert('Clique nos botões para adicionar as rotas a pé e as rotas dos ônibus respectivamente.\nPara deletar a última linha tracejada clique no botão Remover Última Rota');
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
                        })),
                        notificationPoint: notificationPoint ? notificationPoint.getLatLng() : null  // salva a posição do ponto de notificação
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
    
                    document.getElementById('routes').appendChild(newRouteButton);
    
                    alert('Rota salva com sucesso!');
                    currentRoutes = [];
                    location.reload(); // Adicione esta linha para recarregar a página                  
                } else {
                    alert('Nenhuma rota para salvar. Por favor, crie uma rota primeiro.');
                }
                
            }
        } else {
            alert('Por favor, faça login para salvar a rota.');
        }
        location.reload(); // Adicione esta linha para recarregar a página
    };

    // Função para remover a última rota
const removeLastRoute = () => {
    if (currentRoutes.length > 0) {
      const lastRoute = currentRoutes.pop();
      map.removeLayer(lastRoute);
    }
  };

    document.getElementById('saveRoute').addEventListener('click', saveCurrentRoute);
    document.getElementById('removeLastRoute').addEventListener('click', removeLastRoute);
    
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
    
                    // Se houver um ponto de notificação no mapa, remova-o
                    if (notificationPoint) {
                        map.removeLayer(notificationPoint);
                    }
    
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
    
                    // Se um ponto de notificação foi salvo com as rotas, adicione-o ao mapa
                    if (savedRoute.notificationPoint) {
                        notificationPoint = L.marker(savedRoute.notificationPoint, {icon: notificationIcon}).addTo(map);
                    }
                });
            
                const deleteRouteButton = document.createElement('button');
                deleteRouteButton.innerText = 'Excluir';
                deleteRouteButton.classList.add('delete-route-button');
                deleteRouteButton.addEventListener('click', () => {
                    // Exclui a rota do localStorage
                    savedRoutes.splice(index, 1);
                    localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
                
                    // Remove os elementos da rota e do botão da página
                    routeContainer.remove();
                
                    // Recarrega a página após excluir a rota
                    location.reload();
                });
                
                routeContainer.appendChild(newRouteButton);
                routeContainer.appendChild(deleteRouteButton);
                document.getElementById('routes').appendChild(routeContainer);
            });
        }
    }
    
    document.getElementById('saveRoute').addEventListener('click', saveCurrentRoute);
    

    // rota de onibus
    const createBusRoute = async (point1, point2, color) => {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsKey}&start=${point1.lng},${point1.lat}&end=${point2.lng},${point2.lat}`;
    
        try {
            const response = await fetch(url);
            const json = await response.json();
    
            if (json.features && json.features.length > 0) {
                const routeCoordinates = json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                const busRoute = L.polyline(routeCoordinates, { color: color }).addTo(map);
                return busRoute;
            } else {
                console.error('No route found');
            }
        } catch (error) {
            console.error('Error fetching route', error);
        }
    };
    
    let addingBusRoute = false;
    
    document.getElementById('addBusRoute').addEventListener('click', () => {
        addingBusRoute = true;
        map.on('click', onMapClick);
    });


    //GPS



    
    // Ícone personalizado para o marcador de localização do usuário
    const userIcon = L.icon({
        iconUrl: 'imagens/posicao.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });
    
    function addUserLocation(lat, lng) {
        const userLocation = L.marker([lat, lng], {icon: userIcon}).addTo(map);
        userLocation.bindPopup('Você está aqui').openPopup();
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            addUserLocation(position.coords.latitude, position.coords.longitude);
        }, function(error) {
            console.error('Error getting location', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
    
    let notificationPoint;
    let addNotificationMode = false;
    
    const notificationIcon = L.icon({
        iconUrl: 'imagens/pin.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });
    
    function addNotificationPoint(e) {
        if (!addNotificationMode) {
            return;
        }
    
        if (notificationPoint) {
            map.removeLayer(notificationPoint);
        }
    
        notificationPoint = L.marker(e.latlng, {icon: notificationIcon}).addTo(map);
        addNotificationMode = false;
    }
    
    map.on('click', addNotificationPoint);
    
    document.getElementById('addNotificationPoint').addEventListener('click', () => {
        addNotificationMode = true;
    });
    
    setInterval(() => {
        if (notificationPoint) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
                const notificationLatLng = notificationPoint.getLatLng();
    
                if (userLatLng.distanceTo(notificationLatLng) <= 200) {
                    alert('Você está dentro de 20 metros do ponto de notificação!');
                    map.removeLayer(notificationPoint);
                    notificationPoint = null;
                }
            });
        }
    }, 1000);
    
    if (savedRoute.notificationPoint) {
        addNotificationPointToMap(savedRoute.notificationPoint);
    }



    
    }); // Feche o eventListener 'DOMContentLoaded'


