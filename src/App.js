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
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <CustomerProvider>
        <VendorFailureProvider>
          <AgentProvider>
            <ThemeRoutes />
          </AgentProvider>
        </VendorFailureProvider>
      </CustomerProvider>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
