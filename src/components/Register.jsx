import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    carManufacturer: '',
    carModel: '',
    year: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
              <div className="text-center mb-5">
                <Link to="/" className="brand-link">
                  <div className="brand-logo d-flex align-items-center justify-content-center">
                    <img 
                      src="/logo.png" 
                      alt="BenzinApp Logo" 
                      className="brand-icon me-2"
                    />
                  </div>
                  <div className="brand-logo mt-3">
                    <span className="brand-text">Register to BenzinApp</span>
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
                      <Form.Label htmlFor="username" className="form-label">
                        Username
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <Form.Label htmlFor="carManufacturer" className="form-label">
                        Car Manufacturer
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="carManufacturer"
                        name="carManufacturer"
                        value={formData.carManufacturer}
                        onChange={handleChange}
                        placeholder="e.g. Toyota, Honda, Ford"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <Form.Label htmlFor="carModel" className="form-label">
                        Car Model
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="carModel"
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleChange}
                        placeholder="e.g. Camry, Civic, Focus"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <Form.Label htmlFor="year" className="form-label">
                        Year
                      </Form.Label>
                      <Form.Control
                        type="number"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="e.g. 2020"
                        className="form-input"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <Form.Label htmlFor="password" className="form-label">
                        Password
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          className="form-input password-input"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </Button>
                      </InputGroup>
                    </div>

                    <div className="form-group mb-4">
                      <Form.Label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          className="form-input password-input"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          className="password-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          type="button"
                        >
                          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </Button>
                      </InputGroup>
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
