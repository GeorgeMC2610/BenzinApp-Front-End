import { Container, Row, Col, Card, Table, Button, Form, InputGroup, ProgressBar } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faRefresh, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { useServiceStore } from '../services/managers/ServiceManager';

function Services() {
  const [searchTerm, setSearchTerm] = useState('');

    const services = useServiceStore((state) => state.list);
    const indexServices = useServiceStore((state) => state.index);

    useEffect(() => {
        if (services === null) indexServices();
    }, []);

    const refresh = () => {
        indexServices();
    }

    const isReady = services !== null;

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

  // Filter services based on search term
  const filteredServices = services?.reverse().filter(service =>
    service.dateHappened.includes(searchTerm) ||
    service.description.toString().includes(searchTerm)
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
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="page-title mb-0">Services</h1>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className='ms-2'
                      onClick={refresh}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </Button>
                  </div>
                  <p className="page-subtitle">{services?.length} total services</p>
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
                        <th>Date Happened</th>
                        <th>Kilometers Done</th>
                        <th>Next (kilometers)</th>
                        <th>Next (before date)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map(service => (
                        <tr key={service.id}>
                          <td>
                            <div className="service-name">
                              <Link to={`/service/${service.id}`} className='fuel-fill-link'>{service.dateHappened}</Link>
                            </div>
                            <div className="service-description">
                              {service.description}
                            </div>
                          </td>
                          <td>
                            {service.kilometersDone.toLocaleString()} km
                          </td>
                          <td>
                            {service.nextServiceKilometers?.toLocaleString() ?? '-'} km
                          </td>
                          <td>
                            {service.nextServiceDate ?? '-'}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Link to={`/edit-service/${service.id}`}
                                className="btn btn-sm btn-outline-primary edit-btn me-2"
                                onClick={() => handleEdit(service.id)}
                              >
                                Edit
                              </Link>
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
