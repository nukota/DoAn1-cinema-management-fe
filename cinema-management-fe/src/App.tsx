import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import User from "./components/user/user";
import Employee from "./components/employee/employee";
import Admin from "./components/admin/admin";
import { EmployeesProvider } from "./providers/EmployeesProvider";
import { ReviewsProvider } from "./providers/ReviewsProvider";
import { CinemasProvider } from "./providers/CinemasProvider";
import { MoviesProvider } from "./providers/MoviesProvider";
import { ProductsProvider } from "./providers/ProductsProvider";
import { CustomersProvider } from "./providers/CustomersProvider";
import { TicketsProvider } from "./providers/TicketsProviders";
import { ShowtimesProvider } from "./providers/ShowtimesProvider";
import { OrdersProvider } from "./providers/OrdersProvider";
import { PaymentsProvider } from "./providers/PaymentsProvider";
import { DiscountsProvider } from "./providers/DiscountsProvider";
import { RoomsProvider } from "./providers/RoomsProvider";
import { SeatProvider } from "./providers/SeatProvider";
import Showtime from "./components/admin/items/Showtime";

const App: React.FC = () => {
  return (
    <Router>
      <CinemasProvider>
        <MoviesProvider>
          <ProductsProvider>
            <CustomersProvider>
              <EmployeesProvider>
                <ReviewsProvider>
                  <TicketsProvider>
                    <ShowtimesProvider>
                      <OrdersProvider>
                        <PaymentsProvider>
                          <DiscountsProvider>
                            <RoomsProvider>
                              <SeatProvider>
                                <Routes>
                                  <Route
                                    path="/"
                                    element={<Navigate to="/user" />}
                                  />
                                  <Route path="/admin/*" element={<Admin />} />
                                  <Route path="/user/*" element={<User />} />
                                  <Route path="/employee/*" element={<Employee />} />
                                </Routes>
                              </SeatProvider>
                            </RoomsProvider>
                          </DiscountsProvider>
                        </PaymentsProvider>
                      </OrdersProvider>
                    </ShowtimesProvider>
                  </TicketsProvider>
                </ReviewsProvider>
              </EmployeesProvider>
            </CustomersProvider>
          </ProductsProvider>
        </MoviesProvider>
      </CinemasProvider>
    </Router>
  );
};

export default App;
