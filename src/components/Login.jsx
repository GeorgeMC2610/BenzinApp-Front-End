import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import TokenHelper from '../services/TokenHelper';
import RequestHelper from "../services/RequestHelper.ts";
import { useCarStore } from '../services/managers/CarManager.ts';
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFuelFillRecordStore } from '../services/managers/FuelFillRecordManager.ts';

function Login() {
  const carStore = useCarStore();
  const fuelStore = useFuelFillRecordStore();
  const list = useFuelFillRecordStore((state) => state.list)

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

  const testTokenSave = () => {
    TokenHelper.getInstance().setToken('test-token-12345');
    console.log('Token saved.');
  }

  const testTokenRetrieval = () => {
    const retrievedToken = TokenHelper.getInstance().token;
    console.log('Retrieved Token:', retrievedToken);
  }

  const testConnection = async () => {
    const email = formData.email
    const password = formData.password
    const response = await carStore.login(email, password);

    if (response) {
        toast.success("Successfully logged in.", { position: 'top-center' });
    }
    else {
        toast.error("Invalid Credentials. Please, try again.", { position: 'top-center' });
    }
  }

  const getCarDetails = async () => {
    await fuelStore.index();
    console.log(fuelStore.list);
  }

  return (
    <div className="login-page">
      <Container>
        <ToastContainer />
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <div className="login-container">

              <Button
                type="button"
                className="login-btn w-100 mb-3"
                onClick={testTokenSave}
                size="lg"
              >
                Test Saving of the token
              </Button>

              <Button
                type="button"
                className="login-btn w-100 mb-3"
                onClick={testTokenRetrieval}
                size="lg"
              >
                Test Token Retrieval
              </Button>

              <Button
                type="button"
                className="login-btn w-100 mb-3"
                onClick={testConnection}
                size="lg"
              >
                Test Backend Connection
              </Button>

              <Button
                type="button"
                className="login-btn w-100 mb-3"
                onClick={getCarDetails}
                size="lg"
              >
                Test Data Retrieval
              </Button>

              <div>
                {list?.toString() ?? "It's null for now."}
              </div>

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
                        type="text"
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
