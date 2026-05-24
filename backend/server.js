const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

require("dotenv").config();

const app = express();

// ===================== DB =====================
const db = new Database("orders.db");

// створення таблиці
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT,
    quantity INTEGER,
    customerName TEXT,
    phone TEXT,
    city TEXT,
    postOffice TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(express.json());

// фронтенд
app.use(express.static(path.join(__dirname, "../")));

// ===================== ORDER =====================
app.post("/api/order", async (req, res) => {
  const order = req.body;

  console.log("Нове замовлення:", order);

  try {
    // JSON backup
    const orders = JSON.parse(
      fs.readFileSync("orders.json", "utf8")
    );

    orders.push(order);

    fs.writeFileSync(
      "orders.json",
      JSON.stringify(orders, null, 2)
    );

    // Telegram
    const message = `
🛒 Нове замовлення

Товар: ${order.name}
Кількість: ${order.quantity}
Ім'я: ${order.customerName}
Телефон: ${order.phone}
Місто: ${order.city}
Пошта: ${order.postOffice}
`;

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message
      }
    );

    // DB save
    db.prepare(`
      INSERT INTO orders
      (product, quantity, customerName, phone, city, postOffice)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      order.name,
      order.quantity,
      order.customerName,
      order.phone,
      order.city,
      order.postOffice
    );

    res.json({
      success: true,
      message: "Замовлення збережено"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===================== GET ORDERS =====================
app.get("/api/orders", (req, res) => {
  try {
    const rows = db.prepare(
      "SELECT * FROM orders ORDER BY id DESC"
    ).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== DELETE ORDER =====================
app.delete("/api/orders/:id", (req, res) => {
  try {
    const id = req.params.id;

    db.prepare("DELETE FROM orders WHERE id = ?").run(id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== ADMIN LOGIN =====================
app.post("/api/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({
      success: false,
      message: "Неправильний пароль"
    });
  }
});

// ===================== START =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});