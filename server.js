// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const sessions = {}; // Store session info temporarily

app.use(cors());
app.use(bodyParser.json());

// Generate a pairing code
app.get('/generate-code', (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const sessionId = uuidv4();
  sessions[code] = { sessionId, linked: false };
  res.json({ code, sessionId });
});

// Pair code and return session ID
app.post('/pair', (req, res) => {
  const { code } = req.body;
  const session = sessions[code];
  if (session && !session.linked) {
    session.linked = true;
    return res.json({ sessionId: session.sessionId });
  } else {
    return res.status(400).json({ error: 'Invalid or already used code' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
