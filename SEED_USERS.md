# Seed Users - Add Test Users to Database

This guide explains how to add the test users (Admin, Voter, Candidate) to your database.

## 📋 Test Users

The following users will be created in the database:

| Role | Phone | Password | Email | Name |
|------|-------|----------|-------|------|
| **Voter** | 9876543210 | voter123 | voter@example.com | John Smith |
| **Candidate** | 9876543211 | candidate123 | candidate@example.com | Sarah Johnson |
| **Admin** | 9876543212 | admin123 | admin@example.com | Admin User |

## 🚀 How to Seed Users

### Step 1: Make sure dependencies are installed
```powershell
cd backend
npm install
```

### Step 2: Make sure Prisma Client is generated
```powershell
npm run prisma:generate
```

### Step 3: Make sure database is set up
```powershell
# Make sure MySQL is running
# Make sure .env file has correct DATABASE_URL
npm run prisma:migrate
```

### Step 4: Run the seed script
```powershell
npm run prisma:seed
```

You should see output like:
```
🌱 Seeding database...
✅ Created voter user: 9876543210
✅ Created candidate user: 9876543211
✅ Created admin user: 9876543212

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

## ✅ Verify Users

After seeding, you can verify the users were created by:

1. **Using Prisma Studio** (Visual Database Browser):
   ```powershell
   npx prisma studio
   ```
   This will open a browser at `http://localhost:5555` where you can view all users.

2. **Using MySQL directly**:
   ```sql
   USE e_voting;
   SELECT name, email, phone, role, isVerified, isPhoneVerified FROM User;
   ```

## 🔄 Re-running Seed

The seed script uses `upsert`, which means:
- If a user with the same phone number exists, it will be **updated**
- If a user doesn't exist, it will be **created**

You can safely run `npm run prisma:seed` multiple times without creating duplicates.

## 🧪 Testing Login

After seeding, you can test login in the frontend:

1. Start the backend: `npm run dev` (in backend folder)
2. Start the frontend: `npm run dev` (in frontend folder)
3. Go to `http://localhost:8080/login`
4. Try logging in with:
   - **Voter**: Phone `9876543210`, Password `voter123`
   - **Candidate**: Phone `9876543211`, Password `candidate123`
   - **Admin**: Phone `9876543212`, Password `admin123`

## 📝 Notes

- All users are created with `isVerified: true` and `isPhoneVerified: true`
- Passwords are securely hashed using bcrypt
- Phone numbers match the frontend mock data
- Users can be used immediately for testing

## 🐛 Troubleshooting

**Error: "Cannot find module 'bcryptjs'"**
- Run: `npm install` in the backend folder

**Error: "Prisma Client not generated"**
- Run: `npm run prisma:generate`

**Error: "Cannot connect to database"**
- Check your `.env` file has correct `DATABASE_URL`
- Make sure MySQL is running
- Verify database `e_voting` exists

**Error: "User already exists"**
- This is normal - the script uses `upsert` so it will update existing users
- You can run the seed script multiple times safely

