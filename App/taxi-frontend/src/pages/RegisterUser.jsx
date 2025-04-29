import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

function RegisterUser() {
  const [role, setRole] = useState('manager');
  const [formData, setFormData] = useState({
    name: '',
    ssn: '',
    email: '',
    addresses: [{ road_name: '', number: '', city: '' }],
    creditCard: { card_number: '', address: '' }
  });
  const [message, setMessage] = useState('');

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setFormData({
      name: '',
      ssn: '',
      email: '',
      addresses: [{ road_name: '', number: '', city: '' }],
      creditCard: { card_number: '', address: '' }
    });
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, e) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][e.target.name] = e.target.value;
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, { road_name: '', number: '', city: '' }]
    });
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleCreditCardChange = (e) => {
    setFormData({
      ...formData,
      creditCard: { ...formData.creditCard, [e.target.name]: e.target.value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'client') {
      if (formData.addresses.length === 0 || formData.addresses.some(addr => !addr.road_name || !addr.number || !addr.city)) {
        setMessage('Please provide at least one complete address.');
        return;
      }
    }
    const endpoint = role === 'manager' ? '/api/register-manager' : '/api/register-client';
    let payload;
    if (role === 'manager') {
      payload = formData;
    } else {
      payload = {
        name: formData.name,
        email: formData.email,
        addresses: formData.addresses,
        creditCard: formData.creditCard
      };
    }
    try {
      const response = await axios.post(`http://localhost:1303${endpoint}`, payload, { withCredentials: true });
      setMessage(response.data.message);
      setFormData({
        name: '',
        ssn: '',
        email: '',
        addresses: [{ road_name: '', number: '', city: '' }],
        creditCard: { card_number: '', address: '' }
      });
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Register {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formRole">
          <Form.Label>Register as:</Form.Label>
          <Form.Select value={role} onChange={handleRoleChange}>
            <option value="manager">Manager</option>
            <option value="client">Client</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        {role === 'manager' && (
          <Form.Group className="mb-3" controlId="formSSN">
            <Form.Label>SSN</Form.Label>
            <Form.Control
              type="text"
              name="ssn"
              value={formData.ssn}
              onChange={handleChange}
              placeholder="Enter your SSN"
              required
            />
          </Form.Group>
        )}

        <Form.Group className="mb-4" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        {role === 'client' && (
          <>
            <Form.Label>Addresses</Form.Label>
            {formData.addresses.map((address, index) => (
              <div key={index} className="mb-3 border rounded p-3">
                <Form.Group className="mb-2" controlId={`roadName-${index}`}>
                  <Form.Label>Road Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="road_name"
                    value={address.road_name}
                    onChange={(e) => handleAddressChange(index, e)}
                    placeholder="Enter road name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2" controlId={`number-${index}`}>
                  <Form.Label>Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="number"
                    value={address.number}
                    onChange={(e) => handleAddressChange(index, e)}
                    placeholder="Enter number"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2" controlId={`city-${index}`}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, e)}
                    placeholder="Enter city"
                    required
                  />
                </Form.Group>
                {formData.addresses.length > 1 && (
                  <Button variant="danger" size="sm" onClick={() => handleRemoveAddress(index)}>
                    Remove Address
                  </Button>
                )}
              </div>
            ))}
            <Button variant="secondary" onClick={handleAddAddress} className="mb-4">
              Add Address
            </Button>

            <br />

            <Form.Label>Credit Card</Form.Label>
            <Form.Group className="mb-3" controlId="cardNumber">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                name="card_number"
                value={formData.creditCard.card_number}
                onChange={handleCreditCardChange}
                placeholder="Enter card number"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="paymentAddress">
              <Form.Label>Payment Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.creditCard.address}
                onChange={handleCreditCardChange}
                placeholder="Enter payment address"
                required
              />
            </Form.Group>
          </>
        )}

        <Button variant="primary" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default RegisterUser;
