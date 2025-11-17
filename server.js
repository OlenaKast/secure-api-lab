const express = require('express');
// Імпортуємо всі дані, включаючи користувачів
const { users, documents, employees } = require('./data');
const app = express();
const PORT = 3000;

app.use(express.json());

// --- MIDDLEWARE (ОХОРОНА) ---

// 1. Перевірка логіна і пароля
const authMiddleware = (req, res, next) => {
  // Отримуємо логін/пароль із заголовків запиту
  const login = req.headers['x-login'];
  const password = req.headers['x-password'];

  // Шукаємо такого користувача в data.js
  const user = users.find(u => u.login === login && u.password === password);

  // Якщо не знайшли — виганяємо
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed. Please provide valid credentials.' });
  }

  // Якщо знайшли — запам'ятовуємо його і пускаємо далі
  req.user = user;
  next();
};

// 2. Перевірка на Адміна
const adminOnlyMiddleware = (req, res, next) => {
  // Якщо це не адмін — забороняємо вхід
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// --- МАРШРУТИ ---

app.get('/documents', authMiddleware, (req, res) => {
  res.status(200).json(documents);
});

app.post('/documents', authMiddleware, (req, res) => {
  const newDocument = req.body;
  newDocument.id = Date.now();
  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// Сюди пускаємо ТІЛЬКИ якщо пройшов authMiddleware І adminOnlyMiddleware
app.get('/employees', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.status(200).json(employees);
});

// --- ЗАПУСК ---

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});