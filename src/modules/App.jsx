import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
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
  EditCompany,
  CreateDriver,
  EditDriver,
  CreateCustomer,
  EditCustomer,
  EditRateSheet,
  EditOrder,
  DispatchView,
  NotAuthorized
} from './views'
import { DriverDeliveries, LandingPage } from './DriverApp/view'
import { ScrollToTop } from './components'
import { AuthContext, safeParseUser } from './contexts/Auth.context'

const ROLES = {
  ADMIN: 'admin',
  DRIVER: 'driver',
}

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = React.useContext(AuthContext)
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }
  const parsedUser = safeParseUser(user)
  if (!parsedUser || !allowedRoles.includes(parsedUser.type)) {
    return <Navigate to='/not-authorized' replace />
  }

  return <Outlet />
}

const GuestOnlyRoute = () => {
  const { isAuthenticated, user } = React.useContext(AuthContext)
  if (!isAuthenticated) {
    return <Outlet />
  }
  const parsedUser = safeParseUser(user)
  if (parsedUser?.type === ROLES.DRIVER) {
    return <Navigate to='/driver-dashboard' replace />
  }
  return <Navigate to='/' replace />
}

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route element={<GuestOnlyRoute />}>
          <Route path='/login' Component={Login} />
        </Route>
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path='/' Component={Dashboard} />
          <Route path='/orders' Component={Orders} />
          <Route path='/dispatch' Component={DispatchView} />
          <Route path='/orders/create' Component={NewOrder} />
          <Route path='/orders/edit/:id' Component={EditOrder} />
          <Route path='/customers' Component={Customers} />
          <Route path='/customer/create' Component={CreateCustomer} />
          <Route path='/customer/edit/:id' Component={EditCustomer} />
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
          <Route path='/rate-sheet/edit/:id/:cid' Component={EditRateSheet} />
          <Route path='/drivers' Component={Drivers} />
          <Route path='/driver/create' Component={CreateDriver} />
          <Route path='/driver/edit/:id' Component={EditDriver} />
          <Route path='/fuel-surcharges' Component={FuelSurcharges} />
          <Route path='/interliners' Component={Interliners} />
          <Route path='/interliner/create' Component={CreateInterliner} />
          <Route path='/interliner/edit/:id' Component={EditInterliner} />
        </Route>
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.DRIVER]} />}>
          <Route path='/driver-dashboard' Component={LandingPage} />
          <Route path='/driver-deliveries/:tid' Component={DriverDeliveries} />
        </Route>
        <Route path='/not-authorized' element={<NotAuthorized />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  )
}

export default App