# Unalone

> **Meet People Near You, Right Now.**  
> A location-based social web application for discovering and organizing spontaneous real-world meetups.

**Live Demo:** [https://unalone-flax.vercel.app/](https://unalone-flax.vercel.app/)

---

## Overview

**Unalone** helps people connect locally for spontaneous activities—from grabbing coffee and working together at a cafe to outdoor runs, dinners, and hangouts. Powered by interactive maps and geospatial queries, users can see what is happening nearby in real time, create their own plans, and join others.

---

## Features

- **Interactive Map Exploration**: Discover nearby meetups on a dynamic Mapbox-powered map centered on your live location.
- **Spontaneous Plan Creation**: Create a plan in seconds with custom titles, descriptions, categories, participant limits, and meet times.
- **Geospatial Discovery**: High-performance proximity search powered by PostgreSQL and PostGIS to find events within your radius.
- **Join Meetups**: View open spots, check who's attending, and join plans with one click.
- **Smart Filtering**: Filter meetups by category (Coffee, Food, Sports, Study, Hangout, etc.) or time (Happening soon / Today).
- **Secure Authentication**: Token-based authentication using JSON Web Tokens (JWT) stored in secure HTTP-only cookies, password hashing with bcrypt, and Zod input validation.
- **Automatic Cleanup**: Built-in background cron job removes expired plans automatically every 10 minutes.

---

## Tech Stack

### Frontend (`/client`)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **Icons**: Lucide React
- **Routing & Networking**: React Router 7, Axios

### Backend (`/server`)
- **Runtime & Framework**: Node.js, Express 5
- **Database**: PostgreSQL with PostGIS extension
- **Auth & Security**: JWT, bcrypt, cookie-parser
- **Validation**: Zod
- **Scheduled Tasks**: node-cron

---

## Project Structure

```text
unalone/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/            # Axios API client setup
│   │   ├── components/     # UI components (MapView, PlanCard, Modals, etc.)
│   │   ├── context/        # Auth & Location context providers
│   │   ├── pages/          # Landing, Home, Explore, Login, Register pages
│   │   └── utils/          # Helpers, constants, and Mapbox config
│   └── package.json
│
├── server/                 # Backend Node.js / Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers (plans, etc.)
│   │   ├── db/             # PostgreSQL connection pool
│   │   ├── jobs/           # Scheduled background cron jobs
│   │   ├── middleware/     # Auth & token verification middleware
│   │   ├── routes/         # Express routes (auth, plans)
│   │   ├── services/       # Database & business logic
│   │   └── validators/     # Zod request validation schemas
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) database with **PostGIS** extension enabled
- [Mapbox](https://www.mapbox.com/) public access token

---

### 1. Backend Setup

1. Open a terminal and navigate to `server`:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in `server/`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
   JWT_SECRET=your_jwt_secret_key
   ```

3. Start the server:
   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

---

### 2. Frontend Setup

1. Open a new terminal and navigate to `client`:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file in `client/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_MAPBOX_TOKEN=your_mapbox_public_token
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT cookies | No |
| `POST` | `/api/auth/logout` | Log out and clear cookies | No |
| `GET` | `/api/plans/nearby` | Fetch plans within radius (`lat`, `lng`, `radius`) | Yes |
| `POST` | `/api/plans/create` | Create a new meetup plan | Yes |
| `DELETE` | `/api/plans/:id` | Delete a plan created by user | Yes |
| `POST` | `/api/plans/:id/join` | Join or participate in a plan | Yes |

---

## License

This project is licensed under the [ISC License](LICENSE).
