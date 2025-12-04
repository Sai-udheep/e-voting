# Twilio Setup Guide (Optional)

Twilio is used to send OTP codes via SMS. If you don't want to set up Twilio, the system will still work - OTP codes will be generated and stored in the database, and you can retrieve them for testing.

## Option 1: Use Without Twilio (Development)

The system works fine without Twilio! OTP codes are:
- ✅ Generated and stored in the database
- ✅ Logged to console when Twilio is not configured
- ✅ Retrievable via API endpoint: `GET /auth/otp/:phone`

### How to Get OTP Without Twilio:

**Method 1: Check Console**
When you register, the OTP code will be printed in the backend console:
```
📱 OTP CODE for 9876543210: 123456
```

**Method 2: Use API Endpoint**
```bash
GET http://localhost:4000/auth/otp/9876543210
```

Response:
```json
{
  "phone": "9876543210",
  "code": "123456",
  "expiresAt": "2024-12-03T18:50:00.000Z",
  "isUsed": false,
  "createdAt": "2024-12-03T18:40:00.000Z"
}
```

**Method 3: Check Database**
```sql
SELECT * FROM OtpCode 
WHERE phone = '9876543210' 
ORDER BY createdAt DESC 
LIMIT 1;
```

---

## Option 2: Set Up Twilio (Production)

If you want to send real SMS messages, follow these steps:

### Step 1: Create Twilio Account

1. Go to [Twilio](https://www.twilio.com/)
2. Sign up for a free account
3. Verify your email and phone number

### Step 2: Get Twilio Credentials

1. Log in to Twilio Console
2. Go to **Dashboard**
3. Find your **Account SID** and **Auth Token**
4. Copy these values

### Step 3: Get a Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number (free trial accounts get a number)
3. Copy the phone number (format: +1234567890)

### Step 4: Update .env File

Add these to your `backend/.env`:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+1234567890
```

**Important**: 
- Phone number must include country code with `+` (e.g., `+1234567890`)
- Don't include spaces or dashes

### Step 5: Restart Backend

```powershell
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 6: Test

1. Register a new user
2. Check your phone for SMS with OTP code
3. Enter the code to verify

---

## Twilio Free Trial Limits

- **Free Credits**: $15.50 credit
- **SMS Cost**: ~$0.0075 per SMS (varies by country)
- **Approximate Messages**: ~2,000 messages
- **Trial Restrictions**: 
  - Can only send to verified phone numbers (during trial)
  - Need to upgrade for production use

---

## Troubleshooting

### Issue: "Twilio environment variables are not fully configured"

**Solution**: This is normal if you haven't set up Twilio. The system will still work - just check the console or database for OTP codes.

### Issue: "Invalid phone number format"

**Solution**: 
- Phone number must include country code
- Format: `+1234567890` (no spaces, dashes, or parentheses)
- Example: `+919876543210` for India, `+1234567890` for US

### Issue: "SMS not received"

**Solutions**:
1. Check Twilio Console → Logs for errors
2. Verify phone number format
3. During trial, ensure phone number is verified in Twilio
4. Check account balance/credits

### Issue: "Authentication failed"

**Solution**:
- Double-check `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
- Make sure there are no extra spaces in .env file
- Restart backend after changing .env

---

## Example .env Configuration

### Without Twilio (Development)
```env
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/e_voting"
JWT_SECRET=dev-secret-change-me
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
```

### With Twilio (Production)
```env
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/e_voting"
JWT_SECRET=your-secret-key-here
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+1234567890
```

---

## Security Note

⚠️ **Never commit .env file to version control!**

Make sure `.env` is in your `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

## Summary

- ✅ **Twilio is optional** - System works without it
- ✅ **OTP codes are always generated** and stored in database
- ✅ **For development**: Check console or use `/auth/otp/:phone` endpoint
- ✅ **For production**: Set up Twilio to send real SMS

The registration flow works perfectly fine without Twilio - you just need to retrieve the OTP code from the console, database, or API endpoint instead of receiving it via SMS.

