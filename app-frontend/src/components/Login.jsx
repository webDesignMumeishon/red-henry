// import './App.css';
import { useHistory } from "react-router-dom";
import {useState} from 'react'
import Mapview from './Mapview'
import Modal from "./Modal";
import {
  Link
} from "react-router-dom";

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

    fetch('https://app-red-henry.herokuapp.com/client/auth/authenticate',{
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
          <Link to={'/Mapview'}>OK</Link>
          <form onSubmit={handleSubmit} >
            <input type="text" />email
            <input type="text" />password
            <button type="submit" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Submit</button>
          </form>
          <h3>Status: {message}</h3>
          <Modal show={show} handleClose={handleClose} message={message}/>
        </div>
      );
}

export default Login;
