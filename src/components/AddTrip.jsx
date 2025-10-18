import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function AddTrip() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'One-Time',
    frequency: '',
    cost: '',
    kilometers: '',
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
    console.log('Trip record:', formData);
    // Redirect to trips page or show success message
  };

  return (
    <div className="add-trip-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="add-trip-container">
              {/* Header */}
              <div className="text-center mb-4">
                <Link to="/trips" className="brand-link">
                  <div className="brand-logo">
                    <span className="brand-icon">🚗</span>
                    <span className="brand-text">BenzinApp</span>
                  </div>
                </Link>
                <h1 className="page-title mt-3">Add Trip Record</h1>
              </div>

              {/* Form */}
              <Card className="trip-card">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    {/* Required Fields */}
                    <div className="required-fields mb-4">
                      <h3 className="section-title">Required Information</h3>
                      
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="name" className="form-label">
                          Name of Trip *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Work Commute"
                          className="form-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="type" className="form-label">
                          Trip Type *
                        </Form.Label>
                        <Form.Select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="form-input"
                          required
                        >
                          <option value="One-Time">One-Time Trip</option>
                          <option value="Repeating">Repeating Trip</option>
                        </Form.Select>
                      </Form.Group>

                      {formData.type === 'Repeating' && (
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="frequency" className="form-label">
                            Times per Week *
                          </Form.Label>
                          <Form.Control
                            type="number"
                            id="frequency"
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            placeholder="e.g. 5"
                            min="1"
                            max="7"
                            className="form-input"
                            required={formData.type === 'Repeating'}
                          />
                        </Form.Group>
                      )}

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="cost" className="form-label">
                              Cost (€) *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              id="cost"
                              name="cost"
                              value={formData.cost}
                              onChange={handleChange}
                              placeholder="e.g. 2.50"
                              className="form-input"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="kilometers" className="form-label">
                              Kilometers *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              step="0.1"
                              id="kilometers"
                              name="kilometers"
                              value={formData.kilometers}
                              onChange={handleChange}
                              placeholder="e.g. 15.5"
                              className="form-input"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
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
                          placeholder="Describe the trip in detail..."
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

export default AddTrip;
