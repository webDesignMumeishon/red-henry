// import './App.css';
import { useHistory } from "react-router-dom";
import '../App.css';

import {useState} from 'react'
import Mapview from './Mapview'
import Modal from "./Modal";
import {
  Link
} from "react-router-dom";
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
const {
  REACT_APP_SERVER_BASE_URL
} = process.env



function Login(props) {
  
  const [message, setMessage] = useState('Please Log in')
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const history = useHistory()

  const handleSubmit =  (e) => {
    e.preventDefault()

    const dataUser = {
      email: e.target[0].value,
      password : e.target[1].value
    }

    fetch(`${REACT_APP_SERVER_BASE_URL}/clientauth/authenticate` ,{
      method: 'POST',
      withCredentials: true,
      //DON'T TOUCH
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({...dataUser}),
    })
    .then(result => {
      return result.json()
    })
    .then(data => {
      if(data.status === true){
        props.setLogininfo({...dataUser, status: true})
        localStorage.setItem("token", data.data.token)
        let path = `/Mapview`
        history.push(path)
      }
      else{
        handleShow()
        setMessage(data.message)
      }
    })
  }
  
    return (
        <div>
          <Link className="link-top" to="/Create">Sing in</Link>
          <Link className="link-map" to="/Mapview">Go to Map</Link>

          <form onSubmit={handleSubmit} className="login-box">
            <h1>Login</h1>
            <div className="textbox">
              <p>Not a user? <Link to="/create" style={{fontWeight:"500"}}>Sing in here</Link> </p>
            </div>

            <div className="textbox">
              <FaUser className="icons"/>
              <input type="text" placeholder="email"/>
            </div>

            <div className="textbox">
              <RiLockPasswordFill className="icons"/>
              <input type="password" placeholder="password" />
              <p>Forgot your password? <Link to="/resetpassword" style={{fontWeight:"500"}}>Click Here</Link> </p>
              
            </div>
            <button type="submit" className="my-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Log in</button>
          </form>
          <Modal show={show} handleClose={handleClose} message={message}/>
        </div>
      );
}

export default Login;
