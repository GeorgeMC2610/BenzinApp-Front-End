import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import DrawerMenu from './DrawerMenu';

const initialCarData = {
  manufacturer: 'Volkswagen',
  model: 'Polo',
  year: '2006'
};

function EditCar() {
  const [formData, setFormData] = useState(initialCarData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData(initialCarData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Updated car details:', formData);
    // Trigger API call or state update here
  };

  return (
    <div className="edit-car-page">
      <DrawerMenu />

      <div className="drawer-content">
        <section className="edit-car-content py-4">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} xl={6}>
                <Card className="edit-car-card">
                  <Card.Body className="p-4 p-lg-5">
                    <div className="mb-4">
                      <h1 className="page-title">Edit Car</h1>
                      <p className="page-subtitle mb-0">
                        Update your vehicle information to keep your records accurate.
                      </p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      <div className="required-fields mb-4">
                        <h3 className="section-title">Vehicle Details</h3>

                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="manufacturer" className="form-label">
                            Manufacturer *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="manufacturer"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            placeholder="e.g. Volkswagen"
                            className="form-input"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="model" className="form-label">
                            Model *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="e.g. Polo"
                            className="form-input"
                            required
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label htmlFor="year" className="form-label">
                            Year *
                          </Form.Label>
                          <Form.Control
                            type="number"
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            placeholder="e.g. 2006"
                            className="form-input"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            required
                          />
                        </Form.Group>
                      </div>

                      <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button
                          type="button"
                          variant="outline-secondary"
                          className="cancel-btn"
                          onClick={handleReset}
                        >
                          Reset
                        </Button>
                        <Button type="submit" className="confirm-btn">
                          Save Changes
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
}

export default EditCar;

