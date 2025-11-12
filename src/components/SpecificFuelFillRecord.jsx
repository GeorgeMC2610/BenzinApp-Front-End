import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import ConfirmModal from './ConfirmModal';

function SpecificFuelFillRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fuelFill, setFuelFill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const deleteRedirectTimeout = useRef(null);

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
      efficiency: 8.2,
      comments: 'Regular fill-up during morning commute. Traffic was heavy today.'
    },
    {
      id: 2,
      date: '2024-12-28',
      mileage: 28100,
      cost: 68.50,
      liters: 44.1,
      fuelType: '95 Octane',
      stationName: 'BP Station',
      efficiency: 7.9,
      comments: 'Holiday trip to the mountains. Great fuel efficiency on the highway.'
    },
    {
      id: 3,
      date: '2024-12-10',
      mileage: 27700,
      cost: 72.30,
      liters: 46.8,
      fuelType: '95 Octane',
      stationName: 'Esso Station',
      efficiency: 8.5,
      comments: 'City driving mostly. Cold weather affecting efficiency.'
    },
    {
      id: 4,
      date: '2024-11-25',
      mileage: 27300,
      cost: 65.80,
      liters: 42.5,
      fuelType: '95 Octane',
      stationName: 'Shell Station',
      efficiency: 7.6,
      comments: 'Excellent efficiency this time. Mostly highway driving.'
    },
    {
      id: 5,
      date: '2024-11-08',
      mileage: 26900,
      cost: 69.20,
      liters: 44.7,
      fuelType: '95 Octane',
      stationName: 'BP Station',
      efficiency: 8.1,
      comments: 'Regular city commute. Normal consumption patterns.'
    },
    {
      id: 6,
      date: '2024-10-20',
      mileage: 26500,
      cost: 71.10,
      liters: 45.9,
      fuelType: '95 Octane',
      stationName: 'Total Station',
      efficiency: 8.3,
      comments: 'Mixed driving conditions. Some highway, some city.'
    },
    {
      id: 7,
      date: '2024-10-05',
      mileage: 26100,
      cost: 67.40,
      liters: 43.6,
      fuelType: '95 Octane',
      stationName: 'Shell Station',
      efficiency: 7.8,
      comments: 'Good efficiency achieved. Mostly suburban driving.'
    },
    {
      id: 8,
      date: '2024-09-18',
      mileage: 25700,
      cost: 73.50,
      liters: 47.2,
      fuelType: '95 Octane',
      stationName: 'Esso Station',
      efficiency: 8.7,
      comments: 'Heavy traffic conditions. Lower efficiency due to stop-and-go driving.'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchFuelFill = () => {
      const foundFill = fuelFills.find(fill => fill.id === parseInt(id));
      if (foundFill) {
        setFuelFill(foundFill);
      }
      setLoading(false);
    };

    fetchFuelFill();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    
    return {
      dayOfWeek,
      month,
      day,
      year
    };
  };

  const calculateConsumption = (liters, previousMileage, currentMileage) => {
    const kilometers = currentMileage - previousMileage;
    return kilometers > 0 ? (liters / kilometers * 100).toFixed(1) : 'N/A';
  };

  const calculateEfficiency = (liters, previousMileage, currentMileage) => {
    const kilometers = currentMileage - previousMileage;
    return kilometers > 0 ? (kilometers / liters).toFixed(1) : 'N/A';
  };

  const calculateTravelCost = (cost, previousMileage, currentMileage) => {
    const kilometers = currentMileage - previousMileage;
    return kilometers > 0 ? (cost / kilometers).toFixed(2) : 'N/A';
  };

  const handleEdit = () => {
    // Navigate to edit page - for now, we'll redirect to the add fuel fill page
    // In a real app, this would navigate to a dedicated edit form with pre-filled data
    navigate('/add-fuel-fill', { 
      state: { 
        editMode: true, 
        fuelFillData: fuelFill 
      } 
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Delete fuel fill:', fuelFill.id);
    setShowDeleteModal(false);
    setFeedbackMessage('Fuel fill record deleted successfully.');

    deleteRedirectTimeout.current = setTimeout(() => {
      navigate('/fuel-fills');
    }, 1200);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    return () => {
      if (deleteRedirectTimeout.current) {
        clearTimeout(deleteRedirectTimeout.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="fuel-fill-record-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="fuel-fill-record-content py-4">
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

  if (!fuelFill) {
    return (
      <div className="fuel-fill-record-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="fuel-fill-record-content py-4">
            <Container className="py-5">
              <div className="text-center">
                <h2>Fuel Fill Record Not Found</h2>
                <p>The requested fuel fill record could not be found.</p>
                <Link to="/fuel-fills" className="btn btn-primary">
                  Back to Fuel Fills
                </Link>
              </div>
            </Container>
          </section>
        </div>
      </div>
    );
  }

  const dateInfo = formatDate(fuelFill.date);
  const previousMileage = fuelFill.mileage - 400; // Simulate previous mileage
  const consumption = calculateConsumption(fuelFill.liters, previousMileage, fuelFill.mileage);
  const efficiency = calculateEfficiency(fuelFill.liters, previousMileage, fuelFill.mileage);
  const travelCost = calculateTravelCost(fuelFill.cost, previousMileage, fuelFill.mileage);

  return (
    <div className="fuel-fill-record-page">
      <DrawerMenu />
      
      {/* Main Content */}
      <div className="drawer-content">
        <section className="fuel-fill-record-content py-4">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={8}>
              {feedbackMessage && (
                <Alert variant="success" className="mb-4">
                  {feedbackMessage}
                </Alert>
              )}
              {/* Header */}
              <div className="page-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="page-title">Fuel Fill Record Details</h1>
                    <p className="page-subtitle">Detailed information about this fuel fill</p>
                  </div>
                  <Link to="/fuel-fills" className="btn btn-outline-secondary">
                    ← Back to Fuel Fills
                  </Link>
                </div>
              </div>

              {/* Main Record Card */}
              <Card className="fuel-fill-record-card mb-4">
                <Card.Body className="p-4">
                  {/* Date and Basic Info Section */}
                  <div className="date-section mb-4">
                    <div className="date-info text-center">
                      <div className="date-day-of-week">{dateInfo.dayOfWeek}</div>
                      <div className="date-month-day">{dateInfo.month} {dateInfo.day}</div>
                      <div className="date-year">{dateInfo.year}</div>
                    </div>
                    <div className="fuel-station-info text-center mt-3">
                      <div className="fuel-type">{fuelFill.fuelType}</div>
                      <div className="station-name">{fuelFill.stationName}</div>
                    </div>
                  </div>

                  {/* Two Column Data Section */}
                  <Row className="g-4">
                    {/* Left Column - Basic Metrics */}
                    <Col md={6}>
                      <Card className="metrics-card h-100">
                        <Card.Body className="p-4">
                          <h4 className="metrics-title mb-3">Basic Metrics</h4>
                          <div className="metric-item">
                            <div className="metric-label">Liters</div>
                            <div className="metric-value">{fuelFill.liters}L</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Kilometers</div>
                            <div className="metric-value">{(fuelFill.mileage - previousMileage).toLocaleString()} km</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Cost</div>
                            <div className="metric-value">€{fuelFill.cost.toFixed(2)}</div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Right Column - Calculated Metrics */}
                    <Col md={6}>
                      <Card className="metrics-card h-100">
                        <Card.Body className="p-4">
                          <h4 className="metrics-title mb-3">Calculated Metrics</h4>
                          <div className="metric-item">
                            <div className="metric-label">Consumption</div>
                            <div className="metric-value">{consumption} L/100km</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Efficiency</div>
                            <div className="metric-value">{efficiency} km/L</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Travel Cost</div>
                            <div className="metric-value">€{travelCost}/km</div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Comments Section */}
                  {fuelFill.comments && (
                    <div className="comments-section mt-4">
                      <Card className="comments-card">
                        <Card.Body className="p-4">
                          <h4 className="comments-title mb-3">Comments</h4>
                          <p className="comments-text">{fuelFill.comments}</p>
                        </Card.Body>
                      </Card>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons mt-4 d-flex gap-3 justify-content-center">
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={handleEdit}
                      className="action-btn"
                    >
                      Edit Record
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="lg"
                      onClick={handleDelete}
                      className="action-btn"
                    >
                      Delete Record
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
        title="Delete Fuel Fill Record"
        message="Are you sure you want to delete this fuel fill record? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default SpecificFuelFillRecord;
