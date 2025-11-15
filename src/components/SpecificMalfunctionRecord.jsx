import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import ConfirmModal from './ConfirmModal';

const MAX_DESCRIPTION_LENGTH = 150;

function SpecificMalfunctionRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [malfunction, setMalfunction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const deleteRedirectTimeout = useRef(null);

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
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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

  useEffect(() => {
    const foundMalfunction = malfunctions.find((item) => item.id === parseInt(id, 10));
    if (foundMalfunction) {
      setMalfunction(foundMalfunction);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    return () => {
      if (deleteRedirectTimeout.current) {
        clearTimeout(deleteRedirectTimeout.current);
      }
    };
  }, []);

  const handleEdit = () => {
    navigate('/add-malfunction', {
      state: {
        editMode: true,
        malfunctionData: malfunction
      }
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Delete malfunction:', malfunction.id);
    setShowDeleteModal(false);
    setFeedbackMessage('Malfunction record deleted successfully.');

    deleteRedirectTimeout.current = setTimeout(() => {
      navigate('/malfunctions');
    }, 1200);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="malfunctions-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="malfunctions-content py-4">
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

  if (!malfunction) {
    return (
      <div className="malfunctions-page">
        <DrawerMenu />
        <div className="drawer-content">
          <section className="malfunctions-content py-4">
            <Container className="py-5">
              <div className="text-center">
                <h2>Malfunction Record Not Found</h2>
                <p>The requested malfunction record could not be found.</p>
                <Link to="/malfunctions" className="btn btn-primary">
                  Back to Malfunctions
                </Link>
              </div>
            </Container>
          </section>
        </div>
      </div>
    );
  }

  const discoveryDate = new Date(malfunction.date);
  const resolvedDate = malfunction.endDate ? new Date(malfunction.endDate) : null;
  const today = new Date();
  const daysSinceDiscovery = Math.max(
    Math.round((today.getTime() - discoveryDate.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );
  const daysToResolve =
    resolvedDate && resolvedDate >= discoveryDate
      ? Math.round((resolvedDate.getTime() - discoveryDate.getTime()) / (1000 * 60 * 60 * 24))
      : null;

  const severityDescriptions = {
    1: 'Very Low',
    2: 'Low',
    3: 'Moderate',
    4: 'High',
    5: 'Critical'
  };

  const severityVariant = {
    1: 'success',
    2: 'success',
    3: 'warning',
    4: 'danger',
    5: 'danger'
  }[malfunction.severity || 3];

  const repairCostLabel =
    typeof malfunction.repairCost === 'number'
      ? `€${malfunction.repairCost.toFixed(2)}`
      : 'Not recorded yet';

  return (
    <div className="malfunctions-page">
      <DrawerMenu />

      <div className="drawer-content">
        <section className="malfunctions-content py-4">
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} lg={10} xl={8}>
                {feedbackMessage && (
                  <Alert variant="success" className="mb-4">
                    {feedbackMessage}
                  </Alert>
                )}

                <div className="page-header mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h1 className="page-title">Malfunction Record Details</h1>
                      <p className="page-subtitle">Investigate the history of this malfunction</p>
                    </div>
                    <Link to="/malfunctions" className="btn btn-outline-secondary">
                      ← Back to Malfunctions
                    </Link>
                  </div>
                </div>

                <Card className="fuel-fill-record-card mb-4">
                  <Card.Body className="p-4">
                    <div className="title-description-section mb-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h2 className="record-title mb-0">{malfunction.name}</h2>
                        <Badge bg={severityVariant} className="ms-2">
                          Severity Level {malfunction.severity}{' '}
                          {severityDescriptions[malfunction.severity] || ''}
                        </Badge>
                      </div>
                      {malfunction.description && (
                        <div className="record-description">
                          <p className="mb-0">
                            {showFullDescription || malfunction.description.length <= MAX_DESCRIPTION_LENGTH
                              ? malfunction.description
                              : `${malfunction.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
                          </p>
                          {malfunction.description.length > MAX_DESCRIPTION_LENGTH && (
                            <Button
                              variant="link"
                              className="p-0 mt-2 text-decoration-none"
                              onClick={() => setShowFullDescription(!showFullDescription)}
                            >
                              {showFullDescription ? 'Show less' : 'Show more'}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Status Overview</h4>
                            <div className="metric-item">
                              <div className="metric-label">Current status</div>
                              <div className="metric-value d-flex gap-2 align-items-center">
                                <Badge bg={malfunction.status === 'Fixed' ? 'success' : 'warning'}>
                                  {malfunction.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Days since discovery</div>
                              <div className="metric-value">{daysSinceDiscovery} days</div>
                            </div>
                            {malfunction.status === 'Fixed' && daysToResolve !== null && (
                              <div className="metric-item">
                                <div className="metric-label">Resolution time</div>
                                <div className="metric-value">{daysToResolve} days</div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6}>
                        <Card className="metrics-card h-100">
                          <Card.Body className="p-4">
                            <h4 className="metrics-title mb-3">Repair Details</h4>
                            <div className="metric-item">
                              <div className="metric-label">Repair cost</div>
                              <div className="metric-value">{repairCostLabel}</div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Repair location</div>
                              <div className="metric-value">
                                {malfunction.location || 'Not assigned yet'}
                              </div>
                            </div>
                            <div className="metric-item">
                              <div className="metric-label">Discovered at</div>
                              <div className="metric-value">
                                {malfunction.discoveredAt.toLocaleString()} km
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>


                    <div className="action-buttons mt-4 d-flex gap-3 justify-content-center">
                      <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={handleEdit}
                        className="action-btn"
                      >
                        Edit Malfunction
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="lg"
                        onClick={handleDelete}
                        className="action-btn"
                      >
                        Delete Malfunction
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
        title="Delete Malfunction Record"
        message="Are you sure you want to delete this malfunction record? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default SpecificMalfunctionRecord;

