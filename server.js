const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const sessions = {};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend

// Show index.html on root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/generate-code', (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const sessionId = uuidv4();
  sessions[code] = { sessionId, linked: false };
  res.json({ code, sessionId });
});

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
