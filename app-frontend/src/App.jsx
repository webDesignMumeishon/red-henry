import './App.css';
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useState } from 'react';
import Mapview from './components/Mapview';
// import Create from './Create';

function App() {

  const [loginInfo, setLogininfo] = useState({
      username: '',
      password: '',
      status: false
  })

  return (
    <Router>
    <div>
      <Switch>
        <Route path="/Mapview">
          <Mapview email={loginInfo.username} password={loginInfo.password}  status={loginInfo.status}/>
        </Route>
        <Route path="/">
          <Login setLogininfo={setLogininfo}/>
        </Route>
        {/* <Route path="/create">
          <Create />
        </Route> */}
      </Switch>
    </div>
  </Router>
  );
}

export default App;
