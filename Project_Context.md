# Project Name: Agentic AI Autonomous Pharmacy System

## Overview

This project is an **Agentic AI–Powered Autonomous Pharmacy System**.  
This is **NOT** a simple chatbot. It is a multi-agent, tool-using, autonomous system that:

- **Understands** messy natural language
- **Enforces** medical & legal safety rules
- **Uses** medicine inventory as the source of truth
- **Predicts** refill needs proactively
- **Executes** real backend actions (orders, inventory, webhooks)
- **Provides** full observability and decision traceability

The goal is to demonstrate **true autonomy**, not scripted responses.

---

## Core Vision

The system should behave like an **expert pharmacist**.

**Example input:**  
> "Last time wali BP ki tablet de do, ek mahine ki"

**The system must:**
1. Extract intent autonomously
2. Decide if the order is allowed
3. Reject unsafe or illegal requests
4. Predict refill timelines
5. Trigger backend actions
6. Log every decision path

**Role Definitions:**
- **AI** = Worker
- **Admin** = Supervisor

---

## Tech Stack (Locked)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Redis** (JWT blacklist)
- **JWT Authentication**
- **CSV → DB ingestion** (seed only)

### AI Layer (Later)
- **LangChain** (agents + tools)
- **LangSmith** (mandatory observability)

### Frontend (Later)
- **Web-first UI**
- **User chat interface**
- **Admin monitoring dashboard**

---

## Architectural Rules (Non‑Negotiable)

- **AI agents NEVER access the DB directly.**
- **AI interacts only via backend APIs.**
- **CSV files are seed data only** (never runtime).
- **Controllers contain NO AI logic.**
- **Services contain business logic.**
- **Models are the single source of truth.**
- **RBAC is enforced by backend.**
- **Observability is mandatory for AI actions.**

---

## Authentication & RBAC (Completed)

### Roles
- **user** → Customer
- **admin** → Pharmacy operator

### Rules
- Public signup → **user** only
- Admins are created manually
- JWT payload contains `_id`, `email`, `role`
- Redis is used for logout token blacklisting

### Auth APIs
- `POST /users/register`
- `POST /users/login`
- `GET /users/profile`
- `POST /users/logout`

---
---

### Medicine & Inventory Routes (Completed)
- `POST /medicines/create`
- `GET /medicines/get-all`
- `POST /inventory/create` (Admin)
- `GET /inventory/low-stock` (Admin)
- `GET /inventory/expiry` (Admin)


## Backend Folder Structure (Locked)

```text
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Medicine.model.js
│   │   ├── Inventory.model.js
│   │   ├── Order.model.js
│   │   └── OrderHistory.model.js
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js (to be added when admin routes start)
│   ├── services/
│   │   ├── csv.service.js
│   │   └── inventory.service.js
│   └── seed/
│       ├── medicines.csv
│       ├── order_history.csv
│       └── seed.js
```

---

## AI Architecture (Future Phase)

### Agents

| Agent | Responsibility |
| :--- | :--- |
| **Conversation Agent** | Intent extraction only |
| **Policy & Safety Agent** | Rule enforcement |
| **Prediction Agent** | Refill prediction |
| **Action Agent** | Orders, inventory, webhooks |

*Each agent has one responsibility only.*

### Data Assets

**Medicine Master Data**
- Imported once from CSV
- Stored in MongoDB
- **Fields:** `name`, `unitType`, `prescriptionRequired`, `stockQuantity`

**Order History**
- Imported once from CSV
- Stored in MongoDB
- **Used only by Prediction Agent**

---

## Admin Philosophy

**Admins:**
- Do not chat
- Do not manually approve orders
- Monitor AI decisions
- Review audit logs
- Intervene only if needed

---

## Development Order (Strict)

1. Backend schemas + APIs
2. CSV ingestion
3. Medicine & inventory APIs
4. Order & history APIs
5. AI tools
6. LangChain agents
7. LangSmith observability
8. Frontend

---

## Current Status

- ✅ **Backend initialized**
- ✅ **Auth + JWT + Redis complete**
- ✅ **RBAC foundation added**
- ✅ **Medicine Master Data + APIs** (Basic implementation)
- ✅ **Inventory Services + APIs** (Batches, Expiry, Low Stock)
- 🔜 **Order Processing is NEXT**

---

## Instruction to IDE / AI

- **Think in systems**, not snippets.
- **Do not oversimplify.**
- **Do not bypass APIs.**
- **Respect folder structure.**
- **Write production‑style code.**
