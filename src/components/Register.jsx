import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt:', formData);
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <div className="register-container">
              {/* Logo/Brand */}
              <div className="text-center mb-4">
                <Link to="/" className="brand-link">
                  <div className="brand-logo">
                    <FontAwesomeIcon icon={faGasPump} className="brand-icon" />
                    <span className="brand-text">BenzinApp</span>
                  </div>
                </Link>
              </div>

              {/* Register Form */}
              <Card className="register-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h1 className="register-title">Create an account</h1>
                    <p className="register-subtitle">Enter your information to get started</p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <Form.Label htmlFor="name" className="form-label">
                        Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <Form.Label htmlFor="email" className="form-label">
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <Form.Label htmlFor="password" className="form-label">
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group mb-4">
                      <Form.Label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <Form.Check
                        type="checkbox"
                        id="terms"
                        label={
                          <span>
                            I agree to the{' '}
                            <Link to="/terms" className="terms-link">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="terms-link">
                              Privacy Policy
                            </Link>
                          </span>
                        }
                        className="terms-checkbox"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="register-btn w-100 mb-3"
                      size="lg"
                    >
                      Create account
                    </Button>

                    <div className="text-center">
                      <span className="login-text">
                        Already have an account?{' '}
                        <Link to="/login" className="login-link">
                          Sign in
                        </Link>
                      </span>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
