import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Dashboard, Orders } from "./views";
import { ScrollToTop } from "./components";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/" Component={Dashboard} />
        <Route path="/orders" Component={Orders} />
      </Routes>
    </Router>
  );
}

export default App;
