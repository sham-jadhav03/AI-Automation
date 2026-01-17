# User API Endpoints Documentation

This document provides detailed information about the API endpoints for Users, Medicines, and Inventory management.

## Base URLs
- Users: `/users`
- Medicines: `/medicines`
- Inventory: `/inventory`

## Table of Contents
1. [User Authentication](#user-authentication)
2. [Medicine Management](#medicine-management)
3. [Inventory Management](#inventory-management)

---

## User Authentication

### Register User
Creates a new user account.
- **Endpoint**: `POST /users/register`
- **Auth**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created` with user data and token.

### Login User
Authenticates a user.
- **Endpoint**: `POST /users/login`
- **Auth**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK` with user data and token.

### Get Profile
Retrieves current user profile.
- **Endpoint**: `GET /users/profile`
- **Auth**: Required (Bearer Token)
- **Response**: `200 OK` with user data.

### Logout User
Logs out the user (blacklists token).
- **Endpoint**: `GET /users/logout`
- **Auth**: Required (Bearer Token)
- **Response**: `200 OK` with success message.

---

## Medicine Management

### Create Medicine
Adds a new medicine to the master data.
- **Endpoint**: `POST /medicines/create`
- **Auth**: Public (Note: Should ideally be Admin protected in production)
- **Body**:
  ```json
  {
    "name": "Paracetamol",
    "genericName": "Acetaminophen",
    "unitType": "tablets",
    "prescriptionRequired": false
  }
  ```
- **Response**: `201 Created` with medicine data.

### Get All Medicines
Retrieves a list of all medicines.
- **Endpoint**: `GET /medicines/get-all`
- **Auth**: Public
- **Response**: `200 OK` with array of medicines.

---

## Inventory Management

### Create Inventory Batch
Adds a new batch of stock for a specific medicine.
- **Endpoint**: `POST /inventory/create`
- **Auth**: Admin Only (Bearer Token with `role: admin`)
- **Body**:
  ```json
  {
    "medicine": "MEDICINE_ID_HERE",
    "batchNumber": "BATCH001",
    "expiryDate": "2025-12-31",
    "quantityAvailable": 100,
    "reorderThreshold": 10,
    "supplier": "PharmaCorp"
  }
  ```
- **Response**: `201 Created` with inventory batch data.

### Get Low Stock
Retrieves inventory items where quantity is below threshold.
- **Endpoint**: `GET /inventory/low-stock`
- **Auth**: Admin Only
- **Response**: `200 OK` with list of low stock items.

### Get Expiring Inventory
Retrieves items expiring within a specific timeframe (default 30 days).
- **Endpoint**: `GET /inventory/expiry`
- **Auth**: Admin Only
- **Response**: `200 OK` with list of expiring items.

---

## Authentication & Roles

- **Authentication**: JWT Bearer Token required for protected routes.
- **Roles**:
  - `user`: Standard access (Profile, etc.)
  - `admin`: Elevated access (Inventory management, etc.)

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (Validation errors)
- `401`: Unauthorized (Missing/Invalid token)
- `403`: Forbidden (Insufficient role permissions)
- `500`: Internal Server Error
