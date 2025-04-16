import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Admin from "./components/admin/admin"
import "./index.css";
import User from "./components/user/user"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/user" />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/user/*" element={<User />} />
      </Routes>
    </Router>
  )
}

export default App
