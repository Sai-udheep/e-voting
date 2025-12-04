# Backend-Frontend Connection Guide

## ✅ Registration Flow - Connected!

The registration functionality is now fully connected between frontend and backend.

### Flow:
1. **User fills registration form** → Frontend (`Register.tsx`)
2. **User clicks "Register & Send OTP"** → Calls `authApi.register()`
3. **Backend receives request** → `/auth/register` endpoint
4. **Backend creates user** → Stores in database, sends OTP via Twilio
5. **Frontend shows OTP input** → User enters 6-digit code
6. **User clicks "Verify OTP"** → Calls `authApi.verifyOtp()`
7. **Backend verifies OTP** → Updates `isPhoneVerified` to true
8. **User waits for admin approval** → Redirected to login page

---

## 🔌 API Endpoints

### Base URL
- **Development**: `http://localhost:4000`
- **Production**: Set via `VITE_API_URL` environment variable

### Endpoints

#### 1. Register User
```
POST /auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "VOTER" | "CANDIDATE"
}

Response:
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "VOTER"
  },
  "message": "Registered successfully. OTP sent to phone."
}
```

#### 2. Verify OTP
```
POST /auth/verify-otp
Content-Type: application/json

Body:
{
  "phone": "9876543210",
  "code": "123456"
}

Response:
{
  "message": "Phone verified. Waiting for admin approval."
}
```

#### 3. Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "phone": "9876543210",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "VOTER"
  }
}
```

---

## 📁 Files Created/Modified

### Frontend Files

1. **`frontend/src/lib/api.ts`** (NEW)
   - API utility functions
   - Handles HTTP requests to backend
   - Manages authentication tokens

2. **`frontend/src/contexts/AuthContext.tsx`** (UPDATED)
   - Replaced mock data with real API calls
   - Added `verifyOtp` function
   - Handles JWT token storage
   - Maps backend roles to frontend roles

3. **`frontend/src/pages/Register.tsx`** (UPDATED)
   - Two-step registration flow
   - Step 1: Register and send OTP
   - Step 2: Verify OTP
   - Added role selection (Voter/Candidate)
   - Better error handling and loading states

4. **`frontend/src/types/index.ts`** (UPDATED)
   - Added `verifyOtp` to `AuthContextType`
   - Updated `register` function signature

### Backend Files (Already Complete)

- `backend/src/modules/auth/auth.routes.ts` - Route definitions
- `backend/src/modules/auth/auth.controller.ts` - Request handlers
- `backend/src/modules/auth/auth.service.ts` - Business logic
- `backend/src/modules/otp/otp.service.ts` - OTP generation and verification

---

## 🚀 Testing the Connection

### 1. Start Backend
```powershell
cd backend
npm run dev
```
Backend should run on `http://localhost:4000`

### 2. Start Frontend
```powershell
cd frontend
npm run dev
```
Frontend should run on `http://localhost:8080` (or next available port)

### 3. Test Registration

1. Go to `http://localhost:8080/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Role: Voter
   - Password: test123
3. Click "Register & Send OTP"
4. Check backend console for OTP (if Twilio not configured, OTP will be in database)
5. Enter OTP code
6. Click "Verify OTP"
7. Should redirect to login page

### 4. Check Database

```sql
SELECT * FROM User WHERE phone = '9876543210';
SELECT * FROM OtpCode WHERE phone = '9876543210' ORDER BY createdAt DESC;
```

---

## ⚙️ Configuration

### Frontend Environment Variables

Create `frontend/.env` (optional):
```env
VITE_API_URL=http://localhost:4000
```

If not set, defaults to `http://localhost:4000`

### Backend Environment Variables

Ensure `backend/.env` has:
```env
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/e_voting"
JWT_SECRET=your-secret-key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_FROM_NUMBER=your_twilio_number
```

**Note**: Twilio is optional. If not configured, OTP will be generated but not sent via SMS. You can check the database for OTP codes.

---

## 🔒 Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt (10 salt rounds)
2. **JWT Tokens**: Authentication uses JWT tokens stored in localStorage
3. **OTP Expiration**: OTP codes expire after 10 minutes
4. **OTP Single Use**: Each OTP can only be used once
5. **Role-Based Access**: Backend validates user roles
6. **Input Validation**: Backend validates all inputs

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Backend CORS is already configured in `app.ts`. Make sure backend is running.

### Issue: Network Error
**Solution**: 
- Check if backend is running on port 4000
- Check browser console for exact error
- Verify `VITE_API_URL` if using custom port

### Issue: OTP Not Received
**Solution**:
- Check Twilio configuration in `.env`
- If Twilio not configured, check database for OTP:
  ```sql
  SELECT * FROM OtpCode WHERE phone = 'your_phone' ORDER BY createdAt DESC LIMIT 1;
  ```

### Issue: Registration Fails
**Solution**:
- Check backend console for errors
- Verify database connection
- Ensure all required fields are filled
- Check if email/phone already exists

### Issue: Token Not Stored
**Solution**:
- Check browser localStorage
- Verify JWT_SECRET is set in backend `.env`
- Check browser console for errors

---

## 📝 Next Steps

1. ✅ Registration - **COMPLETE**
2. ⏳ Login - Connect frontend login to backend
3. ⏳ Protected Routes - Use JWT token for authentication
4. ⏳ Admin Functions - Connect admin endpoints
5. ⏳ Voting Functions - Connect voting endpoints

---

## 🔄 Role Mapping

| Frontend Role | Backend Role |
|--------------|-------------|
| `voter` | `VOTER` |
| `candidate` | `CANDIDATE` |
| `admin` | `ADMIN` |

The AuthContext automatically maps between frontend and backend role formats.

