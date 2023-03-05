const form = document.querySelector('form'),
      input = document.querySelector('input');

      
let map = null; // Объявляем переменную, которая будет использоваться для проверки существования карты на странице 
let inputValue;

input.addEventListener('input', (event) => {
  event.preventDefault();
  inputValue = insertDotsInIPAddress(event);
});

form.addEventListener('submit', async (e) => { // делаем колбэк функцию асинхронной
    e.preventDefault();

    let apiKey = 'at_2XvU36QAO6irpQC2zhVxluElolTq5',
        apiAddress = inputValue;

    let urlApi = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${apiAddress}`;

    try { // используем try-catch для обработки ошибок
      const data = await getDataFromAPI(urlApi);
      let {ip, location} = data;
    //   console.log(ip);
    //   console.log(location);
      addMap(location.lat, location.lng);
    } catch (error) {
      console.error(error);
    }

    // Очищаем инпут после получения данных
    input.value = '';
  });


function insertDotsInIPAddress(event) {
  let input = event.target;
  let value = input.value;
  
  // Проверяем, что вводятся только цифры, точки, и не больше 15 символов
  if (/[^0-9\.]/.test(value) || value.length > 15) {
    input.value = value.replace(/[^0-9\.]/g, '').substr(0, 15);
  }
  
  return input.value; // возвращаем значение поля
}

async function getDataFromAPI(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
}


function addMap(lat, lng){
    // Проверяем, существует ли элемент "map"
    if (map !== null) {
        // Если карта уже существует, удаляем ее перед созданием новой
        map.remove();
    }
    // Инициализация новой карты
    let position = {
        center: [lat, lng],
        zoom: 15
    }
    map = L.map('map', position); // Присваиваем переменной map созданную карту

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var marker = L.marker(position.center).addTo(map);
}

