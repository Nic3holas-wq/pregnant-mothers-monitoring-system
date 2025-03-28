import Appointment from "./Pages/Appointment/Appointment";
import Home from "./Pages/Home/Home";
import Insights from "./Pages/Insights/Insights";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import theme from "./utils/theme";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Trackhealth from "./Pages/TrackHealth/Trackhealth";
import Chat from "./Pages/Chat/Chat";
import Notifications from "./Pages/Notifications/Notifications";
import Dashboard from "./Pages/Doctor/Dashboard/Dashboard";
import Alerts from "./Pages/Doctor/Alerts/Alerts";
import Messages from "./Pages/Doctor/Messages/Messages";
import PatientsAppointment from "./Pages/Doctor/PatientsAppointment/PatientsAppointment";
import MedicalRecords from "./Pages/MedicalRecords/MedicalRecords";
function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/trackhealth" element={<Trackhealth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/patientsappointment" element={<PatientsAppointment />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
      </Routes>
    </Router>
      
      
    </div>
  );
}

export default App;
