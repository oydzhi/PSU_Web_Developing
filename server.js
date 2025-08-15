const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const newsRoutes = require('./routes/news.js');
const teacherRoutes = require('./routes/prepods.js');
const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/prepods', teacherRoutes);
app.use('/api/auth', authRoutes);



app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

app.get('/news', (req, res) => {
  res.sendFile(path.join(__dirname, 'news.html'));
});

app.get('/prepods', (req, res) => {
  res.sendFile(path.join(__dirname,  'prepods.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contacts', (req, res) => {
  res.sendFile(path.join(__dirname, 'contacts.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
