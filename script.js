
const apiUrl = 'https://api.chipkontrol.com/unit';
// const apiUrl = 'http://127.0.0.1:3000/unit';

const serverInfoUrl = 'https://api.chipkontrol.com/server';
// const serverInfoUrl = 'http://127.0.0.1:3000/server';


async function getDataFromApi() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        //console.error('Error al obtener los datos:', error);
        return [];
    }
}

async function getServerInfoFromApi() {
    try {
        const response = await fetch(serverInfoUrl);
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        //console.error('Error al obtener los datos:', error);
        return [];
    }
}
async function createTable() {
    const data = await getDataFromApi();
    const serverInfo = await getServerInfoFromApi()
    const tableBody = document.querySelector('.activity-data');
    const cardInfo = document.querySelector('.overview');

    // Limpiar tabla antes de agregar datos
    tableBody.innerHTML = '';
    cardInfo.innerHTML = ''

    // Recorrer los datos y agregar filas a la tabla
    var status ="";
    Object.keys(data).forEach((item) => {
        const row = document.createElement('div');
        row.classList.add('data')
        var valor = data[item];
        //console.log(item);
        row.innerHTML = `
            <span class="data-title">${valor.name}</span>
            <span class="data-list">${valor.id}</span>
            <span class="data-list">${valor.imei}</span>
            <span class="data-list">${valor.lat}</span>
            <span class="data-list">${valor.log}</span>
            <span class="data-list">${valor.speed}</span>
            <span class="data-list">${valor.sat}</span>
            <span class="data-list">${valor.ang}</span>
            <span class="data-list">${valor.battery_voltage}</span>
            <span class="data-list">${valor.gps_validity}</span>
            <span class="data-list">${valor.time}</span>
  
      `;
        tableBody.appendChild(row);
        status = valor.server
    });
    const row = document.createElement('div');
    row.classList.add('boxes')
    //console.log(serverInfo);
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
            <span class="number">${status == 'true'? 'Correcto' : 'Fallo'}</span>
        </div>
      `;
    cardInfo.appendChild(row);
}

document.addEventListener('DOMContentLoaded', createTable);

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

