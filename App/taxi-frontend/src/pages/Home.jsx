import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container className="text-center mt-5">
      <h1>Welcome to Taxi Rental</h1>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/login">
          <Button variant="primary">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="secondary">Register</Button>
        </Link>
      </div>
    </Container>
  );
}