
var map = L.map('main_map').setView([-27.47876526666526, -58.847399354587225], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


L.marker([-27.478736825210714, -58.847405464599944]).addTo(map)
    .bindPopup('"App Owner Here".<br> Mumeishon is Here.')
    .openPopup();

// fetch('http://localhost:3000/api/bicicletas')
// .then(res => res.json())
// .then(data => {
//     data.bicicletas.forEach((bicicleta) => {
//         L.marker(bicicleta.ubicacion, {title: bicicleta.code}).addTo(map)
//         .bindPopup(`Bicicleta ID: ${bicicleta.code}`)
//         .openPopup();
//     })
// })

const data = {
    email: "muma@gmail.com",
    password: "741"
}


fetch('http://localhost:3000/api/auth/authenticate', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify({...data}), // body data type must match "Content-Type" header
    headers: { 'Content-Type': 'application/json' }
})
.then( result => result.json())
.then(data => data)
.then(headersRes => {
    return fetch('http://localhost:3000/api/bicicletas', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'x-access-token' : headersRes.data.token 
        }
    })
})
.then( resultBici => resultBici.json())
.then(dataBici => {
    dataBici.bicicletas.forEach((bicicleta) => {
        L.marker(bicicleta.ubicacion, {title: bicicleta.code}).addTo(map)
        .bindPopup(`Bicicleta ID: ${bicicleta.modelo}`)
        .openPopup();
    })
})