# Unalone

A location-based social platform that helps people discover, create, and join activities happening nearby. Unalone enables users to organize real-world meetups, explore events on an interactive map, and connect with people who share similar interests.

**Live Demo:** https://unalone-flax.vercel.app/

---

## Overview

Finding people to participate in activities can often be difficult, especially when you're new to an area or your friends are unavailable. Unalone aims to solve this by allowing users to create public plans that nearby users can discover and request to join.

The platform combines geospatial search, interactive maps, and secure authentication to provide a seamless experience for discovering local activities.

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* HTTP-only cookie authentication
* Protected routes
* Persistent user sessions
* Secure logout

---

### Explore Nearby Plans

* Interactive Mapbox map
* Radius-based nearby search
* Distance calculation using PostGIS
* Filter plans by:

  * All
  * Today
  * Soon
* Responsive sidebar and mobile bottom sheet
* View detailed information about each plan

---

### Create Plans

Users can create plans by providing:

* Title
* Description
* Category
* Date & Time
* Maximum participants
* Location selected directly on the map

Every plan stores geographic coordinates and becomes discoverable to nearby users.

---

### Join Plans

* Request to join a plan
* Prevent users from joining their own plans
* Authentication required
* Request status management

---

### Delete Plans

* Only authenticated users can delete plans
* Server-side ownership verification
* Delete option visible only to the plan creator
* Automatic UI updates after deletion

---

### Geospatial Search

Powered by PostgreSQL + PostGIS.

Features include:

* Radius-based plan discovery
* Geographic distance calculations
* Location indexing
* Efficient nearby search queries

---

### Responsive Design

Optimized for both desktop and mobile devices.

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router
* Mapbox GL JS

### Backend

* Node.js
* Express.js
* JWT Authentication
* REST APIs

### Database

* PostgreSQL
* PostGIS

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```text
Unalone/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── db/
│   └── package.json
│
└── README.md
```

---

## Database

The application currently uses PostgreSQL with PostGIS and includes entities such as:

* Users
* Plans
* Refresh Tokens
* Join Requests

---

## Security

* JWT authentication
* HTTP-only cookies
* Protected API endpointsx
* Server-side authorization
* Ownership verification before deleting plans
* Input validation

---

<!--## Screenshots

### Login

*Add screenshot here*

---

### Explore Plans

*Add screenshot here*

---

### Plan Details

*Add screenshot here*

---

### Create Plan

*Add screenshot here*

---

### Interactive Map

*Add screenshot here*

----->

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Omkar-56/unalone.git
cd unalone
```

---

### Install dependencies

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd server
npm install
```

---

### Environment Variables

#### Client

```env
VITE_API_URL=
VITE_MAPBOX_TOKEN=
```

#### Server

```env
DATABASE_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLIENT_URL=
```

---

### Run the application

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

---

## Future Improvements

The following features are planned for future releases:

* Real-time notifications
* WebSocket integration
* Automatic deletion of expired plans
* Real-time participant updates
* In-app chat
* Push notifications
* User profiles
* Activity history
* Search by interests and categories

---

## Learning Outcomes

This project provided hands-on experience with:

* Full-stack application development
* JWT authentication
* REST API design
* PostgreSQL and PostGIS
* Geospatial database queries
* Interactive maps using Mapbox
* Responsive UI development
* Secure route protection
* Deployment using Vercel and Render

---

## License

This project is licensed under the MIT License.

---

## Author

**Omkar Pansare**

GitHub: https://github.com/Omkar-56

LinkedIn: https://www.linkedin.com/in/omkar-pansare-3b8a91292/

portfolio: https://omkar-pansare.vercel.app/
