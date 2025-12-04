# E-Voting System Setup Guide

This guide will help you set up and run the E-Voting application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify: `node --version`
- **npm** (comes with Node.js)
  - Verify: `npm --version`
- **MySQL** (version 8.0.0 or higher)
  - Download from: https://dev.mysql.com/downloads/mysql/
  - Or use XAMPP: https://www.apachefriends.org/

## Installation Steps

### 1. Install Dependencies

From the project root directory, install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**Note**: This is a Node.js project. Use `npm install` (not `pip install`). See `requirements.txt` for a list of dependencies.

### 2. Set Up Database

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE e_voting;
   ```

2. **Configure Backend Environment**:
   - Navigate to `backend/` directory
   - Create a `.env` file with the following content:
   ```env
   PORT=4000
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/e_voting"
   JWT_SECRET=dev-secret-change-me
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_FROM_NUMBER=
   ```
   - Replace `yourpassword` with your MySQL root password

3. **Run Database Migrations**:
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

### 3. Run the Application

You need to run both backend and frontend servers. Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:8080` (or the port shown in terminal)

### 4. Access the Application

- **Frontend**: Open `http://localhost:8080` in your browser
- **Backend API**: `http://localhost:4000`
- **Health Check**: `http://localhost:4000/health`

## Project Structure

```
e-voting/
├── backend/          # Node.js/Express backend
│   ├── src/          # Source code
│   ├── prisma/       # Database schema and migrations
│   └── package.json  # Backend dependencies
├── frontend/         # React frontend
│   ├── src/          # Source code
│   └── package.json  # Frontend dependencies
├── .gitignore        # Git ignore rules
├── setup.md          # This file
└── requirements.txt  # Dependency list (for reference)
```

## Common Issues

### Backend Issues

**Cannot connect to MySQL:**
- Ensure MySQL service is running
- Check `DATABASE_URL` in `.env` file
- Verify database `e_voting` exists

**Prisma errors:**
- Run: `npm run prisma:generate`
- Then: `npm run prisma:migrate`

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend is running on port 4000
- Check CORS settings in backend

**Port already in use:**
- Backend: Change `PORT` in `.env` file
- Frontend: Vite will automatically use next available port

## Development Commands

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with test data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Additional Resources

- For detailed setup instructions, see `SETUP_INSTRUCTIONS.md`
- For quick start guide, see `QUICK_START.md`
- For Node.js installation help, see `NODEJS_SETUP_GUIDE.md`
- For MySQL setup help, see `MYSQL_SETUP_GUIDE.md`

## Next Steps

1. Access the frontend at `http://localhost:8080`
2. Register a new account or use seeded test accounts
3. Explore the admin, candidate, and voter dashboards

