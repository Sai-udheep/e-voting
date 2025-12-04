# Phone Number Format Guide

## 🔍 Issue: Twilio Phone Number Format

Twilio requires phone numbers in **E.164 format**: `+[country code][number]`

### Example:
- ❌ Wrong: `9701696553`
- ✅ Correct: `+919701696553` (India: +91 prefix)

---

## 📱 How Phone Numbers Are Handled

### Database Storage
- Phone numbers are stored as **digits only** (normalized)
- Example: `9701696553` (no spaces, dashes, or country code)

### Twilio SMS
- Phone numbers are formatted to **E.164 format** before sending
- Example: `9701696553` → `+919701696553`

### Login/Verification
- Phone numbers are normalized (digits only) for database lookup
- Works with any format input: `9701696553`, `+919701696553`, `9701-696-553`

---

## 🌍 Country Code Detection

The system automatically detects country codes:

### India (+91)
- 10-digit numbers starting with 6, 7, 8, or 9
- Example: `9701696553` → `+919701696553`

### United States (+1)
- 10-digit numbers
- Example: `5551234567` → `+15551234567`

### Other Countries
- If number already has 11+ digits, assumes country code included
- Example: `919701696553` → `+919701696553`

---

## ✅ Correct Phone Number Formats

### For Registration/Login:
You can enter phone numbers in any of these formats:
- `9701696553` ✅
- `+919701696553` ✅
- `9701-696-553` ✅
- `9701 696 553` ✅

All will be normalized to `9701696553` for database storage.

### For Twilio SMS:
The system automatically converts to E.164:
- `9701696553` → `+919701696553` ✅

---

## 🐛 Common Errors

### Error: "Invalid 'To' Phone Number"
**Cause**: Phone number missing country code for Twilio

**Solution**: 
- The system now auto-detects and adds country code
- If still failing, ensure your phone number is valid
- Check Twilio console for number format requirements

### Error: "Phone not verified"
**Cause**: OTP verification failed

**Solution**:
- Check console for OTP code (if Twilio not configured)
- Use `GET /auth/otp/:phone` to retrieve OTP
- Ensure OTP is entered within 10 minutes

---

## 🔧 Manual Phone Format Configuration

If you need to specify a different country code, you can modify the `formatPhoneForTwilio` function in:
`backend/src/modules/otp/otp.service.ts`

### Example for Different Country:
```typescript
// For UK (+44)
if (cleaned.length === 10 && cleaned.startsWith('7')) {
  return `+44${cleaned}`;
}
```

---

## 📝 Testing Without Twilio

If Twilio is not configured:
1. OTP is still generated and stored
2. OTP code is logged to console
3. Use console output or API endpoint to get OTP
4. System works perfectly without SMS

---

## ✅ Current Status

- ✅ Phone normalization for database
- ✅ Auto country code detection for Twilio
- ✅ E.164 format conversion
- ✅ Works with any input format
- ✅ Error handling for invalid numbers

**The system now automatically handles phone number formatting!** 🎉

