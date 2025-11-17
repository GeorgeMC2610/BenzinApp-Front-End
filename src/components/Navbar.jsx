import { Container, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCarStore } from '../services/managers/CarManager';
import { useNavigate } from "react-router";
import {useFuelFillRecordStore} from "../services/managers/FuelFillRecordManager.ts";
import {useMalfunctionStore} from "../services/managers/MalfunctionManager.ts";
import {useTripStore} from "../services/managers/TripManager.ts";
import {useServiceStore} from "../services/managers/ServiceManager.ts";

function Navbar() {
  const carStore = useCarStore();
  const fuelFillStore = useFuelFillRecordStore();
  const malfunctionStore = useMalfunctionStore();
  const tripStore = useTripStore();
  const serviceStore = useServiceStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    carStore.logout();
    carStore.destroyValues();
    malfunctionStore.destroyValues();
    tripStore.destroyValues();
    serviceStore.destroyValues();
    fuelFillStore.destroyValues();
    navigate('/login');
  };

  return (
    <BootstrapNavbar expand="lg" className="navbar-custom py-3" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-4 brand-text d-flex align-items-center">
          <img
            src="/logo.png"
            alt="BenzinApp Logo"
            className="navbar-logo me-2"
          />
          BenzinApp
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-1">
            <Nav.Link as={Link} to="/about" className="nav-link-custom px-3">About</Nav.Link>
            <Nav.Link href="#contact" className="nav-link-custom px-3">Contact</Nav.Link>
            {carStore.car ? (
              <>
                <Nav.Link as={Link} to="/user" className="nav-link-custom px-3">Dashboard</Nav.Link>
                <span className="navbar-text px-3">{carStore.car.username}</span>
                <Button
                  variant="outline-danger"
                  className="btn-logout ms-lg-2 mt-2 mt-lg-0"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom px-3">Log In</Nav.Link>
                <Button
                  variant="primary"
                  as={Link}
                  to="/register"
                  className="btn-register ms-lg-2 mt-2 mt-lg-0"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;

