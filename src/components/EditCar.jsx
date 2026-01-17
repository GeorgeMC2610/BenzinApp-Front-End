import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useCarStore } from '../services/managers/CarManager';
import DrawerMenu from './DrawerMenu';

const initialCarData = {
  manufacturer: '',
  model: '',
  year: ''
};

function EditCar() {
  const car = useCarStore((s) => s.car);
  const getCarDetails = useCarStore((s) => s.getCarDetails);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const updateCar = useCarStore((s) => s.update);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleReset = () => {
    if (car) {
      setFormData({
        manufacturer: car.manufacturer ?? '',
        model: car.model ?? '',
        year: car.year ?? ''
      });
    } else {
      setFormData(initialCarData);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Updated car details:', formData);
    const performUpdate = async () => {
      try {
        setIsSubmitting(true);
        // call manager update (manufacturer, model, year)
        await updateCar(formData.manufacturer, formData.model, Number(formData.year));
        toast.success('Car updated successfully', { position: 'top-center' });
        // navigate back if possible
        if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
        }
      } catch (err) {
        console.error('Failed to update car:', err);
        toast.error('Failed to update car', { position: 'top-center' });
      } finally {
        setIsSubmitting(false);
      }
    };

    performUpdate();
  };

  useEffect(() => {
    let mounted = true;

    const ensureData = async () => {
      setLoading(true);
      try {
        if (!car) {
          await getCarDetails();
        }

        const current = useCarStore.getState().car;
        if (mounted) {
          if (current) {
            setFormData({
              manufacturer: current.manufacturer ?? '',
              model: current.model ?? '',
              year: current.year ?? ''
            });
          } else {
            setFormData(initialCarData);
          }
        }
      } catch (err) {
        console.error('Failed to load car details:', err);
        if (mounted) setFormData(initialCarData);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    ensureData();

    return () => { mounted = false; };
  }, [car, getCarDetails]);

  if (loading || formData === null) {
    return (
      <div className="edit-car-page">
        <DrawerMenu />

        <div className="drawer-content">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} xl={6}>
                <Card className="edit-car-card">
                  <Card.Body className="p-4 p-lg-5 text-center">
                    Loading...
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

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
                        <Button type="submit" className="confirm-btn" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
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

