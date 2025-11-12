import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faWrench } from '@fortawesome/free-solid-svg-icons';

function Malfunctions() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in a real app, this would come from an API
  const malfunctions = [
    {
      id: 1,
      name: 'Engine Misfire',
      date: '2025-01-10',
      status: 'Fixed',
      discoveredAt: 28450,
      description: 'Cylinder 3 misfiring at idle',
      severity: 4,
      repairCost: 385,
      endDate: '2025-01-18',
      location: 'City Motors Workshop',
      notes: 'Spark plugs and ignition coils replaced.'
    },
    {
      id: 2,
      name: 'Brake Pad Wear',
      date: '2024-12-15',
      status: 'Ongoing',
      discoveredAt: 28000,
      description: 'Front brake pads need replacement',
      severity: 3,
      repairCost: null,
      endDate: null,
      location: '',
      notes: 'Monitoring pad thickness weekly until service appointment.'
    },
    {
      id: 3,
      name: 'AC Compressor Failure',
      date: '2024-11-20',
      status: 'Fixed',
      discoveredAt: 27500,
      description: 'AC not cooling properly',
      severity: 2,
      repairCost: 620,
      endDate: '2024-11-28',
      location: 'CoolAir Specialists',
      notes: 'Compressor rebuilt and refrigerant topped up.'
    },
    {
      id: 4,
      name: 'Transmission Slipping',
      date: '2024-10-05',
      status: 'Ongoing',
      discoveredAt: 27000,
      description: 'Gear slipping in 3rd gear',
      severity: 5,
      repairCost: null,
      endDate: null,
      location: '',
      notes: 'Diagnostic appointment scheduled for next week.'
    },
    {
      id: 5,
      name: 'Battery Drain',
      date: '2024-09-12',
      status: 'Fixed',
      discoveredAt: 26500,
      description: 'Battery dying overnight',
      severity: 2,
      repairCost: 210,
      endDate: '2024-09-18',
      location: 'ElectroStart Service',
      notes: 'Parasitic drain traced to faulty trunk light switch.'
    }
  ];

  // Filter malfunctions based on search term
  const filteredMalfunctions = malfunctions.filter(malfunction =>
    malfunction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    malfunction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    malfunction.date.includes(searchTerm) ||
    malfunction.discoveredAt.toString().includes(searchTerm)
  );

  const handleEdit = (id) => {
    console.log('Edit malfunction:', id);
    // Handle edit logic here
  };

  const handleDelete = (id) => {
    console.log('Delete malfunction:', id);
    // Handle delete logic here
  };

  return (
    <div className="malfunctions-page">
      <DrawerMenu />
      
      {/* Main Content */}
      <div className="drawer-content">
        <section className="malfunctions-content py-4">
        <Container>
          <Row>
            <Col>
              {/* Header */}
              <div className="page-header mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="page-title">Malfunctions</h1>
                  <p className="page-subtitle">Track and manage vehicle malfunctions</p>
                </div>
                <Button as={Link} to="/add-malfunction" className="add-btn">
                  + Add New Malfunction
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
                    placeholder="Search in malfunctions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            {/* Malfunctions Table */}
            {filteredMalfunctions.length === 0 ? (
              <Card className="no-results-card">
                <Card.Body className="text-center p-5">
                  <div className="no-results-icon mb-3">
                    <FontAwesomeIcon icon={faWrench} size="3x" />
                  </div>
                  <h3>No malfunctions found</h3>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first malfunction record'}
                  </p>
                  {!searchTerm && (
                    <Button as={Link} to="/add-malfunction" className="mt-3">
                      Add First Malfunction
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <Card className="malfunctions-table-card">
                <Card.Body className="p-0">
                  <Table responsive className="malfunctions-table mb-0">
                    <thead>
                      <tr>
                        <th>Malfunction Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Discovered at</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMalfunctions.map(malfunction => (
                        <tr key={malfunction.id}>
                          <td>
                            <div className="malfunction-name">
                              <Link to={`/malfunction/${malfunction.id}`} className="fuel-fill-link">
                                {malfunction.name}
                              </Link>
                            </div>
                            <div className="malfunction-description">
                              {malfunction.description}
                            </div>
                          </td>
                          <td>{malfunction.date}</td>
                          <td>
                            <span className={`status-badge ${malfunction.status.toLowerCase()}`}>
                              {malfunction.status}
                            </span>
                          </td>
                          <td>{malfunction.discoveredAt.toLocaleString()} km</td>
                          <td>
                            <div className="action-buttons">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="edit-btn me-2"
                                onClick={() => handleEdit(malfunction.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="delete-btn"
                                onClick={() => handleDelete(malfunction.id)}
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

export default Malfunctions;
