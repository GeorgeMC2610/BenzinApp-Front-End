import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';
import { Malfunction } from '../classes/Malfunction';
import { useMalfunctionStore } from '../services/managers/MalfunctionManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import LocationMapModal from './LocationMapModal';

const MAX_DESCRIPTION_LENGTH = 150;

function SpecificMalfunctionRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [malfunction, setMalfunction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const deleteRedirectTimeout = useRef(null);
  const store = useMalfunctionStore();

  useEffect(() => {
    const fetchMalfunction = () => {
      const listMalfunction = store.list?.find(mlfnctn => mlfnctn.id === parseInt(id));
      if (listMalfunction) {
        setMalfunction(new Malfunction(listMalfunction));
        setLoading(false);
      }
      else {
        store.read(id).then(_ => {
          setMalfunction(new Malfunction(store.viewingMalfunction));
          setLoading(false);
        });
      }
    };
    
    fetchMalfunction();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-malfunction/${malfunction.id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    (async () => {
      try {
        await store.delete(malfunction.id);
        setShowDeleteModal(false);
        setFeedbackMessage('Malfunction record deleted successfully.');
        deleteRedirectTimeout.current = setTimeout(() => {
          navigate('/malfunctions');
        }, 1200);
      } catch (err) {
        console.error('Failed to delete malfunction:', err);
        setShowDeleteModal(false);
        toast?.error && toast.error('Failed to delete malfunction.');
      }
    })();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="malfunctions-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="malfunctions-content py-4">
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

  if (!malfunction) {
    return (
      <div className="malfunctions-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="malfunctions-content py-4">
            <Container className="py-5">
              <div className="text-center">
                <h2>Malfunction Record Not Found</h2>
                <p>The requested malfunction record could not be found.</p>
                <Link to="/malfunctions" className="btn btn-primary">
                  Back to Malfunctions
                </Link>
              </div>
            </Container>
          </section>
        </div>
      </div>
    );
  }

  const locationParts = malfunction.location ? malfunction.location.split('|') : null;
  const locationName = locationParts ? locationParts[0] : null;
  const coordsPart = locationParts && locationParts.length > 1 ? locationParts[1] : null;
  let locationCoords = null;
  if (coordsPart) {
    const [latStr, lngStr] = coordsPart.split(',');
    const lat = parseFloat((latStr || '').trim());
    const lng = parseFloat((lngStr || '').trim());
    if (!isNaN(lat) && !isNaN(lng)) {
      locationCoords = { lat, lng };
    }
  }

  const openMapFor = (title, coords) => {
    setMapLocation({ label: title, coords });
    setShowMapModal(true);
  };
  const discoveryDate = new Date(malfunction.dateStarted);
  const resolvedDate = malfunction.dateEnded ? new Date(malfunction.dateEnded) : null;
  const today = new Date();
  const daysSinceDiscovery = Math.max(
    Math.round((today.getTime() - discoveryDate.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );
  const daysToResolve =
    resolvedDate && resolvedDate >= discoveryDate
      ? Math.round((resolvedDate.getTime() - discoveryDate.getTime()) / (1000 * 60 * 60 * 24))
      : null;

  const severityDescriptions = {
    1: 'Very Low',
    2: 'Low',
    3: 'Moderate',
    4: 'High',
    5: 'Critical'
  };

  const severityVariant = {
    1: 'success',
    2: 'success',
    3: 'warning',
    4: 'danger',
    5: 'danger'
  }[malfunction.severity || 3];

  const repairCostLabel =
    typeof malfunction.cost === 'number'
      ? `€${malfunction.cost.toFixed(2)}`
      : 'Not recorded yet';

  return (
    <div className="malfunctions-page">
      <DrawerMenu />

      <div className="drawer-content">
        <section className="malfunctions-content py-4">
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
                      <h1 className="page-title">Malfunction Record Details</h1>
                      <p className="page-subtitle">Investigate the history of this malfunction</p>
                    </div>
                    <Link to="/malfunctions" className="btn btn-outline-secondary">
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Back to Malfunctions
                    </Link>
                  </div>
                </div>

                <Card className="fuel-fill-record-card mb-4">
                  <Card.Body className="p-4">
                    <div className="title-description-section mb-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h2 className="record-title mb-0">{malfunction.title}</h2>
                        <Badge bg={severityVariant} className="ms-2">
                          Severity Level {malfunction.severity}{' '}
                          {severityDescriptions[malfunction.severity] || ''}
                        </Badge>
                      </div>
                      {malfunction.description && (
                        <div className="record-description">
                          <p className="mb-0">
                            {showFullDescription || malfunction.description.length <= MAX_DESCRIPTION_LENGTH
                              ? malfunction.description
                              : `${malfunction.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
                          </p>
                          {malfunction.description.length > MAX_DESCRIPTION_LENGTH && (
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
                            <h4 className="metrics-title mb-3">Status Overview</h4>
                            <div className="metric-item">
                              <div className="metric-label">Current status</div>
                              <div className="metric-value d-flex gap-2 align-items-center">
                                <Badge bg={!!malfunction.dateEnded ? 'success' : 'warning'}>
                                  {!!malfunction.dateEnded ? 'Fixed' : 'Ongoing'}
                                </Badge>
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Days since discovery</div>
                              <div className="metric-value">{daysSinceDiscovery} days</div>
                            </div>
                            {!!malfunction.dateEnded && daysToResolve !== null && (
                              <div className="metric-item">
                                <div className="metric-label">Resolution time</div>
                                <div className="metric-value">{daysToResolve} days</div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Repair Details</h4>
                            <div className="metric-item">
                              <div className="metric-label">Repair cost</div>
                              <div className="metric-value">{repairCostLabel}</div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Repair location</div>
                              <div className="metric-value text-end">
                                {locationName ?? (malfunction.location ?? 'Unassigned')}
                                {locationCoords && (
                                  <div>
                                    <button
                                      type="button"
                                      className="address-link"
                                      onClick={() => openMapFor(locationName || malfunction.location, locationCoords)}
                                    >
                                      <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                                      View on map
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Discovered at</div>
                              <div className="metric-value">
                                {malfunction.kilometersDiscovered.toLocaleString()} km
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
                        Edit Malfunction
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="lg"
                        onClick={handleDelete}
                        className="action-btn"
                      >
                        Delete Malfunction
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
        title="Delete Malfunction Record"
        message="Are you sure you want to delete this malfunction record? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <LocationMapModal
        show={showMapModal}
        onHide={() => setShowMapModal(false)}
        location={mapLocation}
      />
    </div>
  );
}

export default SpecificMalfunctionRecord;

