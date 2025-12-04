import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useCarStore } from '../services/managers/CarManager.ts';
import { useNavigate } from "react-router";

function Register() {
  const carStore = useCarStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    manufacturer: '',
    model: '',
    year: '',
    password: '',
    password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const username = formData.username
    const password = formData.password
    const confirmPassword = formData.password_confirmation
    const manufacturer = formData.manufacturer
    const model = formData.model
    const year = formData.year
    const response = await carStore.register(username, password, confirmPassword, manufacturer, model, parseInt(year));

    if (response) {
        toast.success("Successfully registered! Welcome to BenzinApp.", { position: 'top-center' });
        navigate('/dashboard');
    }
    else {
        toast.error("This username is already taken. Please try again, with a different username.", { position: 'top-center' });
        setFormData({
          ...formData,
          password: '',
          password_confirmation: ''
        })
    }
    setIsLoggingIn(false);
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
                        disabled={isLoggingIn}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <Form.Label htmlFor="manufacturer" className="form-label">
                        Car Manufacturer
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        value={formData.manufacturer}
                        disabled={isLoggingIn}
                        onChange={handleChange}
                        placeholder="e.g. Toyota, Honda, Ford"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <Form.Label htmlFor="model" className="form-label">
                        Car Model
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="model"
                        name="model"
                        disabled={isLoggingIn}
                        value={formData.model}
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
                        disabled={isLoggingIn}
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
                          disabled={isLoggingIn}
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
                      <Form.Label htmlFor="password_confirmation" className="form-label">
                        Confirm Password
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          id="password_confirmation"
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          disabled={isLoggingIn}
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
                      disabled={isLoggingIn}
                      className={isLoggingIn ? 'login-btn-disabled w-100 mb-3' : 'login-btn w-100 mb-3'}
                      size="lg"
                    >
                      {isLoggingIn ? (
                      <>
                        <span
                          className='spinner-border spinner-border-sm mr-3'
                          aria-hidden="true"
                        />
                        Logging in...
                      </>
                        ) : (
                          'Login'
                        )}
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
