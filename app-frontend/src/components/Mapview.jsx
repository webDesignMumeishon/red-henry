import '../App.css';
import { MapContainer, TileLayer, Marker, Popup,useMapEvents } from 'react-leaflet'
import { useHistory } from "react-router-dom";
import {useEffect} from 'react'
import { useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { AiFillLinkedin } from 'react-icons/ai';

function Mapview(props) {

  const history = useHistory()
  const [login, setLogin] =  useState(false)
  const [bicis, setBicis] =  useState([])
  const [numBicis, setNumBicis] = useState(0)
  const [detail, setDetails] = useState({
    toggle: true
  })


  const remote = "https://app-red-henry.herokuapp.com/api/usuarios"
  const local = "http://localhost:3000/api/usuarios"

  useEffect(() => {
    fetch(remote, {
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
    setLogin(true)
  }) 
  .catch(err => {
    console.log(err)
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


  if(!login){
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
        <h5 className="nHenrys">Number of Henrys Verified: {numBicis.length}</h5>
        <h5 onClick={logout} className="logout">Logout</h5>
      </header>

      <div className="moreInfo" hidden={detail.toggle}>
        <button className="btn-info" onClick={() => setDetails({...detail, toggle: !detail.toggle})}>X</button>
        <div className="body-info">
          <h3 className="info-title">{detail.nombre}</h3>
          <p>Cohorte: {detail.cohorte}</p>
          <p>{detail.email}</p>  
          <form  method="post" action={`mailto:${detail.email}`} >
            <input className="send-email-btn" type="submit" value="Contact" /> 
          </form>
          <ul className="social-icons">
            <li><a href={detail.github} target="_blank"><AiFillGithub/></a></li>
            <li><a href={detail.linkedin} target="_blank"><AiFillLinkedin/></a></li>
          </ul>
        </div>
      </div>

      <MapContainer
        center={{ lat: -17.82712706356967, lng: -57.94735835790813 }}
        zoom={3}
        scrollWheelZoom={true}>
          <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bicis.map((b,i) => {
            return b.verified ?
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
