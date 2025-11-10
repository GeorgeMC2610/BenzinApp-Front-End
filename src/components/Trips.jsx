import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCar } from '@fortawesome/free-solid-svg-icons';

function Trips() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in a real app, this would come from an API
  const trips = [
    {
      id: 1,
      name: 'Work Commute',
      type: 'Repeating',
      frequency: 5,
      cost: 2.50,
      kilometers: 15.5,
      createdDate: '2024-01-15',
      description: 'Daily commute to office'
    },
    {
      id: 2,
      name: 'Grocery Shopping',
      type: 'Repeating',
      frequency: 2,
      cost: 1.20,
      kilometers: 8.2,
      createdDate: '2024-02-01',
      description: 'Weekly grocery trips'
    },
    {
      id: 3,
      name: 'Weekend Trip to Beach',
      type: 'One-Time',
      frequency: null,
      cost: 25.80,
      kilometers: 120.5,
      createdDate: '2024-12-20',
      description: 'Family trip to coastal city'
    },
    {
      id: 4,
      name: 'Gym Visits',
      type: 'Repeating',
      frequency: 3,
      cost: 1.80,
      kilometers: 12.0,
      createdDate: '2024-03-10',
      description: 'Regular gym sessions'
    },
    {
      id: 5,
      name: 'Airport Pickup',
      type: 'One-Time',
      frequency: null,
      cost: 18.50,
      kilometers: 45.2,
      createdDate: '2024-11-15',
      description: 'Picking up friend from airport'
    },
    {
      id: 6,
      name: 'Doctor Appointments',
      type: 'Repeating',
      frequency: 1,
      cost: 3.20,
      kilometers: 22.8,
      createdDate: '2024-06-05',
      description: 'Monthly medical checkups'
    }
  ];

  // Filter trips based on search term
  const filteredTrips = trips.filter(trip =>
    trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.createdDate.includes(searchTerm) ||
    trip.kilometers.toString().includes(searchTerm)
  );

  // Separate repeating and one-time trips
  const repeatingTrips = filteredTrips.filter(trip => trip.type === 'Repeating');
  const oneTimeTrips = filteredTrips.filter(trip => trip.type === 'One-Time');

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
                <th>Name of Trip</th>
                <th>Frequency</th>
                <th>Cost</th>
                <th>Kilometers</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tripList.map(trip => (
                <tr key={trip.id}>
                  <td>
                    <div className="trip-name">
                      {trip.name}
                    </div>
                    <div className="trip-description">
                      {trip.description}
                    </div>
                  </td>
                  <td>
                    {trip.frequency ? `${trip.frequency} times per week` : 'One-time'}
                  </td>
                  <td>€{trip.cost.toFixed(2)}</td>
                  <td>{trip.kilometers} km</td>
                  <td>{trip.createdDate}</td>
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
                  <h1 className="page-title">Trips</h1>
                  <p className="page-subtitle">Manage your regular and one-time trips</p>
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
