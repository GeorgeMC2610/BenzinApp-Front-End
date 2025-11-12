import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { useMalfunctionStore } from '../services/managers/MalfunctionManager';

function Malfunctions() {
  const [searchTerm, setSearchTerm] = useState('');

  const store = useMalfunctionStore();
  const malfunctions = useMalfunctionStore((state) => state.list);

  if (!malfunctions) {
    store.index();
  }

  // Filter malfunctions based on search term
  const filteredMalfunctions = malfunctions?.filter(malfunction =>
    malfunction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    malfunction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    malfunction.kilometersDiscovered.includes(searchTerm) ||
    malfunction.dateStarted.toString().includes(searchTerm)
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
                    🔍
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
            {filteredMalfunctions == null ? (
              // Show this while data is being fetched or not yet set
              <div className="text-center p-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5>Loading malfunctions...</h5>
              </div>
            ) : filteredMalfunctions.length === 0 ? (
              // Show this when there’s no data
              <Card className="no-results-card">
                <Card.Body className="text-center p-5">
                  <div className="no-results-icon mb-3">🔧</div>
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
              // Show this when data is ready
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
                      {filteredMalfunctions.map((malfunction) => (
                        <tr key={malfunction.id}>
                          <td>
                            <div className="malfunction-name">{malfunction.title}</div>
                          </td>
                          <td>{malfunction.dateStarted}</td>
                          <td>
                            <span className={`status-badge ${malfunction.fixed() ? 'fixed' : 'ongoing'}`}>
                              {malfunction.fixed() ? 'fixed' : 'ongoing'}
                            </span>
                          </td>
                          <td>{malfunction.kilometersDiscovered.toLocaleString()} km</td>
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
