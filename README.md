# VoteSecure – E-Voting System

A secure, full-stack electronic voting system built with **React**, **TypeScript**, **Node.js**, and **MySQL**. The system provides role-based interfaces for **voters**, **candidates**, and **administrators** with complete backend integration, phone verification, and real-time election management.

---

## 🎯 Features

### User Management
- **User Registration** with email, phone, password, and date of birth (age ≥ 18)
- **Phone Verification** via OTP (Twilio SMS integration)
- **Admin Approval** workflow for new users
- **JWT-based Authentication** with role-based access control
- **Secure Password Hashing** using bcrypt

### Voting System
- **Election Management** - Create, activate, and manage elections
- **Candidate Nominations** - Submit and approve candidate applications
- **Vote Casting** - Secure voting with duplicate prevention
- **Real-time Results** - View election results with dynamic turnout calculation
- **Candidate Self-Voting** - Candidates can vote for themselves or other candidates

### Role-Based Dashboards

#### 👤 Voter
- View available elections
- Cast votes for candidates
- View published election results
- Submit nominations to become a candidate

#### 🎯 Candidate
- View elections where running as candidate
- Cast votes (including voting for themselves)
- View election results
- Manage candidacy status

#### 👨‍💼 Admin
- **User Management** - Approve/reject voters and candidates
- **Election Management** - Create, edit, activate/deactivate elections
- **Candidate Management** - Approve/reject candidate nominations
- **Results Dashboard** - View comprehensive results with turnout statistics
- **System Statistics** - View total voters, candidates, votes, and elections

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18.0.0+)
- **Framework**: Express.js (v4.21.2)
- **Language**: TypeScript (v5.8.3)
- **Database**: MySQL (v8.0.0+) with Prisma ORM (v6.0.0)
- **Authentication**: JWT (jsonwebtoken v9.0.2)
- **Security**: bcryptjs (v2.4.3) for password hashing
- **OTP Service**: Twilio (v5.4.1) for SMS verification
- **Utilities**: dotenv, date-fns, cors

### Frontend
- **Framework**: React (v18.3.1) with TypeScript
- **Build Tool**: Vite (v7.2.6)
- **UI Framework**: Tailwind CSS (v3.4.17)
- **Component Library**: shadcn/ui with Radix UI primitives
- **Routing**: react-router-dom (v6.30.1)
- **State Management**: React Context API
- **Data Fetching**: @tanstack/react-query (v5.83.0)
- **Forms**: react-hook-form (v7.61.1) with zod validation
- **Icons**: lucide-react
- **Notifications**: sonner

---

## 📁 Project Structure

```
e-voting/
├── backend/                    # Node.js/Express Backend
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication & registration
│   │   │   ├── admin/         # Admin operations
│   │   │   ├── elections/     # Election management
│   │   │   ├── candidates/    # Candidate management
│   │   │   ├── votes/         # Voting system
│   │   │   └── otp/           # OTP service
│   │   ├── middlewares/       # Express middlewares
│   │   ├── config/            # Configuration files
│   │   └── utils/             # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   └── package.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── voter/         # Voter pages
│   │   │   ├── candidate/     # Candidate pages
│   │   │   └── admin/         # Admin pages
│   │   ├── components/        # Reusable components
│   │   │   ├── layout/        # Layout components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── contexts/          # React contexts
│   │   ├── lib/               # Utilities & API client
│   │   └── types/             # TypeScript types
│   └── package.json
│
├── .gitignore                 # Git ignore rules
├── setup.md                   # Detailed setup guide
├── requirements.txt           # Dependency list
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0 ([Download](https://nodejs.org/))
- **MySQL** ≥ 8.0.0 ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** (comes with Node.js)
- **Twilio Account** (optional, for OTP functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-voting
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=4000
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/e_voting"
   JWT_SECRET=your-secret-key-change-in-production
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_FROM_NUMBER=your_twilio_phone_number
   ```

4. **Set up Database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE e_voting;
   
   # Run migrations
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:8080` (or port shown in terminal)

### Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

---

## 📖 Usage

### Registration & Login

1. **Register** a new account with email, phone, password, and role (VOTER or CANDIDATE)
2. **Verify Phone** using the OTP code sent via SMS
3. **Wait for Admin Approval** (admin must approve your account)
4. **Login** with phone number and password

### Voting Process

1. **Select an Election** from available active elections
2. **View Candidates** running in the election
3. **Cast Your Vote** - Select a candidate and confirm
4. **View Results** - See results once published by admin

### Admin Functions

- **Validate Voters**: Approve/reject pending user registrations
- **Manage Elections**: Create, edit, activate/deactivate elections
- **Manage Candidates**: Approve/reject candidate nominations
- **View Results**: Access comprehensive election results with turnout statistics
- **User Management**: View and manage all system users

---

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Phone Verification**: OTP-based phone number verification
- **Role-Based Access Control**: Protected routes based on user roles
- **Duplicate Vote Prevention**: One vote per election per user
- **Election Date Validation**: Votes only accepted during active election periods
- **Admin Approval**: New users require admin verification

---

## 📊 Database Schema

### Models
- **User**: Stores user accounts (voters, candidates, admins)
- **Election**: Stores election information and settings
- **Candidate**: Stores candidate nominations and status
- **Vote**: Stores individual votes with timestamps
- **OtpCode**: Stores OTP codes for phone verification

### Enums
- **UserRole**: VOTER, CANDIDATE, ADMIN
- **CandidateStatus**: PENDING, APPROVED, REJECTED
- **OtpType**: REGISTRATION, LOGIN

---

## 🛠️ Development Scripts

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with test data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🔄 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/verify-otp` - Verify phone with OTP
- `POST /auth/login` - User login

### Elections
- `GET /elections` - Get all elections
- `GET /elections/:id` - Get election by ID
- `POST /elections` - Create election (Admin only)
- `PUT /elections/:id` - Update election (Admin only)

### Candidates
- `GET /candidates` - Get all candidates
- `GET /candidates/election/:electionId` - Get candidates by election
- `POST /candidates/nominate` - Submit nomination
- `PUT /candidates/:id/approve` - Approve candidate (Admin only)

### Votes
- `POST /votes/cast` - Cast a vote
- `GET /votes/history` - Get vote history
- `GET /votes/has-voted/:electionId` - Check if user has voted
- `GET /votes/results/:electionId` - Get election results

### Admin
- `GET /admin/stats` - Get system statistics
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id/approve` - Approve user
- `DELETE /admin/users/:id` - Delete user

---

## 📝 Key Features

### Dynamic Turnout Calculation
Election results display real-time turnout percentage calculated as:
```
Turnout % = (Total Votes / Total Eligible Voters) × 100
```

### Candidate Self-Voting
Candidates can vote for themselves or any other candidate in elections where they are running.

### Real-time Results
- Vote counts per candidate
- Percentage of votes
- Total votes cast
- Turnout percentage
- Winner identification

---

## 🐛 Troubleshooting

### Backend Issues

**Cannot connect to MySQL:**
- Ensure MySQL service is running
- Verify `DATABASE_URL` in `.env` file
- Check database `e_voting` exists

**Prisma errors:**
- Run: `npm run prisma:generate`
- Then: `npm run prisma:migrate`

**Port 4000 already in use:**
- Change `PORT` in `.env` file
- Or stop the process using port 4000

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend is running on port 4000
- Check CORS settings in backend
- Verify API URL in frontend `.env` (if configured)

**Port already in use:**
- Vite will automatically use next available port
- Check terminal for actual port number

---

## 📚 Additional Documentation

- **Setup Guide**: See `setup.md` for detailed setup instructions
- **Quick Start**: See `QUICK_START.md` for quick setup guide
- **Requirements**: See `requirements.txt` for dependency list
- **Project Requirements**: See `PROJECT_REQUIREMENTS.md` for detailed specifications

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- Your Name - Initial work

---

## 🙏 Acknowledgments

- shadcn/ui for the excellent component library
- Prisma for the amazing ORM
- React team for the fantastic framework
- All contributors and users of this project

---

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Note**: This is a full-stack application with real backend integration. Make sure both backend and frontend servers are running for the application to work properly.
