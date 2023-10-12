
//const apiUrl = 'https://api.chipkontrol.com/unit';
const apiUrl = 'http://127.0.0.1:3000/unit';

//const serverInfoUrl = 'https://api.chipkontrol.com/server';
const serverInfoUrl = 'http://127.0.0.1:3000/server';

const units = '';
const itemsPerPage = 10; // Número de filas por página
let currentPage = 1; // Página actual
const tableBody = document.querySelector('.data-table-body');
const cardInfo = document.querySelector('.overview');
const prevPageBtn = document.querySelector('.prev-page');
const nextPageBtn = document.querySelector('.next-page');
const pageNumElement = document.querySelector('.page-num');

async function fetchData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API Units');
        }
        return await response.json();
    } catch (error) {
        //console.error('Error al obtener los datos:', error);
        return [];
    }
}

// Función para mostrar datos en la página actual
async function displayDataOnPage(page) {

    let data = JSON.parse(localStorage.getItem('data'))
    const newData = await fetchData(apiUrl);

    if (Array.isArray(newData) && newData.length > 0) {
        data = newData
        localStorage.setItem('data', JSON.stringify(data));
    }
    tableBody.innerHTML = ''; // Limpiar la tabla

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        const row = document.createElement('tr'); // Crea una nueva fila

        // Crea y agrega celdas con los valores de las propiedades de 'data[i]'
        for (const prop of ['name', 'id', 'imei', 'lat', 'log', 'speed', 'sat', 'ang', 'battery_voltage', 'gps_validity', 'time']) {
            const cell = document.createElement('td');
            cell.textContent = data[i][prop];
            // Verifica si la propiedad es 'name' y agrega una clase CSS
            if (prop === 'name') {
                cell.classList.add('bold'); // Añadir clase 'naranja' para el color naranja
            }
            row.appendChild(cell);
        }

        tableBody.appendChild(row);// Agrega la fila al tbody
    }

    // Actualiza el número de página actual en el elemento HTML
    pageNumElement.textContent = `Página ${page}`;
}

// Función para actualizar el estado de los botones de paginación
async function updatePaginationButtons() {
    const data = await fetchData(apiUrl);
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === Math.ceil(data.length / itemsPerPage);
}

// Manejadores de eventos para los botones de paginación
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayDataOnPage(currentPage);
        updatePaginationButtons();
    }
});

nextPageBtn.addEventListener('click', async () => {
    const data = await fetchData(apiUrl);
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
        currentPage++;
        displayDataOnPage(currentPage);
        updatePaginationButtons();
    }
});

async function loadCardsFromService() {
    let data = JSON.parse(localStorage.getItem('data'))

    const serverInfo = await fetchData(serverInfoUrl);
    const row = document.createElement('div');
    row.classList.add('boxes')
    const allServersOnline = data.every(item => item.server === 'true');
    row.innerHTML = `
        <div class="box box1">
            <i class="uil uil-cpu"></i>
            <span class="text">NUCLEOS DE CPU</span>
            <span class="number">${serverInfo.numCores}</span>
        </div>
        <div class="box box2">
            <i class="uil uil-cpu"></i>
            <span class="text">RAM TOTAL</span>
            <span class="number">${serverInfo.totalMemory} GB</span>
        </div>
        <div class="box box3">
            <i class="uil uil-cpu"></i>
            <span class="text">RAM LIBRE</span>
            <span class="number">${serverInfo.freeMemory} GB</span>
        </div>
        <div class="box box4">
            <i class="uil uil-cpu"></i>
            <span class="text">TIEMPO ACTIVO</span>
            <span class="number">${serverInfo.uptime}  Días</span>
        </div>
        <div class="box box1">
            <i class="uil uil-cpu"></i>
            <span class="text">SISTEMA OPERATIVO</span>
            <span class="number">${serverInfo.osName}</span>
        </div>
        <div class="box box5">
            <i class="uil uil-cpu"></i>
            <span class="text">STATUS API SITRACK</span>
            <span class="number">${allServersOnline ? 'Correcto' : 'Fallo'}</span>
        </div>
      `;
    cardInfo.appendChild(row);
}

const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
})

document.addEventListener('DOMContentLoaded', () => {
    displayDataOnPage(currentPage);
    loadCardsFromService();
});