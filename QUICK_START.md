# Quick Start Guide - Run Backend & Frontend

## 🚀 Running the Backend

### Step 1: Navigate to Backend Directory
```powershell
cd backend
```

### Step 2: Create Environment File (.env)
Create a file named `.env` in the `backend` folder with this content:

```env
PORT=4000
DATABASE_URL="mysql://root:yourpassword@localhost:3306/e_voting"
JWT_SECRET=dev-secret-change-me
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
```

**Important**: 
- Replace `yourpassword` with your MySQL root password
- If you haven't set up MySQL yet, see `MYSQL_SETUP_GUIDE.md`
- Twilio fields can be left empty for now (needed only for OTP)

### Step 3: Set Up Database (First Time Only)
```powershell
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Add test users (Admin, Voter, Candidate)
npm run prisma:seed
```

**Note**: 
- Make sure MySQL is running and the database `e_voting` exists before running migrations
- The seed script creates test users with phone numbers matching the frontend (see `SEED_USERS.md` for details)

### Step 4: Run Backend Server
```powershell
npm run dev
```

You should see:
```
Server is running on http://localhost:4000
```

✅ **Backend is now running!** Keep this terminal open.

---

## 🎨 Running the Frontend

### Step 1: Open a NEW Terminal/PowerShell Window
Keep the backend terminal running, open a new one.

### Step 2: Navigate to Frontend Directory
```powershell
cd C:\Users\hp\e-voting\frontend
```

### Step 3: Install Frontend Dependencies (First Time Only)
```powershell
npm install
```

This will take a few minutes the first time.

### Step 4: Run Frontend Server
```powershell
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

✅ **Frontend is now running!**

---

## 🌐 Access Your Application

1. **Frontend**: Open browser and go to `http://localhost:8080`
2. **Backend API**: `http://localhost:4000`
3. **Backend Health Check**: `http://localhost:4000/health`

---

## 📝 Summary - What You Need

### Terminal 1 (Backend):
```powershell
cd backend
# Create .env file (see Step 2 above)
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Terminal 2 (Frontend):
```powershell
cd frontend
npm install
npm run dev
```

---

## ⚠️ Common Issues

### Backend Issues:

**Error: "Cannot connect to MySQL"**
- Make sure MySQL is running
- Check your `.env` file - `DATABASE_URL` should be correct
- Verify database `e_voting` exists

**Error: "Prisma Client not generated"**
- Run: `npm run prisma:generate`

**Error: "Port 4000 already in use"**
- Another process is using port 4000
- Change `PORT=4000` to `PORT=4001` in `.env` file

### Frontend Issues:

**Error: "Cannot connect to backend"**
- Make sure backend is running on port 4000
- Check backend terminal for any errors

**Error: "Port 8080 already in use"**
- Vite will automatically use the next available port (8081, 8082, etc.)
- Check the terminal output for the actual port number

---

## 🛑 Stopping the Servers

- Press `Ctrl + C` in each terminal to stop the servers
- Or simply close the terminal windows

---

## 🔄 Next Time You Run

After the first setup, you only need:

**Terminal 1:**
```powershell
cd backend
npm run dev
```

**Terminal 2:**
```powershell
cd frontend
npm run dev
```

No need to run `npm install`, `prisma:generate`, or `prisma:migrate` again unless you add new dependencies or change the database schema.

**Note**: If you need to re-seed users, run `npm run prisma:seed` in the backend folder.

