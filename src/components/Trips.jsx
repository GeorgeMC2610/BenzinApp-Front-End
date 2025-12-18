import { Container, Row, Col, Card, Table, Button, Form, InputGroup, ProgressBar } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';
import DrawerMenu from './DrawerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCar, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useTripStore } from '../services/managers/TripManager';

function Trips() {
  const [searchTerm, setSearchTerm] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

    const trips = useTripStore((state) => state.list);
    const indexTrips = useTripStore((state) => state.index);
    const store = useTripStore();

    useEffect(() => {
        if (trips === null) indexTrips();
    }, []);

    const refresh = () => {
        indexTrips();
    }

    const isReady = trips !== null;

    if (!isReady) {
        return (
            <div className="user-page">
                <DrawerMenu />
                <div className="drawer-content">
                    <Container className="py-5">
                        <Row className="justify-content-center">
                            <Col md={8} lg={6}>
                                <Card className="p-4 text-center">
                                    <h5 className="mb-3">Loading your data...</h5>
                                    <ProgressBar now={100} animated striped />
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }

  // Filter trips based on search term
  const filteredTrips = trips?.filter(trip =>
    trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.timesRepeating.toString().includes(searchTerm) ||
    trip.created.includes(searchTerm) ||
    trip.totalKm.toString().includes(searchTerm)
  ) ?? [];

  // Separate repeating and one-time trips
  const repeatingTrips = filteredTrips.filter(trip => trip.timesRepeating > 1);
  const oneTimeTrips = filteredTrips.filter(trip => trip.timesRepeating === 1);

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await store.delete(deleteTargetId);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      toast.success('Trip deleted', { position: 'top-center' });
    } catch (err) {
      console.error('Failed to delete trip:', err);
      toast.error('Failed to delete trip', { position: 'top-center' });
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const renderTripTable = (tripList, title, emptyMessage) => (
    <Card className="trip-section-card mb-4">
      <Card.Header className="trip-section-header">
        <h3 className="trip-section-title">{title}</h3>
      </Card.Header>
      <Card.Body className="p-0">
        {tripList.length === 0 ? (
          <div className="text-center p-4">
            <div className="no-trips-icon mb-2">
              <FontAwesomeIcon icon={faCar} size="2x" />
            </div>
            <p className="text-muted">{emptyMessage}</p>
          </div>
        ) : (
          <Table responsive className="trips-table mb-0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Times Repeating</th>
                <th>Total Km</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tripList.map(trip => (
                <tr key={trip.id}>
                  <td>
                    <div className="trip-name">
                      <Link to={`/trip/${trip.id}`} className="fuel-fill-link">
                        {trip.title}
                      </Link>
                    </div>
                    <div className="trip-addresses mt-1">
                      <small>Origin: {trip.originAddress}</small>
                      <small>Destination: {trip.destinationAddress}</small>
                    </div>
                  </td>
                  <td>
                    {trip.timesRepeating > 1 ? `${trip.timesRepeating} times per week` : 'One-time'}
                  </td>
                  <td>{trip.totalKm.toFixed(2)} km</td>
                  <td>{(new Date(trip.created)).toLocaleString('en-UK')}</td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="delete-btn"
                        onClick={() => handleDelete(trip.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="trips-page">
      <DrawerMenu />

      {/* Main Content */}
      <div className="drawer-content">
        <section className="trips-content py-4">
        <Container>
          <Row>
            <Col>
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Trip"
        message="Are you sure you want to delete this trip record? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
              {/* Header */}
              <div className="page-header mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="page-title mb-0">Trips</h1>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className='ms-2'
                      onClick={refresh}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </Button>
                  </div>
                  <p className="page-subtitle">{trips?.length} total trips</p>
                </div>
              </div>
            </div>

            {/* Search Box */}
            <Card className="search-card mb-4">
              <Card.Body className="p-3">
                <InputGroup>
                  <InputGroup.Text className="search-icon">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search in trips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            {/* No Results */}
            {filteredTrips.length === 0 && searchTerm ? (
              <Card className="no-results-card">
                <Card.Body className="text-center p-5">
                  <div className="no-results-icon mb-3">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="3x" />
                  </div>
                  <h3>No trips found</h3>
                  <p className="text-muted">Try adjusting your search terms</p>
                </Card.Body>
              </Card>
            ) : (
              <>
                {/* Repeating Trips */}
                {renderTripTable(
                  repeatingTrips,
                  'Repeating Trips',
                  'No repeating trips found'
                )}

                {/* One-Time Trips */}
                {renderTripTable(
                  oneTimeTrips,
                  'One-Time Trips',
                  'No one-time trips found'
                )}
              </>
            )}

            {/* Empty State for No Trips */}
            {filteredTrips.length === 0 && !searchTerm && (
              <Card className="no-results-card">
                <Card.Body className="text-center p-5">
                  <div className="no-results-icon mb-3">
                    <FontAwesomeIcon icon={faCar} size="3x" />
                  </div>
                  <h3>No trips found</h3>
                  <p className="text-muted">Start by adding your first trip record</p>
                  <Button as={Link} to="/add-trip" className="mt-3">
                    Add First Trip
                  </Button>
                </Card.Body>
              </Card>
            )}
            </Col>
          </Row>
        </Container>
        </section>
      </div>
    </div>
  );
}

export default Trips;
