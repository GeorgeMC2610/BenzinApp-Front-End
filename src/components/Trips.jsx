import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCar, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useTripStore } from '../services/managers/TripManager';

function Trips() {
  const [searchTerm, setSearchTerm] = useState('');

  const store = useTripStore();
  const trips = useTripStore((state) => state.list);

  if (!trips) {
    store.index();
  }

  // Filter trips based on search term
  const filteredTrips = trips.filter(trip =>
    trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.timesRepeating.toString().includes(searchTerm) ||
    trip.created.includes(searchTerm) ||
    trip.totalKm.toString().includes(searchTerm)
  );

  // Separate repeating and one-time trips
  const repeatingTrips = filteredTrips.filter(trip => trip.timesRepeating > 1);
  const oneTimeTrips = filteredTrips.filter(trip => trip.timesRepeating === 1);

  const handleEdit = (id) => {
    console.log('Edit trip:', id);
    // Handle edit logic here
  };

  const handleDelete = (id) => {
    console.log('Delete trip:', id);
    // Handle delete logic here
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
                      {trip.title}
                    </div>
                  </td>
                  <td>
                    {trip.timesRepeating > 1 ? `${trip.timesRepeating} times per week` : 'One-time'}
                  </td>
                  <td>{trip.totalKm.toFixed(2)} km</td>
                  <td>{trip.created}</td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="edit-btn me-2"
                        onClick={() => handleEdit(trip.id)}
                      >
                        Edit
                      </Button>
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
                      onClick={() => store.index()}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </Button>
                  </div>
                  <p className="page-subtitle">{trips?.length} total trips</p>
                </div>
                <Button as={Link} to="/add-trip" className="add-btn">
                  + Add New Trip
                </Button>
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
