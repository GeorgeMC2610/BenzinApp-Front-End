import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';
import LocationMapModal from './LocationMapModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons/faLongArrowAltRight';
import { Trip } from '../classes/Trip';
import { useTripStore } from '../services/managers/TripManager';
import { useCarStore } from '../services/managers/CarManager';
import { Car } from '../classes/Car';

function SpecificTripRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const deleteRedirectTimeout = useRef(null);
  const store = useTripStore();

    useEffect(() => {
        const fetchTrip = () => {
            const listTrip = store.list?.find(trip => trip.id === parseInt(id));
            if (listTrip) {
                setTrip(new Trip(listTrip));
                setLoading(false);
            }
            else {
                store.read(id).then(_ => {
                    setTrip(new Trip(store.viewingTrip));
                    setLoading(false);
                });
            }
        };

        fetchTrip();
    }, [id]);

  let bestConsumption;
  let worstConsumption;
  let averageConsumption;

  let bestCostPerKm;
  let worstCostPerKm;
  let averageCostPerKm;

  bestConsumption = (trip?.totalKm ?? 0) / Car.getBestEfficiency();
  bestCostPerKm = Car.getBestTravelCost() * trip?.totalKm;

  worstConsumption = (trip?.totalKm ?? 0) / Car.getWorstEfficiency();
  worstCostPerKm = Car.getWorstTravelCost() * trip?.totalKm;

  averageConsumption = (trip?.totalKm ?? 0) / Car.getTotalConsumption();
  averageCostPerKm = Car.getTotalTravelCost() * trip?.totalKm;

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
    (async () => {
      try {
        await store.delete(trip.id);
        setShowDeleteModal(false);
        setFeedbackMessage('Trip record deleted successfully.');
        deleteRedirectTimeout.current = setTimeout(() => {
          navigate('/trips');
        }, 1200);
      } catch (err) {
        console.error('Failed to delete trip:', err);
        setShowDeleteModal(false);
        toast?.error && toast.error('Failed to delete trip.');
      }
    })();
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

  const isRepeating = trip.timesRepeating !== 1;

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
                        <h2 className="record-title mb-0">{trip.title}</h2>

                      </div>
                      <div className="record-description">
                        <Badge bg={isRepeating ? 'info' : 'secondary'}>
                          <FontAwesomeIcon icon={isRepeating ? faRepeat : faLongArrowAltRight} className='me-2' />
                          {isRepeating ? `Repeating ${trip.timesRepeating} times per week` : 'One-Time'}
                        </Badge>
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
                            <div className='analytics-row best'>
                                <div className='analytics-cost text-success'>
                                  €{bestCostPerKm.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="analytics-consumption text-success">
                                  {bestConsumption.toLocaleString(undefined, {maximumFractionDigits: 3})} lt
                                </div>
                              </div>
                              <div className='analytics-row average'>
                                <div className='analytics-cost text-secondary'>
                                  €{averageCostPerKm.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="analytics-consumption text-secondary">
                                  {averageConsumption.toLocaleString(undefined, {maximumFractionDigits: 3})} lt
                                </div>
                              </div>
                              <div className='analytics-row worst'>
                                <div className='analytics-cost text-danger'>
                                  €{worstCostPerKm.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="analytics-consumption text-danger">
                                  {worstConsumption.toLocaleString(undefined, {maximumFractionDigits: 3})} lt
                                </div>
                              </div>
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
                              <div className='analytics-row best'>
                                <div className='analytics-cost text-success'>
                                  €{(bestCostPerKm * trip.timesRepeating).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="analytics-consumption text-success">
                                  {(bestConsumption * trip.timesRepeating).toLocaleString(undefined, {maximumFractionDigits: 3})} lt
                                </div>
                              </div>
                              <div className='analytics-row average'>
                                <div className='analytics-cost text-secondary'>
                                  €{(averageCostPerKm * trip.timesRepeating).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="analytics-consumption text-secondary">
                                  {(averageConsumption * trip.timesRepeating).toLocaleString(undefined, {maximumFractionDigits: 3})} lt
                                </div>
                              </div>
                              <div className='analytics-row worst'>
                                <div className='analytics-cost text-danger'>
                                  €{(worstCostPerKm * trip.timesRepeating).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="analytics-consumption text-danger">
                                  {(worstConsumption * trip.timesRepeating).toLocaleString(undefined, {maximumFractionDigits: 3})} lt
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      )}
                    </Row>

                    <Card className="route-card mt-4">
                      <Card.Body className="p-4">
                        <div className="route-row">
                          <FontAwesomeIcon icon={faLocationDot} size='xl' className='text-success' />
                          <div>
                            <p className="route-label mb-0">Origin</p>
                            <button
                              type="button"
                              className="address-link"
                              onClick={() =>
                                openMapFor(`Origin · ${trip.originAddress}`, {lat: trip.originLatitude, lng: trip.originLongitude})
                              }
                            >
                              {trip.originAddress}
                            </button>
                          </div>
                        </div>
                        <div className="route-row">
                          <FontAwesomeIcon icon={faLocationDot} size='xl' className='text-danger' />
                          <div>
                            <p className="route-label mb-0">Destination</p>
                            <button
                              type="button"
                              className="address-link"
                              onClick={() =>
                                openMapFor(`Destination · ${trip.destinationAddress}`, {lat: trip.destinationLatitude, lng: trip.destinationLongitude} )
                              }
                            >
                              {trip.destinationAddress}
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
