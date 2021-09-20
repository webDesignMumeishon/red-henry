import React from 'react'
import { useHistory } from "react-router-dom";
import '../App.css';

import { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";
import Modal from "./Modal";


export default function Create() {
  const history = useHistory()
  const [show, setShow] = useState(false);

  const handleClose = () => {
    //cuando se crea efectivamente el usuario se hace el push / y cambia de pagina
    setShow(false)
    history.push("/")
  };

  const handleClose2 = () => {
    setShow(false)
  };
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState(null)
  const [creation, setCreation] = useState(false)

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cohorte: "",
    password: "",
    repassword: "",
    // github: "",
    // linkedin: "",
    lat: "",
    lng: ""
  })

  useEffect(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
          let crd = pos.coords 
          let lat = crd.latitude
          let lng = crd.longitude
          setValues({
              ...values,
              lat: lat,
              lng: lng
          })
      })
  }, [])

  const handleOnChange = (e) => {
      setValues({
          ...values,
          [e.target.name]: e.target.value
      })
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    if(values.password !== values.repassword){
      console.log("entro")
      handleShow()
      setMessage("Las constraseñas no coinciden.")
      return setValues({
        nombre: "",
        apellido: "",
        email: "",
        cohorte: "",
        password: "",
        repassword: "",
        lat: "",
        lng: ""
      })
    }

    setValues({
      ...values,
      nombre: values.nombre.slice(0,1).toUpperCase()+values.nombre.slice(1),
      apellido: values.apellido.slice(0,1).toUpperCase()+values.apellido.slice(1)
    })

    fetch('http://localhost:3000/api/usuarios/create', {
    method: 'POST',
    withCredentials: true,
    //DON'T TOUCH
    credentials: 'include',
    body: JSON.stringify(values),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(r => {
    return r.json()
  })
  .then(data => {
    handleShow()
    setCreation(data.creation)
    setMessage(data.message)
  })
  .catch(err => {
    setShow(true)
    setMessage(err.message)
    console.log(err.message)
  })
  
  }
    return (
        <div>
          <Modal show={show} handleClose={creation ? handleClose : handleClose2} message={message}/>
          <Link className="link-top" to="/">Log in</Link>
          <Link className="link-map" to="/Mapview">Go to Map</Link>

            <form  className="create-box" onSubmit={handleOnSubmit}>
            <h1>Create an Accout</h1>

            <div className="textbox">
              <input type="text" placeholder="Nombre" name="nombre" value={values.nombre} onChange={handleOnChange}/>
            </div>

            <div className="textbox">
              <input type="text" placeholder="Apellido" name="apellido" value={values.apellido} onChange={handleOnChange}/>
            </div>

            <div className="textbox">
              <input type="text" placeholder="Email" name="email" value={values.email} onChange={handleOnChange}/>
            </div>

            <div className="textbox">
              <input type="text" placeholder="Cohort" name="cohorte" value={values.cohorte} onChange={handleOnChange} />
            </div>

            <div className="textbox">
              <input type="text" placeholder="Password" name="password" value={values.password} onChange={handleOnChange}/>
            </div>

            <div className="textbox">
              <input type="text" placeholder="Re Enter Password" name="repassword" value={values.repassword} onChange={handleOnChange}/>
            </div>

            <div className="textbox">
                <p>By default your current coordinates are shown </p>
                <input style={{marginBottom: "10px"}} type="text" placeholder="Latitude" name="lat" value={values.lat} onChange={handleOnChange}/>
                <input type="text" placeholder="Longitude" name="lng" value={values.lng} onChange={handleOnChange}/>
            </div>

            <button type="submit" className="my-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Create Account</button>
          </form>
        </div>
    )
}
