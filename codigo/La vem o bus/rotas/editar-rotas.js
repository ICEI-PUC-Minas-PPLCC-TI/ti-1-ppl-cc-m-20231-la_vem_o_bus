document.addEventListener('DOMContentLoaded', async () => {
        


    const map = L.map('map').setView([-19.920830, -43.937780], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);



    const orsKey = '5b3ce3597851110001cf624862e8cd6327b04ab3902533c08464a987';


    const createWalkingRoute = async (point1, point2, description) => {
        const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${orsKey}&start=${point1.lng},${point1.lat}&end=${point2.lng},${point2.lat}`;
        try {
            const response = await fetch(url);
            const json = await response.json();

            if (json.features && json.features.length > 0) {
                const routeCoordinates = json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                const walkingRoute = L.polyline(routeCoordinates, { color: 'green', dashArray: '5, 10' }).addTo(map);
                return {
                    route: walkingRoute,
                    description: description
                };
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
            const routeDescription = prompt("Digite a descrição da rota:");
            let newRouteObject = null;
            if (addingBusRoute) {
                const busRouteColor = document.getElementById('busRouteColor').value;
                newRouteObject = await createBusRoute(selectedPoints[0], selectedPoints[1], busRouteColor, routeDescription);
            } else {
                newRouteObject = await createWalkingRoute(selectedPoints[0], selectedPoints[1], routeDescription);
            }
            const newRoute = newRouteObject.route;
            const description = newRouteObject.description;
            currentRoutes.push({ route: newRoute, description: description });
            selectedPoints = [];
            map.off('click', onMapClick);
            addingBusRoute = false;
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

    // salvar rotas 
    const saveCurrentRoute = () => {
        const userEmail = isLoggedIn();
        if (userEmail) {
            if (currentRoutes.length > 0) {
                const routeName = prompt("Digite um nome para a rota:");
                if (routeName) {
                    const notificationData = [...notificationPoints];

                    const savedRoute = {
                        name: routeName,
                        routes: currentRoutes.map(routeObject => ({
                            coordinates: routeObject.route.getLatLngs(),
                            color: routeObject.route.options.color,
                            description: routeObject.description
                        })),
                        notificationPoints: notificationData 
                    };
                    const savedRoutesJSON = localStorage.getItem(userEmail);
                    let savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
                    savedRoutes.push(savedRoute);
                    localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
    
                    const newRouteButton = document.createElement('button');
                    newRouteButton.innerText = routeName;
                    newRouteButton.classList.add('route-button');
                    
                    newRouteButton.addEventListener('click', () => {
                        currentRoutes.forEach(route => map.removeLayer(route.route));
                        currentRoutes = [];
                        savedRoute.routes.forEach(routeCoordinates => {
                            const polylineOptions = {
                                color: routeCoordinates.color,
                            };
                    
                            if (routeCoordinates.color === 'green') {
                                polylineOptions.dashArray = '5, 10';
                            }
                    
                            const savedRouteLine = L.polyline(routeCoordinates.coordinates, polylineOptions).addTo(map);
                            currentRoutes.push({ route: savedRouteLine, description: routeCoordinates.description });
                        });
                    
                        const routeButtons = document.querySelectorAll('.route-button');
                        routeButtons.forEach(button => button.classList.remove('selected'));
                        newRouteButton.classList.add('selected');
                    
                        const routeDescriptionElement = document.getElementById('routeDescription');
                        if (routeDescriptionElement) {
                            routeDescriptionElement.textContent = savedRoute.description;
                        } else {
                            console.error("routeDescription element não foi encontrado");
                        }
                    
                        const routeDetails = document.getElementById('routeDetails');
                        routeDetails.innerHTML = '';
                    
                        savedRoute.routes.forEach(routeData => {
                            const routeDescriptionItem = document.createElement('li');
                            routeDescriptionItem.textContent = routeData.description;
                            routeDescriptionItem.dataset.routeName = savedRoute.name; 
                            routeDetails.appendChild(routeDescriptionItem);
                        });
                    });
                    
    
                    document.getElementById('routes').appendChild(newRouteButton);
    
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
    
   

    

    const removeLastRoute = () => {
        if (currentRoutes.length > 0) {
            const lastRoute = currentRoutes[currentRoutes.length - 1];
            map.removeLayer(lastRoute.route);
            currentRoutes.pop();
        }
    };

    document.getElementById('saveRoute').addEventListener('click', saveCurrentRoute);
    loadSavedRoutes();
    document.getElementById('removeLastRoute').addEventListener('click', removeLastRoute);

    let markersGroup = L.layerGroup().addTo(map);

    function drawNotificationMarker(lat, lng) {
        const icon = L.icon({
            iconUrl: 'imagens/pin.png',
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38]
        });

        const marker = L.marker([lat, lng], { icon: icon });
        markersGroup.addLayer(marker);
        return marker;
    }

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
                newRouteButton.dataset.routeIndex = index;
                newRouteButton.addEventListener('click', () => {
                    currentRoutes.forEach(route => map.removeLayer(route.route));
                    currentRoutes = [];
                    savedRoute.routes.forEach(routeCoordinates => {
                        const polylineOptions = {
                            color: routeCoordinates.color,
                        };
                
                        if (routeCoordinates.color === 'green') {
                            polylineOptions.dashArray = '5, 10';
                        }
                
                        const savedRouteLine = L.polyline(routeCoordinates.coordinates, polylineOptions).addTo(map);
                        currentRoutes.push({ route: savedRouteLine, description: routeCoordinates.description });
                    });
                
                    const routeButtons = document.querySelectorAll('.route-button');
                    routeButtons.forEach(button => button.classList.remove('selected'));
                    newRouteButton.classList.add('selected');
                
                    const routeDescriptionElement = document.getElementById('routeDescription');
                    if (routeDescriptionElement) {
                        routeDescriptionElement.textContent = savedRoute.description;
                    } else {
                        console.error("routeDescription element não foi encontrado");
                    }
                
                    const routeDetails = document.getElementById('routeDetails');
                    routeDetails.innerHTML = '';
                  

                    markersGroup.clearLayers();
                    savedRoute.routes.forEach(routeData => {
                        const routeDescriptionItem = document.createElement('li');
                        routeDescriptionItem.textContent = routeData.description;
                        routeDescriptionItem.dataset.routeName = savedRoute.name; 
                        routeDetails.appendChild(routeDescriptionItem);
                    });
                
                    // Desenha os pontos de notificação no mapa
                    console.log(savedRoute.notificationPoints);
                    console.log('array de notificação acima');
                    console.log('mapa abaixo:');
                    console.log(map); // Imprima a variável `map` para o console
                    console.log('groupmarkers abaixo');
                    console.log(markersGroup.getLayers()); // Deve imprimir um array de marcadores
                    savedRoute.notificationPoints.forEach(notificationPoint => {
                        if (notificationPoint) {
                            const marker = drawNotificationMarker(notificationPoint.lat, notificationPoint.lng);
                            setTimeout(() => {
                                console.log(markersGroup.hasLayer(marker));
                            }, 0);
                        }
                    });
                    
                    

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
                routeContainer.appendChild(deleteRouteButton);
                document.getElementById('routes').appendChild(routeContainer);
            });

            const selectedRouteButton = document.querySelector('.route-button.selected');
            if (selectedRouteButton) {
                const routeIndex = parseInt(selectedRouteButton.dataset.routeIndex);
                if (!isNaN(routeIndex) && routeIndex >= 0 && routeIndex < savedRoutes.length) {
                    const selectedRoute = savedRoutes[routeIndex];
                    const routeDescriptionElement = document.getElementById('routeDescription');
                    routeDescriptionElement.textContent = selectedRoute.description;
                }
            }
        }
    }

    document.getElementById('saveRoute').addEventListener('click', saveCurrentRoute);

    const createBusRoute = async (point1, point2, color, description) => {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsKey}&start=${point1.lng},${point1.lat}&end=${point2.lng},${point2.lat}`;

        try {
            const response = await fetch(url);
            const json = await response.json();

            if (json.features && json.features.length > 0) {
                const routeCoordinates = json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                const busRoute = L.polyline(routeCoordinates, { color: color }).addTo(map);
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


    let addingBusRoute = false;

    document.getElementById('addBusRoute').addEventListener('click', () => {
        addingBusRoute = true;
        map.on('click', onMapClick);
    });








    
    // alterar descrição da rota

    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const nextButton = document.getElementById('nextButton');
    let currentlyEditing = null;
    
    let savedRoute = null; // Variável savedRoute adicionada aqui
    
    editButton.addEventListener('click', () => {
        if (currentlyEditing === null) {
            // No item is currently being edited, so we start editing the first item
            const firstItem = routeDetails.querySelector('li');
            if (firstItem) {
                // Before starting the editing, save the route associated with the item to be edited
                const userEmail = isLoggedIn(); // Obtenha o email do usuário
            if (!userEmail) {
                console.error('Nenhum usuário logado!');
                return;
            }

            const savedRoutesJSON = localStorage.getItem(userEmail); // Obtenha as rotas salvas do usuário
            let savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];

            // Identifique qual rota salva está associada com o item que está sendo editado
            const savedRouteName = firstItem.dataset.routeName; // Supondo que você adicionou um atributo data com o nome da rota ao item

            if (!savedRouteName) {
                console.error('Nenhum nome de rota associado com o item!');
                return;
            }

            // Encontre a rota salva que está associada com o item que está sendo editado
            savedRoute = savedRoutes.find(route => route.name === savedRouteName);

            if (!savedRoute) {
                console.error('Rota salva não encontrada!');
                return;
            }

                startEditing(firstItem);
            }
        }
    });
    
    
    

    saveButton.addEventListener('click', () => {
        if (currentlyEditing) {
            stopEditing(currentlyEditing, savedRoute); // Passar a variável savedRoute como parâmetro
            currentlyEditing = null;
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentlyEditing) {
            stopEditing(currentlyEditing, savedRoute); // Passar a variável savedRoute como parâmetro
            const nextItem = currentlyEditing.nextElementSibling;
            if (nextItem) {
                startEditing(nextItem);
            } else {
                currentlyEditing = null;
                editButton.disabled = false;
                saveButton.disabled = true;
                nextButton.disabled = true;
            }
        }
    });

    function startEditing(item) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = item.textContent;
        item.textContent = '';
        item.appendChild(input);
        input.focus();
        currentlyEditing = item;
        editButton.disabled = true;
        saveButton.disabled = false;
        nextButton.disabled = false;
    }

    function stopEditing(item, savedRoute) {
        if (!savedRoute) {
            console.error('savedRoute é null ou undefined!');
            return;
        }
        
        const input = item.querySelector('input');
        const text = document.createTextNode(input.value);
        item.textContent = '';
        item.appendChild(text);
    
        // Update the route description in the savedRoute object and save it to local storage
        const routeIndex = Array.from(routeDetails.children).indexOf(item); // Alterado para obter o índice do item na lista
        if (routeIndex === -1) {
            console.error('Não foi possível encontrar o item na lista de detalhes da rota!');
            return;
        }
        
        if (routeIndex >= savedRoute.routes.length) {
            console.error('Índice de rota fora dos limites!');
            return;
        }
    
        savedRoute.routes[routeIndex].description = input.value;
    
        const userEmail = isLoggedIn();
        if (userEmail) {
            const savedRoutesJSON = localStorage.getItem(userEmail);
            let savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
            savedRoutes.forEach((route, index) => {
                if (route.name === savedRoute.name) {
                    savedRoutes[index] = savedRoute;
                }
            });
            console.log(savedRoutes); // Verificar o valor de savedRoutes antes de atualizar a rota
            console.log('salvando descrição');
            localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
            console.log(localStorage.getItem(userEmail)); // Verificar se o valor foi salvo corretamente no local storage
        }
    }
   








    //Parte 2 do código envolvendo ponto de notificação e localização!








    //GPS
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
            // Exemplo: addUserLocation(latitude, longitude);
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
        iconUrl: 'imagens/posicao.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    function addUserLocation(lat, lng) {
        const userLocation = L.marker([lat, lng], { icon: userIcon }).addTo(map);
        userLocation.bindPopup('Você está aqui').openPopup();
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            addUserLocation(position.coords.latitude, position.coords.longitude);
        }, function (error) {
            console.error('Error getting location', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }

    let notificationPoints = [];  
    let addNotificationMode = false;
    let markersReference = {};

    const notificationIcon = L.icon({
        iconUrl: 'imagens/pin.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });
   
    
   
   
    
    // Após a definição de todas as suas funções, adicione os eventListeners.
   
    function addNotificationPoint(e) {
        if (!addNotificationMode) {
            return;
        }
    
        const newNotificationPoint = L.marker(e.latlng, { icon: notificationIcon }).addTo(map);
        notificationPoints.push(newNotificationPoint.getLatLng());
    
        const userEmail = isLoggedIn();
        if (userEmail) {
            const savedRoutesJSON = localStorage.getItem(userEmail);
            const savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
    
            // Obtém o índice da rota selecionada
            const selectedRouteButton = document.querySelector('.route-button.selected');
            if (selectedRouteButton) {
                const routeIndex = parseInt(selectedRouteButton.dataset.routeIndex);
                if (!isNaN(routeIndex) && routeIndex >= 0 && routeIndex < savedRoutes.length) {
    
                    // Adiciona o novo ponto de notificação à rota selecionada
                    savedRoutes[routeIndex].notificationPoints.push(newNotificationPoint.getLatLng());
    
                    // Salva as rotas atualizadas de volta no local storage
                    localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
                }
            }
        }
    
        addNotificationMode = false;
        alert('Ponto de notificação adicionado com sucesso!');
    }
    
    
    map.on('click', addNotificationPoint);

    document.getElementById('addNotificationPoint').addEventListener('click', () => {
        addNotificationMode = true;
    });

    setInterval(() => {             // lida com a notificação
        if (notificationPoints.length > 0) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
    
                notificationPoints.forEach((notificationLatLng, index) => {
                    const notificationPoint = L.latLng(notificationLatLng.lat, notificationLatLng.lng);
                    if (userLatLng.distanceTo(notificationPoint) <= 400) {
                        alert('você está a 40 metros do ponto ')
                        const audio = new Audio('sounds/BOLSO.mp3');
                        audio.play();
                        
                        
                        // Remove the notificationPoint from the map
                      
                        
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
    
                        // Remove the notificationPoint from the local array
                        notificationPoints.splice(index, 1);
                    }
                });
            });
        }
    }, 1000);
    
    

    

    // remove notification point
    const removeNotificationPointButton = document.getElementById('removeNotificationPoint');

    removeNotificationPointButton.addEventListener('click', () => {
        const userEmail = isLoggedIn();
        if (userEmail) {
            const savedRoutesJSON = localStorage.getItem(userEmail);
            const savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
    
            // Obtém o índice da rota selecionada
            const selectedRouteButton = document.querySelector('.route-button.selected');
            if (selectedRouteButton) {
                const routeIndex = parseInt(selectedRouteButton.dataset.routeIndex);
                if (!isNaN(routeIndex) && routeIndex >= 0 && routeIndex < savedRoutes.length) {
    
                    // Remove o último ponto de notificação da rota selecionada
                    const selectedRoute = savedRoutes[routeIndex];
                    if (selectedRoute.notificationPoints.length > 0) {
                        const lastNotificationPoint = selectedRoute.notificationPoints.pop();
                        const markerKey = `${lastNotificationPoint.lat}-${lastNotificationPoint.lng}`;
                        
                        // Remove o marcador do mapa usando markersReference
                        if (markersReference[markerKey]) {
                            map.removeLayer(markersReference[markerKey]);
                            delete markersReference[markerKey];
                        }
    
                        // Salva as rotas atualizadas de volta no local storage
                        localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
                        location.reload();
                        alert('Ponto de notificação removido.');
    
                    } else {
                        
                        alert('Nenhum ponto de notificação para remover nesta rota.');
                    }
                }
            }
        } else {
            alert('Por favor, faça login para remover pontos de notificação.');
        }
    });
    
    
    
    document.getElementById('clearMap').addEventListener('click', function() {  // clear map;
        location.reload();
    });
    
    const updateRoute = () => {
        console.log('Iniciando atualização da rota...');
        const userEmail = isLoggedIn();
        if (userEmail) {
            const selectedRouteButton = document.querySelector('.route-button.selected');
            if (selectedRouteButton) {
                const routeIndex = parseInt(selectedRouteButton.dataset.routeIndex);
                const savedRoutesJSON = localStorage.getItem(userEmail);
                const savedRoutes = savedRoutesJSON ? JSON.parse(savedRoutesJSON) : [];
    
                console.log('Rotas salvas encontradas: ', savedRoutes);
    
                if (!isNaN(routeIndex) && routeIndex >= 0 && routeIndex < savedRoutes.length) {
                    const selectedRoute = savedRoutes[routeIndex];
    
                    console.log('Rota selecionada: ', selectedRoute);
    
                    if (currentRoutes.length > 0) {
                        const routeName = prompt("Digite um novo nome para a rota:");
                        if (routeName) {
                            selectedRoute.name = routeName;
                            selectedRoute.routes = currentRoutes.map(routeObject => ({
                                coordinates: routeObject.route.getLatLngs(),
                                color: routeObject.route.options.color,
                                description: routeObject.description
                            }));
    
                            console.log('Detalhes da rota atualizada: ', selectedRoute);

                            console.log('pontos de notificação abaixo em update routes antes de ser salvo no local storage:');
                            console.log(notificationPoints);
    
                            // Salvar os pontos de notificação no Local Storage junto com a rota
                            
    
                            localStorage.setItem(userEmail, JSON.stringify(savedRoutes));
                            alert('Rota atualizada com sucesso!');
                            currentRoutes = [];
                             location.reload();
                            
                        } else {
                            alert('Nome inválido para a rota.');
                        }
                    } else {
                        alert('Nenhuma rota para atualizar. Por favor, crie uma rota primeiro.');
                    }
                } else {
                    alert('Nenhuma rota selecionada. Por favor, selecione uma rota para atualizar.');
                }
            } else {
                alert('Por favor, faça login para atualizar a rota.');
            }
        } else {
            alert('Por favor, faça login para atualizar a rota.');
        }
    };
    
    document.getElementById('updateRoute').addEventListener('click', updateRoute);


 // ponto de notificação
    
 
 



}); // Feche o eventListener 'DOMContentLoaded'