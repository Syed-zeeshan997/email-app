# Email App - Full Stack Web Application

A modern, responsive full-stack email web application with user authentication, email composition, admin panel, and secure backend.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, HTML5, CSS3, JavaScript, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Email | Nodemailer (SMTP) |
| Upload | Multer |
| Security | Helmet, CORS, Rate Limiting, XSS Protection, Mongo Sanitize |

## Features

- **Authentication**: Register, login, logout, forgot/reset password, email verification, JWT sessions
- **User Dashboard**: Profile management, profile picture upload, change password, delete account
- **Email System**: Gmail-style compose, attachments, sent mail history, email details
- **Admin Panel**: User management, suspend/delete users, email logs, dashboard statistics
- **UI**: Dark/light mode, responsive design, sidebar navigation, toast notifications, loading spinners
- **Security**: Input validation, rate limiting, password hashing, protected routes

## Project Structure

```
email-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service layer
│   │   └── utils/          # Helper functions
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database & mailer config
│   ├── controllers/        # Route controllers (MVC)
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, upload, rate limit
│   ├── utils/              # Token, validation, templates
│   ├── uploads/            # File uploads storage
│   └── server.js
├── package.json            # Root scripts
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally or MongoDB Atlas
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) (for SMTP)

## Installation

### 1. Clone and install dependencies

```bash
cd "C:\new project email"
npm run install-all
```

### 2. Configure environment variables

Copy the example env file and update values:

```bash
cd server
copy .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/email-app
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=your-email@gmail.com

CLIENT_URL=http://localhost:5173
```

### 3. Seed admin user

```bash
cd server
node utils/seedAdmin.js
```

Default admin credentials:
- **Email**: `admin@emailapp.com`
- **Password**: `Admin@12345`

### 4. Start development servers

From the project root:

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## Production Build

```bash
npm run build
NODE_ENV=production npm start
```

The server serves the React build from `client/dist` in production mode.

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/register` | Register new user | No |
| POST | `/api/login` | Login user | No |
| POST | `/api/logout` | Logout user | No |
| POST | `/api/forgot-password` | Send reset email | No |
| POST | `/api/reset-password/:token` | Reset password | No |
| GET | `/api/verify-email/:token` | Verify email | No |
| GET | `/api/me` | Get current session | Yes |

### User Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile` | Get profile | Yes |
| PUT | `/api/profile` | Update profile (multipart) | Yes |
| PUT | `/api/change-password` | Change password | Yes |
| DELETE | `/api/account` | Delete account | Yes |

### Email

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/send-email` | Send email (multipart) | Yes |
| GET | `/api/sent-mails` | List sent emails | Yes |
| GET | `/api/mail/:id` | Get email details | Yes |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| PUT | `/api/admin/users/:id/status` | Suspend/unsuspend | Admin |
| GET | `/api/admin/emails` | Email logs | Admin |

### Request Examples

**Register:**
```json
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secure@123"
}
```

**Send Email (multipart/form-data):**
```
POST /api/send-email
receiver: recipient@example.com
subject: Hello
message: Email body text
attachment: [file]
```

## Database Collections

### Users
- name, email, password (hashed), profileImage, verified, role, suspended, createdAt

### Emails
- sender, senderEmail, receiver, subject, message, attachment, status, createdAt

## Security Features

- JWT stored in HTTP-only cookies
- bcrypt password hashing (12 rounds)
- Rate limiting on auth and email routes
- Helmet security headers
- CORS with credentials
- express-mongo-sanitize (NoSQL injection protection)
- xss-clean middleware
- express-validator input validation
- Strong password requirements

## License

MIT
