import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Offcanvas } from 'react-bootstrap';

function DrawerMenu() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      altPaths: ['/user']
    },
    {
      path: '/fuel-fills',
      label: 'Fuel Fills',
      icon: '⛽',
      altPaths: []
    },
    {
      path: '/malfunctions',
      label: 'Malfunctions',
      icon: '⚠️',
      altPaths: []
    },
    {
      path: '/services',
      label: 'Services',
      icon: '🔧',
      altPaths: []
    },
    {
      path: '/trips',
      label: 'Trips',
      icon: '🚗',
      altPaths: []
    }
  ];

  const isItemActive = (item) => {
    return isActive(item.path) || item.altPaths.some(altPath => isActive(altPath));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="drawer-menu-mobile">
        <Button
          variant="outline-secondary"
          onClick={handleShow}
          className="drawer-toggle-btn d-lg-none"
          aria-label="Open navigation menu"
        >
          <span className="hamburger-icon">☰</span>
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="drawer-menu-desktop d-none d-lg-block">
        <div className="drawer-sidebar">
          <nav className="drawer-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`drawer-nav-item ${isItemActive(item) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="start" className="drawer-offcanvas">
        <Offcanvas.Header closeButton className="drawer-offcanvas-header">
          <Offcanvas.Title className="drawer-offcanvas-title">
            Navigation Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="drawer-offcanvas-body">
          <nav className="drawer-nav-mobile">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`drawer-nav-item ${isItemActive(item) ? 'active' : ''}`}
                onClick={handleClose}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default DrawerMenu;
