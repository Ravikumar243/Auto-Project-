// project import
// import Routes from 'routes';
import ThemeCustomization from "themes";
import ScrollTop from "components/ScrollTop";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import ThemeRoutes from "routes/index";
import { CustomerProvider } from "pages/extra-pages/customer/createDetails/CreateCustomerHooks";
import { VendorFailureProvider } from "pages/extra-pages/deshboard/vendorFailure/VendorFailureHook";
import { AgentProvider } from "pages/extra-pages/deshboard/agentDashboard/AgentDashboardHook";
import { UserProvider } from "pages/extra-pages/create-user/CreateUserHook";
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <CustomerProvider>
        <VendorFailureProvider>
          <AgentProvider>
            <UserProvider>
              <ThemeRoutes />
            </UserProvider>
          </AgentProvider>
        </VendorFailureProvider>
      </CustomerProvider>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
