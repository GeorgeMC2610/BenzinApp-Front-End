import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import ConfirmModal from './ConfirmModal';

function SpecificServiceRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const deleteRedirectTimeout = useRef(null);

  const services = [
    {
      id: 1,
      name: 'Oil Change',
      date: '2025-01-05',
      status: 'Completed',
      discoveredAt: 28500,
      description: 'Regular oil change with synthetic oil',
      serviceCenter: 'AutoFix Garage',
      cost: 120.0,
      nextServiceMileage: 33500,
      notes: 'Used Castrol Edge 5W-30 oil and replaced oil filter.'
    },
    {
      id: 2,
      name: 'Brake Service',
      date: '2024-12-20',
      status: 'Scheduled',
      discoveredAt: 28000,
      description: 'Brake pad replacement and rotor inspection',
      serviceCenter: 'Downtown Brake Specialists',
      cost: null,
      nextServiceMileage: 31000,
      notes: 'Waiting for OEM brake pads to arrive before appointment.'
    },
    {
      id: 3,
      name: 'Tire Rotation',
      date: '2024-11-15',
      status: 'Completed',
      discoveredAt: 27500,
      description: 'Tire rotation and alignment check',
      serviceCenter: 'WheelWorks Alignment Center',
      cost: 65.0,
      nextServiceMileage: 30500,
      notes: 'Front tires showed minor wear difference; alignment adjusted.'
    },
    {
      id: 4,
      name: 'Transmission Service',
      date: '2024-10-10',
      status: 'Scheduled',
      discoveredAt: 27000,
      description: 'Transmission fluid change and filter replacement',
      serviceCenter: 'Precision Auto Care',
      cost: null,
      nextServiceMileage: 32000,
      notes: 'Scheduled during next maintenance window.'
    },
    {
      id: 5,
      name: 'Battery Check',
      date: '2024-09-25',
      status: 'Completed',
      discoveredAt: 26500,
      description: 'Battery test and terminal cleaning',
      serviceCenter: 'ElectroStart Service',
      cost: 45.0,
      nextServiceMileage: 29500,
      notes: 'Terminals cleaned and protective spray applied.'
    }
  ];

  useEffect(() => {
    const foundService = services.find((item) => item.id === parseInt(id, 10));
    if (foundService) {
      setService(foundService);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    return () => {
      if (deleteRedirectTimeout.current) {
        clearTimeout(deleteRedirectTimeout.current);
      }
    };
  }, []);

  const handleEdit = () => {
    navigate('/add-service', {
      state: {
        editMode: true,
        serviceData: service
      }
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Delete service:', service.id);
    setShowDeleteModal(false);
    setFeedbackMessage('Service record deleted successfully.');

    deleteRedirectTimeout.current = setTimeout(() => {
      navigate('/services');
    }, 1200);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="services-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="services-content py-4">
            <Container className="py-5">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </Container>
          </section>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="services-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="services-content py-4">
            <Container className="py-5">
              <div className="text-center">
                <h2>Service Record Not Found</h2>
                <p>The requested service record could not be found.</p>
                <Link to="/services" className="btn btn-primary">
                  Back to Services
                </Link>
              </div>
            </Container>
          </section>
        </div>
      </div>
    );
  }

  const serviceDate = new Date(service.date);
  const today = new Date();
  const daysSinceService = Math.max(
    Math.round((today.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );
  const nextServiceMileage = service.nextServiceMileage ?? service.discoveredAt + 10000;
  const costLabel =
    typeof service.cost === 'number' ? `€${service.cost.toFixed(2)}` : 'Not recorded yet';

  return (
    <div className="services-page">
      <DrawerMenu />

      <div className="drawer-content">
        <section className="services-content py-4">
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} lg={10} xl={8}>
                {feedbackMessage && (
                  <Alert variant="success" className="mb-4">
                    {feedbackMessage}
                  </Alert>
                )}

                <div className="page-header mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h1 className="page-title">Service Record Details</h1>
                      <p className="page-subtitle">
                        Comprehensive overview of your vehicle service entry
                      </p>
                    </div>
                    <Link to="/services" className="btn btn-outline-secondary">
                      ← Back to Services
                    </Link>
                  </div>
                </div>

                <Card className="fuel-fill-record-card mb-4">
                  <Card.Body className="p-4">
                    <div className="date-section mb-4">
                      <div className="date-info text-center">
                        <div className="date-day-of-week">
                          {serviceDate.toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                        <div className="date-month-day">
                          {serviceDate.toLocaleDateString('en-US', { month: 'long' })}{' '}
                          {serviceDate.getDate()}
                        </div>
                        <div className="date-year">{serviceDate.getFullYear()}</div>
                      </div>
                      <div className="fuel-station-info text-center mt-3">
                        <div className="fuel-type">{service.serviceCenter || 'Service center TBD'}</div>
                        <div className="station-name">{service.name}</div>
                      </div>
                    </div>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Service Metrics</h4>
                            <div className="metric-item">
                              <div className="metric-label">Logged at mileage</div>
                              <div className="metric-value">
                                {service.discoveredAt.toLocaleString()} km
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Estimated next service</div>
                              <div className="metric-value">
                                {nextServiceMileage.toLocaleString()} km
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Service cost</div>
                              <div className="metric-value">{costLabel}</div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Status Insights</h4>
                            <div className="metric-item">
                              <div className="metric-label">Current status</div>
                              <div className="metric-value d-flex align-items-center gap-2">
                                <Badge bg={service.status === 'Completed' ? 'success' : 'warning'}>
                                  {service.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Days since logged</div>
                              <div className="metric-value">{daysSinceService} days</div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Notes</div>
                              <div className="metric-value">
                                {service.notes || 'No additional notes recorded.'}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {service.description && (
                      <div className="comments-section mt-4">
                        <Card className="comments-card">
                          <Card.Body className="p-4">
                            <h4 className="comments-title mb-3">Description</h4>
                            <p className="comments-text mb-0">{service.description}</p>
                          </Card.Body>
                        </Card>
                      </div>
                    )}

                    <div className="action-buttons mt-4 d-flex gap-3 justify-content-center">
                      <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={handleEdit}
                        className="action-btn"
                      >
                        Edit Service
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="lg"
                        onClick={handleDelete}
                        className="action-btn"
                      >
                        Delete Service
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Service Record"
        message="Are you sure you want to delete this service record? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default SpecificServiceRecord;

