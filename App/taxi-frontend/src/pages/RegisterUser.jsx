import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RegisterUser() {
  const [role, setRole] = useState('manager');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    ssn: '',
    email: '',
    addresses: [{ road_name: '', number: '', city: '' }],
    creditCard: { card_number: '', address: '' }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      ssn: '',
      email: '',
      addresses: [{ road_name: '', number: '', city: '' }],
      creditCard: { card_number: '', address: '' }
    });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setMessage('');
    resetForm();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, e) => {
    const updated = [...formData.addresses];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, addresses: updated });
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, { road_name: '', number: '', city: '' }]
    });
  };

  const removeAddress = (index) => {
    const filtered = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: filtered });
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
      if (formData.addresses.length === 0 || formData.addresses.some(a => !a.road_name || !a.number || !a.city)) {
        setMessage('Please fill out all address fields.');
        return;
      }
    }

    const endpoint = role === 'manager' ? '/api/register-manager' : '/api/register-client';
    const payload = role === 'manager'
      ? formData
      : {
          name: formData.name,
          email: formData.email,
          addresses: formData.addresses,
          creditCard: formData.creditCard
        };

    try {
      const res = await axios.post(`http://localhost:1303${endpoint}`, payload, { withCredentials: true });
      setMessage(res.data.message);
      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '550px' }}>
      <h2 className="text-center mb-4">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Register as:</Form.Label>
          <Form.Select value={role} onChange={handleRoleChange}>
            <option value="manager">Manager</option>
            <option value="client">Client</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        {role === 'manager' && (
          <Form.Group className="mb-3">
            <Form.Label>SSN</Form.Label>
            <Form.Control
              name="ssn"
              value={formData.ssn}
              onChange={handleChange}
              placeholder="Enter SSN"
              required
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
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
            <h5 className="mt-4">Addresses</h5>
            {formData.addresses.map((address, index) => (
              <div key={index} className="p-3 border rounded mb-3">
                <Form.Group className="mb-2">
                  <Form.Label>Road Name</Form.Label>
                  <Form.Control
                    name="road_name"
                    value={address.road_name}
                    onChange={(e) => handleAddressChange(index, e)}
                    placeholder="e.g. Elm Street"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Number</Form.Label>
                  <Form.Control
                    name="number"
                    value={address.number}
                    onChange={(e) => handleAddressChange(index, e)}
                    placeholder="e.g. 101"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name="city"
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, e)}
                    placeholder="e.g. Chicago"
                    required
                  />
                </Form.Group>
                {formData.addresses.length > 1 && (
                  <Button variant="outline-danger" size="sm" onClick={() => removeAddress(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="secondary" onClick={addAddress} className="mb-4">Add Another Address</Button>

            <h5 className="mt-3">Credit Card</h5>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                name="card_number"
                value={formData.creditCard.card_number}
                onChange={handleCreditCardChange}
                placeholder="Enter card number"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Billing Address</Form.Label>
              <Form.Control
                name="address"
                value={formData.creditCard.address}
                onChange={handleCreditCardChange}
                placeholder="Enter billing address"
                required
              />
            </Form.Group>
          </>
        )}

        <Button variant="primary" type="submit" className="w-100">Register</Button>
      </Form>

      <div className="text-center mt-3">
        <Link to="/" className="btn btn-outline-secondary">Back to Home</Link>
      </div>
    </Container>
  );
}

export default RegisterUser;
