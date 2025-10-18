import { Container, Row, Col } from 'react-bootstrap';

function About() {
  return (
    <div className="about-page">
      {/* Header Section */}
      <section className="about-header py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="about-title mb-4">About BenzinApp</h1>
              <p className="about-subtitle">
                Your trusted companion for vehicle management and fuel tracking
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content Section */}
      <section className="about-content py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="content-card">
                <h2 className="content-title mb-4">Our Story</h2>
                <p className="content-text mb-4">
                  In 2022, Giorgos set out to solve a problem every driver faces: tracking car efficiency without a trip computer. With an older car and no easy way to log data, he wanted a solution that wasn’t clunky or time-consuming. That’s when BenzinApp was born; a free app that simplifies car management.
                </p>
                <p className="content-text mb-4">
                  Later, Giorgos teamed up with his brother Aimilios to refine the front-end, making BenzinApp a family-built tool designed to help drivers stay on top of their car's performance effortlessly. 
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default About;
