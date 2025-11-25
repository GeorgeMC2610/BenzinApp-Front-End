import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { normalizeToNull } from '../utils/fields';
import { Service } from '../classes/Service';
import { useServiceStore } from '../services/managers/ServiceManager';

function AddService() {
  const store = useServiceStore();
  const [formData, setFormData] = useState({
    description: '',
    dateHappened: new Date().toISOString().split('T')[0],
    kilometersDone: '',
    description: '',
    location: '',
    cost: '',

    nextServiceDate: '',
    nextServiceKilometers: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedData = {
      ...formData,
      nextServiceDate: normalizeToNull(formData.nextServiceDate),
      nextServiceKilometers: normalizeToNull(formData.nextServiceKilometers),
      location: normalizeToNull(formData.location),
    };

    const service = new Service(normalizedData);
    await store.create(service);

    console.log('Service record:', service.toJson());
  };

  return (
    <div className="add-service-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="add-service-container">
              <div className="text-center mb-4">
                <h1 className="page-title">Add Service Record</h1>
              </div>

              {/* Form */}
              <Card className="service-card">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    {/* Required Fields */}
                    <div className="required-fields mb-4">
                      <h3 className="section-title">Required Information</h3>
                      
                      <Form.Group className='mb-3'>
                        <Form.Label htmlFor="dateHappened" className="form-label">
                          Date *
                        </Form.Label>
                        <Form.Control
                          type="date"
                          id="dateHappened"
                          name="dateHappened"
                          value={formData.dateHappened}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="description" className="form-label">
                          Description *
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe the service in detail..."
                          rows={3}
                          className="form-input"
                        />
                      </Form.Group>

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="kilometersDone" className="form-label">
                              Kilometers done *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              id="kilometersDone"
                              name="kilometersDone"
                              value={formData.kilometersDone}
                              onChange={handleChange}
                              placeholder="e.g. 28500"
                              className="form-input"
                              required
                            />
                          </Form.Group>
                        </Col>
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
                              placeholder="e.g. 70.50"
                              className="form-input"
                              required
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

                    <div className="optional-fields">
                      <h3 className="section-title">Next Service Information</h3>
                      <Form.Group>
                        <Form.Label htmlFor="nextServiceDate" className="form-label">
                          Next Service Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          id="nextServiceDate"
                          name="nextServiceDate"
                          value={formData.nextServiceDate}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </Form.Group>

                      <Form.Group className='mt-3'>
                        <Form.Label htmlFor="nextServiceKilometers" className="form-label">
                          Next Service Kilometers
                        </Form.Label>
                        <Form.Control
                          type="number"
                          id="nextServiceKilometers"
                          name="nextServiceKilometers"
                          value={formData.nextServiceKilometers}
                          onChange={handleChange}
                          placeholder="e.g. 28500"
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

export default AddService;
