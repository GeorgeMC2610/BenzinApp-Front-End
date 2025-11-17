import { Container, Row, Col, Card, Button, Dropdown, ProgressBar } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faWrench, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useCarStore } from '../services/managers/CarManager';
import { useServiceStore } from '../services/managers/ServiceManager';
import { useMalfunctionStore } from '../services/managers/MalfunctionManager';
import { useTripStore } from '../services/managers/TripManager';
import { useFuelFillRecordStore } from '../services/managers/FuelFillRecordManager';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Car } from '../classes/Car';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  Filler
);

function User() {
  const [selectedMetric, setSelectedMetric] = useState('Liters per 100km');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All Time');

  const car = useCarStore((state) => state.car);
  const fuelFills = useFuelFillRecordStore((state) => state.list);
  const services = useServiceStore((state) => state.list);
  const malfunctions = useMalfunctionStore((state) => state.list);
  // const trips = useTripStore((state) => state.list);

  // index actions; they retrieve the data from the back-end.
  const getCarDetails = useCarStore((state) => state.getCarDetails);
  const indexFuelFills = useFuelFillRecordStore((state) => state.index);
  const indexServices = useServiceStore((state) => state.index);
  const indexMalfunctions = useMalfunctionStore((state) => state.index);
  // const indexTrips = useTripStore((state) => state.index);

  useEffect(() => {
    if (car === null) getCarDetails();
    if (fuelFills === null) indexFuelFills();
    if (services === null) indexServices();
    if (malfunctions === null) indexMalfunctions();
    // We don't care that much about trips, since they're not any helpful in the dashboard.
    // if (trips === null) indexTrips();
  }, []);

  const isReady = car !== null &&
                  fuelFills !== null &&
                  services !== null &&
                  malfunctions !== null

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

  const lastFill = fuelFills && fuelFills.length > 0 ? fuelFills[0] : null;

  // Color mapping for different metrics
  const metricColors = {
    'Liters per 100km': { line: '#82b1ff', bg: 'rgba(130, 177, 255, 0.1)', shortened: 'lt/100km' },
    'Kilometers Per Liter': { line: '#ff5252', bg: 'rgba(255, 82, 82, 0.1)', shortened: 'km/lt' },
    'Cost per Kilometer': { line: '#4caf50', bg: 'rgba(76, 175, 80, 0.1)', shortened: '€/km' }
  };

  const getMetricData = (metric) => {
    switch (metric) {
      case 'Liters per 100km':
        return fuelFills.map((fill) => fill.getConsumption().toLocaleString(undefined, { minimumFractionDigits: 4 })).reverse();
      case 'Kilometers Per Liter':
        return fuelFills.map((fill) => fill.getEfficiency().toLocaleString(undefined, { minimumFractionDigits: 4 })).reverse();
      case 'Cost per Kilometer':
        return fuelFills.map((fill) => fill.getTravelCost().toLocaleString(undefined, { minimumFractionDigits: 4 })).reverse();
      default:
        return [];
    }
  };

  const currentColor = metricColors[selectedMetric];

  const totalFuelCosts = Car.getTotalFuelFillCosts() || 0;
  const totalMalfunctionCosts = Car.getTotalMalfunctionCosts() || 0;
  const totalServiceCosts = Car.getTotalServiceCosts() || 0;
  const totalCosts = totalFuelCosts + totalMalfunctionCosts + totalServiceCosts;

  const fuelPercentage = totalCosts > 0 ? (totalFuelCosts / totalCosts) * 100 : 0;
  const malfunctionPercentage = totalCosts > 0 ? (totalMalfunctionCosts / totalCosts) * 100 : 0;
  const servicePercentage = totalCosts > 0 ? (totalServiceCosts / totalCosts) * 100 : 0;

  const pieData = {
    labels: ['Fuel', 'Malfunctions', 'Services'],
    datasets: [
      {
        data: [fuelPercentage, malfunctionPercentage, servicePercentage],
        backgroundColor: [
          '#ff9800',
          '#ff5252',
          '#ff6e40',
        ],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.formattedValue}%`
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value) => `${value.toFixed(1)}%`,
        anchor: 'center',
        align: 'center',
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  // Sample data for the chart
  const chartData = {
    labels: fuelFills.map((fill) => fill.filledAt).reverse(),
    datasets: [
      {
        label: selectedMetric,
        data: getMetricData(selectedMetric),
        borderColor: currentColor.line,
        backgroundColor: currentColor.bg,
        borderWidth: 3,
        pointBackgroundColor: currentColor.line,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff'
      },
      datalabels: {
        display: false
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          wheel: {
            enabled: true
          },
          drag: {
            enabled: true
          },
          mode: 'x'
        }
      }
    },
    scales: {
      y: {
        position: 'left',
        grid: {
          display: true
        },
        ticks: {
          color: '#8C7A6A',
          font: {
            size: 12
          }
        }
      },
      y1: {
        position: 'right',
        afterBuildTicks: (axis) => {
          axis.ticks = [...axis.chart.scales.y.ticks];
          axis.min = axis.chart.scales.y.min;
          axis.max = axis.chart.scales.y.max;
        },
        grid: {
          display: true
        },
        ticks: {
          color: '#8C7A6A',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#8C7A6A',
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: currentColor.line
      }
    }
  };

  return (
    <div className="user-page">
      <DrawerMenu />

      {/* Main Content */}
      <div className="drawer-content">
        <section className="user-content py-4">
        <Container>
          <Row className="g-4">
            {/* Car Info Card */}
            <Col lg={8}>
              <Card className="car-info-card">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <h2 className="car-name mb-0">{car?.manufacturer} {car?.model}</h2>
                        <div className="car-year-badge">{car?.year}</div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faGasPump} className="fuel-icon" />
                        {lastFill ? (
                          <>
                            <span className="last-filled">Last filled {lastFill.filledAt}</span>
                            <span className="last-filled-details">
                              {lastFill.lt.toLocaleString(undefined, { minimumFractionDigits: 2 })} lt. |
                              €{lastFill.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </>
                        ) : (
                          <span className="last-filled">No fuel fills yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Service Status Section */}
                  <div className="service-status-section mt-4 pt-3">
                    <div className="service-status-item">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faWrench} className="service-icon" />
                          <span className="service-label">Next service in 3,545 km.</span>
                        </div>
                        <Button variant="success" className="service-ok-btn">OK</Button>
                      </div>
                    </div>
                    <div className="service-status-item mt-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faCalendar} className="service-icon" />
                          <span className="service-label">Service due in 6 month(s)</span>
                        </div>
                        <Button variant="success" className="service-ok-btn">OK</Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Average Consumption Card */}
            <Col lg={4}>
              <Card className="consumption-card">
                <Card.Body className="p-4">
                  <h3 className="card-title mb-3">Average Consumption</h3>
                  <div className="consumption-grid">
                    <div className="consumption-item">
                      <div className="consumption-value">{Car.getTotalConsumption().toFixed(3)}</div>
                      <div className="consumption-label">lt/100km</div>
                    </div>
                    <div className="consumption-item">
                      <div className="consumption-value">{Car.getTotalEfficiency().toFixed(3)}</div>
                      <div className="consumption-label">km/lt</div>
                    </div>
                    <div className="consumption-item">
                      <div className="consumption-value">{Car.getTotalTravelCost().toFixed(2)}</div>
                      <div className="consumption-label">€/km</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Fuel Usage Graph Card */}
            <Col lg={8}>
              <Card className="fuel-graph-card">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="card-title mb-0">Fuel Usage Graph</h3>
                    <div className="d-flex gap-2">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" className="dropdown-toggle">
                          {selectedMetric}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setSelectedMetric('Liters per 100km')}>
                            Liters per 100km
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectedMetric('Kilometers Per Liter')}>
                            Kilometers Per Liter
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectedMetric('Cost per Kilometer')}>
                            Cost per Kilometer
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" className="dropdown-toggle">
                          {selectedTimeFilter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setSelectedTimeFilter('All Time')}>
                            All Time
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectedTimeFilter('Last 3 months')}>
                            Last 3 months
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectedTimeFilter('Last month')}>
                            Last month
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectedTimeFilter('Last 7 days')}>
                            Last 7 days
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="graph-container">
                    <div className="graph-title">{currentColor.shortened}</div>
                    <div className="chart-wrapper">
                      <Line data={chartData} options={chartOptions} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Combined Costs Card */}
            <Col lg={4}>
              <Card className="costs-card">
                <Card.Body className="p-4">
                  <h3 className="card-title mb-4">Combined Costs</h3>
                  <div className="costs-content">
                      {(() => {
                              return (
                                <>
                                  <div>
                                    <div style={{ width: '250px', height: '250px' }}>
                                      <Pie data={pieData} options={pieOptions} />
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                    <div className="costs-legend">
                      <div className="legend-item">
                        <span className="legend-color fuel"></span>
                        <span className="legend-text">
                          Fuel Fills: €{Car.getTotalFuelFillCosts().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color malfunctions"></span>
                        <span className="legend-text">
                          Malfunction Repairs: €{Car.getTotalMalfunctionCosts().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color services"></span>
                        <span className="legend-text">
                          Services: €{Car.getTotalServiceCosts().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Fuel Fills Table */}
            <Col lg={8}>
              <Card className="fuel-fills-table-card">
                <Card.Body className="p-4">
                  <h3 className="card-title mb-3">Recent Fuel Fills</h3>
                  <div className="table-responsive">
                    <table className="table fuel-fills-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Cost</th>
                          <th>Fuel Type</th>
                          <th>Fuel Station</th>
                          <th>Efficiency (l/100km)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fuelFills.slice(0, 5).map((fill) => (
                          <tr key={fill.id}>
                            <td>
                              <Link to={`/fuel-fill/${fill.id}`} className="fuel-fill-link">
                                {fill.filledAt}
                              </Link>
                            </td>
                            <td>€{fill.cost.toFixed(2)}</td>
                            <td>{fill.fuelType === null || fill.fuelType === '' ? '-' : fill.fuelType }</td>
                            <td>{fill.station === null || fill.station === '' ? '-' : fill.station}</td>
                            <td>{fill.getConsumption().toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Total Statistics Card */}
            <Col lg={4}>
              <Card className="statistics-card">
                <Card.Body className="p-4">
                  <h3 className="card-title mb-3">Total Statistics</h3>
                  <div className="statistics-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Liters Filled:</span>
                      <span className="stat-value">{Car.getTotalLitersFilled().toLocaleString(undefined, {maximumFractionDigits: 3})} lt</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Kilometers Traveled:</span>
                      <span className="stat-value">{Car.getTotalKilometersTraveled().toLocaleString(undefined, {maximumFractionDigits: 3})} km</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Costs:</span>
                      <span className="stat-value">€{Car.getTotalCost().toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Action Buttons */}
            <Col lg={12}>
              <div className="action-buttons d-flex gap-3 justify-content-center">
                <Link to="/fuel-fills" className="brand-link">
                  <Button variant="outline-secondary" size="lg" className="action-btn">
                    View Fuel Fill History
                  </Button>
                </Link>

                <Link to="/add-fuel-fill" className="brand-link">
                  <Button variant="primary" size="lg" className="action-btn">
                    Add New Fuel Fill
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
        </section>
      </div>
    </div>
  );
}

export default User;
