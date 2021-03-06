import React from 'react'
import { useHistory } from "react-router-dom";
import '../App.css';

import { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";
import Modal from "./Modal";
const {
  REACT_APP_SERVER_BASE_URL
} = process.env


export default function Create(props) {
  const history = useHistory()
  const [show, setShow] = useState(null);

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

  const [token, setToken] = useState(true)

  const [values, setValues] = useState({
    password: "",
    repassword: "",
  })

  useEffect(() => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/client/resetPassword/${props.match.params.token}`)
    .then(result => {
      return result.json()
    })
    .then(data => {
      console.log(data)
      handleShow()
      setMessage(data.msg)
      setCreation(!data.token)
      setToken(data.token)
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
    const PASSWORD_REGEX = /^[A-Za-z0-9]\w{8,}$/;


    if(values.password !== values.repassword){
      handleShow()
      setMessage("Passwords don't match.")
      return setValues({
        password: "",
        repassword: "",
      })
    }

    if(!PASSWORD_REGEX.test(values.password)){
      handleShow()
      setMessage("La contraseña debe contener mas de 8 caracteres")
      return setValues({
        password: "",
        repassword: "",
      })
    }

    fetch(`${REACT_APP_SERVER_BASE_URL}/client/resetPassword`, {
      method: 'POST',
      withCredentials: true,
      //DON'T TOUCH
      credentials: 'include',
      body: JSON.stringify({
        ...values,
        email: props.match.params.email
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(r => {
      return r.json()
    })
    .then(data => {
      handleShow()
      setCreation(data.token)
      setMessage(data.msg)
    })
    .catch(err => {
      setShow(true)
      setMessage(err.msg)
    })
  }
    return (
      <div>
        <Modal show={show} handleClose={creation ? handleClose : handleClose2} message={message}/>
        <Link className="link-top" to="/">Log in</Link>
        <Link className="link-map" to="/Mapview">Go to Map</Link>

          <form  className="create-box" onSubmit={handleOnSubmit}>
          <h1>Re Enter Password</h1>

          <div className="textbox">
          <span className="span-guidelines">Mas de 8 caracteres</span>

            <input type="password" placeholder="Password" name="password" value={values.password} onChange={handleOnChange}/>
          </div>

          <div className="textbox">
            <input type="password" placeholder="Re Enter Password" name="repassword" value={values.repassword} onChange={handleOnChange}/>
          </div>

          <button type="submit" className="my-btn" data-bs-toggle="modal">Change Password</button>
        </form>
      </div>
    )
}
