document.addEventListener("DOMContentLoaded", function() {
    let rotaAtual = JSON.parse(localStorage.getItem('rotaAtual'));
    console.log(rotaAtual);

    // Configurar mapa Leaflet
    const map = L.map('map').setView([-19.920830, -43.937780], 14);

    // Adicionar camada do mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Utilizando o L.Routing.control para desenhar as rotas 
    let waypoints = rotaAtual.routes.map(route => {
        return L.Routing.waypoint(L.latLng(route.coordinates[0][1], route.coordinates[0][0]), route.description);
    });

    L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        router: new L.Routing.osrmv1({
            serviceUrl: `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624862e8cd6327b04ab3902533c08464a987`
        }),
    }).addTo(map);

    // Adicionar pontos de notificação
    rotaAtual.notificationPoints.forEach(np => {
        let marker = L.marker([np.lat, np.lng]).addTo(map);
        marker.bindPopup("Ponto de Notificação");
    });

});
