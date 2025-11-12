import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import ConfirmModal from './ConfirmModal';

function SpecificTripRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const deleteRedirectTimeout = useRef(null);

  const trips = [
    {
      id: 1,
      name: 'Work Commute',
      type: 'Repeating',
      frequency: 5,
      cost: 2.5,
      kilometers: 15.5,
      createdDate: '2024-01-15',
      description: 'Daily commute to office',
      origin: 'Home',
      destination: 'Downtown Office',
      lastCompleted: '2025-01-10'
    },
    {
      id: 2,
      name: 'Grocery Shopping',
      type: 'Repeating',
      frequency: 2,
      cost: 1.2,
      kilometers: 8.2,
      createdDate: '2024-02-01',
      description: 'Weekly grocery trips',
      origin: 'Home',
      destination: 'Local Supermarket',
      lastCompleted: '2025-01-12'
    },
    {
      id: 3,
      name: 'Weekend Trip to Beach',
      type: 'One-Time',
      frequency: null,
      cost: 25.8,
      kilometers: 120.5,
      createdDate: '2024-12-20',
      description: 'Family trip to coastal city',
      origin: 'Home',
      destination: 'Seaside Town',
      lastCompleted: '2024-12-20'
    },
    {
      id: 4,
      name: 'Gym Visits',
      type: 'Repeating',
      frequency: 3,
      cost: 1.8,
      kilometers: 12.0,
      createdDate: '2024-03-10',
      description: 'Regular gym sessions',
      origin: 'Home',
      destination: 'City Gym',
      lastCompleted: '2025-01-11'
    },
    {
      id: 5,
      name: 'Airport Pickup',
      type: 'One-Time',
      frequency: null,
      cost: 18.5,
      kilometers: 45.2,
      createdDate: '2024-11-15',
      description: 'Picking up friend from airport',
      origin: 'Home',
      destination: 'International Airport',
      lastCompleted: '2024-11-15'
    },
    {
      id: 6,
      name: 'Doctor Appointments',
      type: 'Repeating',
      frequency: 1,
      cost: 3.2,
      kilometers: 22.8,
      createdDate: '2024-06-05',
      description: 'Monthly medical checkups',
      origin: 'Home',
      destination: 'City Clinic',
      lastCompleted: '2025-01-05'
    }
  ];

  useEffect(() => {
    const foundTrip = trips.find((item) => item.id === parseInt(id, 10));
    if (foundTrip) {
      setTrip(foundTrip);
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
    navigate('/add-trip', {
      state: {
        editMode: true,
        tripData: trip
      }
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Delete trip:', trip.id);
    setShowDeleteModal(false);
    setFeedbackMessage('Trip record deleted successfully.');

    deleteRedirectTimeout.current = setTimeout(() => {
      navigate('/trips');
    }, 1200);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="trips-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="trips-content py-4">
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

  if (!trip) {
    return (
      <div className="trips-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="trips-content py-4">
            <Container className="py-5">
              <div className="text-center">
                <h2>Trip Record Not Found</h2>
                <p>The requested trip record could not be found.</p>
                <Link to="/trips" className="btn btn-primary">
                  Back to Trips
                </Link>
              </div>
            </Container>
          </section>
        </div>
      </div>
    );
  }

  const createdDate = new Date(trip.createdDate);
  const lastCompletedDate = trip.lastCompleted ? new Date(trip.lastCompleted) : null;
  const today = new Date();
  const daysSinceCreated = Math.max(
    Math.round((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );
  const daysSinceLastCompleted = lastCompletedDate
    ? Math.max(
        Math.round((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24)),
        0
      )
    : null;

  const isRepeating = trip.type === 'Repeating';
  const weeklyTrips = isRepeating ? trip.frequency : 0;
  const weeklyDistance = isRepeating ? trip.frequency * trip.kilometers : trip.kilometers;
  const weeklyCost = isRepeating ? trip.frequency * trip.cost : trip.cost;
  const annualTripCount = isRepeating ? trip.frequency * 52 : 1;
  const annualDistance = (weeklyDistance / (isRepeating ? trip.frequency : 1)) * annualTripCount;
  const annualCost = weeklyCost * (isRepeating ? 52 : 1);

  return (
    <div className="trips-page">
      <DrawerMenu />

      <div className="drawer-content">
        <section className="trips-content py-4">
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
                      <h1 className="page-title">Trip Record Details</h1>
                      <p className="page-subtitle">Detailed insights about your saved trip</p>
                    </div>
                    <Link to="/trips" className="btn btn-outline-secondary">
                      ← Back to Trips
                    </Link>
                  </div>
                </div>

                <Card className="fuel-fill-record-card mb-4">
                  <Card.Body className="p-4">
                    <div className="date-section mb-4">
                      <div className="date-info text-center">
                        <div className="date-day-of-week">
                          {createdDate.toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                        <div className="date-month-day">
                          {createdDate.toLocaleDateString('en-US', { month: 'long' })}{' '}
                          {createdDate.getDate()}
                        </div>
                        <div className="date-year">{createdDate.getFullYear()}</div>
                      </div>
                      <div className="fuel-station-info text-center mt-3">
                        <div className="fuel-type">
                          {trip.origin} → {trip.destination}
                        </div>
                        <div className="station-name">
                          <Badge bg={isRepeating ? 'info' : 'secondary'}>{trip.type}</Badge>
                        </div>
                      </div>
                    </div>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Distance & Frequency</h4>
                            <div className="metric-item">
                              <div className="metric-label">Trip distance</div>
                              <div className="metric-value">{trip.kilometers} km</div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Weekly trips</div>
                              <div className="metric-value">
                                {isRepeating ? `${weeklyTrips} times` : 'One-time trip'}
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Weekly distance</div>
                              <div className="metric-value">
                                {isRepeating ? `${weeklyDistance.toFixed(1)} km` : '—'}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Cost Overview</h4>
                            <div className="metric-item">
                              <div className="metric-label">Cost per trip</div>
                              <div className="metric-value">€{trip.cost.toFixed(2)}</div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Estimated annual cost</div>
                              <div className="metric-value">
                                €{annualCost.toFixed(2)} ({annualTripCount} trip
                                {annualTripCount !== 1 ? 's' : ''})
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Annual distance</div>
                              <div className="metric-value">
                                {annualDistance.toFixed(1)} km
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Row className="g-4 mt-1">
                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Timeline</h4>
                            <div className="metric-item">
                              <div className="metric-label">Created</div>
                              <div className="metric-value">{daysSinceCreated} days ago</div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Last completed</div>
                              <div className="metric-value">
                                {daysSinceLastCompleted !== null
                                  ? `${daysSinceLastCompleted} days ago`
                                  : 'Not recorded'}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Route</h4>
                            <div className="metric-item">
                              <div className="metric-label">Start</div>
                              <div className="metric-value">{trip.origin}</div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Destination</div>
                              <div className="metric-value">{trip.destination}</div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {trip.description && (
                      <div className="comments-section mt-4">
                        <Card className="comments-card">
                          <Card.Body className="p-4">
                            <h4 className="comments-title mb-3">Notes</h4>
                            <p className="comments-text mb-0">{trip.description}</p>
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
                        Edit Trip
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="lg"
                        onClick={handleDelete}
                        className="action-btn"
                      >
                        Delete Trip
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
        title="Delete Trip Record"
        message="Are you sure you want to delete this trip record? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default SpecificTripRecord;

