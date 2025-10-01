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
  EditRole,
  Companies,
  RateSheets,
  Drivers,
  FuelSurcharges,
  Interliners,
  CreateInterliner,
  EditInterliner,
  CreateCompany,
  EditCompany
} from './views'
import { ScrollToTop } from './components'
import { AuthContext } from './contexts'

function App() {
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
          <Route path='/companies' Component={Companies} />
          <Route path='/company/create' Component={CreateCompany} />
          <Route path='/company/edit/:id' Component={EditCompany} />
          <Route path='/rate-sheets' Component={RateSheets} />
          <Route path='/drivers' Component={Drivers} />
          <Route path='/fuel-surcharges' Component={FuelSurcharges} />
          <Route path='/interliners' Component={Interliners} />
          <Route path='/interliner/create' Component={CreateInterliner} />
          <Route path='/interliner/edit/:id' Component={EditInterliner} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
