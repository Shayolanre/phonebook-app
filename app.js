const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express(); 
const port = 3000;

// In-memory data storage
let contacts = [];
let callLogs = [];

// Set up Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Set up body parser for form data
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Phonebook', contacts, callLogs });
});

app.post('/add', (req, res) => {
  const newContact = { id: Date.now().toString(), name: req.body.name, phone: req.body.phone };
  contacts.push(newContact);
  res.redirect('/');
});

app.post('/call/:id', (req, res) => {
  const contact = contacts.find(c => c.id === req.params.id);
  const newCallLog = { ...contact, date: new Date().toLocaleString() };
  callLogs.unshift(newCallLog);
  if (callLogs.length > 10) callLogs.pop(); // Limit to 10 recent calls
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  contacts = contacts.filter(c => c.id !== req.params.id);
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});