# Email App - Full Stack Web Application

A modern, responsive full-stack email web application with user authentication, email composition, admin panel, and secure backend.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, HTML5, CSS3, JavaScript, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Email | Resend API |
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
- A [Resend](https://resend.com/) account and API key (for sending emails)

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

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=onboarding@resend.dev

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

## Resend Migration Notes

The email layer was migrated from Nodemailer/Gmail SMTP to the official [Resend](https://resend.com/) API. The public `sendEmail({ to, subject, html, attachments })` function signature is unchanged, so no other file besides the mailer itself needed to change.

**Files changed:**

| File | Change |
|------|--------|
| `server/config/mailer.js` | Rewritten to use the `resend` SDK instead of `nodemailer`. Reads multer disk-storage attachments (`{ filename, path }`) into buffers before sending, since Resend expects attachment `content`, not a filesystem path. |
| `server/package.json` | Removed `nodemailer`, added `resend`. |
| `server/package-lock.json` | Removed (stale, referenced `nodemailer`). Run `npm install` in `server/` to regenerate it against the new `package.json`. |
| `server/.env.example` | Replaced `SMTP_*` variables with `RESEND_API_KEY` and `RESEND_FROM`. |

**Files intentionally NOT changed:** `authController.js`, `emailController.js`, `middleware/upload.js`, all routes, models, and the client — none of them talk to Nodemailer/SMTP directly, they only call `sendEmail(...)`.

**Required environment variables (server):**

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `RESEND_API_KEY` | Yes | — | From your [Resend dashboard](https://resend.com/api-keys). App throws a clear error on first send if missing. |
| `RESEND_FROM` | No | `onboarding@resend.dev` | Use `onboarding@resend.dev` for quick testing (delivers only to your own Resend account email). Verify a domain in Resend and set this to an address on that domain for production. |

**Behavior preserved:**
- `POST /api/register` → verification email via Resend (unchanged flow)
- `POST /api/forgot-password` → reset email via Resend (unchanged flow)
- `POST /api/send-email` (Compose) → email + optional multer attachment via Resend (unchanged flow)
- Failure handling unchanged: `authController.js` and `emailController.js` still catch send errors the same way (`status: 'failed'`, `errorMessage`, etc.)

## Deploying on Render

1. **Push this project to GitHub** (or your existing repo, replacing the old `server/config/mailer.js`, `server/package.json`, and `server/.env.example`).
2. **Create a Web Service on Render** pointing at the `server/` directory (or root, if you deploy the monorepo with the `npm run build` root script).
   - Build command: `npm run install-all && npm run build` (root) *or* `npm install` (if deploying `server/` alone)
   - Start command: `npm start` (root) *or* `node server.js` (server-only)
3. **Set environment variables** in Render's dashboard (Service → Environment):
   - `MONGODB_URI` (your MongoDB Atlas connection string)
   - `JWT_SECRET`, `JWT_EXPIRE`, `JWT_COOKIE_EXPIRE`
   - `RESEND_API_KEY` — from Resend dashboard
   - `RESEND_FROM` — `onboarding@resend.dev` for a quick test, or your verified domain sender once ready
   - `CLIENT_URL` — your deployed frontend URL (comma-separate multiple origins if needed)
   - `NODE_ENV=production`
4. **Verify a sending domain in Resend** before going live — `onboarding@resend.dev` only delivers to the email address on your own Resend account, which is fine for testing but not for real users.
5. Redeploy. Test registration (verification email), forgot password, and Compose with an attachment to confirm Resend delivery end-to-end.

## License

MIT
