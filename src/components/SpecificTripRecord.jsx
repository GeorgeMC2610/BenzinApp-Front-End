import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import ConfirmModal from './ConfirmModal';
import LocationMapModal from './LocationMapModal';

const MAX_DESCRIPTION_LENGTH = 150;
const FUEL_PRICE_PER_LITER = 2.0;
const COST_SCENARIOS = [
  { key: 'best', label: 'Best case', color: 'success', multiplier: 0.8 },
  { key: 'average', label: 'Average case', color: 'secondary', multiplier: 1 },
  { key: 'worst', label: 'Worst case', color: 'danger', multiplier: 1.15 }
];

function SpecificTripRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
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
      description: 'Daily trip from the port area to the central offices.',
      origin: 'Miaouli 4, Thessaloniki',
      destination: 'Tsimiski 50, Thessaloniki',
      originCoords: { lat: 40.6401, lng: 22.9361 },
      destinationCoords: { lat: 40.6387, lng: 22.9469 },
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
      description: 'Weekly groceries near Ano Poli.',
      origin: 'Kapodistriou 8, Thessaloniki',
      destination: 'Agias Sofias 15, Thessaloniki',
      originCoords: { lat: 40.6231, lng: 22.9294 },
      destinationCoords: { lat: 40.6339, lng: 22.9423 },
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
      description: 'Family escape to Agios Nikolaos beach.',
      origin: 'Miaouli 4, Thessaloniki',
      destination: 'Agios Nikolaos Beach, Chalkidiki',
      originCoords: { lat: 40.6401, lng: 22.9361 },
      destinationCoords: { lat: 40.2509, lng: 23.0795 },
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
      description: 'Trip to the fitness center in Marousi.',
      origin: 'Kifisias Avenue 115, Marousi',
      destination: 'Leoforos Marathonos 12, Marousi',
      originCoords: { lat: 38.0483, lng: 23.7852 },
      destinationCoords: { lat: 38.0432, lng: 23.8087 },
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
      description: 'Pickup from Athena International Airport.',
      origin: 'Miaouli 4, Thessaloniki',
      destination: 'Athens International Airport, Spata',
      originCoords: { lat: 40.6401, lng: 22.9361 },
      destinationCoords: { lat: 37.9366, lng: 23.9471 },
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
      description: 'Monthly checkup in Kifisia.',
      origin: 'Miaouli 4, Thessaloniki',
      destination: 'Stratonikos 25, Kifisia',
      originCoords: { lat: 40.6401, lng: 22.9361 },
      destinationCoords: { lat: 38.0157, lng: 23.7972 },
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

  const openMapFor = (title, coords) => {
    setMapLocation({
      label: title,
      coords
    });
    setShowMapModal(true);
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

  const baseConsumptionPerTime = trip.cost > 0 ? trip.cost / FUEL_PRICE_PER_LITER : 0;

  const buildScenarioData = (baseCost, baseConsumption, unit) =>
    COST_SCENARIOS.map((scenario) => ({
      ...scenario,
      unit,
      cost: baseCost * scenario.multiplier,
      consumption: baseConsumption * scenario.multiplier
    }));

  const perTimeScenarios = buildScenarioData(trip.cost, baseConsumptionPerTime, 'per time');

  const weeklyScenarios = isRepeating
    ? buildScenarioData(
        trip.cost * trip.frequency,
        baseConsumptionPerTime * trip.frequency,
        'per week'
      )
    : [];

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
                    <div className="title-description-section mb-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h2 className="record-title mb-0">{trip.name}</h2>
                        <Badge bg={isRepeating ? 'info' : 'secondary'} className="ms-2">
                          {trip.type}
                        </Badge>
                      </div>
                      <div className="record-description">
                        {trip.description && (
                          <>
                            <p className="mb-0">
                              {showFullDescription || trip.description.length <= MAX_DESCRIPTION_LENGTH
                                ? trip.description
                                : `${trip.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
                            </p>
                            {trip.description.length > MAX_DESCRIPTION_LENGTH && (
                              <Button
                                variant="link"
                                className="p-0 mt-2 text-decoration-none"
                                onClick={() => setShowFullDescription(!showFullDescription)}
                              >
                                {showFullDescription ? 'Show less' : 'Show more'}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="analytics-legend mb-3">
                      <span className="legend-item best">Best case</span>
                      <span className="legend-item average">Average case</span>
                      <span className="legend-item worst">Worst case</span>
                    </div>

                    <Row className="g-4">
                      <Col md={isRepeating ? 6 : 12}>
                        <Card className="analytics-card h-100">
                          <Card.Body className="p-4">
                            <div className="analytics-header mb-3">
                              <h4 className="metrics-title mb-0">Analytics Per Time</h4>
                            </div>
                            {perTimeScenarios.map((scenario) => (
                              <div className={`analytics-row ${scenario.key}`} key={scenario.key}>
                                <div className={`analytics-cost text-${scenario.color}`}>
                                  €{scenario.cost.toFixed(2)} {scenario.unit}
                                </div>
                                <div className="analytics-consumption">
                                  {(scenario.consumption).toFixed(2)} lt. {scenario.unit}
                                </div>
                              </div>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>

                      {isRepeating && (
                        <Col md={6}>
                          <Card className="analytics-card h-100">
                            <Card.Body className="p-4">
                              <div className="analytics-header mb-3">
                                <h4 className="metrics-title mb-0">Weekly Analytics</h4>
                              </div>
                              {weeklyScenarios.map((scenario) => (
                                <div className={`analytics-row ${scenario.key}`} key={scenario.key}>
                                  <div className={`analytics-cost text-${scenario.color}`}>
                                    €{scenario.cost.toFixed(2)} {scenario.unit}
                                  </div>
                                  <div className="analytics-consumption">
                                    {(scenario.consumption).toFixed(2)} lt. {scenario.unit}
                                  </div>
                                </div>
                              ))}
                            </Card.Body>
                          </Card>
                        </Col>
                      )}
                    </Row>

                    <Card className="route-card mt-4">
                      <Card.Body className="p-4">
                        <div className="route-row">
                          <span className="route-icon">📍</span>
                          <div>
                            <p className="route-label mb-0">Origin</p>
                            <button
                              type="button"
                              className="address-link"
                              onClick={() =>
                                openMapFor(`Origin · ${trip.origin}`, trip.originCoords)
                              }
                            >
                              {trip.origin}
                            </button>
                          </div>
                        </div>
                        <div className="route-row">
                          <span className="route-icon">🎯</span>
                          <div>
                            <p className="route-label mb-0">Destination</p>
                            <button
                              type="button"
                              className="address-link"
                              onClick={() =>
                                openMapFor(`Destination · ${trip.destination}`, trip.destinationCoords)
                              }
                            >
                              {trip.destination}
                            </button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>

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
      <LocationMapModal
        show={showMapModal}
        onHide={() => setShowMapModal(false)}
        location={mapLocation}
      />
    </div>
  );
}

export default SpecificTripRecord;


