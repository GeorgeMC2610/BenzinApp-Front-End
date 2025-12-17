import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import { normalizeToNull } from '../utils/fields';
import { Malfunction } from '../classes/Malfunction';
import { useMalfunctionStore } from '../services/managers/MalfunctionManager';
import { toast } from "react-toastify";

function AddMalfunction() {
  const params = useParams();
  const recordId = params?.id;
  const navigate = useNavigate();
  const store = useMalfunctionStore();

  const malfunctionList = useMalfunctionStore((s) => s.list);
  const indexMalfunctions = useMalfunctionStore((s) => s.index);
  const readMalfunction = useMalfunctionStore((s) => s.read);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function prepareForm() {
      if (!recordId) {
        if (!mounted) return;
        setFormData({
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
        setLoading(false);
        return;
      }

      try {
        if (!malfunctionList || malfunctionList.length === 0) {
          if (typeof indexMalfunctions === 'function') {
            await indexMalfunctions();
          }
        }

        let editRecord = (useMalfunctionStore.getState().list || []).find(r => r.id.toString() === recordId);

        if (!editRecord && typeof readMalfunction === 'function') {
          const maybe = await readMalfunction(recordId);
          editRecord = maybe || useMalfunctionStore.getState().viewingMalfunction;
        }

        if (!mounted) return;

        if (editRecord) {
          setFormData({
            title: editRecord.title ?? '',
            dateStarted: editRecord.dateStarted ? new Date(editRecord.dateStarted).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: editRecord.status ?? 'Ongoing',
            kilometersDiscovered: editRecord.kilometersDiscovered ?? '',
            severity: editRecord.severity?.toString() ?? '3',
            cost: editRecord.cost ?? '',
            dateEnded: editRecord.dateEnded ?? '',
            location: editRecord.location ?? '',
            description: editRecord.description ?? ''
          });
        } else {
          toast.warn('Malfunction record not found. Showing add form.');
          setFormData({
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
        }
      } catch (err) {
        console.error('Error preparing malfunction form:', err);
        toast.error('Failed to load malfunction data.');
        setFormData({
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
      } finally {
        if (mounted) setLoading(false);
      }
    }

    prepareForm();
    return () => { mounted = false; };
  }, [recordId, malfunctionList, indexMalfunctions, readMalfunction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === 'status' && value !== 'Fixed') {
        return {
          ...prevData,
          status: value,
          cost: '',
          dateEnded: '',
          location: ''
        };
      }
      return {
        ...prevData,
        [name]: value
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedData = {
      ...formData,
      dateEnded: normalizeToNull(formData.dateEnded),
      cost: normalizeToNull(formData.cost),
      location: normalizeToNull(formData.location),
    };

    const malfunction = new Malfunction(normalizedData);
    const editRecord = useMalfunctionStore.getState().list?.find(r => r.id.toString() === recordId);

    if (!!editRecord && !!recordId) {
      // Edit mode: PATCH (manager.update should implement actual update)
      await store.update(new Malfunction({ ...normalizedData, id: editRecord.id }));
      toast.success("Successfully updated Malfunction.", { position: 'top-center' });
    } else {
      // Add mode: POST
      await store.create(malfunction);
      toast.success("Successfully added Malfunction.", { position: 'top-center' });
    }

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/malfunctions', { replace: true });
    }
  };

  if (loading || formData === null) {
    return (
      <div className="add-malfunction-page">
        <Container>
          <Row className="justify-content-center min-vh-100 align-items-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <Card className="malfunction-card">
                <Card.Body className="p-5 text-center">Loading...</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="add-malfunction-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="add-malfunction-container">
              <div className="text-center mb-4">
                <h1 className="page-title">{!!recordId ? 'Edit ' : 'Add '}Malfunction Record</h1>
              </div>

              <Card className="malfunction-card">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    <div className="required-fields mb-4">
                      <h3 className="section-title">Required Information</h3>

                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="title" className="form-label">Malfunction Title *</Form.Label>
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
                        <Form.Label htmlFor="description" className="form-label">Description *</Form.Label>
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
                            <Form.Label htmlFor="dateStarted" className="form-label">Date *</Form.Label>
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
                            <Form.Label htmlFor="status" className="form-label">Status *</Form.Label>
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
                        <Form.Label htmlFor="kilometersDiscovered" className="form-label">Discovered at (km) *</Form.Label>
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
                      <div className="optional-fields">
                        <h3 className="section-title">Repair Information</h3>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label htmlFor="dateEnded" className="form-label">End Date *</Form.Label>
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
                              <Form.Label htmlFor="cost" className="form-label">Repair Cost (€)</Form.Label>
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
                    )}

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

export default AddMalfunction;