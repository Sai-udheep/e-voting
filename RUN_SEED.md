# How to Run Seed Script - Add Sample Users to Database

## 🚀 Quick Start

Run this command to add sample users (Voter, Candidate, Admin) to your database:

```powershell
cd backend
npm run prisma:seed
```

## 📋 What the Seed Script Does

The seed script creates 3 test users with the following credentials:

| Role | Phone | Password | Email | Status |
|------|-------|----------|-------|--------|
| **Voter** | 9876543210 | voter123 | voter@example.com | ✅ Verified & OTP Verified |
| **Candidate** | 9876543211 | candidate123 | candidate@example.com | ✅ Verified & OTP Verified |
| **Admin** | 9876543212 | admin123 | admin@example.com | ✅ Verified & OTP Verified |

## ✅ User Status

All users created by the seed script are:
- ✅ **isPhoneVerified: true** - Phone OTP verified
- ✅ **isVerified: true** - Admin approved
- ✅ **Ready to login** - Can login immediately

## 🔄 Running the Seed Script

### Step 1: Navigate to Backend
```powershell
cd backend
```

### Step 2: Make sure Prisma Client is generated
```powershell
npm run prisma:generate
```

### Step 3: Run the seed script
```powershell
npm run prisma:seed
```

You should see output like:
```
🌱 Seeding database...
✅ Created/Updated voter user: 9876543210
✅ Created/Updated candidate user: 9876543211
✅ Created/Updated admin user: 9876543212

📋 Test Users Created:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Voter:
   Phone: 9876543210
   Password: voter123
   Email: voter@example.com

👤 Candidate:
   Phone: 9876543211
   Password: candidate123
   Email: candidate@example.com

👤 Admin:
   Phone: 9876543212
   Password: admin123
   Email: admin@example.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Seeding completed!
```

## 🔍 Verify Users in Database

### Using MySQL:
```sql
USE e_voting;
SELECT id, name, email, phone, role, isVerified, isPhoneVerified FROM User;
```

### Using Prisma Studio:
```powershell
cd backend
npx prisma studio
```
Then open `http://localhost:5555` and check the `User` table.

## 🧪 Test Login

After running the seed script, you can login with:

**Admin:**
- Phone: `9876543212`
- Password: `admin123`
- Role: `admin`

**Voter:**
- Phone: `9876543210`
- Password: `voter123`
- Role: `voter`

**Candidate:**
- Phone: `9876543211`
- Password: `candidate123`
- Role: `candidate`

## 🔄 Re-running Seed

The seed script uses `upsert`, which means:
- If a user with the same phone exists, it will be **updated**
- If a user doesn't exist, it will be **created**
- You can safely run it multiple times

## 🐛 Troubleshooting

### Error: "Prisma Client not generated"
**Solution:**
```powershell
npm run prisma:generate
```

### Error: "Cannot connect to database"
**Solution:**
- Check your `.env` file has correct `DATABASE_URL`
- Make sure MySQL is running
- Verify database `e_voting` exists

### Error: "Users still can't login"
**Solution:**
1. Check users exist: `SELECT * FROM User;`
2. Verify `isPhoneVerified = 1` and `isVerified = 1`
3. Make sure phone numbers match exactly (no spaces/dashes)
4. Check password hash is correct

### Users not showing up
**Solution:**
- Run seed script again: `npm run prisma:seed`
- Check database connection
- Verify Prisma migrations are applied: `npm run prisma:migrate`

## 📝 Notes

- Phone numbers are normalized (digits only) before storage
- Passwords are hashed using bcrypt (10 salt rounds)
- All users are pre-verified for easy testing
- Seed script is safe to run multiple times

---

**After running the seed script, you should be able to login with the admin credentials!** ✅

