import {Route, Switch} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import NotFound from './components/NotFound'
import MovieItemDetails from './components/MovieItemDetails'
import ProtectedRoute from './components/ProtectedRoute'
import Account from './components/Account'

import Popular from './components/Popular'

import './App.css'
import Search from './components/Search'

const App = () => (
  <div className="mainApp">
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/popular" component={Popular} />
      <ProtectedRoute exact path="/search" component={Search} />
      <ProtectedRoute exact path="/account" component={Account} />
      <ProtectedRoute exact path="/movies/:id" component={MovieItemDetails} />
      <Route component={NotFound} />
    </Switch>
  </div>
)

export default App
