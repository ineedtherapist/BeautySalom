# Beauty Salon Management System

A comprehensive web application for managing beauty salons with tools for handling clients, appointments, services, and staff.

## Features

- **Client Management**: Add, edit, and manage client profiles and history
- **Appointment Scheduling**: Create and manage appointments with calendar integration
- **Service Management**: Configure services, prices, and duration
- **Staff Management**: Manage employee profiles, schedules, and specializations
- **User-friendly Interface**: Modern, responsive design for both desktop and mobile use

## Technologies Used

### Frontend
- **React** (v19.1.0) - Modern JavaScript library for building user interfaces
- **React Router DOM** (v7.5.1) - Client-side routing
- **Axios** (v1.8.4) - HTTP client for API requests
- **React Scripts** (v5.0.1) - Scripts and configuration for React applications

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express** (v4.18.2) - Web framework for Node.js
- **MongoDB** (v5.8.0) - NoSQL database
- **Mongoose** (v7.0.0) - MongoDB object modeling for Node.js
- **CORS** (v2.8.5) - Middleware for handling Cross-Origin Resource Sharing
- **Dotenv** (v16.0.0) - Loading environment variables from .env files

## Prerequisites

Before running the project, you need to install:

1. **Node.js** (version 16.x or higher) & **npm** (version 8.x or higher)
   - Download and install from [Node.js official website](https://nodejs.org/)
   - Verify installation with:
     ```
     node -v
     npm -v
     ```

2. **Git** (optional)
   - Install Git from [official website](https://git-scm.com/downloads)
   - Verify installation: `git --version`

## Project Setup

1. **Clone the repository** (if using Git):
   ```
   git clone <repository URL>
   cd beauty-salon-management
   ```

2. **Backend setup**:
   ```
   cd backend
   npm install
   ```

3. **Frontend setup**:
   ```
   cd ../frontend
   npm install
   ```

## Running the Application

### Option 1: Running backend and frontend concurrently (recommended)

1. From the backend directory:
   ```
   cd backend
   npm run dev
   ```
   This command will start both the server (backend) and client (frontend) simultaneously.

### Option 2: Running backend and frontend separately

1. Start the backend:
   ```
   cd backend
   npm start
   ```

2. In a separate terminal, start the frontend:
   ```
   cd frontend
   npm start
   ```

## Accessing the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

## API Endpoints

The application provides the following API endpoints:

- **Clients**
   - `GET /api/clients` - Get all clients
   - `POST /api/clients` - Create a new client
   - `GET /api/clients/:id` - Get a specific client
   - `PUT /api/clients/:id` - Update a client
   - `DELETE /api/clients/:id` - Delete a client

- **Employees**
   - `GET /api/employees` - Get all employees
   - `POST /api/employees` - Create a new employee
   - `GET /api/employees/:id` - Get a specific employee
   - `PUT /api/employees/:id` - Update an employee
   - `DELETE /api/employees/:id` - Delete an employee

- **Services**
   - `GET /api/services` - Get all services
   - `POST /api/services` - Create a new service
   - `GET /api/services/:id` - Get a specific service
   - `PUT /api/services/:id` - Update a service
   - `DELETE /api/services/:id` - Delete a service

- **Appointments**
   - `GET /api/appointments` - Get all appointments
   - `POST /api/appointments` - Create a new appointment
   - `GET /api/appointments/:id` - Get a specific appointment
   - `PUT /api/appointments/:id` - Update an appointment
   - `DELETE /api/appointments/:id` - Delete an appointment

## Troubleshooting

1. **"Port already in use" error**:
   - For Windows: Find and terminate the process using that port
   - For Linux/Mac: `sudo kill -9 $(sudo lsof -t -i:PORT)`
   - Or change the port in the .env file for the backend

2. **MongoDB connection issues**:
   - Ensure MongoDB is running (if using a local instance)
   - Verify the connection string in your .env file
   - Make sure your IP address is whitelisted if using MongoDB Atlas

3. **Package installation errors**:
   - Try deleting the node_modules folder and running `npm install` again
   - Check your npm and Node.js versions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License.
