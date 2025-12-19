import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';
import { Service } from '../classes/Service';
import { useServiceStore } from '../services/managers/ServiceManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const MAX_DESCRIPTION_LENGTH = 150;

function SpecificServiceRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const deleteRedirectTimeout = useRef(null);
  const store = useServiceStore();

  useEffect(() => {
    const fetchService = () => {
      const listService = store.list?.find(service => service.id === parseInt(id));
      if (listService) {
        setService(new Service(listService));
        setLoading(false);
      }
      else {
        store.read(id).then(_ => {
          setService(new Service(store.viewingService));
          setLoading(false);
        });
      }
    };

    fetchService();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-service/${service.id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    (async () => {
      try {
        await store.delete(service.id);
        setShowDeleteModal(false);
        setFeedbackMessage('Service record deleted successfully.');
        deleteRedirectTimeout.current = setTimeout(() => {
          navigate('/services');
        }, 1200);
      } catch (err) {
        console.error('Failed to delete service:', err);
        setShowDeleteModal(false);
        toast?.error && toast.error('Failed to delete service.');
      }
    })();
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

  const serviceDate = new Date(service.dateHappened);
  const today = new Date();
  const daysSinceService = Math.max(
    Math.round((today.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );
  const nextServiceMileage = service.nextServiceKilometers;
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
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Back to Services
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
                    </div>

                    <div className="title-description-section mb-4">
                      <h2 className="record-title mb-2">{service.name}</h2>
                      {service.description && (
                        <div className="record-description">
                          <p className="mb-0">
                            {showFullDescription || service.description.length <= MAX_DESCRIPTION_LENGTH
                              ? service.description
                              : `${service.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
                          </p>
                          {service.description.length > MAX_DESCRIPTION_LENGTH && (
                            <Button
                              variant="link"
                              className="p-0 mt-2 text-decoration-none"
                              onClick={() => setShowFullDescription(!showFullDescription)}
                            >
                              {showFullDescription ? 'Show less' : 'Show more'}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Service Metrics</h4>
                            <div className="metric-item">
                              <div className="metric-label">Logged at mileage</div>
                              <div className="metric-value">
                                {service.kilometersDone.toLocaleString()} km
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Estimated next service</div>
                              <div className="metric-value">
                                {nextServiceMileage?.toLocaleString() ?? '-'} km
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
                              <div className="metric-label">Days since logged</div>
                              <div className="metric-value">{daysSinceService} days</div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Service center</div>
                              <div className="metric-value text-end">
                                {!!service.location ? (service.location.includes('|') ? service.location.split('|')[0] : service.location) : 'Unassigned'}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

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

