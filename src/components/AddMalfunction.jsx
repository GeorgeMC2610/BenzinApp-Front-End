import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function AddMalfunction() {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Ongoing',
    discoveredAt: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Malfunction record:', formData);
    // Redirect to malfunctions page or show success message
  };

  return (
    <div className="add-malfunction-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="add-malfunction-container">
              {/* Header */}
              <div className="text-center mb-4">
                <Link to="/malfunctions" className="brand-link">
                  <div className="brand-logo">
                    <span className="brand-icon">🔧</span>
                    <span className="brand-text">BenzinApp</span>
                  </div>
                </Link>
                <h1 className="page-title mt-3">Add Malfunction Record</h1>
              </div>

              {/* Form */}
              <Card className="malfunction-card">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    {/* Required Fields */}
                    <div className="required-fields mb-4">
                      <h3 className="section-title">Required Information</h3>
                      
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="name" className="form-label">
                          Malfunction Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Engine Misfire"
                          className="form-input"
                          required
                        />
                      </Form.Group>

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="date" className="form-label">
                              Date *
                            </Form.Label>
                            <Form.Control
                              type="date"
                              id="date"
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                              className="form-input"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="status" className="form-label">
                              Status *
                            </Form.Label>
                            <Form.Select
                              id="status"
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              className="form-input"
                              required
                            >
                              <option value="Ongoing">Ongoing</option>
                              <option value="Fixed">Fixed</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mt-3">
                        <Form.Label htmlFor="discoveredAt" className="form-label">
                          Discovered at (km) *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          id="discoveredAt"
                          name="discoveredAt"
                          value={formData.discoveredAt}
                          onChange={handleChange}
                          placeholder="e.g. 28500"
                          className="form-input"
                          required
                        />
                      </Form.Group>
                    </div>

                    {/* Optional Fields */}
                    <div className="optional-fields">
                      <h3 className="section-title">Additional Information</h3>
                      
                      <Form.Group>
                        <Form.Label htmlFor="description" className="form-label">
                          Description
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe the malfunction in detail..."
                          rows={3}
                          className="form-input"
                        />
                      </Form.Group>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-4">
                      <Button
                        type="submit"
                        className="confirm-btn"
                        size="lg"
                      >
                        Confirm Add
                      </Button>
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

export default AddMalfunction;
