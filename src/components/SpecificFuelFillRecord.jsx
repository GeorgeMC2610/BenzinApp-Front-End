import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { useFuelFillRecordStore } from '../services/managers/FuelFillRecordManager';
import { FuelFillRecord } from '../classes/FuelFillRecord';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const MAX_COMMENT_LENGTH = 150;

function SpecificFuelFillRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fuelFill, setFuelFill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFullComments, setShowFullComments] = useState(false);
  const deleteRedirectTimeout = useRef(null);
  const store = useFuelFillRecordStore();

  useEffect(() => {
    const fetchFuelFill = () => {
      const listFill = store.list?.find(fill => fill.id === parseInt(id));
      if (listFill) {
        setFuelFill(new FuelFillRecord(listFill));
        setLoading(false);
      }
      else {
        store.read(id).then(_ => {
          setFuelFill(new FuelFillRecord(store.viewingFuelFillRecord));
          setLoading(false);
        });
      }
    };

    fetchFuelFill();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    
    return {
      dayOfWeek,
      month,
      day,
      year
    };
  };

  const handleEdit = () => {
    // Navigate to edit page - for now, we'll redirect to the add fuel fill page
    // In a real app, this would navigate to a dedicated edit form with pre-filled data
    navigate(`/edit-fuel-fill/${fuelFill.id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // perform delete via store
    (async () => {
      try {
        await store.delete(fuelFill.id);
        setShowDeleteModal(false);
        setFeedbackMessage('Fuel fill record deleted successfully.');
        deleteRedirectTimeout.current = setTimeout(() => {
          navigate('/fuel-fills');
        }, 1200);
      } catch (err) {
        console.error('Failed to delete fuel fill:', err);
        setShowDeleteModal(false);
        toast?.error && toast.error('Failed to delete fuel fill.');
      }
    })();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="fuel-fill-record-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="fuel-fill-record-content py-4">
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

  if (!fuelFill) {
    return (
      <div className="fuel-fill-record-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="fuel-fill-record-content py-4">
            <Container className="py-5">
              <div className="text-center">
                <h2>Fuel Fill Record Not Found</h2>
                <p>The requested fuel fill record could not be found.</p>
                <Link to="/fuel-fills" className="btn btn-primary">
                  Back to Fuel Fills
                </Link>
              </div>
            </Container>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="fuel-fill-record-page">
      <DrawerMenu />
      
      {/* Main Content */}
      <div className="drawer-content">
        <section className="fuel-fill-record-content py-4">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={8}>
              {/* Header */}
              <div className="page-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="page-title">Fuel Fill Record Details</h1>
                    <p className="page-subtitle">Detailed information about this fuel fill</p>
                  </div>
                  <Link to="/fuel-fills" className="btn btn-outline-secondary">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Back to Fuel Fills
                  </Link>
                </div>
              </div>

              {/* Main Record Card */}
              <Card className="fuel-fill-record-card mb-4">
                <Card.Body className="p-4">
                  {/* Date and Basic Info Section */}
                  <div className="date-section mb-4">
                    <div className="date-info text-center">
                      <div className="date-day-of-week">{formatDate(new Date(fuelFill?.filledAt)).dayOfWeek}</div>
                      <div className="date-month-day">{formatDate(new Date(fuelFill?.filledAt)).month} {formatDate(new Date(fuelFill?.filledAt)).day}</div>
                      <div className="date-year">{formatDate(new Date(fuelFill?.filledAt)).year}</div>
                    </div>
                    <div className="fuel-station-info text-center mt-3">
                      <div className="fuel-type">{fuelFill.fuelType}</div>
                      <div className="station-name">{fuelFill.station}</div>
                      <div className='station-name'><i>@ {fuelFill.totalKm.toLocaleString(undefined, { maximumFractionDigits: 2 })} km</i></div>
                    </div>
                  </div>

                  {/* Two Column Data Section */}
                  <Row className="g-4">
                    {/* Left Column - Basic Metrics */}
                    <Col md={6}>
                      <Card className="metrics-card h-100">
                        <Card.Body className="p-4">
                          <h4 className="metrics-title mb-3">Basic Metrics</h4>
                          <div className="metric-item">
                            <div className="metric-label">Liters</div>
                            <div className="metric-value">{fuelFill.lt.toLocaleString(undefined, { maximumFractionDigits: 2 })} L</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Kilometers</div>
                            <div className="metric-value">{fuelFill.km.toLocaleString(undefined, { maximumFractionDigits: 2 })} km</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Cost</div>
                            <div className="metric-value">€{fuelFill.cost.toFixed(2)}</div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Right Column - Calculated Metrics */}
                    <Col md={6}>
                      <Card className="metrics-card h-100">
                        <Card.Body className="p-4">
                          <h4 className="metrics-title mb-3">Calculated Metrics</h4>
                          <div className="metric-item">
                            <div className="metric-label">Consumption</div>
                            <div className="metric-value">{fuelFill?.getConsumption().toLocaleString(undefined, { maximumFractionDigits: 3 })} L/100km</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Efficiency</div>
                            <div className="metric-value">{fuelFill?.getEfficiency().toLocaleString(undefined, { maximumFractionDigits: 3 })} km/L</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Travel Cost</div>
                            <div className="metric-value">€{fuelFill?.getTravelCost().toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}/km</div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Comments Section */}
                  {fuelFill.comments && (
                    <div className="comments-section mt-4">
                      <Card className="comments-card">
                        <Card.Body className="p-4">
                          <h4 className="comments-title mb-3">Comments</h4>
                          <p className="comments-text mb-0">
                            {showFullComments || fuelFill.comments.length <= MAX_COMMENT_LENGTH
                              ? fuelFill.comments
                              : `${fuelFill.comments.substring(0, MAX_COMMENT_LENGTH)}...`}
                          </p>
                          {fuelFill.comments.length > MAX_COMMENT_LENGTH && (
                            <Button
                              variant="link"
                              className="p-0 mt-2 text-decoration-none"
                              onClick={() => setShowFullComments(!showFullComments)}
                            >
                              {showFullComments ? 'Show less' : 'Show more'}
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons mt-4 d-flex gap-3 justify-content-center">
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={handleEdit}
                      className="action-btn"
                    >
                      Edit Record
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="lg"
                      onClick={handleDelete}
                      className="action-btn"
                    >
                      Delete Record
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
        title="Delete Fuel Fill Record"
        message="Are you sure you want to delete this fuel fill record? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default SpecificFuelFillRecord;
