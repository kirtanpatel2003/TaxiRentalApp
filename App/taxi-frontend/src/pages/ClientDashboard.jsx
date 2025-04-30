import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function ClientDashboard({ name = "Client", clientId = 1 }) {
  const [date, setDate] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [bookedRents, setBookedRents] = useState([]);
  const [review, setReview] = useState({ driver_id: '', rating: '', message: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRents();
  }, []);

  const fetchRents = async () => {
    try {
      const res = await axios.get(`http://localhost:1303/api/client/rents?client_id=${clientId}`);
      setBookedRents(res.data.rents);
    } catch {
      setMessage('Failed to fetch booked rents.');
    }
  };

  const handleCheckAvailability = async () => {
    if (!date) {
      setMessage('Please select a valid date.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:1303/api/client/available-models', { date });
      setAvailableModels(res.data.models);
      setMessage('');
    } catch {
      setMessage('Failed to fetch available car models.');
    }
  };

  const handleBook = async (model_id, car_id) => {
    try {
      const res = await axios.post(`http://localhost:1303/api/client/book`, {
        client_id: clientId,
        date,
        model_id,
        car_id
      });
      setMessage(res.data.message);
      fetchRents();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed.');
    }
  };

  const handleReviewSubmit = async () => {
    if (!review.driver_id || !review.rating || !review.message) {
      setMessage('All fields are required for submitting a review.');
      return;
    }

    try {
      await axios.post('http://localhost:1303/api/client/review', {
        ...review,
        client_id: clientId
      });
      setMessage('Review submitted successfully!');
      setReview({ driver_id: '', rating: '', message: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Welcome, {name}!</h2>
      {message && <Alert variant="info">{message}</Alert>}

      {/* Check Available Models */}
      <Form.Group className="my-3">
        <Form.Label><strong>1. Select Date to Check Available Car Models</strong></Form.Label>
        <Row>
          <Col xs={12} md={6}>
            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Col>
          <Col xs="auto">
            <Button onClick={handleCheckAvailability}>Check Availability</Button>
          </Col>
        </Row>
      </Form.Group>

      {/* Available Car Models */}
      <h5 className="mt-4">2. Available Car Models on {date}</h5>
      {availableModels.length > 0 ? (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Brand</th><th>Color</th><th>Year</th><th>Transmission</th><th>Book</th>
            </tr>
          </thead>
          <tbody>
            {availableModels.map(m => (
              <tr key={`${m.model_id}-${m.car_id}`}>
                <td>{m.brand}</td>
                <td>{m.color}</td>
                <td>{m.year}</td>
                <td>{m.transmission}</td>
                <td><Button size="sm" onClick={() => handleBook(m.model_id, m.car_id)}>Book</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No available models yet. Try selecting a date above.</p>
      )}

      {/* Booked Rents */}
      <h5 className="mt-5">3. Your Booked Rents</h5>
      {bookedRents.length > 0 ? (
        <Table striped bordered>
          <thead>
            <tr><th>Date</th><th>Driver (ID)</th><th>Car Model</th></tr>
          </thead>
          <tbody>
            {bookedRents.map(r => (
              <tr key={r.rent_id}>
                <td>{new Date(r.date).toISOString().slice(0, 10)}</td>
                <td>{r.driver_name} (ID: {r.driver_id})</td>
                <td>{r.year} {r.color} ({r.transmission})</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>You haven’t booked any rides yet.</p>
      )}

      {/* Review Form */}
      <h5 className="mt-5">4. Submit a Review</h5>
      <Form>
        <Row className="mb-2">
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Driver ID"
              value={review.driver_id}
              onChange={(e) => setReview({ ...review, driver_id: e.target.value })}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Rating (0–5)"
              min={0}
              max={5}
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.target.value })}
            />
          </Col>
        </Row>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Write your review..."
          value={review.message}
          onChange={(e) => setReview({ ...review, message: e.target.value })}
          className="mb-2"
        />
        <Button onClick={handleReviewSubmit}>Submit Review</Button>
      </Form>
    </Container>
  );
}

export default ClientDashboard;
