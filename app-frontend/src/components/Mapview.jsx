import '../App.css';
import { MapContainer, TileLayer, Marker, Popup,useMapEvents } from 'react-leaflet'
import { useHistory } from "react-router-dom";
import {useEffect} from 'react'
import { useState } from 'react';
import Loading  from './Loading';

import { UserInfo } from './UserInfo';
const {
  REACT_APP_SERVER_BASE_URL
} = process.env

function Mapview(props) {

  const history = useHistory()

  const [login, setLogin] =  useState(null)

  const [loading, setLoading] = useState(false)

  const [bicis, setBicis] =  useState([])
  const [numBicis, setNumBicis] = useState(0)
  const [detail, setDetails] = useState({
    toggle: true
  })

  useEffect(() => {
    
    setLoading(false)

    fetch(`${REACT_APP_SERVER_BASE_URL}/api/usuarios`, {
      method: 'GET',
      withCredentials: true,
      //DON'T TOUCH
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token' : localStorage.token 
      }
    })
    .then( resultBici => resultBici.json())
    .then(dataBici => {
    setBicis([...dataBici.usuarios])
    setNumBicis([...dataBici.usuarios].filter(e => e.verified))
    setLoading(true)
    setLogin(false)
  }) 
  .catch(err => {
    console.log(err)
    console.log("Failed request to the server!")
    setLoading(true)
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
    localStorage.removeItem('token')
    history.push("/")
    setLogin(false)
  }


  if(login){
    return (
      <div className="loginHere">
        <h1>You are Not logged</h1>
        <button className="my-btn" onClick={() => {history.push(`/`)}}>Log in Here</button>
      </div>
    )
  }

  return (
    <div>
      <header className="header">
        <h5 className="nHenrys">Number of Henrys Verified: {numBicis.length-1}</h5>
        <h5 onClick={logout} className="logout">Logout</h5>
      </header>

      <Loading hidden={loading}/>

      <UserInfo detail={detail} close={() => setDetails({...detail, toggle: !detail.toggle})}></UserInfo>

      <MapContainer
        center={{ lat: -17.82712706356967, lng: -57.94735835790813 }}
        zoom={3}
        scrollWheelZoom={true}>
          <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bicis.map((b,i) => {
            return b.verified && b.nombre !== 'testing' ?
            <Marker
              key={i}
              position={b?.ubicacion}>
            <Popup>
              Nombre: {b.nombre} <br />
              Cohorte: {b.cohorte}
              <br/>
              <span className="moreSpan" onClick={() => setDetails({toggle: !detail.toggle, ...b})}>More</span>
            </Popup>
            </Marker> 
            : null
          })}
        <LocationMarker />
      </MapContainer>
    </div>
  ) 
}

export default Mapview;
