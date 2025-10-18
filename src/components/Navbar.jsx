import { Container, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <BootstrapNavbar expand="lg" className="navbar-custom py-3" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-4 brand-text">
          BenzinApp
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-1">
            <Nav.Link as={Link} to="/about" className="nav-link-custom px-3">About</Nav.Link>
            <Nav.Link as={Link} to="/user" className="nav-link-custom px-3">Dashboard</Nav.Link>
            <Nav.Link href="#contact" className="nav-link-custom px-3">Contact</Nav.Link>
            <Nav.Link href="#login" className="nav-link-custom px-3">Log In</Nav.Link>
            <Button 
              variant="primary" 
              href="#register" 
              className="btn-register ms-lg-2 mt-2 mt-lg-0"
            >
              Register
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;

