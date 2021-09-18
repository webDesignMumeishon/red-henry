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

    fetch('http://localhost:3000/client/auth/authenticate',{
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
        console.log(data.message)
        setMessage(data.message)
      }
    })
  }
  
    return (
        <div>
          {/* <Link to={'/Mapview'}>OK</Link> */}
          <form onSubmit={handleSubmit} className="login-box">
            <h1>Login</h1>
            
            <div className="textbox">
              <p>Not a user? <Link style={{fontWeight:"500"}}>Sing in here</Link> </p>
            </div>

            <div className="textbox">
              <FaUser className="icons"/>
              <input type="text" placeholder="email"/>
            </div>

            <div className="textbox">
              <RiLockPasswordFill className="icons"/>
              <input type="text" placeholder="password"/>
              
            </div>
            <button type="submit" class="my-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Log in</button>
          </form>
          <Modal show={show} handleClose={handleClose} message={message}/>
        </div>
      );
}

export default Login;
