import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const defaultFuelTypes = ['95 Octane', '98 Octane', 'Diesel', 'E10', 'E5', 'LPG'];

function AddFuelFill() {
  const [formData, setFormData] = useState({
    mileage: '',
    cost: '',
    liters: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    fuelType: '',
    stationName: '',
    comments: ''
  });
  const [fuelTypeOptions, setFuelTypeOptions] = useState(defaultFuelTypes);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedOptions = window.localStorage.getItem('fuelTypeOptions');
      if (storedOptions) {
        try {
          const parsedOptions = JSON.parse(storedOptions);
          if (Array.isArray(parsedOptions) && parsedOptions.length > 0) {
            setFuelTypeOptions(parsedOptions);
          }
        } catch (error) {
          console.error('Failed to parse stored fuel type options:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fuelTypeOptions', JSON.stringify(fuelTypeOptions));
    }
  }, [fuelTypeOptions]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Fuel fill record:', formData);
    const normalizedFuelType = formData.fuelType.trim();
    if (normalizedFuelType) {
      setFuelTypeOptions((prevOptions) => {
        const exists = prevOptions.some(
          (option) => option.toLowerCase() === normalizedFuelType.toLowerCase()
        );
        if (exists) {
          return prevOptions;
        }
        return [...prevOptions, normalizedFuelType];
      });
    }
    // Redirect to fuel fills page or show success message
  };

  return (
    <div className="add-fuel-fill-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="add-fuel-fill-container">
              <div className="text-center mb-4">
                <h1 className="page-title">Add Fuel Fill Record</h1>
              </div>

              {/* Form */}
              <Card className="fuel-fill-card">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    {/* Required Fields */}
                    <div className="required-fields mb-4">
                      <h3 className="section-title">Required Information</h3>
                      
                      <Row className="g-3">
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label htmlFor="mileage" className="form-label">
                              Mileage *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              id="mileage"
                              name="mileage"
                              value={formData.mileage}
                              onChange={handleChange}
                              placeholder="e.g. 50000"
                              className="form-input"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
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
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label htmlFor="liters" className="form-label">
                              Liters *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              id="liters"
                              name="liters"
                              value={formData.liters}
                              onChange={handleChange}
                              placeholder="e.g. 45.2"
                              className="form-input"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mt-3">
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
                        <Col md={6} className="d-flex align-items-end">
                          <Button
                            type="button"
                            variant="outline-secondary"
                            className="today-btn"
                            onClick={() => setFormData({...formData, date: new Date().toISOString().split('T')[0]})}
                          >
                            Today's Date
                          </Button>
                        </Col>
                      </Row>
                    </div>

                    {/* Optional Fields */}
                    <div className="optional-fields">
                      <h3 className="section-title">Optional Information</h3>
                      
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="fuelType" className="form-label">
                              Fuel Type
                            </Form.Label>
                            <Form.Control
                              id="fuelType"
                              name="fuelType"
                              type="text"
                              list="fuelTypeOptions"
                              value={formData.fuelType}
                              onChange={handleChange}
                              className="form-input"
                              placeholder="e.g. 95 Octane"
                              autoComplete="on"
                            />
                            <datalist id="fuelTypeOptions">
                              {fuelTypeOptions.map((option) => (
                                <option value={option} key={option} />
                              ))}
                            </datalist>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="stationName" className="form-label">
                              Station Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="stationName"
                              name="stationName"
                              value={formData.stationName}
                              onChange={handleChange}
                              placeholder="e.g. Shell Station"
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col>
                          <Form.Group>
                            <Form.Label htmlFor="comments" className="form-label">
                              Comments
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              id="comments"
                              name="comments"
                              value={formData.comments}
                              onChange={handleChange}
                              placeholder="Any additional notes about this fuel fill..."
                              rows={3}
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
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

export default AddFuelFill;
