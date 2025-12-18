import {Container, Row, Col, Card, Table, Button, Form, InputGroup, ProgressBar} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { useFuelFillRecordStore } from '../services/managers/FuelFillRecordManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faRefresh } from '@fortawesome/free-solid-svg-icons';

function FuelFills() {
  const [searchTerm, setSearchTerm] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fuelFills = useFuelFillRecordStore((state) => state.list);
  const indexFuelFills = useFuelFillRecordStore((state) => state.index);
  const store = useFuelFillRecordStore();

  useEffect(() => {
    if (fuelFills === null) indexFuelFills();
  }, []);

  const refresh = () => {
    indexFuelFills();
  }

  const isReady = fuelFills !== null;

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

  // Group fuel fills by month
  const groupedFills = fuelFills?.reduce((groups, fill) => {
    const date = new Date(fill.filledAt);
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
  const filteredFills = Object.keys(groupedFills ?? {}).reduce((filtered, monthKey) => {
    const monthData = groupedFills[monthKey];
    const filteredMonthFills = monthData.fills.filter(fill =>
      fill.station?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fill.fuelType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fill.filledAt.includes(searchTerm) ||
      fill.km.toString().includes(searchTerm)
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
    // navigate to edit page or open edit form
  };

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
      toast.success('Fuel fill deleted', { position: 'top-center' });
    } catch (err) {
      console.error('Failed to delete fuel fill:', err);
      toast.error('Failed to delete fuel fill', { position: 'top-center' });
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  return (
    <div className="fuel-fills-page">
      <DrawerMenu />

      {/* Main Content */}
      <div className="drawer-content">
        <section className="fuel-fills-content py-4">
        <Container>
          <Row>
            <Col>
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Fuel Fill"
        message="Are you sure you want to delete this fuel fill record? This action cannot be undone."
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
                    <h1 className="page-title mb-0">Fuel Fills</h1>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className='ms-2'
                      onClick={refresh}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </Button>
                  </div>
                  <p className="page-subtitle">{fuelFills?.length ?? 0} total fuel fills.</p>
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
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
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
            {Object.keys(filteredFills ?? {}).length === 0 ? (
              <Card className="no-results-card">
                <Card.Body className="text-center p-5">
                  <div className="no-results-icon mb-3">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="3x" />
                  </div>
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
                          {monthData?.fills.map(fill => (
                            <tr key={fill.id}>
                              <td><Link to={`/fuel-fill/${fill.id}`} className="fuel-fill-link">{fill.filledAt}</Link></td>
                              <td>{fill.km.toLocaleString()} km</td>
                              <td>€{fill.cost.toFixed(2)}</td>
                              <td>{fill.lt}L</td>
                              <td>{fill.fuelType}</td>
                              <td>{fill.station}</td>
                              <td>{typeof fill.getConsumption === 'function' ? fill.getConsumption().toFixed(3) : 'N/A'} L/100km</td>
                              <td>
                                <div className="action-buttons">
                                  <Link to={`/edit-fuel-fill/${fill.id}`}
                                    className="btn btn-sm btn-outline-primary edit-btn me-2"
                                    onClick={() => handleEdit(fill.id)}
                                  >
                                    Edit
                                  </Link>
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
    </div>
  );
}

export default FuelFills;
