# Fix Database Migration Issue

## Problem
The database tables (`election`, `candidate`, `vote`) don't exist because the migration hasn't been applied.

## Solution

Run these commands in your terminal:

```bash
cd backend
npx prisma migrate dev --name add_elections_candidates_votes
```

This will:
1. Create a migration file for the new tables
2. Apply the migration to your MySQL database
3. Automatically regenerate Prisma Client

## What Was Fixed

### 1. ✅ Database Migration
- Added `getAdminStats()` function to admin service
- Created `/admin/stats` endpoint
- Updated admin dashboard to fetch real statistics

### 2. ✅ JWT Token Handling
- Updated API error handling to only clear tokens on 401 (Unauthorized) errors
- Server errors (500) won't log users out anymore
- Tokens are preserved during database connection issues

### 3. ✅ Admin Dashboard Stats
- Now fetches real data from database:
  - Total Voters
  - Active Candidates (approved)
  - Pending Approvals
  - Votes Cast
  - Active Elections

## After Running Migration

Once the migration is complete, restart your backend server:

```bash
npm run dev
```

The tables will be created and all API endpoints will work correctly.

## Verification

After migration, you can verify tables exist by running:

```bash
cd backend
npx prisma studio
```

This opens a database browser where you can see all tables including `Election`, `Candidate`, and `Vote`.

