# API Documentation

Base URL: `http://localhost:5000/api`

All authenticated endpoints accept JWT via HTTP-only cookie or `Authorization: Bearer <token>` header.

---

## Authentication Endpoints

### Register
```
POST /register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secure@123"
}

Response 201:
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "user": { "id", "name", "email", "verified", "role", "profileImage", "createdAt" }
}
```

### Login
```
POST /login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "Secure@123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "user": { ... }
}
```

### Logout
```
POST /logout

Response 200:
{ "success": true, "message": "Logged out successfully" }
```

### Forgot Password
```
POST /forgot-password
Content-Type: application/json

Body: { "email": "john@example.com" }

Response 200:
{ "success": true, "message": "If an account exists with that email, a reset link has been sent." }
```

### Reset Password
```
POST /reset-password/:token
Content-Type: application/json

Body:
{
  "password": "NewSecure@123",
  "confirmPassword": "NewSecure@123"
}

Response 200:
{ "success": true, "message": "Password reset successful" }
```

### Verify Email
```
GET /verify-email/:token

Response 200:
{ "success": true, "message": "Email verified successfully" }
```

### Get Current Session
```
GET /me
Auth: Required

Response 200:
{ "success": true, "user": { ... } }
```

---

## User Profile Endpoints

### Get Profile
```
GET /profile
Auth: Required
```

### Update Profile
```
PUT /profile
Auth: Required
Content-Type: multipart/form-data

Fields:
- name (optional)
- email (optional)
- profileImage (optional, file)
```

### Change Password
```
PUT /change-password
Auth: Required
Content-Type: application/json

Body:
{
  "currentPassword": "OldSecure@123",
  "newPassword": "NewSecure@456"
}
```

### Delete Account
```
DELETE /account
Auth: Required
Content-Type: application/json

Body: { "password": "Secure@123" }
```

---

## Email Endpoints

### Send Email
```
POST /send-email
Auth: Required
Content-Type: multipart/form-data

Fields:
- receiver (required, email)
- subject (required)
- message (required)
- attachment (optional, file, max 5MB)
```

### Get Sent Mails
```
GET /sent-mails?page=1&limit=10&search=keyword
Auth: Required

Response 200:
{
  "success": true,
  "emails": [...],
  "pagination": { "page", "limit", "total", "pages" }
}
```

### Get Email Details
```
GET /mail/:id
Auth: Required
```

---

## Admin Endpoints

All admin endpoints require authentication with `role: "admin"`.

### Dashboard Stats
```
GET /admin/stats

Response:
{
  "success": true,
  "stats": {
    "totalUsers": 10,
    "totalEmails": 25,
    "suspendedUsers": 1,
    "verifiedUsers": 8
  }
}
```

### List Users
```
GET /admin/users?page=1&limit=10&search=keyword
```

### Delete User
```
DELETE /admin/users/:id
```

### Suspend/Unsuspend User
```
PUT /admin/users/:id/status
Content-Type: application/json

Body: { "suspended": true }
```

### Email Logs
```
GET /admin/emails?page=1&limit=10&search=keyword
```

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "Please provide a valid email" }]
}
```

Common status codes: `400` Validation, `401` Unauthorized, `403` Forbidden, `404` Not Found, `429` Rate Limited, `500` Server Error
