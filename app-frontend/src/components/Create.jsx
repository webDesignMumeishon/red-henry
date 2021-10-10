import React from 'react'
import { useHistory } from "react-router-dom";
import '../App.css';
import { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";
import Modal from "./Modal";

//ACA FUNCIONA
const {
  REACT_APP_SERVER_BASE_URL
} = process.env


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
    github: "",
    linkedin: "",
    lat: "",
    lng: ""
  })

  const generateLocation = () => {
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
  }

  useEffect(() => {
    generateLocation()
  }, [])

  const handleOnChange = (e) => {
      setValues({
          ...values,
          [e.target.name]: e.target.value
      })
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    // more secure regex password must be
    // more than 8 chars 
    const PASSWORD_REGEX = /^[A-Za-z0-9]\w{8,}$/;
    const LINKEDIN_REGEX = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/;
    const COHORTE_REGEX = /^[1-9][a-z]$|^[1-9][1-9][a-z]$/i
    


    if(values.password !== values.repassword){
      handleShow()
      setMessage("Las constraseñas no coinciden.")
      return setValues({
        nombre: "",
        apellido: "",
        email: "",
        cohorte: "",
        linkedin: "",
        github: "",
        password: "",
        repassword: "",
        lat: "",
        lng: ""
      })
    }

    if(!PASSWORD_REGEX.test(values.password)){
      handleShow()
      setMessage("La contraseña debe contener mas de 8 caracteres")
      return setValues({
        nombre: "",
        apellido: "",
        email: "",
        cohorte: "",
        linkedin: "",
        github: "",
        password: "",
        repassword: "",
        lat: "",
        lng: ""
      })
    }

    if(!LINKEDIN_REGEX.test(values.linkedin)){
      handleShow()
      setMessage("No es un valido URL de LinkedIn")
      return setValues({
        nombre: "",
        apellido: "",
        email: "",
        cohorte: "",
        linkedin: "",
        github: "",
        password: "",
        repassword: "",
        lat: "",
        lng: ""
      })
    }

    if(!COHORTE_REGEX.test(values.cohorte)){
      handleShow()
      setMessage("La cohorte ingresada no es valida.\n Por favor, sigue el ejemplo")
      return setValues({
        nombre: "",
        apellido: "",
        email: "",
        cohorte: "",
        linkedin: "",
        github: "",
        password: "",
        repassword: "",
        lat: "",
        lng: ""
      })
    }
    
    const dataBody = {
      nombre: values.nombre.slice(0,1).toUpperCase()+values.nombre.slice(1),
      apellido: values.apellido.slice(0,1).toUpperCase()+values.apellido.slice(1),
      email: values.email,
      cohorte: values.cohorte,
      linkedin: values.linkedin,
      github: values.github,
      password: values.password,
      repassword: values.repassword,
      lat: values.lat,
      lng: values.lng
    }
  fetch(`${REACT_APP_SERVER_BASE_URL}/api/usuarios/create`, {
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
            <h1 className="create-title">Create an Accout</h1>

            <div className="textbox-create">
              <input required type="text" placeholder="Nombre" name="nombre" value={values.nombre} onChange={handleOnChange}/>
            </div>

            <div className="textbox-create">
              <input required type="text" placeholder="Apellido" name="apellido" value={values.apellido} onChange={handleOnChange}/>
            </div>

            <div className="textbox-create">
              <span className="span-guidelines">'usuario@mail.com'</span>
              <input required type="text" placeholder="Email" name="email" value={values.email} onChange={handleOnChange}/>
            </div>

            <div className="textbox-create">
              <span className="span-guidelines">'12b'</span>
              <input required type="text" placeholder="Cohort" name="cohorte" value={values.cohorte} onChange={handleOnChange} />
            </div>

            <div className="textbox-create">
              <input required type="text" placeholder="LinkedIn" name="linkedin" value={values.linkedin} onChange={handleOnChange} />
            </div>

            
            <div className="textbox-create">
              <input required  type="text" placeholder="Github" name="github" value={values.github} onChange={handleOnChange} />
            </div>

            <div className="textbox-create">
            <span className="span-guidelines">Mas de 8 caracteres</span>
              <input required type="password" placeholder="Password" name="password" value={values.password} onChange={handleOnChange}/>
            </div>

            <div className="textbox-create">
              <input required type="password" placeholder="Re ingresa contraseña" name="repassword" value={values.repassword} onChange={handleOnChange}/>
            </div>

            <div className="textbox-coordinates">
                <p className="span-guidelines hide-span">By default your current coordinates are shown </p>
                <input required style={{marginBottom: "10px"}} type="text" placeholder="Latitude" name="lat" value={values.lat} onChange={handleOnChange}/>
                <input required type="text" placeholder="Longitude" name="lng" value={values.lng} onChange={handleOnChange}/>
                <button type="button" className="reset-coordinates-btn" onClick={generateLocation}>Reset</button>
            </div>

            <button type="submit" className="my-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Create Account</button>
          </form>
        </div>
    )
}
