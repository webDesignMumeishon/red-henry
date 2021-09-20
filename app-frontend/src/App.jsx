import './App.css';
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useState } from 'react';
import Mapview from './components/Mapview';
import Create from './components/Create';
import ResetPassword from './components/ResetPassword'
import ReCrearePassword from './components/ReCreatePassword'

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
      <Route  exact path="/">
          <Login setLogininfo={setLogininfo}/>
        </Route>
        <Route path="/Mapview">
          <Mapview email={loginInfo.username} password={loginInfo.password}  status={loginInfo.status}/>
        </Route>

        <Route path="/create">
          <Create/>
        </Route>

        <Route exact path="/resetpassword">
          <ResetPassword/>
        </Route>

        <Route path='/recreatepassword/:token/:email' component={ReCrearePassword}/>

        
        {/* Default redirected page if the path is invalid */}
        <Route path="*"  exact={true}>
          <Login setLogininfo={setLogininfo}/>
        </Route>
      </Switch>
    </div>
  </Router>
  );
}

export default App;
