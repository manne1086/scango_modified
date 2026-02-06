
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Real credentials provided by user
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const VERIFY_SERVICE_SID = process.env.VERIFY_SERVICE_SID;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.post('/api/send-otp', async (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) return res.status(400).json({ success: false, message: 'Mobile number required' });

  try {
    // Use Verify API as requested
    const verification = await client.verify.v2.services(VERIFY_SERVICE_SID)
      .verifications
      .create({ to: mobileNumber, channel: 'sms' });

    console.log(`[Twilio] OTP Sent to ${mobileNumber}: Status ${verification.status}`);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error("Twilio Send Error:", error);
    // Return 500 but structured so frontend handles it
    res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;
  if (!mobileNumber || !otp) return res.status(400).json({ success: false, message: 'Missing params' });

  try {
    const verificationCheck = await client.verify.v2.services(VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: mobileNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      console.log(`[Twilio] Verified ${mobileNumber}`);
      res.json({ success: true, message: 'Verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error("Twilio Verify Error:", error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
