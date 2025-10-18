import { Container, Row, Col, Card, Button, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function User() {
  const [selectedMetric, setSelectedMetric] = useState('Liters per 100km');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All Time');

  // Sample data for the chart
  const chartData = {
    labels: ['2022-03-04', '2022-08-09', '2023-03-28', '2023-11-15', '2024-07-03', '2025-02-19', '2025-09-25'],
    datasets: [
      {
        label: 'Fuel Consumption (L/100km)',
        data: [8.2, 9.1, 7.8, 8.9, 7.5, 8.3, 7.9],
        borderColor: '#F5A962',
        backgroundColor: 'rgba(245, 169, 98, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#F5A962',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#F5A962',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 7,
        max: 12,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
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
        hoverBackgroundColor: '#E89647'
      }
    }
  };

  return (
    <div className="user-page">

      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <section className="user-content py-4">
        <Container>
          <Row className="g-4">
            {/* Car Info Card */}
            <Col lg={8}>
              <Card className="car-info-card">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h2 className="car-name mb-2">Brand Model 2025</h2>
                      <div className="d-flex align-items-center">
                        <span className="fuel-icon me-2">⛽</span>
                        <span className="last-filled">Last filled 23 days ago: 38.96 lt | €70.00</span>
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
                      <div className="consumption-value">9.31</div>
                      <div className="consumption-label">lt/100km</div>
                    </div>
                    <div className="consumption-item">
                      <div className="consumption-value">10.75</div>
                      <div className="consumption-label">km/lt</div>
                    </div>
                    <div className="consumption-item">
                      <div className="consumption-value">0,18</div>
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
                    <div className="graph-title">It./100km</div>
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
                    <div className="costs-chart">
                      <div className="pie-chart">
                        <div className="pie-slice fuel" style={{'--percentage': '93.1%'}}></div>
                        <div className="pie-slice malfunctions" style={{'--percentage': '6.9%'}}></div>
                        <div className="pie-slice services" style={{'--percentage': '0%'}}></div>
                        <div className="pie-percentages">
                          <div className="percentage fuel-percentage">93.1%</div>
                          <div className="percentage malfunctions-percentage">6.9%</div>
                        </div>
                      </div>
                    </div>
                    <div className="costs-legend">
                      <div className="legend-item">
                        <span className="legend-color fuel"></span>
                        <span className="legend-text">fuel fills: €5,230.73</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color malfunctions"></span>
                        <span className="legend-text">malfunctions: €385</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color services"></span>
                        <span className="legend-text">services: €0</span>
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
                          <td>2025-01-15</td>
                          <td>€70.00</td>
                          <td>95 Octane</td>
                          <td>Shell Station</td>
                          <td>8.2</td>
                        </tr>
                        <tr>
                          <td>2024-12-28</td>
                          <td>€68.50</td>
                          <td>95 Octane</td>
                          <td>BP Station</td>
                          <td>7.9</td>
                        </tr>
                        <tr>
                          <td>2024-12-10</td>
                          <td>€72.30</td>
                          <td>95 Octane</td>
                          <td>Esso Station</td>
                          <td>8.5</td>
                        </tr>
                        <tr>
                          <td>2024-11-25</td>
                          <td>€65.80</td>
                          <td>95 Octane</td>
                          <td>Shell Station</td>
                          <td>7.6</td>
                        </tr>
                        <tr>
                          <td>2024-11-08</td>
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
                      <span className="stat-value">2.640 lt</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Kilometers Traveled:</span>
                      <span className="stat-value">28.371,5 km</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Costs:</span>
                      <span className="stat-value">€5.623,31</span>
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
  );
}

export default User;
