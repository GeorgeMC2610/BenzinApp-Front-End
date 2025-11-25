import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useFuelFillRecordStore } from '../services/managers/FuelFillRecordManager';
import { FuelFillRecord } from '../classes/FuelFillRecord';
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function AddFuelFill() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    km: '',
    cost: '',
    totalKm: '',
    lt: '',
    filledAt: new Date().toISOString().split('T')[0],
    fuelType: '',
    station: '',
    notes: ''
  });
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
  const fuelFillList = useFuelFillRecordStore((state) => state.list);
  const store = useFuelFillRecordStore();
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const fromApi = Array.isArray(fuelFillList)
      ? fuelFillList
          .map((f) => f?.fuelType)
          .filter((t) => typeof t === 'string' && t.trim() !== '')
          .map((s) => s.trim())
      : [];

    const unique = Array.from(new Set(fromApi));
    setFuelTypeOptions(unique);
  }, [fuelFillList]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizeToNull = (value) => {
      if (value === null || value === undefined) return null;
      const trimmed = String(value).trim();
      return trimmed === '' ? null : trimmed;
    };

    const normalizedData = {
      ...formData,
      fuelType: normalizeToNull(formData.fuelType),
      station: normalizeToNull(formData.station),
      notes: normalizeToNull(formData.notes),
    };

    const fuelFill = new FuelFillRecord(normalizedData);
    await store.create(fuelFill);

    toast.success("Successfully added Fuel Fill Record.", { position: 'top-center' });
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } 
    else {
      navigate('fuel-fills', { replace: true });
    }
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
                            <Form.Label htmlFor="km" className="form-label">
                              Mileage (in km) *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              id="km"
                              name="km"
                              value={formData.km}
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
                            <Form.Label htmlFor="lt" className="form-label">
                              Liters *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              id="lt"
                              name="lt"
                              value={formData.lt}
                              onChange={handleChange}
                              placeholder="e.g. 45.2"
                              className="form-input"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group>
                        <Form.Label htmlFor="totalKm" className="form-label mt-3">
                          Car's Total Mileage (in km) *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          id="totalKm"
                          name="totalKm"
                          value={formData.totalKm}
                          onChange={handleChange}
                          placeholder="e.g. 120000"
                          className="form-input"
                          required
                        />
                      </Form.Group>

                      <Row className="mt-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="filledAt" className="form-label">
                              Date *
                            </Form.Label>
                            <Form.Control
                              type="date"
                              id="filledAt"
                              name="filledAt"
                              value={formData.filledAt}
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
                            onClick={() => setFormData({...formData, filledAt: new Date().toISOString().split('T')[0]})}
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
                            <Form.Label htmlFor="station" className="form-label">
                              Station Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="station"
                              name="station"
                              value={formData.station}
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
                            <Form.Label htmlFor="notes" className="form-label">
                              Comments
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              id="notes"
                              name="notes"
                              value={formData.notes}
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
