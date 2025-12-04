# E-Voting Project Setup Instructions

Complete setup guide for running the E-Voting application locally.

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
  - **See `NODEJS_SETUP_GUIDE.md` for detailed installation instructions**
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm**: Comes with Node.js
  - Verify installation: `npm --version`
  - If `npm` is not recognized, see `NODEJS_SETUP_GUIDE.md`
- **MySQL**: Version 8.0.0 or higher
  - See `MYSQL_SETUP_GUIDE.md` for detailed installation instructions

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=4000

# Database Configuration
DATABASE_URL="mysql://root:yourpassword@localhost:3306/e_voting"

# JWT Secret (change this in production!)
JWT_SECRET=dev-secret-change-me

# Twilio Configuration (for OTP - optional for development)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=your_twilio_phone_number
```

**Important**: Replace `yourpassword` with your MySQL root password.

### 4. Set Up Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations (creates tables)
npm run prisma:migrate
```

### 5. Run Backend

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
# Build TypeScript
npm run build

# Start server
npm start
```

The backend will run on `http://localhost:4000`

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Frontend

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run preview
```

The frontend will run on `http://localhost:8080` (or the port shown in terminal)

---

## Quick Start (Both Services)

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## Verify Installation

1. **Backend Health Check:**
   - Open browser: http://localhost:4000/health
   - Should return: `{"status":"ok"}`

2. **Frontend:**
   - Open browser: http://localhost:8080
   - Should see the E-Voting application

---

## Common Issues

### Backend Issues

**Error: Cannot connect to MySQL**
- Ensure MySQL service is running
- Check `DATABASE_URL` in `.env` file
- Verify database `e_voting` exists

**Error: Prisma Client not generated**
- Run: `npm run prisma:generate`

**Port 4000 already in use**
- Change `PORT` in `.env` file
- Or stop the process using port 4000

### Frontend Issues

**Error: Cannot connect to backend**
- Ensure backend is running on port 4000
- Check CORS settings in backend
- Verify API endpoints in frontend code

**Port 8080 already in use**
- Vite will automatically use next available port
- Check terminal for actual port number

---

## Project Structure

```
e-voting/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── modules/       # Feature modules
│   │   ├── middlewares/   # Express middlewares
│   │   └── utils/         # Utility functions
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── package.json
│   └── .env               # Environment variables (create this)
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── contexts/      # React contexts
    │   └── lib/          # Utilities
    └── package.json
```

---

## Development Workflow

1. **Start MySQL** (if using XAMPP, start from control panel)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Make changes** - Both services will auto-reload
5. **Database changes**: Update `prisma/schema.prisma`, then run `npm run prisma:migrate`

---

## Production Deployment

### Backend:
```bash
cd backend
npm run build
npm start
```

### Frontend:
```bash
cd frontend
npm run build
# Serve the dist/ folder using a web server
```

---

## Additional Resources

- **Node.js Setup**: See `NODEJS_SETUP_GUIDE.md` (if npm/node commands not working)
- **MySQL Setup**: See `MYSQL_SETUP_GUIDE.md`
- **Backend Requirements**: See `backend/requirements.txt`
- **Frontend Requirements**: See `frontend/requirements.txt`

