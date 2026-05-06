# CRM Rashmi Portal

Frontend for the CRM Lead Management System built for the SE Internship assessment.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

## Features
- Login with JWT authentication
- Dashboard with live stats
- Leads list with search and filters
- Create, edit, delete leads
- Lead detail view
- Add and delete notes
- Filter by status, source, assigned salesperson

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/crm-rashmi-portal.git
cd crm-rashmi-portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the app
```bash
npm run dev
```

App runs on http://localhost:5173

> Make sure crm-rashmi-service backend is running on port 5000 first.

## Test Credentials
| Email | Password |
|-------|----------|
| admin@example.com | password123 |

## Environment
No .env needed. API base URL is set to http://localhost:5000/api in src/api/axios.js

## Known Limitations
- Not deployed (runs locally only)
- No pagination
- No dark mode

## Reflection
Building the frontend taught me how to manage global auth state using React Context,
and how to connect a React app to a REST API using Axios interceptors for automatic
JWT token injection on every request.

