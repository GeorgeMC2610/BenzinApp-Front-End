import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import About from './components/About';
import User from './components/User';
import Login from './components/Login';
import Register from './components/Register';
import AddFuelFill from './components/AddFuelFill';
import FuelFills from './components/FuelFills';
import Malfunctions from './components/Malfunctions';
import AddMalfunction from './components/AddMalfunction';
import Services from './components/Services';
import AddService from './components/AddService';
import Trips from './components/Trips';
import AddTrip from './components/AddTrip';
import SpecificFuelFillRecord from './components/SpecificFuelFillRecord';
import SpecificServiceRecord from './components/SpecificServiceRecord';
import SpecificTripRecord from './components/SpecificTripRecord';
import SpecificMalfunctionRecord from './components/SpecificMalfunctionRecord';
import EditCar from './components/EditCar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
          <Route path="/dashboard" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-fuel-fill" element={<AddFuelFill />} />
          <Route path="/edit-fuel-fill/:id" element={<AddFuelFill />} />
          <Route path="/fuel-fills" element={<FuelFills />} />
          <Route path="/malfunctions" element={<Malfunctions />} />
          <Route path="/add-malfunction" element={<AddMalfunction />} />
          <Route path="/edit-malfunction/:id" element={<AddMalfunction />} />
          <Route path="/malfunction/:id" element={<SpecificMalfunctionRecord />} />
          <Route path="/services" element={<Services />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/edit-service/:id" element={<AddService />} />
          <Route path="/service/:id" element={<SpecificServiceRecord />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/add-trip" element={<AddTrip />} />
          <Route path="/trip/:id" element={<SpecificTripRecord />} />
          <Route path="/fuel-fill/:id" element={<SpecificFuelFillRecord />} />
          <Route path="/edit-car" element={<EditCar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
