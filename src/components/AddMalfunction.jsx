import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';

function AddMalfunction() {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Ongoing',
    discoveredAt: '',
    severity: '3',
    repairCost: '',
    endDate: '',
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
                      
                      {formData.status === 'Fixed' && (
                        <>
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label htmlFor="endDate" className="form-label">
                                  End Date *
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  id="endDate"
                                  name="endDate"
                                  value={formData.endDate}
                                  onChange={handleChange}
                                  className="form-input"
                                  required={formData.status === 'Fixed'}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label htmlFor="repairCost" className="form-label">
                                  Repair Cost (€) *
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  id="repairCost"
                                  name="repairCost"
                                  value={formData.repairCost}
                                  onChange={handleChange}
                                  placeholder="e.g. 150.00"
                                  className="form-input"
                                  required={formData.status === 'Fixed'}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mt-3">
                            <Form.Label htmlFor="location" className="form-label">
                              Repair Location *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="location"
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              placeholder="e.g. Auto Service Center"
                              className="form-input"
                              required={formData.status === 'Fixed'}
                            />
                          </Form.Group>
                        </>
                      )}

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
