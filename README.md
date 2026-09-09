# 🛡️ EV CYBER ACADEMY — 2-Day FREE Cyber Security Webinar & Lead Gen System

A full-stack, high-conversion landing page and administrative lead management system built for **EV CYBER ACADEMY**.

---

## 📐 Project Architecture

This application consists of two main components:
1. **Frontend (Client)**: Built with **Vite**, **React 19**, **Tailwind CSS**, and **Lucide Icons**.
2. **Backend (Server)**: Built with **Node.js**, **Express.js**, and an **SQLite** database (`server/db/database.sqlite`).

In production, the Express server handles API requests (`/api/*`) and serves the pre-compiled static React production build (`dist/`).

---

## 🚀 Deployment Options

You can deploy this project using either **Render** (Recommended for single-server deployment with SQLite) or a **Split Setup (Vercel + Render)**.

---

### Option 1: Fullstack Deployment on Render (Recommended ⭐️)

Deploying everything on Render as a single **Web Service** is the simplest approach because Express serves both the API endpoints and the static frontend build.

#### Step-by-Step Render Setup:

1. **Push your code to GitHub / GitLab / Bitbucket**.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your repository.
4. Configure the Web Service settings:
   - **Name**: `ev-cyber-academy` (or your preferred name)
   - **Region**: Choose the region closest to your audience (e.g., Singapore / Frankfurt / Oregon).
   - **Branch**: `main` (or `master`)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
5. **Environment Variables** (Add under *Advanced* or *Environment* settings):
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or leave empty; Render automatically assigns a `PORT`)
   - `JWT_SECRET` = `your_strong_random_jwt_secret_key_here`
   - `CORS_ORIGINS` = `https://your-render-app-name.onrender.com` (Add your live Render domain)
6. Click **Create Web Service**.

> 💡 **Note on SQLite Database on Render**: Render free-tier web services have an ephemeral filesystem (data resets when the server restarts or deploys). For persistent registrations across redeployments:
> - Attach a **Render Persistent Disk** mounted at `./server/db` in Render paid plans, **OR**
> - The database will automatically initialize and seed tables on boot.

---

### Option 2: Split Deployment (Vercel Frontend + Render Backend)

If you prefer to host the client frontend on **Vercel** for fast edge CDN delivery and the Express server on **Render**:

#### Part A: Deploy Backend on Render

1. Create a **Web Service** on Render following Option 1, but set **Start Command** to `node server/index.js`.
2. Set Environment Variables:
   - `CORS_ORIGINS` = `https://your-vercel-app.vercel.app` (your Vercel frontend URL).
3. Copy your deployed Render backend URL (e.g. `https://ev-cyber-backend.onrender.com`).

#### Part B: Deploy Frontend on Vercel

1. Create or ensure `vercel.json` is present in the root directory:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-name.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   *(Replace `https://your-backend-name.onrender.com` with your actual Render backend URL)*.

2. Log into [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Project Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

---

### Option 3: Deploying Frontend Only on Vercel (Static / Serverless)

If you deploy only the Vite single-page application (SPA) on Vercel without custom rewrites:
- Add a custom environment variable in Vercel: `VITE_API_URL=https://your-render-backend.onrender.com`
- Configure CORS in your Render backend settings (`CORS_ORIGINS=https://your-app.vercel.app`).

---

## 🔑 Environment Variables Reference

Create a `.env` file in the root directory (for local testing):

```env
# Server Port
PORT=5000

# Secret Key for JWT Authentication
JWT_SECRET=super_secret_ev_academy_jwt_key_2026

# Allowed CORS Origins (comma-separated for multiple domains)
CORS_ORIGINS=http://localhost:5173,https://ev-cyber-academy.onrender.com
```

---

## 🛠️ Local Development Guide

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation & Run

1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd ev-cyber-academy
   npm install
   ```

2. Start the development environment (Runs Express Server & Vite concurrently):
   ```bash
   npm run dev
   ```

3. Access application:
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000/api`
   - **Admin Dashboard**: `http://localhost:5173/admin/login`

### Default Admin Credentials
- **Username**: `vimalthehacker`
- **Password**: `adminsshvimal-2008`

---

## 📜 Available NPM Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Runs Express server and Vite development server concurrently |
| `npm start` | Launches Express server in production mode |
| `npm run build` | Compiles Vite frontend production assets into `dist/` |
| `npm run preview` | Previews the compiled static `dist/` build locally |

---

## 🔒 Security Features Implemented

- **Helmet Security Headers**: Protection against XSS, clickjacking, and mime-sniffing.
- **Express Rate Limiter**: Rate-limiting on public API endpoints to block brute-force abuse.
- **CORS Protection**: Restricted origin validation via environment configuration.
- **JWT Session Security**: Secure token authentication for administrative routes.
