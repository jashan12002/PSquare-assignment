# HRMS Dashboard

A comprehensive HR Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) with vanilla CSS.

## Features

- Authentication and Authorization with JWT
- Candidate Management
- Employee Management
- Attendance Management
- Leave Management
- Responsive Design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd hrms-dashboard
```

2. Install dependencies
```
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. Environment Variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/hrms
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Running the application
```
# Run both frontend and backend
npm run dev

# Run only backend
npm run server

# Run only frontend
npm run client
```

5. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create a new candidate
- `PUT /api/candidates/:id` - Update candidate status
- `DELETE /api/candidates/:id` - Delete a candidate
- `POST /api/candidates/:id/hire` - Move candidate to employee

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete an employee

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/employee/:id` - Get attendance by employee
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record

### Leaves
- `GET /api/leaves` - Get all leave requests
- `GET /api/leaves/approved` - Get approved leaves
- `GET /api/leaves/employee/:id` - Get leaves by employee
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Update leave status
- `DELETE /api/leaves/:id` - Delete leave request 