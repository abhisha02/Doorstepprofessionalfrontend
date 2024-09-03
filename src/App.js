import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeWrapper from './components/Home/HomeWrapper/HomeWrapper';
import CustomerRegister from './pages/customer/CustomerRegister';
import OTPVerification from './pages/customer/Customerotp';
import UserLogin from './pages/customer/customerlogin';
import { Provider } from "react-redux";
import Store from "./Redux/Store";
import UserWrapper from "./components/Customer/customerwrapper";
import AdminWrapper from './components/Admin/adminwrapper';
import ProfessionalWrapper from './components/professional/professionalwrapper';
import GlobalNotificationHandler from './components/GlobalNotificationHandler';
import Homeroute from './components/HomeRoute';

function App() {
  return (
    <BrowserRouter>
    <Provider store={Store}>
   
      <Routes>
        <Route path="/" element={<Homeroute><HomeWrapper /></Homeroute>} />
        <Route path="/customer/*" element={<UserWrapper />} />
        <Route path="/admin/*" element={< AdminWrapper />} />
        <Route path="/professional/*" element={< ProfessionalWrapper />} />
       
       
      </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
