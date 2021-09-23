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
    email: "",
  })

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
        email: "",
      })
    }

    fetch('http://localhost:3000/client/forgotPassword', {
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

            <form  className="resetpassword-box" onSubmit={handleOnSubmit}>
            <h1>Reset Password</h1>

            <div className="textbox">
              <input type="text" placeholder="Email" name="email" value={values.email} onChange={handleOnChange}/>
            </div>
         
            <button type="submit" className="my-btn">Send Email</button>
          </form>
        </div>
    )
}
