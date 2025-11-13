import { Container, Row, Col, Card, Button, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
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

  const totalFuelCosts = car?.getTotalFuelFillCosts() || 0;
  const totalMalfunctionCosts = car?.getTotalMalfunctionCosts() || 0;
  const totalServiceCosts = car?.getTotalServiceCosts() || 0;
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
                        <span className="last-filled">Last filled {fuelFills[0].filledAt}</span>
                        <span className="last-filled-details">
                          {fuelFills[0].lt.toLocaleString(undefined, {minimumFractionDigits: 2})} lt. | 
                          €{fuelFills[0].cost.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
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
                      <div className="consumption-value">{car?.getTotalConsumption().toFixed(3)}</div>
                      <div className="consumption-label">lt/100km</div>
                    </div>
                    <div className="consumption-item">
                      <div className="consumption-value">{car?.getTotalEfficiency().toFixed(3)}</div>
                      <div className="consumption-label">km/lt</div>
                    </div>
                    <div className="consumption-item">
                      <div className="consumption-value">{car?.getTotalTravelCost().toFixed(2)}</div>
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
                          Fuel Fills: €{car?.getTotalFuelFillCosts().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color malfunctions"></span>
                        <span className="legend-text">
                          Malfunction Repairs: €{car?.getTotalMalfunctionCosts().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color services"></span>
                        <span className="legend-text">
                          Services: €{car?.getTotalServiceCosts().toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                        <tr>
                          <td><Link to="/fuel-fill/1" className="fuel-fill-link">2025-01-15</Link></td>
                          <td>€70.00</td>
                          <td>95 Octane</td>
                          <td>Shell Station</td>
                          <td>8.2</td>
                        </tr>
                        <tr>
                          <td><Link to="/fuel-fill/2" className="fuel-fill-link">2024-12-28</Link></td>
                          <td>€68.50</td>
                          <td>95 Octane</td>
                          <td>BP Station</td>
                          <td>7.9</td>
                        </tr>
                        <tr>
                          <td><Link to="/fuel-fill/3" className="fuel-fill-link">2024-12-10</Link></td>
                          <td>€72.30</td>
                          <td>95 Octane</td>
                          <td>Esso Station</td>
                          <td>8.5</td>
                        </tr>
                        <tr>
                          <td><Link to="/fuel-fill/4" className="fuel-fill-link">2024-11-25</Link></td>
                          <td>€65.80</td>
                          <td>95 Octane</td>
                          <td>Shell Station</td>
                          <td>7.6</td>
                        </tr>
                        <tr>
                          <td><Link to="/fuel-fill/5" className="fuel-fill-link">2024-11-08</Link></td>
                          <td>€69.20</td>
                          <td>95 Octane</td>
                          <td>BP Station</td>
                          <td>8.1</td>
                        </tr>
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
                      <span className="stat-value">{car?.getTotalLitersFilled().toLocaleString(undefined, {maximumFractionDigits: 3})} lt</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Kilometers Traveled:</span>
                      <span className="stat-value">{car?.getTotalKilometersTraveled().toLocaleString(undefined, {maximumFractionDigits: 3})} km</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Costs:</span>
                      <span className="stat-value">€{car?.getTotalCost().toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
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
