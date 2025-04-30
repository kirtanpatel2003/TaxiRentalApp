import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
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
    <Container className="mt-4">
      <h2>Welcome, {driverName}!</h2>
      {message && <Alert variant="info">{message}</Alert>}

      {/* Address Update */}
      <h5 className="mt-4">1. Update Your Address</h5>
      <Form as={Row} className="mb-3">
        <Col><Form.Control placeholder="Road Name" value={newAddress.road_name} onChange={(e) => setNewAddress({ ...newAddress, road_name: e.target.value })} /></Col>
        <Col><Form.Control placeholder="Number" value={newAddress.number} onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })} /></Col>
        <Col><Form.Control placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} /></Col>
        <Col xs="auto"><Button onClick={handleAddressChange}>Update</Button></Col>
      </Form>

      {/* List All Models */}
      <h5 className="mt-5">2. All Car Models</h5>
      <Table striped bordered>
        <thead>
          <tr><th>Brand</th><th>Color</th><th>Year</th><th>Transmission</th><th>Action</th></tr>
        </thead>
        <tbody>
          {models.map(model => (
            <tr key={`${model.model_id}-${model.car_id}`}>
              <td>{model.brand}</td>
              <td>{model.color}</td>
              <td>{model.year}</td>
              <td>{model.transmission}</td>
              <td>
                <Button size="sm" onClick={() => setSelectedModel(model)}>Select</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Declare CanDrive */}
      {selectedModel.model_id && (
        <div className="mt-3">
          <p>You selected: {selectedModel.brand} {selectedModel.year} ({selectedModel.transmission})</p>
          <Button onClick={handleDeclareModel}>Add to Can Drive</Button>
        </div>
      )}
    </Container>
  );
}

export default DriverDashboard;
