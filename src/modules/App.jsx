import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom'
import {
  Login,
  Dashboard,
  Orders,
  Customers,
  NewOrder,
  RoleView,
  Users,
  VehicleTypes,
  AddressBook,
  Accessorials,
  CreateRole,
  EditRole
} from './views'
import { ScrollToTop } from './components'
import { AuthContext } from './contexts'

function App () {
  const authContext = React.useContext(AuthContext)

  const ProtectRoute = props => {
    return authContext.isAuthenticated ? <Outlet /> : <Navigate to='/login' />
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path='/login' Component={Login} />
        <Route element={<ProtectRoute />}>
          <Route path='/' index Component={Dashboard} />
          <Route path='/orders' Component={Orders} />
          <Route path='/new-order' Component={NewOrder} />
          <Route path='/customers' Component={Customers} />
          <Route path='/roles' Component={RoleView} />
          <Route path='/roles/create' Component={CreateRole} />
          <Route path='/roles/edit/:rid' Component={EditRole} />
          <Route path='/users' Component={Users} />
          <Route path='/vehicle-types' Component={VehicleTypes} />
          <Route path='/address-books' Component={AddressBook} />
          <Route path='/accessorials' Component={Accessorials} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
