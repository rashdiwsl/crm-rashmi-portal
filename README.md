# CRM Rashmi Portal

Frontend for the CRM Lead Management System built for the SE Internship assessment.

## Live Demo
- Frontend: https://crm-rashmi-portal.vercel.app
- Backend API: https://crm-rashmi-service.onrender.com

## Test Credentials
| Email | Password |
|-------|----------|
| admin@example.com | password123 |

## Tech Stack
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React (icons)

## Features
- Login with JWT authentication
- Dashboard with live stats (total leads, new, qualified, won, lost, pipeline value)
- Leads list with search and filters
- Create, edit, delete leads
- Lead detail view
- Add and delete notes per lead
- Filter by status, source, assigned salesperson
- Search by name, company, email
- Protected routes (redirects to login if not authenticated)

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/rashdiwsl/crm-rashmi-portal.git
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

## Environment Variables
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL (default: http://localhost:5000/api) |

For local development no .env needed.
For production set VITE_API_URL to your deployed backend URL.

## Project Structure
src/
├── api/          # Axios instance with JWT interceptor
├── components/   # Navbar, Sidebar, LeadStatusBadge
├── context/      # AuthContext for global auth state
└── pages/        # Login, Dashboard, Leads, LeadDetail, LeadForm

## Known Limitations
- Render free tier backend may take 30 seconds to wake up on first request
- No pagination on leads list
- Not mobile optimized

## Reflection
Building the frontend taught me how to manage global authentication state using React Context API, and how to connect a React app to a REST API using Axios interceptors for automatic JWT token injection on every request. The most interesting challenge was handling protected routes and automatic logout when the token expires.