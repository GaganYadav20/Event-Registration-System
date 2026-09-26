# Eventora — Full-Stack AI-Powered Event Registration Platform

<div align="center">

**A production-ready MERN application for browsing, booking, and managing events — with a built-in AI chatbot powered by Google Gemini.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google)](https://ai.google.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)

</div>

---

## Overview

Eventora is a full-stack event registration system built on the **MERN** stack (MongoDB, Express, React, Node.js). It enables users to discover, filter, and securely register for events with two-factor OTP verification. Admins get a dedicated dashboard to manage events, confirm bookings, and track revenue. A context-aware **AI chatbot** (powered by **Google Gemini 2.5 Flash**) is embedded site-wide to help users discover events using natural language.

---

## ✨ Features

### 👤 Authentication & Security
- **JWT-based Authentication** — Secure login and registration; tokens expire in 30 days.
- **Bcrypt Password Hashing** — All passwords are salted and hashed before storage.
- **Email OTP — Account Verification** — A 6-digit OTP is sent on registration; users must verify before accessing the platform.
- **Email OTP — Booking Verification** — A fresh 6-digit OTP is required to authorize every booking request. OTPs expire in 5 minutes.
- **Role Hardening** — The `role` field is hardcoded server-side to `user` on registration; admin access is exclusively set at the database level.

### 🗓️ Event Management (Admin)
- Create, edit, and delete events with title, description, date, location, category, image URL, total seats, and ticket price.
- Support for **free** (price = 0) and **paid** events.
- Real-time seat tracking: available seats automatically decrement on confirmation and restore on cancellation.

### 📋 Booking System
- **OTP-Secured Booking Flow** — Users first request a booking OTP, then submit it alongside the event ID to create a booking.
- **Pending Queue** — All bookings (free and paid) enter a `pending` state for admin review, preventing overbooking.
- **Admin Confirmation** — Admin confirms bookings and marks payment status as `paid` or `not_paid`.
- **Smart Cancellation** — Cancelling a `confirmed` booking restores the seat; cancelling a `pending` booking does not.
- **Duplicate Prevention** — Users cannot place a second active booking for the same event.

### 📊 Admin Dashboard
- Live analytics: pending requests, total confirmed paid clients, and total revenue.
- Tabular view of all bookings with user info, event name, booking status, and payment status controls.
- Create and delete events directly from the dashboard.

### 🤖 AI Chatbot (Eventora AI)
- Powered by **Google Gemini 2.5 Flash** via the `@google/genai` SDK.
- Embedded globally as a floating widget available on every page.
- **Multi-turn conversation** with full history context passed on each request.
- **Two-pass Gemini pipeline** — Gemini first classifies user intent, then generates a grounded response:
  - `search_events` — Find/filter events by keyword, location, price range, or free-only.
  - `event_details` — Get detailed info about a previously shown event.
  - `follow_up` — Show more results from the previous search context.
  - `general` — Handle greetings and general queries.
- **Smart Event Search** — A 20+ category keyword map drives MongoDB regex queries across event titles, descriptions, and categories (tech, music, art, food, startup, gaming, finance, health, and more).
- **Grounded responses** — Gemini only uses live DB event data; it never fabricates event information.

### 📧 Email Notifications
- **Account Verification OTP** email on registration.
- **Booking OTP** email on every booking attempt.
- **Booking Confirmation** email when an admin confirms a booking.
- All transactional emails sent via **Nodemailer** using Gmail SMTP with App Password authentication.

### 🎨 Frontend (React + Tailwind CSS)
- Built with **React 18** and **Vite 5** for fast HMR development.
- Styled with **Tailwind CSS v3** for a utility-first responsive design.
- Polished micro-interactions throughout the UI.
- **React Router v6** for client-side routing.

---

## 🗂️ Project Structure

```
Event-Registration-System/
├── client/                         # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Global navigation bar
│   │   ├── context/                # React context (auth state, etc.)
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Event listing & search
│   │   │   ├── EventDetail.jsx     # Single event page + booking flow
│   │   │   ├── Login.jsx           # Login with OTP re-verification
│   │   │   ├── Register.jsx        # Registration + OTP verification
│   │   │   ├── UserDashboard.jsx   # User booking history & status
│   │   │   ├── AdminDashboard.jsx  # Admin analytics & booking management
│   │   │   ├── Chatbot.jsx         # AI chatbot floating widget
│   │   │   ├── PaymentSuccess.jsx  # Payment success page
│   │   │   └── PaymentFailed.jsx   # Payment failure page
│   │   ├── utils/                  # Axios instance & helper functions
│   │   ├── App.jsx                 # Root routing component
│   │   └── main.jsx                # React entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                         # Express Backend (Node.js)
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, OTP Verify
│   │   ├── bookingController.js    # Book, Confirm, Cancel, List bookings
│   │   ├── chatController.js       # AI chat pipeline (intent → search → respond)
│   │   └── eventController.js      # CRUD for events
│   ├── middleware/
│   │   └── auth.js                 # JWT protect + admin role guard
│   ├── models/
│   │   ├── User.js                 # name, email, password, role, isVerified
│   │   ├── Event.js                # title, description, date, location, category, seats, price
│   │   ├── Booking.js              # userId, eventId, status, paymentStatus, amount
│   │   ├── OTP.js                  # email, otp, action, expiry (TTL index)
│   │   └── eventKeywords.js        # Keyword-to-category mapping
│   ├── routes/
│   │   ├── auth.js                 # POST /register, /login, /verify-otp
│   │   ├── events.js               # CRUD /api/events
│   │   ├── bookings.js             # Booking endpoints
│   │   └── chatRoutes.js           # POST /api/chat
│   ├── utils/
│   │   ├── email.js                # Nodemailer OTP & booking confirmation emails
│   │   ├── geminiService.js        # Basic Gemini content generation helper
│   │   ├── eventIntent.js          # Gemini intent classifier
│   │   └── eventSearch.js          # MongoDB event search with keyword mapping
│   ├── seed.js                     # Database seeder with sample events
│   ├── server.js                   # Express app entry point
│   ├── .env.example                # Environment variable template
│   └── package.json
│
├── Eventora_Postman_Collection.json # Full Postman API collection
├── dfd.png                          # Data Flow Diagram
├── fc.png                           # Flowchart
├── package.json                     # Root scripts (concurrently)
└── README.md
```

---

## 🔌 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register a new user; sends account verification OTP |
| POST | `/login` | Public | Login; re-sends OTP if account unverified |
| POST | `/verify-otp` | Public | Verify account OTP; returns JWT token |

### Events — `/api/events`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List all events |
| GET | `/:id` | Public | Get event by ID |
| POST | `/` | Admin | Create a new event |
| PUT | `/:id` | Admin | Update an event |
| DELETE | `/:id` | Admin | Delete an event |

### Bookings — `/api/bookings`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/send-otp` | User | Send booking OTP to the user's email |
| POST | `/` | User | Submit a booking request (OTP required) |
| GET | `/my` | User/Admin | Get own bookings (admin sees all) |
| PUT | `/:id/confirm` | Admin | Confirm a booking & set payment status |
| DELETE | `/:id` | User/Admin | Cancel a booking |

### Chat — `/api/chat`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Public | Send a message to Eventora AI; returns natural language response + matched events |

---

## 🚀 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (or local MongoDB)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

### 1. Clone the Repository
```bash
git clone https://github.com/GaganYadav20/Event-Registration-System.git
cd Event-Registration-System
```

### 2. Configure Environment Variables
Navigate to `server/.env` and fill in the necessary keys:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretjwtkey_eventora
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

> **Note on `EMAIL_PASS`**: This must be a Gmail **App Password**, not your regular Google account password. Generate one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

> **Note on `GEMINI_API_KEY`**: Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Install & Run (Single Terminal — Recommended)

From the project root:
```bash
npm install           # Install root concurrently dependency
npm run install:all   # Install server + client dependencies
npm run dev           # Start both backend and frontend concurrently
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Start server (nodemon) + client (Vite) concurrently |
| `npm run start` | Start server (node) + client (vite preview) concurrently |
| `npm run build` | Build the client for production |
| `npm run setup` | Alias for `install:all` |
| `npm run dev:all` | Install all deps then start dev |
| `npm run start:all` | Install all deps then start prod |

### 4. Manual Setup (Two Terminals)

**Terminal 1 — Backend:**
```bash
cd server
npm install --legacy-peer-deps
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

### 5. Seed the Database (Optional)
Populate the database with sample events for testing:
```bash
cd server
npm run seed
```

---

## 🛠️ Tech Stack

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Express | ^4.18 | HTTP server & routing |
| Mongoose | ^8.2 | MongoDB ODM |
| jsonwebtoken | ^9.0 | JWT authentication |
| bcryptjs | ^2.4 | Password hashing |
| Nodemailer | ^6.9 | Email delivery via Gmail SMTP |
| @google/genai | ^2.24 | Google Gemini AI SDK |
| dotenv | ^16.4 | Environment variable loading |
| cors | ^2.8 | Cross-origin resource sharing |
| nodemon | ^3.1 | Dev auto-restart |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | ^18.2 | UI library |
| React Router DOM | ^6.22 | Client-side routing |
| Axios | ^1.6 | HTTP client |
| React Icons | ^5.0 | Icon library |
| Tailwind CSS | ^3.4 | Utility-first CSS framework |
| Vite | ^5.1 | Build tool & dev server |

---

## 🤖 AI Chatbot Architecture

The chatbot pipeline runs entirely on the backend and uses a **two-pass Gemini approach**:

```
User Message + Conversation History
        │
        ▼
[Pass 1] Gemini Intent Classifier  (server/utils/eventIntent.js)
        │
        ├─ search_events  ──► MongoDB keyword/location/price search  (eventSearch.js)
        ├─ event_details  ──► Reuse events array from previous history turn
        ├─ follow_up      ──► Reuse events array from previous history turn
        └─ general        ──► Empty events context (no DB call)
        │
        ▼
[Pass 2] Gemini Response Generator  (server/controllers/chatController.js)
        │
        ▼
{ response: "...", events: [...] }  ──► Client (Chatbot.jsx)
```

The frontend stores each assistant turn's `events` array in local state and sends the full history on every request, enabling context-aware follow-up questions without re-querying the database.

---

## 📬 Postman Collection

A complete Postman collection is included at [`Eventora_Postman_Collection.json`](./Eventora_Postman_Collection.json). Import it into Postman to test all API endpoints with pre-configured request bodies and headers.

---

## 📊 Diagrams

| Diagram | File |
|---------|------|
| Data Flow Diagram (DFD) | [`dfd.png`](./dfd.png) |
| Flowchart | [`fc.png`](./fc.png) |

---

## 🔒 Security Notes

- Admin roles are **never assignable via the API** — they must be set directly in MongoDB.
- OTPs are **single-use** and deleted immediately after successful verification.
- OTPs have a **5-minute expiry** enforced via a MongoDB TTL index on the OTP model.
- JWT tokens are valid for **30 days** and carry user ID and role for server-side guard validation.
- All booking mutations require a **valid JWT** and, where applicable, **admin role verification** via middleware.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
