import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function DriverDashboard() {
  const location = useLocation();
  const driverName = location.state?.name || 'Driver';

  const [models, setModels] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState({});
  const [newAddress, setNewAddress] = useState({ road_name: '', number: '', city: '' });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await axios.get('http://localhost:1303/api/driver/models');
      setModels(res.data.models);
    } catch {
      setMessage('Failed to fetch models.');
    }
  };

  const handleDeclareModel = async () => {
    try {
      await axios.post('http://localhost:1303/api/driver/candrive', {
        driver_name: driverName,
        model_id: selectedModel.model_id,
        car_id: selectedModel.car_id
      });
      setMessage('Model added to your drive list!');
    } catch {
      setMessage('Failed to add model.');
    }
  };

  const handleAddressChange = async () => {
    try {
      await axios.put('http://localhost:1303/api/driver/address', {
        driver_name: driverName,
        ...newAddress
      });
      setMessage('Address updated successfully!');
      setNewAddress({ road_name: '', number: '', city: '' });
    } catch {
      setMessage('Failed to update address.');
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h2 className="text-primary">Welcome, {driverName}!</h2>
          {message && <Alert variant="info" className="mt-3">{message}</Alert>}

          <h5 className="mt-4">1. Update Your Address</h5>
          <Form as={Row} className="g-2 align-items-center mb-3">
            <Col md={4}>
              <Form.Control
                placeholder="Road Name"
                value={newAddress.road_name}
                onChange={(e) => setNewAddress({ ...newAddress, road_name: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                placeholder="Number"
                value={newAddress.number}
                onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </Col>
            <Col xs="auto">
              <Button variant="primary" onClick={handleAddressChange}>Update</Button>
            </Col>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3 text-success">2. All Car Models</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Color</th>
                <th>Year</th>
                <th>Transmission</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {models.map(model => (
                <tr key={`${model.model_id}-${model.car_id}`}>
                  <td>{model.brand}</td>
                  <td>{model.color}</td>
                  <td>{model.year}</td>
                  <td>{model.transmission}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => setSelectedModel(model)}>Select</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {selectedModel.model_id && (
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="text-info">3. Confirm Model to Drive</h5>
            <p>
              You selected: <strong>{selectedModel.brand}</strong>, {selectedModel.year} ({selectedModel.transmission})
            </p>
            <Button variant="success" onClick={handleDeclareModel}>Add to Can Drive</Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default DriverDashboard;
