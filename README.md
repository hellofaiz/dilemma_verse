# DilemmaVerse (MindAbs) — Moral Dilemmas Manager

A full-stack MERN application (using PostgreSQL & Prisma instead of MongoDB) designed to ingest, manage, and explore moral dilemmas.

It features an elegant, responsive UI built with Vite + React, connected to a robust Express backend. The application supports seamless bulk imports directly from Excel (`.xlsx`/`.csv`) files.

---

## 🛠 Prerequisites
Before running the application, ensure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/en/)** (v16+)
- **[PostgreSQL](https://www.postgresql.org/)** (Running locally or hosted)

---

## 🚀 Setup & Run Instructions

This project is separated into two directories: `client` (Frontend) and `server` (Backend). You'll need to run both concurrently.

### 1. Database Setup & Backend Initialization
Open a terminal and navigate to the server directory:

```bash
cd server
npm install
```

**Set up Environment Variables:**
Inside the `server` folder, there is an `.env.example` file. 
Create a new file named `.env` and configure your local Postgres instance:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/mindabs_db"
```
*(Replace `<USERNAME>` and `<PASSWORD>` with your actual Postgres credentials).*

**Initialize Prisma and Start the Server:**
Run the following commands to create the database tables, generate the Prisma client, and start the API:

```bash
npx prisma db push
npx prisma generate
npm start
```
The backend API should now be running successfully at `http://localhost:5000`.

---

### 2. Frontend Setup
Open a second terminal window or tab and navigate to the client directory:

```bash
cd client
npm install
```

**Set up Environment Variables:**
Create a `.env` file in the `client` directory to point the React app to your backend API:

```env
VITE_API_BASE_URL=http://localhost:5000/situation
```

**Start the Development Server:**
```bash
npm run dev
```
The React frontend will start up (usually at `http://localhost:5173` or `5174`). Open that link in your browser to view the application!

---

