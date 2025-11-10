# BobaPOS - Point of Sale System

A full-stack point of sale application for a boba tea shop, built with React (frontend) and Node.js/Express (backend).

## Prerequisites

Before setting up the project, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
- **Git** (optional, for cloning the repository)

## Project Structure

```
Project3/
├── backend/          # Node.js/Express API server
├── frontend/         # React + TypeScript frontend
└── README.md         # This file
```

## Setup Instructions

### 1. Database Setup

1. Install and start PostgreSQL on your system
2. Create a new database for the project:
   ```sql
   CREATE DATABASE bobapos;
   ```
3. (Optional) Create a PostgreSQL user with appropriate permissions, or use your default PostgreSQL user

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=3000
   PSQL_USER=your_postgres_username
   PSQL_HOST=localhost
   PSQL_DATABASE=bobapos
   PSQL_PASSWORD=your_postgres_password
   PSQL_PORT=5432
   ```
   
   Replace the values with your actual PostgreSQL credentials:
   - `PSQL_USER`: Your PostgreSQL username (default is often `postgres`)
   - `PSQL_HOST`: Usually `localhost` for local development
   - `PSQL_DATABASE`: The name of the database you created (e.g., `bobapos`)
   - `PSQL_PASSWORD`: Your PostgreSQL password
   - `PSQL_PORT`: PostgreSQL port (default is `5432`)

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

1. Open a terminal/command prompt
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Start the server:
   ```bash
   npm start
   ```
   
   The backend server will run on `http://localhost:3000`

### Start the Frontend Development Server

1. Open a **new** terminal/command prompt (keep the backend running)
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will typically run on `http://localhost:5173` (Vite's default port)

### Access the Application

Once both servers are running:
- Open your web browser
- Navigate to the frontend URL (usually `http://localhost:5173`)
- The frontend will automatically connect to the backend API at `http://localhost:3000`

## Available Scripts

### Backend
- `npm start` - Starts the Express server

### Frontend
- `npm run dev` - Starts the Vite development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Backend won't start
- Make sure PostgreSQL is running
- Verify your `.env` file exists in the `backend/` directory with correct credentials
- Check that the database exists and is accessible with the provided credentials
- Ensure port 3000 is not already in use

### Frontend can't connect to backend
- Verify the backend server is running on `http://localhost:3000`
- Check that the API base URL in `frontend/src/api/config.ts` matches your backend URL
- Ensure CORS is properly configured (should be enabled by default)

### Database connection errors
- Verify PostgreSQL is installed and running
- Check that your database credentials in `.env` are correct
- Ensure the database exists: `psql -U your_username -l` to list databases
- Test connection manually: `psql -U your_username -d bobapos`

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, React Router
- **Backend**: Node.js, Express, PostgreSQL (pg)
- **Database**: PostgreSQL

## Notes

- The backend uses port 3000 by default
- The frontend uses Vite's default port (usually 5173)
- Make sure both servers are running simultaneously for the app to work properly
- The `.env` file should never be committed to version control (add it to `.gitignore`)

