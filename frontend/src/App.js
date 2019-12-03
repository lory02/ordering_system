import React from 'react';
import {
  HashRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import CheckLogin from './components/CheckLogin'
import LandingPage from './components/LandingPage'
import HomePage from './components/HomePage/HomePage'
import SelectPage from './components/Client/SelectPage'
import Menu from './components/Menu/Menu'
import OrderSuccess from './components/Menu/OrderSuccess'
import Register from './components/Register'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={ CheckLogin } />  
        <Route path='/login' component={ LandingPage } />
        <Route path='/register' component={ Register } />
        <Route path='/restaurant/:rid/homepage' component={ HomePage } />
        <Route path='/restaurant/:rid/selectPage' component={SelectPage} />
        <Route path='/restaurant/:rid/desk/:did/customerCount/:number/menu' component={Menu} />
        <Route path='/restaurant/:rid/desk/:did/order-success' component={OrderSuccess} />
      </Switch>
    </Router>
  );

}

export default App;
