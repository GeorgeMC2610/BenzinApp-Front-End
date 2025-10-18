import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';

function FuelFills() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in a real app, this would come from an API
  const fuelFills = [
    {
      id: 1,
      date: '2025-01-15',
      mileage: 28500,
      cost: 70.00,
      liters: 45.2,
      fuelType: '95 Octane',
      stationName: 'Shell Station',
      efficiency: 8.2
    },
    {
      id: 2,
      date: '2024-12-28',
      mileage: 28100,
      cost: 68.50,
      liters: 44.1,
      fuelType: '95 Octane',
      stationName: 'BP Station',
      efficiency: 7.9
    },
    {
      id: 3,
      date: '2024-12-10',
      mileage: 27700,
      cost: 72.30,
      liters: 46.8,
      fuelType: '95 Octane',
      stationName: 'Esso Station',
      efficiency: 8.5
    },
    {
      id: 4,
      date: '2024-11-25',
      mileage: 27300,
      cost: 65.80,
      liters: 42.5,
      fuelType: '95 Octane',
      stationName: 'Shell Station',
      efficiency: 7.6
    },
    {
      id: 5,
      date: '2024-11-08',
      mileage: 26900,
      cost: 69.20,
      liters: 44.7,
      fuelType: '95 Octane',
      stationName: 'BP Station',
      efficiency: 8.1
    },
    {
      id: 6,
      date: '2024-10-20',
      mileage: 26500,
      cost: 71.10,
      liters: 45.9,
      fuelType: '95 Octane',
      stationName: 'Total Station',
      efficiency: 8.3
    },
    {
      id: 7,
      date: '2024-10-05',
      mileage: 26100,
      cost: 67.40,
      liters: 43.6,
      fuelType: '95 Octane',
      stationName: 'Shell Station',
      efficiency: 7.8
    },
    {
      id: 8,
      date: '2024-09-18',
      mileage: 25700,
      cost: 73.50,
      liters: 47.2,
      fuelType: '95 Octane',
      stationName: 'Esso Station',
      efficiency: 8.7
    }
  ];

  // Group fuel fills by month
  const groupedFills = fuelFills.reduce((groups, fill) => {
    const date = new Date(fill.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groups[monthYear]) {
      groups[monthYear] = {
        monthName,
        fills: []
      };
    }
    groups[monthYear].fills.push(fill);
    return groups;
  }, {});

  // Filter fuel fills based on search term
  const filteredFills = Object.keys(groupedFills).reduce((filtered, monthKey) => {
    const monthData = groupedFills[monthKey];
    const filteredMonthFills = monthData.fills.filter(fill =>
      fill.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fill.fuelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fill.date.includes(searchTerm) ||
      fill.mileage.toString().includes(searchTerm)
    );
    
    if (filteredMonthFills.length > 0) {
      filtered[monthKey] = {
        ...monthData,
        fills: filteredMonthFills
      };
    }
    return filtered;
  }, {});

  const handleEdit = (id) => {
    console.log('Edit fuel fill:', id);
    // Handle edit logic here
  };

  const handleDelete = (id) => {
    console.log('Delete fuel fill:', id);
    // Handle delete logic here
  };

  return (
    <div className="fuel-fills-page">
      <DashboardNavbar />
      
      {/* Main Content */}
      <section className="page-content py-4">
        <Container>
          <Row>
            <Col>
              {/* Header */}
              <div className="page-header mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="page-title">Fuel Fills</h1>
                  <p className="page-subtitle">Manage your fuel fill records</p>
                </div>
                <Button as={Link} to="/add-fuel-fill" className="add-btn">
                  + Add New Fill
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
                    placeholder="Search in fuel fills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            {/* Fuel Fills by Month */}
            {Object.keys(filteredFills).length === 0 ? (
              <Card className="no-results-card">
                <Card.Body className="text-center p-5">
                  <div className="no-results-icon mb-3">🔍</div>
                  <h3>No fuel fills found</h3>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first fuel fill record'}
                  </p>
                  {!searchTerm && (
                    <Button as={Link} to="/add-fuel-fill" className="mt-3">
                      Add First Fill
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ) : (
              Object.keys(filteredFills).map(monthKey => {
                const monthData = filteredFills[monthKey];
                return (
                  <Card key={monthKey} className="month-card mb-4">
                    <Card.Header className="month-header">
                      <h3 className="month-title">{monthData.monthName}</h3>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <Table responsive className="fuel-fills-table mb-0">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Mileage</th>
                            <th>Cost</th>
                            <th>Liters</th>
                            <th>Fuel Type</th>
                            <th>Station</th>
                            <th>Efficiency</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthData.fills.map(fill => (
                            <tr key={fill.id}>
                              <td>{fill.date}</td>
                              <td>{fill.mileage.toLocaleString()} km</td>
                              <td>€{fill.cost.toFixed(2)}</td>
                              <td>{fill.liters}L</td>
                              <td>{fill.fuelType}</td>
                              <td>{fill.stationName}</td>
                              <td>{fill.efficiency} L/100km</td>
                              <td>
                                <div className="action-buttons">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="edit-btn me-2"
                                    onClick={() => handleEdit(fill.id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="delete-btn"
                                    onClick={() => handleDelete(fill.id)}
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
                );
              })
            )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default FuelFills;
