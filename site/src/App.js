import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Home from './pages/Home/Home'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import { getSession } from './utils'
import { AppProvider } from '@shopify/polaris'
import translations from "@shopify/polaris/locales/ja.json";
import Verification from './pages/Auth/Verification'
import AppInstall from './pages/Auth/AppInstall'
import Callback from './pages/Auth/Callback'
import ShopDomain from './pages/Auth/ShopDomain'

import cognitoBase from './utils/cognito.js'
const cognito = new cognitoBase()
export default function App() {
  useEffect(()=>{
    if( !window.location.pathname.match(/login/) && 
        !window.location.pathname.match(/register/) && 
        !cognito.userPool.getCurrentUser()?.getSession(function(error,session){return session.accessToken.jwtToken})
    ){
      window.location = "/login?flash=ログインしてください";
    }
  }, []);
  return (
    <AppProvider i18n={translations}>
      <Router>
        <Switch>

          <Route path='/top' component={Home} />
          <Route path='/register' component={Auth} />
          <Route exact path='/verification/:email' component={Verification} />
          <Route path='/login' component={Auth} />
          <Route path='/auth' component={AppInstall} />
          <Route path='/callback' component={Callback} />
          <Route path='/shop_domain' component={ShopDomain} />

          <PrivateRoute
            exact
            path='/'
            component={Dashboard}
          />
        </Switch>
      </Router>
    </AppProvider>
  )
}

/**
 * A component to protect routes.
 * Shows Auth page if the user is not authenticated
 */
const PrivateRoute = ({ component, ...options }) => {

  const session = getSession()

  const finalComponent = session ? Dashboard : Auth
  return <Route {...options} component={finalComponent} />
}