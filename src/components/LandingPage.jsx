import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10} xl={8}>
              <div className="badge-pill mb-3">
                <span className="badge-text">⛽ Track every drop</span>
              </div>
              <h1 className="hero-title mb-4">
                Take control of your vehicle's performance
              </h1>
              <p className="hero-subtitle mb-5">
                Track fuel consumption, maintenance schedules, and expenses for your classic cars. 
                Perfect for older vehicles without trip computers or drivers who care about every detail.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button size="lg" variant="outline-secondary" className="btn-demo" as={Link} to="/login">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="me-2">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Log In
                </Button>
                <Button size="lg" variant="primary" className="btn-signup" as={Link} to="/register">
                  Sign up
                </Button>
              </div>
            </Col>
          </Row>
          
          {/* Dashboard Preview */}
          <Row className="justify-content-center mt-5 pt-4">
            <Col lg={11}>
              <div className="dashboard-preview">
                <img 
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=600&fit=crop" 
                  alt="BenzinApp Dashboard Preview" 
                  className="img-fluid rounded-4 shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Social Proof */}
      <section className="social-proof-section py-5">
        <Container>
          <p className="text-center text-muted mb-4">Trusted by thousands of car enthusiasts worldwide</p>
          <Row className="justify-content-center align-items-center g-4">
            {['🚗 Classic Cars', '🏎️ Sports Cars', '🚙 Daily Drivers', '🚐 Family Vans', '🛻 Pickup Trucks'].map((vehicle) => (
              <Col xs={6} md={4} lg={2} key={vehicle} className="text-center">
                <div className="company-logo">{vehicle}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <div className="section-badge mb-3">Features</div>
              <h2 className="section-title mb-3">
                Everything you need to manage your vehicle
              </h2>
              <p className="section-subtitle">
                From fuel tracking to maintenance logs, BenzinApp gives you complete insight into 
                your vehicle's health and performance. Simple, powerful, and always at your fingertips.
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            {[
              {
                icon: '⛽',
                title: 'Fuel Fill Tracking',
                description: 'Log every fill-up with detailed records including liters, cost, odometer reading, and fuel type. Track your spending and consumption over time.'
              },
              {
                icon: '📈',
                title: 'Consumption Analytics',
                description: 'Visualize your fuel economy with detailed charts and trends. Monitor liters per 100km and identify patterns in your driving habits.'
              },
              {
                icon: '🔧',
                title: 'Maintenance Logs',
                description: 'Keep track of all maintenance activities, from oil changes to tire rotations. Never miss a service interval again.'
              },
              {
                icon: '💰',
                title: 'Expense Management',
                description: 'Monitor all vehicle-related costs in one place. See exactly how much your car costs to run and identify areas to save money.'
              },
              {
                icon: '🚗',
                title: 'Multiple Vehicles',
                description: 'Manage an entire fleet of vehicles from a single account. Perfect for households with multiple cars or collectors with classic vehicles.'
              },
              {
                icon: '📍',
                title: 'Trip Statistics',
                description: 'Record and analyze your trips with detailed statistics. Perfect for business mileage tracking or understanding your driving patterns.'
              }
            ].map((feature, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="feature-card h-100 border-0">
                  <Card.Body className="p-4">
                    <div className="feature-icon mb-3">{feature.icon}</div>
                    <h5 className="feature-title mb-2">{feature.title}</h5>
                    <p className="feature-description text-muted mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <Card className="cta-card border-0">
            <Card.Body className="p-5 text-center">
              <h2 className="cta-title mb-3">Start tracking your vehicle today</h2>
              <p className="cta-subtitle mb-4">
                Join thousands of car owners who trust BenzinApp to keep their vehicles running smoothly.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button size="lg" variant="outline-secondary" as={Link} to="/about">
                  Learn more
                </Button>
                <Button size="lg" variant="primary" as={Link} to="/register">
                  Get started for free
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer-section py-5">
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <p className="text-muted mb-0">
                © 2025 BenzinApp. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default LandingPage;

