import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

function Services() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in a real app, this would come from an API
  const services = [
    {
      id: 1,
      name: 'Oil Change',
      date: '2025-01-05',
      status: 'Completed',
      discoveredAt: 28500,
      description: 'Regular oil change with synthetic oil'
    },
    {
      id: 2,
      name: 'Brake Service',
      date: '2024-12-20',
      status: 'Scheduled',
      discoveredAt: 28000,
      description: 'Brake pad replacement and rotor inspection'
    },
    {
      id: 3,
      name: 'Tire Rotation',
      date: '2024-11-15',
      status: 'Completed',
      discoveredAt: 27500,
      description: 'Tire rotation and alignment check'
    },
    {
      id: 4,
      name: 'Transmission Service',
      date: '2024-10-10',
      status: 'Scheduled',
      discoveredAt: 27000,
      description: 'Transmission fluid change and filter replacement'
    },
    {
      id: 5,
      name: 'Battery Check',
      date: '2024-09-25',
      status: 'Completed',
      discoveredAt: 26500,
      description: 'Battery test and terminal cleaning'
    }
  ];

  // Filter services based on search term
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.date.includes(searchTerm) ||
    service.discoveredAt.toString().includes(searchTerm)
  );

  const handleEdit = (id) => {
    console.log('Edit service:', id);
    // Handle edit logic here
  };

  const handleDelete = (id) => {
    console.log('Delete service:', id);
    // Handle delete logic here
  };

  return (
    <div className="services-page">
      <DrawerMenu />
      
      {/* Main Content */}
      <div className="drawer-content">
        <section className="services-content py-4">
        <Container>
          <Row>
            <Col>
              {/* Header */}
              <div className="page-header mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="page-title">Services</h1>
                  <p className="page-subtitle">Track and manage vehicle services</p>
                </div>
                <Button as={Link} to="/add-service" className="add-btn">
                  + Add New Service
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
                    placeholder="Search in services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            {/* Services Table */}
            {filteredServices.length === 0 ? (
              <Card className="no-results-card">
                <Card.Body className="text-center p-5">
                  <div className="no-results-icon mb-3">
                    <FontAwesomeIcon icon={faScrewdriverWrench} size="3x" />
                  </div>
                  <h3>No services found</h3>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first service record'}
                  </p>
                  {!searchTerm && (
                    <Button as={Link} to="/add-service" className="mt-3">
                      Add First Service
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <Card className="services-table-card">
                <Card.Body className="p-0">
                  <Table responsive className="services-table mb-0">
                    <thead>
                      <tr>
                        <th>Service Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Discovered at</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map(service => (
                        <tr key={service.id}>
                          <td>
                            <div className="service-name">
                              {service.name}
                            </div>
                            <div className="service-description">
                              {service.description}
                            </div>
                          </td>
                          <td>{service.date}</td>
                          <td>
                            <span className={`status-badge ${service.status.toLowerCase()}`}>
                              {service.status}
                            </span>
                          </td>
                          <td>{service.discoveredAt.toLocaleString()} km</td>
                          <td>
                            <div className="action-buttons">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="edit-btn me-2"
                                onClick={() => handleEdit(service.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="delete-btn"
                                onClick={() => handleDelete(service.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
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

export default Services;
