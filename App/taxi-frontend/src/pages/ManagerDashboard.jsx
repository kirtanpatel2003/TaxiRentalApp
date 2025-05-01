import React, { useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';

function ManagerDashboard({ name = "Manager" }) {
  const [selectedSection, setSelectedSection] = useState('Manage Cars');

  // Manage Cars state
  const [carBrand, setCarBrand] = useState('');
  const [removeCarId, setRemoveCarId] = useState('');
  const [allCars, setAllCars] = useState([]);

  // Manage Models state
  const [modelColor, setModelColor] = useState('');
  const [modelTransmission, setModelTransmission] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [modelCarId, setModelCarId] = useState('');
  const [removeModelId, setRemoveModelId] = useState('');
  const [removeModelCarId, setRemoveModelCarId] = useState('');
  const [allModels, setAllModels] = useState([]);

  // Manage Drivers state
  const [driverName, setDriverName] = useState('');
  const [driverAddress, setDriverAddress] = useState('');
  const [removeDriverName, setRemoveDriverName] = useState('');

  // Data Query state
  const [topK, setTopK] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [driverCity, setDriverCity] = useState('');

  const [topKClients, setTopKClients] = useState([]);
  const [carModelUsage, setCarModelUsage] = useState([]);
  const [driverPerformance, setDriverPerformance] = useState([]);
  const [cityMatchResults, setCityMatchResults] = useState([]);

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
        car_id: Number(modelCarId),
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
        model_id: Number(removeModelId),
        car_id: Number(removeModelCarId),
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
      const response = await axios.post('http://localhost:1303/api/data/top-k-clients', { k: Number(topK) });
      setTopKClients(response.data);
      setTopK('');
    } catch (error) {
      alert('Failed to get top-k clients');
    }
  };

  const handleCarModelUsage = async () => {
    try {
      const response = await axios.get('http://localhost:1303/api/data/car-model-usage');
      setCarModelUsage(response.data);
    } catch (error) {
      alert('Failed to generate car model usage report');
    }
  };

  const handleDriverPerformance = async () => {
    try {
      const response = await axios.get('http://localhost:1303/api/data/driver-performance');
      setDriverPerformance(response.data);
    } catch (error) {
      alert('Failed to generate driver performance report');
    }
  };

  const handleClientDriverCityMatch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1303/api/data/client-driver-city-match', {
        clientCity,
        driverCity,
      });
      setCityMatchResults(response.data);
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
            <h4 className="mt-4">All Cars</h4>
            <Button className="btn-outline-info mb-3" onClick={async () => {
              try {
                const response = await axios.get('http://localhost:1303/api/all-cars');
                setAllCars(response.data);
              } catch (error) {
                alert('Failed to fetch cars');
              }
            }}>Load Cars</Button>
            {allCars.length > 0 && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Car ID</th>
                    <th>Brand</th>
                  </tr>
                </thead>
                <tbody>
                  {allCars.map((car, idx) => (
                    <tr key={idx}>
                      <td>{car.car_id}</td>
                      <td>{car.brand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
            <h4 className="mt-4">All Models</h4>
            <Button className="btn-outline-info mb-3" onClick={async () => {
              try {
                const response = await axios.get('http://localhost:1303/api/all-models');
                setAllModels(response.data);
              } catch (error) {
                alert('Failed to fetch models');
              }
            }}>Load Models</Button>
            {allModels.length > 0 && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Model ID</th>
                    <th>Color</th>
                    <th>Transmission</th>
                    <th>Year</th>
                    <th>Car ID</th>
                  </tr>
                </thead>
                <tbody>
                  {allModels.map((model, idx) => (
                    <tr key={idx}>
                      <td>{model.model_id}</td>
                      <td>{model.color}</td>
                      <td>{model.transmission}</td>
                      <td>{model.year}</td>
                      <td>{model.car_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
            <h4 className="mt-4">All Drivers</h4>
            <Button className="btn-outline-info mb-3" onClick={async () => {
              try {
                const response = await axios.get('http://localhost:1303/api/all-drivers');
                setDriverPerformance(response.data); // reuse state for simplicity
              } catch (error) {
                alert('Failed to fetch drivers');
              }
            }}>Load Drivers</Button>
            {driverPerformance.length > 0 && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {driverPerformance.map((driver, idx) => (
                    <tr key={idx}>
                      <td>{driver.name}</td>
                      <td>{driver.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
            {topKClients.length > 0 && (
              <table className="table mt-3">
                <thead><tr><th>Name</th><th>Email</th></tr></thead>
                <tbody>
                  {topKClients.map((client, index) => (
                    <tr key={index}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <h4>Car Model Usage</h4>
            <Button className="btn-outline-info w-100 mb-3" onClick={handleCarModelUsage}>Generate Report</Button>
            {carModelUsage.length > 0 && (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Car Brand</th>
                    <th>Model Color</th>
                    <th>Transmission</th>
                    <th>Year</th>
                    <th>Usage Count</th>
                  </tr>
                </thead>
                <tbody>
                  {carModelUsage.map((usage, index) => (
                    <tr key={index}>
                      <td>{usage.brand}</td>
                      <td>{usage.color}</td>
                      <td>{usage.transmission}</td>
                      <td>{usage.year}</td>
                      <td>{usage.usageCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <h4>Driver Performance</h4>
            <Button className="btn-outline-info w-100 mb-3" onClick={handleDriverPerformance}>Generate Report</Button>
            {driverPerformance.length > 0 && (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Driver Name</th>
                    <th>Trips Completed</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {driverPerformance.map((driver, index) => (
                    <tr key={index}>
                      <td>{driver.name}</td>
                      <td>{driver.tripsCompleted}</td>
                      <td>{driver.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
            {cityMatchResults.length > 0 && (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Driver Name</th>
                    <th>Client City</th>
                    <th>Driver City</th>
                  </tr>
                </thead>
                <tbody>
                  {cityMatchResults.map((match, index) => (
                    <tr key={index}>
                      <td>{match.clientName}</td>
                      <td>{match.driverName}</td>
                      <td>{match.clientCity}</td>
                      <td>{match.driverCity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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