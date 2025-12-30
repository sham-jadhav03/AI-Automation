# User API Endpoints Documentation

This document provides detailed information about the user authentication and profile management endpoints.

## Base URL
```
/users
```

## Table of Contents
- [Register User](#register-user)
- [Login User](#login-user)
- [Get User Profile](#get-user-profile)
- [Logout User](#logout-user)

---

## Register User

Creates a new user account with email and password.

### Endpoint
```
POST /users/register
```

### Authentication
None required (public endpoint)

### Request Headers
```
Content-Type: application/json
```

### Request Body
| Field    | Type   | Required | Validation                              |
|----------|--------|----------|-----------------------------------------|
| email    | string | Yes      | Valid email format, 6-128 characters    |
| password | string | Yes      | Minimum 3 characters                    |

#### Example Request
```json
{
  "email": "user@example.com",
  "password": "mySecurePassword123"
}
```

### Response

#### Success Response (201 Created)
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**400 Bad Request** - Validation errors
```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**400 Bad Request** - Registration failed (e.g., email already exists)
```json
{
  "message": "User already exists"
}
```

### Status Codes
- `201` - User successfully registered
- `400` - Validation error or registration failed

### Notes
- Password is hashed using bcrypt before storage
- JWT token is automatically set as a cookie
- Password is excluded from the response
- Token expires in 24 hours

---

## Login User

Authenticates an existing user and returns a JWT token.

### Endpoint
```
POST /users/login
```

### Authentication
None required (public endpoint)

### Request Headers
```
Content-Type: application/json
```

### Request Body
| Field    | Type   | Required | Validation           |
|----------|--------|----------|----------------------|
| email    | string | Yes      | Valid email format   |
| password | string | Yes      | Minimum 3 characters |

#### Example Request
```json
{
  "email": "user@example.com",
  "password": "mySecurePassword123"
}
```

### Response

#### Success Response (200 OK)
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**400 Bad Request** - Validation errors
```json
{
  "errors": [
    {
      "msg": "Password must be at least 3 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

**401 Unauthorized** - Invalid credentials
```json
{
  "message": "Invalid credentials"
}
```

**400 Bad Request** - Server error
```json
{
  "message": "Error message"
}
```

### Status Codes
- `200` - Login successful
- `400` - Validation error or server error
- `401` - Invalid email or password

### Notes
- Password is verified using bcrypt comparison
- JWT token is returned in response body
- Password is excluded from the response
- Token expires in 24 hours

---

## Get User Profile

Retrieves the authenticated user's profile information.

### Endpoint
```
GET /users/profile
```

### Authentication
**Required** - JWT token

### Request Headers
```
Authorization: Bearer <token>
```

**OR** token can be sent via cookie:
```
Cookie: token=<token>
```

### Request Body
None

### Response

#### Success Response (200 OK)
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

#### Error Responses

**401 Unauthorized** - No token provided or invalid token
```json
{
  "error": "Unauthorized User"
}
```

**401 Unauthorized** - Token blacklisted (user logged out)
```json
{
  "error": "Unauthorized User"
}
```

### Status Codes
- `200` - Profile retrieved successfully
- `401` - Authentication failed or token invalid/expired

### Notes
- User information is extracted from the JWT token
- Token can be sent in header or cookie
- Blacklisted tokens (from logout) are rejected
- Password field is never returned

---

## Logout User

Logs out the authenticated user by blacklisting their JWT token.

### Endpoint
```
GET /users/logout
```

### Authentication
**Required** - JWT token

### Request Headers
```
Authorization: Bearer <token>
```

**OR** token can be sent via cookie:
```
Cookie: token=<token>
```

### Request Body
None

### Response

#### Success Response (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses

**401 Unauthorized** - No token provided or invalid token
```json
{
  "error": "Unauthorized User"
}
```

**500 Internal Server Error** - Server error during logout
```json
{
  "message": "Error message"
}
```

### Status Codes
- `200` - Logout successful
- `401` - Authentication failed
- `500` - Internal server error

### Notes
- Token is added to Redis blacklist for 24 hours
- Blacklisted tokens cannot be used for authentication
- User must login again to get a new token
- Token blacklist automatically expires after 24 hours

---

## Authentication Flow

### Token-Based Authentication
1. User registers or logs in
2. Server generates JWT token (valid for 24 hours)
3. Token is sent in response and can be stored by client
4. Client includes token in subsequent requests via:
   - Authorization header: `Bearer <token>`
   - Cookie: `token=<token>`
5. Server validates token for protected endpoints
6. On logout, token is blacklisted in Redis

### Token Structure
```javascript
{
  "_id": "user_id",
  "email": "user@example.com",
  "iat": 1640000000,
  "exp": 1640086400
}
```

---

## Error Handling

### Common Error Formats

#### Validation Errors (express-validator)
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

#### General Errors
```json
{
  "message": "Error description"
}
```

#### Authentication Errors
```json
{
  "error": "Unauthorized User"
}
```

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String (required, unique, 6-128 chars),
  password: String (hashed, not returned in responses)
}
```

---

## Security Features

1. **Password Hashing**: Bcrypt with salt rounds of 10
2. **JWT Tokens**: Signed with secret, 24-hour expiration
3. **Token Blacklisting**: Redis-based logout mechanism
4. **Input Validation**: Email format and password length validation
5. **Password Exclusion**: Passwords never returned in API responses
6. **Secure Cookies**: Tokens can be stored in HTTP cookies

---

## Technologies Used

- **Express.js**: Web framework
- **MongoDB/Mongoose**: Database and ODM
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Request validation
- **Redis**: Token blacklist storage

---

## Environment Variables Required

```
JWT_SECRET=your_jwt_secret_key
```

---

## Examples

### Complete Registration Flow
```bash
# Register
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response includes token
# Use token for authenticated requests
```

### Complete Login and Profile Flow
```bash
# Login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get Profile (using token from login)
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Logout
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notes and Best Practices

1. **Token Storage**: Store tokens securely on client-side (HTTP-only cookies recommended)
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Token Expiration**: Tokens expire after 24 hours; implement token refresh if needed
4. **Error Messages**: Generic error messages for authentication to prevent user enumeration
5. **Rate Limiting**: Consider implementing rate limiting for login/register endpoints
6. **Password Requirements**: Current minimum is 3 characters; consider stronger requirements for production
