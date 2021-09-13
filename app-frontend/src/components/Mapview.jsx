// import logo from './logo.svg';
import '../App.css';
import { MapContainer, TileLayer, Marker, Popup,useMapEvents } from 'react-leaflet'
import { useHistory } from "react-router-dom";
import {useEffect} from 'react'
import { useState } from 'react';



function Mapview(props) {

  const history = useHistory()
  const [login, setLogin] =  useState(false)
  const [bicis, setBicis] =  useState([])
  // const [loading, setLoading] = useState(false)

  useEffect(() => {
     fetch('http://localhost:3000/api/usuarios', {
      method: 'GET',
      withCredentials: true,
      //DON'T TOUCH
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        }, 
      })
      .then( resultBici => resultBici.json())
      .then(dataBici => {
      // let bicisCoord = dataBici.bicicletas.map(el => {
      // return el.ubicacion
      // })
      // setBicis(bicisCoord)
      setBicis([...dataBici.usuarios])
      setLogin(true)
    })
  },[])

  function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  const logout = () => {
    fetch('http://localhost:3000/logout2', {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        }, 
    })
    .then(result => result.json())
    .then(data => {
      history.push("/")
      setLogin(false)
    })
  }

  // const showPreview = () => {
  //   alert("HEy there")
  // }

  console.log(bicis)

  if(!login){
    return (
      <div>
        <h1>You are Not logged</h1>
        <button onClick={() => {history.push(`/`)}}>Log in Here</button>
      </div>
    )
  }

  return (
    <div>
      <h3>Number of Henrys registered: {bicis.length}</h3>
      
      <MapContainer
        center={{ lat: -17.82712706356967, lng: -57.94735835790813 }}
        zoom={3}
        scrollWheelZoom={true}>
          <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bicis.map((b,i) => (
            <Marker
              key={i}
              // eventHandlers={{ click: () => showPreview() }}
              position={b?.ubicacion}>
            <Popup>
              Nombre: {b.nombre} <br />
              Cohorte: {b.cohorte}
            </Popup>
            </Marker>
          ))}
        <LocationMarker />
      </MapContainer>,
    <button onClick={logout}>logout</button>
    </div>

  ) 
  
}

export default Mapview;
