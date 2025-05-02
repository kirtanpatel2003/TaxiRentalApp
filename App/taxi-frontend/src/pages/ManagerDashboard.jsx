import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Tabs, Tab } from 'react-bootstrap';
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

  // Loaders for each section
  const loadCars = async () => {
    try {
      const response = await axios.get('http://localhost:1303/api/all-cars');
      setAllCars(response.data);
    } catch (error) {
      alert('Failed to fetch cars');
    }
  };

  const loadModels = async () => {
    try {
      const response = await axios.get('http://localhost:1303/api/all-models');
      setAllModels(response.data);
    } catch (error) {
      alert('Failed to fetch models');
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:1303/api/all-drivers');
      setDriverPerformance(response.data);
    } catch (error) {
      alert('Failed to fetch drivers');
    }
  };

  useEffect(() => {
    if (selectedSection === 'Manage Cars') {
      loadCars();
    } else if (selectedSection === 'Manage Models') {
      loadModels();
    } else if (selectedSection === 'Manage Drivers') {
      loadDrivers();
    }
  }, [selectedSection]);

  const handleInsertCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1303/api/add-car', { brand: carBrand });
      alert('Car inserted successfully');
      setCarBrand('');
      await loadCars();
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
      await loadCars();
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
      await loadModels();
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
      await loadModels();
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
      await loadDrivers();
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
      await loadDrivers();
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
          <div className="row">
            <div className="col-md-8 pe-4">
              <h4 className="mt-0">All Cars</h4>
              <Button className="btn-outline-info mb-3" onClick={loadCars}>
                Refresh
              </Button>
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
            <div className="col-md-4 ps-md-4">
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
          </div>
        );
      case 'Manage Models':
        return (
          <div className="row">
            <div className="col-md-8 pe-4">
              <h4 className="mt-0">All Models</h4>
              <Button className="btn-outline-info mb-3" onClick={loadModels}>
                Refresh
              </Button>
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
            <div className="col-md-4 ps-md-4">
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
          </div>
        );
      case 'Manage Drivers':
        return (
          <div className="row">
            <div className="col-md-8 pe-4">
              <h4 className="mt-0">All Drivers</h4>
              <Button className="btn-outline-info mb-3" onClick={loadDrivers}>
                Refresh
              </Button>
              {driverPerformance.length > 0 && (
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverPerformance.map((driver, idx) => (
                      <tr key={idx}>
                        <td>{driver.driver_id ?? '-'}</td>
                        <td>{driver.name}</td>
                        <td>{driver.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="col-md-4 ps-md-4">
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
          </div>
        );
      case 'Data Query':
        return (
          <div className="row">
            <div className="col-md-8 pe-4">
              <div className="mb-4">
                <h4 className="mt-0">Top-k Clients</h4>
                {topKClients.length > 0 && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
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
              </div>
              <div className="mb-4">
                <h4>Car Model Usage</h4>
                {carModelUsage.length > 0 && (
                  <table className="table">
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
              </div>
              <div className="mb-4">
                <h4>Driver Performance</h4>
                {driverPerformance.length > 0 && (
                  <table className="table">
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
              </div>
              <div className="mb-4">
                <h4>Client-Driver City Match</h4>
                {cityMatchResults.length > 0 && (
                  <table className="table">
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
            </div>
            <div className="col-md-4 ps-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Top-k Clients</h5>
                  <form className="mb-2" onSubmit={handleTopKClients}>
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Enter k"
                      value={topK}
                      onChange={(e) => setTopK(e.target.value)}
                      required
                      min="1"
                    />
                    <Button type="submit" className="btn-primary w-100">Submit</Button>
                  </form>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Car Model Usage</h5>
                  <Button className="btn-outline-info w-100" onClick={handleCarModelUsage}>Generate Report</Button>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Driver Performance</h5>
                  <Button className="btn-outline-info w-100" onClick={handleDriverPerformance}>Generate Report</Button>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Client-Driver City Match</h5>
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
                    <Button type="submit" className="btn-primary w-100">Submit</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="mt-4 px-5">
      <h2 className="text-center">Welcome, Manager {name}!</h2>
      <p className="text-center">Select a section below to begin.</p>
      <Tabs
        activeKey={selectedSection}
        onSelect={(k) => setSelectedSection(k)}
        className="mb-3"
      >
        <Tab eventKey="Manage Cars" title="Manage Cars" />
        <Tab eventKey="Manage Models" title="Manage Models" />
        <Tab eventKey="Manage Drivers" title="Manage Drivers" />
        <Tab eventKey="Data Query" title="Data Query" />
      </Tabs>
      <div className="mt-4">{renderContent()}</div>
    </Container>
  );
}

export default ManagerDashboard;