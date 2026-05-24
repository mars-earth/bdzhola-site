const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();

const axios = require("axios");

const app = express();
const db = new sqlite3.Database("./orders.db");
db.run(`
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
`);

app.use(cors());
app.use(express.json());
const path = require("path");

app.use(express.static(path.join(__dirname, "../")));

app.post("/api/order", async (req, res) => {
  const order = req.body;

  console.log("Нове замовлення:", order);

  // читаємо старі замовлення
  const orders = JSON.parse(
    fs.readFileSync("orders.json", "utf8")
  );

  // додаємо нове
  orders.push(order);

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

  // записуємо назад у файл
  fs.writeFileSync(
    "orders.json",
    JSON.stringify(orders, null, 2)
  );
db.run(
  `INSERT INTO orders
   (product, quantity, customerName, phone, city, postOffice)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    order.name,
    order.quantity,
    order.customerName,
    order.phone,
    order.city,
    order.postOffice
  ],
  function(err) {
    if (err) {
      console.error("DB error:", err.message);
    } else {
      console.log("Order saved, ID:", this.lastID);
    }
  }
);
  res.json({
    success: true,
    message: "Замовлення збережено"
  });
});
app.get("/api/orders", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});
app.delete("/api/orders/:id", (req, res) => {
  const id = req.params.id;

  db.run(
    "DELETE FROM orders WHERE id = ?",
    [id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ success: true });
    }
  );
});
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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});