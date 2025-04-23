import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import User from "./components/user/user";
import Employee from "./components/employee/employee";
import { EmployeesProvider } from "./providers/EmployeesProvider";
import Admin from "./components/admin/admin";
import { CinemasProvider } from "./providers/CinemasProvider";
import { MoviesProvider } from "./providers/MoviesProvider";
import { ProductsProvider } from "./providers/ProductsProvider";
import { CustomersProvider } from "./providers/CustomersProvider";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/user" />} />
        <Route
          path="/admin/*"
          element={
            <CinemasProvider>
              <MoviesProvider>
                <ProductsProvider>
                  <CustomersProvider>
                    <EmployeesProvider>
                      <Admin />
                    </EmployeesProvider>
                  </CustomersProvider>
                </ProductsProvider>
              </MoviesProvider>
            </CinemasProvider>
          }
        />
        <Route path="/user/*" element={<User />} />
        <Route path="/employee" element={<Employee />} />
      </Routes>
    </Router>
  );
};

export default App;
