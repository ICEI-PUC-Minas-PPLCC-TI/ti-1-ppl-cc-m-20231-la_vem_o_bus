document.addEventListener('DOMContentLoaded', async () => {
    // Inicialize o mapa
    const map = L.map('map').setView([-19.920830, -43.937780], 14); // Coordenadas de Belo Horizonte e zoom inicial

    // Adicione uma camada de mapa (tiles) ao mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Substitua 'YOUR_API_KEY' pela sua chave de API do OpenRouteService
    const orsKey = '5b3ce3597851110001cf624862e8cd6327b04ab3902533c08464a987';

    // Função para obter a rota a pé seguindo as ruas
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

    // Defina as coordenadas das rotas
    const startPoint1 = [-19.91083332522026, -43.90513648605128];
    const endPoint1 = [-19.926103152843456, -43.930969993042105];
    const startPoint11 = [-19.917577503598082, -43.926531283811855];
    const endPoint11 = [-19.92613525959305, -43.9253860993067];
    const startPoint12 = [-19.91242162450274, -43.90449527735016]; //leopoldo gomes
    const endPoint12 = [-19.917408044061244, -43.926413315297225]; // hermilo alves
    const startPoint13 = [-19.92609059249397, -43.93093242348241]; 
    const endPoint13 = [-19.924080719924657, -43.95300394391276]; 

    const startPoint2 = [-19.91083332522026, -43.90513648605128];
    const endPoint2 = [-19.933287406764244, -43.93711621673579];
   

    // Obtenha e adicione rotas a pé seguindo as ruas ao mapa
    const route1Coordinates = await busroute(startPoint1, endPoint1);
    const route2Coordinates = await busroute(startPoint2, endPoint2);

    const route11coordinates = await busroute(startPoint11, endPoint11);
    const route12coordinates = await busroute(startPoint12, endPoint12);
    const route13coordinates = await busroute(startPoint13, endPoint13);
                              
    if (route1Coordinates) {
        L.polyline(route1Coordinates, { color: 'blue' }).addTo(map);
    }
    
    if (route11coordinates) { // Verifique se as coordenadas da terceira rota estão disponíveis
        L.polyline(route11coordinates, { color: 'blue' }).addTo(map); 
    }
    if (route12coordinates) { // Verifique se as coordenadas da terceira rota estão disponíveis
        L.polyline(route12coordinates, { color: 'blue' }).addTo(map); 
    }
    if (route13coordinates) {
        L.polyline(route13coordinates, { color: 'blue' }).addTo(map);
    }

    if (route2Coordinates) {
        L.polyline(route2Coordinates, { color: 'red' }).addTo(map);
    }

   









    // Função para criar uma rota a pé entre dois pontos
    const createWalkingRoute = async (point1, point2) => {
        const orsKey = '5b3ce3597851110001cf624862e8cd6327b04ab3902533c08464a987'; 
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

    // Variáveis para armazenar os pontos selecionados e a rota atual
    let selectedPoints = [];
    let currentRoute = null;

    // Função para lidar com cliques no mapa ao criar uma rota
    const onMapClick = async (e) => {
        selectedPoints.push(e.latlng);
        if (selectedPoints.length === 2) {
            if (currentRoute) {
                map.removeLayer(currentRoute);
            }
            currentRoute = await createWalkingRoute(selectedPoints[0], selectedPoints[1]);
            map.off('click', onMapClick);
            selectedPoints = [];
        }
    };

    // Adicione event listener ao botão "Criar Rota"
    document.getElementById('addRoute').addEventListener('click', () => {
        map.on('click', onMapClick);
    });


    // Variável para armazenar todas as rotas
let savedRoutes = [];

// Função para salvar a rota atual e criar um novo botão
const saveCurrentRoute = () => {
    if (currentRoute) {
        const routeCoordinates = currentRoute.getLatLngs();
        savedRoutes.push(routeCoordinates);

        // Crie um novo botão e adicione-o à lista de rotas
        const newRouteButton = document.createElement('button');
        newRouteButton.innerText = `Rota ${savedRoutes.length}`;
        newRouteButton.classList.add('route-button');
        newRouteButton.addEventListener('click', () => {
            // Remova a rota atual do mapa, se houver
            if (currentRoute) {
                map.removeLayer(currentRoute);
            }

            // Adicione a rota salva ao mapa
            currentRoute = L.polyline(routeCoordinates, { color: 'green', dashArray: '5, 10' }).addTo(map);
        });

        document.getElementById('routes').appendChild(newRouteButton);

        alert('Rota salva com sucesso!');
    } else {
        alert('Nenhuma rota para salvar. Por favor, crie uma rota primeiro.');
    }
};

// Adicionar event listener ao botão "Salvar Rota"
document.getElementById('saveRoute').addEventListener('click', saveCurrentRoute);

});
