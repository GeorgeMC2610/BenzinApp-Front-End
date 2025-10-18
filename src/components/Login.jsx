import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <div className="login-container">
              {/* Logo/Brand */}
              <div className="text-center mb-4">
                <Link to="/" className="brand-link">
                  <div className="brand-logo">
                    <span className="brand-icon">⛽</span>
                    <span className="brand-text">BenzinApp</span>
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

                    <div className="form-group mb-4">
                      <Form.Label htmlFor="password" className="form-label">
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        id="remember"
                        label="Remember me"
                        className="remember-checkbox"
                      />
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
