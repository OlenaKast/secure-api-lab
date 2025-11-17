const express = require('express');
const { documents, employees } = require('./data');
const app = express();
const PORT = 3000;

// Middleware для автоматичного парсингу JSON-тіла запиту
app.use(express.json());

// --- МАРШРУТИ ДЛЯ РЕСУРСІВ ---

// Отримати список документів
app.get('/documents', (req, res) => {
  res.status(200).json(documents);
});

// Створити новий документ
app.post('/documents', (req, res) => {
  const newDocument = req.body;
  newDocument.id = Date.now();
  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// Отримати список співробітників
app.get('/employees', (req, res) => {
  res.status(200).json(employees);
});

// --- КІНЕЦЬ МАРШРУТІВ ---

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});