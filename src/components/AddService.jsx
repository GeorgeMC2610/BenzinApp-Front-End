import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { normalizeToNull } from '../utils/fields';
import { Service } from '../classes/Service';
import { useServiceStore } from '../services/managers/ServiceManager';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";

function AddService() {
  const params = useParams();
  const recordId = params?.id;
  const store = useServiceStore();
  const navigate = useNavigate();

  const serviceList = useServiceStore((s) => s.list);
  const indexServices = useServiceStore((s) => s.index);
  const readService = useServiceStore((s) => s.read);

  // null = resolving, non-null = form ready
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function prepareForm() {
      if (!recordId) {
        if (!mounted) return;
        setFormData({
          description: '',
          dateHappened: new Date().toISOString().split('T')[0],
          kilometersDone: '',
          location: '',
          cost: '',
          nextServiceDate: '',
          nextServiceKilometers: ''
        });
        setLoading(false);
        return;
      }

      try {
        if (!serviceList || serviceList.length === 0) {
          if (typeof indexServices === 'function') {
            await indexServices();
          }
        }

        let editRecord = (useServiceStore.getState().list || []).find(r => r.id.toString() === recordId);

        if (!editRecord && typeof readService === 'function') {
          const maybe = await readService(recordId);
          editRecord = maybe || useServiceStore.getState().viewingService;
        }

        if (!mounted) return;

        if (editRecord) {
          setFormData({
            description: editRecord.description ?? '',
            dateHappened: editRecord.dateHappened ? new Date(editRecord.dateHappened).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            kilometersDone: editRecord.kilometersDone ?? '',
            location: editRecord.location ?? '',
            cost: editRecord.cost ?? '',
            nextServiceDate: editRecord.nextServiceDate ?? '',
            nextServiceKilometers: editRecord.nextServiceKilometers ?? ''
          });
        } else {
          toast.warn('Service record not found. Showing add form.');
          setFormData({
            description: '',
            dateHappened: new Date().toISOString().split('T')[0],
            kilometersDone: '',
            location: '',
            cost: '',
            nextServiceDate: '',
            nextServiceKilometers: ''
          });
        }
      } catch (err) {
        console.error('Error preparing service form:', err);
        toast.error('Failed to load service data.');
        setFormData({
          description: '',
          dateHappened: new Date().toISOString().split('T')[0],
          kilometersDone: '',
          location: '',
          cost: '',
          nextServiceDate: '',
          nextServiceKilometers: ''
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    prepareForm();
    return () => { mounted = false; };
  }, [recordId, serviceList, indexServices, readService]);

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

    // find edit record from store
    const editRecord = useServiceStore.getState().list?.find(r => r.id.toString() === recordId);

    if (!!editRecord && !!recordId) {
      // Edit mode: PATCH (manager.update should implement actual update)
      await store.update(new Service({ ...normalizedData, id: editRecord.id }));
      toast.success("Successfully updated Service.", { position: 'top-center' });
    } else {
      // Add mode: POST
      await store.create(service);
      toast.success("Successfully added Service.", { position: 'top-center' });
    }

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/services', { replace: true });
    }
  };

  if (loading || formData === null) {
    return (
      <div className="add-service-page">
        <Container>
          <Row className="justify-content-center min-vh-100 align-items-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <Card className="service-card">
                <Card.Body className="p-5 text-center">
                  Loading...
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="add-service-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="add-service-container">
              <div className="text-center mb-4">
                <h1 className="page-title">{!!recordId ? 'Edit ' : 'Add '}Service Record</h1>
              </div>

              <Card className="service-card">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    <div className="required-fields mb-4">
                      <h3 className="section-title">Required Information</h3>
                      <Form.Group className='mb-3'>
                        <Form.Label htmlFor="dateHappened" className="form-label">Date *</Form.Label>
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
                        <Form.Label htmlFor="description" className="form-label">Description *</Form.Label>
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
                            <Form.Label htmlFor="kilometersDone" className="form-label">Kilometers done *</Form.Label>
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
                            <Form.Label htmlFor="cost" className="form-label">Cost (€) *</Form.Label>
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
                        <Form.Label htmlFor="location" className="form-label">Repair Location</Form.Label>
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
                        <Form.Label htmlFor="nextServiceDate" className="form-label">Next Service Date</Form.Label>
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
                        <Form.Label htmlFor="nextServiceKilometers" className="form-label">Next Service Kilometers</Form.Label>
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

                    <div className="text-center mt-4">
                      <Button type="submit" className="confirm-btn" size="lg">
                        {!!recordId ? 'Confirm Edit' : 'Confirm Add'}
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