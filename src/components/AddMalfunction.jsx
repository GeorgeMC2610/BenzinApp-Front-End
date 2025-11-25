import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router";
import { useState } from 'react';
import { normalizeToNull } from '../utils/fields';
import { Malfunction } from '../classes/Malfunction';

function AddMalfunction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    dateStarted: new Date().toISOString().split('T')[0],
    status: 'Ongoing',
    kilometersDiscovered: '',
    severity: '3',
    cost: '',
    dateEnded: '',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name === 'status' && value !== 'Fixed') {
        return {
          ...prevData,
          status: value,
          repairCost: '',
          endDate: '',
          location: ''
        };
      }

      return {
        ...prevData,
        [name]: value
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedData = {
      ...formData,
      dateEnded: normalizeToNull(formData.dateEnded),
      cost: normalizeToNull(formData.cost),
      location: normalizeToNull(formData.location),
    };
    const malfunction = new Malfunction(normalizedData);
    console.log('Malfunction record:', malfunction.toJson());
  };

  return (
    <div className="add-malfunction-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="add-malfunction-container">
              <div className="text-center mb-4">
                <h1 className="page-title">Add Malfunction Record</h1>
              </div>

              {/* Form */}
              <Card className="malfunction-card">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    {/* Required Fields */}
                    <div className="required-fields mb-4">
                      <h3 className="section-title">Required Information</h3>
                      
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="title" className="form-label">
                          Malfunction Title *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Engine Misfire"
                          className="form-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label htmlFor="description" className="form-label">
                          Description *
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
                          required
                        />
                      </Form.Group>

                      <Row className="g-3 mt-1">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="dateStarted" className="form-label">
                              Date *
                            </Form.Label>
                            <Form.Control
                              type="date"
                              id="dateStarted"
                              name="dateStarted"
                              value={formData.dateStarted}
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
                        <Form.Label htmlFor="severity" className="form-label d-flex justify-content-between align-items-center">
                          <span>Malfunction Severity *</span>
                          <span className="severity-value">Level {formData.severity}</span>
                        </Form.Label>
                        <Form.Range
                          id="severity"
                          name="severity"
                          min={1}
                          max={5}
                          step={1}
                          value={formData.severity}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mt-3">
                        <Form.Label htmlFor="kilometersDiscovered" className="form-label">
                          Discovered at (km) *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          id="kilometersDiscovered"
                          name="kilometersDiscovered"
                          value={formData.kilometersDiscovered}
                          onChange={handleChange}
                          placeholder="e.g. 28500"
                          className="form-input"
                          required
                        />
                      </Form.Group>
                    </div>
                                            
                    {formData.status === 'Fixed' && (
                      <>
                        <div className="optional-fields">
                        <h3 className="section-title">Repair Information</h3>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label htmlFor="dateEnded" className="form-label">
                                End Date *
                              </Form.Label>
                              <Form.Control
                                type="date"
                                id="dateEnded"
                                name="dateEnded"
                                value={formData.dateEnded}
                                onChange={handleChange}
                                className="form-input"
                                required={formData.status === 'Fixed'}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label htmlFor="cost" className="form-label">
                                Repair Cost (€)
                              </Form.Label>
                              <Form.Control
                                type="number"
                                step="0.01"
                                id="cost"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                placeholder="e.g. 150.00"
                                className="form-input"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mt-3">
                          <Form.Label htmlFor="location" className="form-label">
                            Repair Location
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Auto Service Center"
                            className="form-input"
                          />
                        </Form.Group>
                        </div>
                      </>
                    )}

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
