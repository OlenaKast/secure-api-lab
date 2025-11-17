const express = require('express');
const { users, documents, employees } = require('./data');
const app = express();
const PORT = 3000;

app.use(express.json());

// --- MIDDLEWARE (ОХОРОНА та ЛОГИ) ---

// 1. ЛОГЕР (Записує кожен запит) - ДОДАНО
const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  // Виводимо в консоль: [Час] МЕТОД АДРЕСА
  console.log(`[${timestamp}] ${method} ${url}`);
  
  next();
};

// Підключаємо логер ГЛОБАЛЬНО (перед усіма маршрутами)
app.use(loggingMiddleware);


// 2. Перевірка логіна і пароля
const authMiddleware = (req, res, next) => {
  const login = req.headers['x-login'];
  const password = req.headers['x-password'];
  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed. Please provide valid credentials.' });
  }

  req.user = user;
  next();
};

// 3. Перевірка на Адміна
const adminOnlyMiddleware = (req, res, next) => {
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

app.get('/employees', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.status(200).json(employees);
});

// --- ЗАПУСК ---

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});