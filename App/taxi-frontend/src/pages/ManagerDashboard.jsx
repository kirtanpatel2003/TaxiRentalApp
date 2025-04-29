import React, { useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';

function ManagerDashboard({ name = "Manager" }) {
  const [selectedSection, setSelectedSection] = useState('Manage Cars');

  // Manage Cars state
  const [carBrand, setCarBrand] = useState('');
  const [removeCarId, setRemoveCarId] = useState('');

  // Manage Models state
  const [modelColor, setModelColor] = useState('');
  const [modelTransmission, setModelTransmission] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [modelCarId, setModelCarId] = useState('');
  const [removeModelId, setRemoveModelId] = useState('');
  const [removeModelCarId, setRemoveModelCarId] = useState('');

  // Manage Drivers state
  const [driverName, setDriverName] = useState('');
  const [driverAddress, setDriverAddress] = useState('');
  const [removeDriverName, setRemoveDriverName] = useState('');

  // Data Query state
  const [topK, setTopK] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [driverCity, setDriverCity] = useState('');

  const handleInsertCar = async (e) => {
    e.preventDefault();
    try {
    //   await axios.post('/api/cars', { brand: carBrand });
      await axios.post('http://localhost:1303/api/add-car', { brand: carBrand });
      alert('Car inserted successfully');
      setCarBrand('');
    } catch (error) {
      alert('Failed to insert car');
    }
  };

  const handleRemoveCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1303/api/remove-car', { car_id: Number(removeCarId) });
      alert('Car removed successfully');
      setRemoveCarId('');
    } catch (error) {
      alert('Failed to remove car');
    }
  };

  const handleInsertModel = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1303/api/add-model', {
        color: modelColor,
        transmission: modelTransmission,
        year: Number(modelYear),
        carId: Number(modelCarId),
      });
      alert('Model inserted successfully');
      setModelColor('');
      setModelTransmission('');
      setModelYear('');
      setModelCarId('');
    } catch (error) {
      alert('Failed to insert model');
    }
  };

  const handleRemoveModel = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1303/api/remove-model', {
        modelId: Number(removeModelId),
        carId: Number(removeModelCarId),
      });
      alert('Model removed successfully');
      setRemoveModelId('');
      setRemoveModelCarId('');
    } catch (error) {
      alert('Failed to remove model');
    }
  };

  const handleInsertDriver = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1303/api/add-driver', {
        name: driverName,
        address: driverAddress,
      });
      alert('Driver inserted successfully');
      setDriverName('');
      setDriverAddress('');
    } catch (error) {
      alert('Failed to insert driver');
    }
  };

  const handleRemoveDriver = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1303/api/remove-driver', { name: removeDriverName });
      alert('Driver removed successfully');
      setRemoveDriverName('');
    } catch (error) {
      alert('Failed to remove driver');
    }
  };

  const handleTopKClients = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/data/top-k-clients', { k: Number(topK) });
      alert('Top-k clients: ' + JSON.stringify(response.data));
      setTopK('');
    } catch (error) {
      alert('Failed to get top-k clients');
    }
  };

  const handleCarModelUsage = async () => {
    try {
      const response = await axios.get('/api/data/car-model-usage');
      alert('Car Model Usage Report: ' + JSON.stringify(response.data));
    } catch (error) {
      alert('Failed to generate car model usage report');
    }
  };

  const handleDriverPerformance = async () => {
    try {
      const response = await axios.get('/api/data/driver-performance');
      alert('Driver Performance Report: ' + JSON.stringify(response.data));
    } catch (error) {
      alert('Failed to generate driver performance report');
    }
  };

  const handleClientDriverCityMatch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/data/client-driver-city-match', {
        clientCity,
        driverCity,
      });
      alert('Client-Driver City Match: ' + JSON.stringify(response.data));
      setClientCity('');
      setDriverCity('');
    } catch (error) {
      alert('Failed to get client-driver city match');
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'Manage Cars':
        return (
          <div>
            <h4>Insert Car</h4>
            <form onSubmit={handleInsertCar}>
              <input
                type="text"
                placeholder="Brand"
                className="form-control mb-2"
                value={carBrand}
                onChange={(e) => setCarBrand(e.target.value)}
                required
              />
              <Button type="submit" className="btn-success mb-3">Submit</Button>
            </form>
            <h4>Remove Car</h4>
            <form onSubmit={handleRemoveCar}>
              <input
                type="number"
                placeholder="Car ID"
                className="form-control mb-2"
                value={removeCarId}
                onChange={(e) => setRemoveCarId(e.target.value)}
                required
              />
              <Button type="submit" className="btn-danger">Remove</Button>
            </form>
          </div>
        );
      case 'Manage Models':
        return (
          <div>
            <h4>Insert Model</h4>
            <form onSubmit={handleInsertModel}>
              <input
                type="text"
                placeholder="Color"
                className="form-control mb-2"
                value={modelColor}
                onChange={(e) => setModelColor(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Transmission"
                className="form-control mb-2"
                value={modelTransmission}
                onChange={(e) => setModelTransmission(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Year"
                className="form-control mb-2"
                value={modelYear}
                onChange={(e) => setModelYear(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Car ID"
                className="form-control mb-2"
                value={modelCarId}
                onChange={(e) => setModelCarId(e.target.value)}
                required
              />
              <Button type="submit" className="btn-success mb-3">Submit</Button>
            </form>
            <h4>Remove Model</h4>
            <form onSubmit={handleRemoveModel}>
              <input
                type="number"
                placeholder="Model ID"
                className="form-control mb-2"
                value={removeModelId}
                onChange={(e) => setRemoveModelId(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Car ID"
                className="form-control mb-2"
                value={removeModelCarId}
                onChange={(e) => setRemoveModelCarId(e.target.value)}
                required
              />
              <Button type="submit" className="btn-danger">Remove</Button>
            </form>
          </div>
        );
      case 'Manage Drivers':
        return (
          <div>
            <h4>Insert Driver</h4>
            <form onSubmit={handleInsertDriver}>
              <input
                type="text"
                placeholder="Driver Name"
                className="form-control mb-2"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address (road,number,city)"
                className="form-control mb-2"
                value={driverAddress}
                onChange={(e) => setDriverAddress(e.target.value)}
                required
              />
              <Button type="submit" className="btn-success mb-3">Submit</Button>
            </form>
            <h4>Remove Driver</h4>
            <form onSubmit={handleRemoveDriver}>
              <input
                type="text"
                placeholder="Driver Name"
                className="form-control mb-2"
                value={removeDriverName}
                onChange={(e) => setRemoveDriverName(e.target.value)}
                required
              />
              <Button type="submit" className="btn-danger">Remove</Button>
            </form>
          </div>
        );
      case 'Data Query':
        return (
          <div>
            <h4>Top-k Clients</h4>
            <form className="mb-4" onSubmit={handleTopKClients}>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Enter k"
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
                required
                min="1"
              />
              <Button type="submit" className="btn-primary">Submit</Button>
            </form>
            <h4>Car Model Usage</h4>
            <Button className="btn-outline-info w-100 mb-3" onClick={handleCarModelUsage}>Generate Report</Button>
            <h4>Driver Performance</h4>
            <Button className="btn-outline-info w-100 mb-3" onClick={handleDriverPerformance}>Generate Report</Button>
            <h4>Client-Driver City Match</h4>
            <form onSubmit={handleClientDriverCityMatch}>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="City C1 (Client)"
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="City C2 (Driver)"
                value={driverCity}
                onChange={(e) => setDriverCity(e.target.value)}
                required
              />
              <Button type="submit" className="btn-primary">Submit</Button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={9} className="text-center">
          <h2>Welcome, Manager {name}!</h2>
          <p>Select a section from the right to begin.</p>
          <div className="mt-4">{renderContent()}</div>
        </Col>
        <Col md={3}>
          <div className="border-start ps-3">
            <h5>Options</h5>
            <ButtonGroup vertical className="w-100">
              <Button variant="outline-primary" onClick={() => setSelectedSection('Manage Cars')}>Manage Cars</Button>
              <Button variant="outline-primary" onClick={() => setSelectedSection('Manage Models')}>Manage Models</Button>
              <Button variant="outline-primary" onClick={() => setSelectedSection('Manage Drivers')}>Manage Drivers</Button>
              <Button variant="outline-primary" onClick={() => setSelectedSection('Data Query')}>Data Query</Button>
            </ButtonGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ManagerDashboard;