import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container className="d-flex vh-100 align-items-center justify-content-center">
      <Row className="text-center w-100">
        <Col>
          <h1 className="mb-3">Welcome to Taxi Rental</h1>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/login">
              <Button size="lg" variant="primary">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline-secondary">Register</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
