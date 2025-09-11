import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login, Dashboard, Orders, Customers, NewOrder } from './views'
import { ScrollToTop } from './components'

function App () {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path='/login' Component={Login} />
        <Route path='/' Component={Dashboard} />
        <Route path='/orders' Component={Orders} />
        <Route path='/new-order' Component={NewOrder} />
        <Route path='/customers' Component={Customers} />
      </Routes>
    </Router>
  )
}

export default App
