const form = document.querySelector('form'),
      input = document.querySelector('input'),
      ipNumWrapper = document.querySelector('.ip-number'),
      locationNameWrapper = document.querySelector('.position-name'),
      timeZoneWrapper = document.querySelector('.timezone-time'),
      ispNameWrapper = document.querySelector('.isp-name');

let map;
let inputValue;

input.addEventListener('input', (event) => {
  event.preventDefault();
  inputValue = insertDotsInIPAddress(event);
});

// загружаем карту Leaflet при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await getDataFromAPI('https://geo.ipify.org/api/v2/country,city?apiKey=at_2XvU36QAO6irpQC2zhVxluElolTq5');
    let {location} = data;
    addMap(location.lat, location.lng);
  } catch (error) {
    console.error(error);
  }
});

form.addEventListener('submit', async (e) => { 
    e.preventDefault();

    let apiKey = 'at_2XvU36QAO6irpQC2zhVxluElolTq5',
        apiAddress = inputValue;

    let urlApi = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${apiAddress}`;

    try { 
      const data = await getDataFromAPI(urlApi);
      console.log(data);
      
      let {ip, location, isp} = data;

    // Заполняем html динамическими данными из API
      ipNumWrapper.textContent = ip;
      locationNameWrapper.textContent = location.city;
      timeZoneWrapper.textContent = location.timezone;
      if (isp == ''){
        ispNameWrapper.textContent = '-';
      } else {
        ispNameWrapper.textContent = isp;
      }

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
    if (map) {
        map.remove();
    }

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