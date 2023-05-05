// Adicione o ouvinte de evento de clique no mapa fora do evento de clique do botão
map.on("click", async (event) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${event.latlng.lat}&lon=${event.latlng.lng}`
      );
      const data = await response.json();
      const address = data.address;
      const street = address.road || address.pedestrian;
      const number = address.house_number;
      const popupContent = `<strong>Rua:</strong> ${street}<br><strong>Número:</strong> ${number}`;
      L.popup().setLatLng(event.latlng).setContent(popupContent).openOn(map);
    } catch (error) {
      console.error(error);
    }
  });
  
  const getLocationInfoBtn = document.querySelector("#getLocationInfo");
  getLocationInfoBtn.addEventListener("click", () => {
    alert("Clique em um ponto no mapa para obter informações sobre a localização.");
  });
  