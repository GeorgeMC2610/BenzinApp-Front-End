import { Container, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function DashboardNavbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <section className="dashboard-navbar py-3">
      <Container>
        <Row>
          <Col>
            <div className="dashboard-nav">
              <Link 
                to="/dashboard" 
                className={`nav-item ${isActive('/dashboard') || isActive('/user') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/fuel-fills" 
                className={`nav-item ${isActive('/fuel-fills') ? 'active' : ''}`}
              >
                Fuel Fills
              </Link>
              <Link 
                to="/malfunctions" 
                className={`nav-item ${isActive('/malfunctions') ? 'active' : ''}`}
              >
                Malfunctions
              </Link>
              <Link 
                to="/services" 
                className={`nav-item ${isActive('/services') ? 'active' : ''}`}
              >
                Services
              </Link>
              <Link 
                to="/trips" 
                className={`nav-item ${isActive('/trips') ? 'active' : ''}`}
              >
                Trips
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default DashboardNavbar;
