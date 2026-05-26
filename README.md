# 🐝 Beeswax Candle Shop — Full Stack E-commerce Website

A full-stack e-commerce web application for selling handmade beeswax candles with admin dashboard, order management, and Telegram notifications.

## 🌍 Live Demo
👉 https://bdzhola-site.onrender.com/

## 📌 Features

### 🛒 Customer Side
- Product catalog with images and descriptions
- Multilingual support (Ukrainian / English)
- Order form with validation
- Responsive design (mobile-friendly)

### ⚙️ Admin Panel
- Password-protected access
- View all customer orders
- Delete orders
- Real-time order updates

### 🔔 Backend Features
- REST API built with Node.js + Express
- SQLite database for storing orders
- Telegram bot notifications for new orders
- JSON backup system (optional)

## 🧰 Tech Stack

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript

**Backend:**
- Node.js
- Express.js

**Database:**
- SQLite

**Integrations:**
- Telegram Bot API

**Deployment:**
- Render

## 🔐 Admin Panel
URL: /admin.html
Login required via password from .env

## 🛒 API Endpoints
POST /api/order — create order
GET /api/orders — get all orders
DELETE /api/orders/:id — delete order

## 📬 Telegram Integration
New orders are automatically sent to Telegram using bot API.

## 💡 Future Improvements
Online payment integration (Stripe / LiqPay)
Product management from admin panel
Order status system (new / shipped / completed)
User accounts system

## 👨‍💻 Author
Created by mars-earth.
Full-stack developer (Node.js / Frontend / API integration)

## 📄 License
This project is for portfolio/demo purposes.
