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
import { ShowtimesProvider } from "./providers/ShowtimesProvider";
import { OrdersProvider } from "./providers/OrdersProvider";
import { PaymentsProvider } from "./providers/PaymentsProvider";
import { DiscountsProvider } from "./providers/DiscountsProvider";
import { RoomsProvider } from "./providers/RoomsProvider";
import { SeatProvider } from "./providers/SeatProvider";
import AdminNotFound from "./components/admin/NotFound";
import { SettingProvider } from "./providers/SettingProvider";
import { TimerProvider } from "./providers/page/TimerProvider";
import { RevenueProvider } from "./providers/RevenueProvider";
import { ChatbotProvider } from "./providers/ChatbotProvider";
import UsersProvider from "./providers/UserProvider";

const App: React.FC = () => {
  return (
    <Router>
      <CinemasProvider>
        <MoviesProvider>
          <ProductsProvider>
            <CustomersProvider>
              <EmployeesProvider>
                <ReviewsProvider>
                  <ShowtimesProvider>
                    <OrdersProvider>
                      <PaymentsProvider>
                        <DiscountsProvider>
                          <RoomsProvider>
                            <SeatProvider>
                              <UsersProvider>
                                <SettingProvider>
                                  <RevenueProvider>
                                    <TimerProvider>
                                      <ChatbotProvider>
                                        <Routes>
                                          <Route
                                            path="/"
                                            element={<Navigate to="/user" />}
                                          />
                                          <Route
                                            path="/admin/*"
                                            element={<Admin />}
                                          />
                                          <Route
                                            path="/user/*"
                                            element={<User />}
                                          />
                                          <Route
                                            path="/employee/*"
                                            element={<Employee />}
                                          />
                                          <Route
                                            path="/*"
                                            element={<AdminNotFound />}
                                          />
                                        </Routes>
                                      </ChatbotProvider>
                                    </TimerProvider>
                                  </RevenueProvider>
                                </SettingProvider>
                              </UsersProvider>
                            </SeatProvider>
                          </RoomsProvider>
                        </DiscountsProvider>
                      </PaymentsProvider>
                    </OrdersProvider>
                  </ShowtimesProvider>
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
