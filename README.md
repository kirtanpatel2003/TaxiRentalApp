# Taxi Rental Management App

This is a full-stack web application for managing taxi rentals, built using:

- Frontend: React.js and Bootstrap
- Backend: Node.js and Express.js
- Database: PostgreSQL

## Project Structure

/taxi-frontend        (React.js frontend)
/taxi-backend         (Node.js backend)
/backend/config/taxi_rental_db.sql  (SQL file to setup database)

## How to Setup and Run Locally

### 1. Clone the Repository

git clone https://github.com/kirtanpatel2003/TaxiRentalApp.git
cd TaxiRentalApp

### 2. Setup PostgreSQL Database

- Open pgAdmin or use psql.
- Create a new database:

CREATE DATABASE taxi_rental_db;

- Then run the SQL file provided:

Inside pgAdmin:
  - Open Query Tool and load "taxi_rental_db.sql" from backend/config/

OR via command line:

psql -U your_username -d taxi_rental_db -f taxi-backend/config/taxi_rental_db.sql

This will create the necessary tables and insert initial sample data.

### 3. Start Backend Server

cd taxi-backend
npm install
npx nodemon server.js

Backend will run on:

http://localhost:1303/

### 4. Start Frontend Server

cd taxi-frontend
npm install
npm start

If using Node.js version 17 or higher, update your package.json "start" script to:

"start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start"

Frontend will run on:

http://localhost:3000/

## Features

- Manager Registration (Name, SSN, Email)
- Manager Login (using SSN only)
- PostgreSQL Database Integration
- Bootstrap Responsive Design
- Clean API structure

## Notes

- Ensure PostgreSQL is installed locally.
- The SQL file is located in: backend/config/taxi_rental_db.sql
- Keep .env files private (not pushed to GitHub).

## Future Enhancements

- Manager Dashboard after Login
- Driver and Car Management
- Client Booking System
- Admin Reports and Analytics
