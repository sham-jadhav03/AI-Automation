# 📂 Mediloon – Complete Project Structure & API Documentation

This document describes the **complete folder structure** of the Mediloon project, including **Frontend**, **Backend**, and **all REST API endpoints** used in the system.

---

## 🧠 Project Overview

Mediloon is a **MERN + AI-based intelligent pharmacy system** that enables:
- Natural text & voice-based medicine ordering
- AI-driven refill prediction
- Inventory intelligence
- Backend-triggered automation workflows

The system follows a **Backend-first, Agent-based architecture**.

---

# 🖥️ FRONTEND STRUCTURE (React)

```
frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── VoiceButton.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   │
│   │   ├── medicine/
│   │   │   └── MedicineCard.jsx
│   │   │
│   │   └── admin/
│   │       ├── InventoryTable.jsx
│   │       ├── OrdersTable.jsx
│   │       └── PredictionPanel.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── customer/
│   │   │   ├── Home.jsx
│   │   │   ├── ChatOrder.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Orders.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   └── Orders.jsx
│   │   │
│   │   └── NotFound.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── medicine.service.js
│   │   ├── order.service.js
│   │   └── ai.service.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ChatContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── useVoice.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   └── formatters.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── README.md
```

---

# ⚙️ BACKEND STRUCTURE (Node + Express)

```
backend/
│
├── src/
│ │
│ ├── config/
│ │ ├── db.js
│ │ ├── env.js
│ │ └── openai.js
│ │
│ ├── models/
│ │ ├── User.model.js
│ │ ├── Medicine.model.js
│ │ ├── Inventory.model.js
│ │ ├── Order.model.js
│ │ ├── Prescription.model.js
│ │ └── AILog.model.js
│ │
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ ├── medicine.controller.js
│ │ ├── inventory.controller.js
│ │ ├── order.controller.js
│ │ └── ai.controller.js
│ │
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── medicine.routes.js
│ │ ├── inventory.routes.js
│ │ ├── order.routes.js
│ │ └── ai.routes.js
│ │
│ ├── agents/
│ │ ├── ordering.agent.js
│ │ ├── safety.agent.js
│ │ ├── forecast.agent.js
│ │ └── procurement.agent.js
│ │
│ ├── services/
│ │ ├── ai.service.js
│ │ ├── prediction.service.js
│ │ ├── prescription.service.js
│ │ └── automation.service.js
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.js
│ │ ├── role.middleware.js
│ │ └── error.middleware.js
│ │
│ ├── jobs/
│ │ └── refill.job.js
│ │
│ ├── app.js
│ └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# 🔌 API ENDPOINTS

All endpoints are prefixed with `/api`.

## Authentication
- POST /auth/register
- POST /auth/login
- GET /auth/me

## Medicines
- GET /medicines
- GET /medicines/:id
- POST /medicines
- PUT /medicines/:id
- DELETE /medicines/:id

## Inventory
- GET /inventory
- PUT /inventory/update
- GET /inventory/alerts

## Orders
- POST /orders
- GET /orders/my
- GET /orders
- GET /orders/:id

## AI & Agentic
- POST /ai/order
- POST /ai/chat
- GET /ai/predictions/:userId
- GET /ai/logs

---

## 🔁 Automation

Automation is triggered by backend conditions such as:
- Low stock
- Refill due
- Order placed

Handled via webhooks using tools like n8n or Zapier.

---