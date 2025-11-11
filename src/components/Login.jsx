import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <div className="login-container">
              {/* Logo/Brand */}
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
                    <span className="brand-text">Login to BenzinApp</span>
                  </div>
                </Link>
              </div>

              {/* Login Form */}
              <Card className="login-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h1 className="login-title">Welcome back</h1>
                    <p className="login-subtitle">Enter your credentials to access your account</p>
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

                    <div className="form-group mb-4">
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
                          placeholder="Enter your password"
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

                    <div className="d-flex justify-content-end align-items-center mb-4">
                      <Link to="/forgot-password" className="forgot-link">
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="login-btn w-100 mb-3"
                      size="lg"
                    >
                      Sign in
                    </Button>

                    <div className="text-center">
                      <span className="signup-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="signup-link">
                          Sign up
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

export default Login;
