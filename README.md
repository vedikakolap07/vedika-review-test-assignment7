# Online Prescription Platform (MedScript)

Minimal full‑stack app:
- **Frontend**: Vite + React + TypeScript (runs on `http://localhost:5173`)
- **Backend**: Node + Express + MongoDB (runs on `http://localhost:5000`)

## Prerequisites
- **Node.js**: 18+ recommended
- **MongoDB**: running locally on `mongodb://127.0.0.1:27017`

## 1) Start MongoDB (Windows)
If MongoDB is installed as a service:

```powershell
net start MongoDB
```

If you don’t have `mongosh`, that’s OK — the app can still run.

## 2) Start Backend (port 5000)
Open a terminal in the project and run:

```powershell
cd backend
```

Create `backend/.env` (you can copy from `backend/.env.example`) and ensure:

```env
MONGO_URI=mongodb://127.0.0.1:27017/prescription
JWT_SECRET=your_jwt_secret
PORT=5000
```

Install + start:

```powershell
npm.cmd install
npm.cmd start
```

Health check:
- `http://localhost:5000/api/health`

## 3) Start Frontend (port 5173)
From the project root:

```powershell
npm.cmd install
npm.cmd run dev
```

Open:
- `http://localhost:5173`

## Main URLs (Frontend)
- Home: `/`
- Patient:
  - Sign up: `/patient/signup`
  - Sign in: `/patient/signin`
  - Dashboard (doctor list + consult): `/patient/dashboard`
  - My prescriptions: `/patient/prescriptions`
- Doctor:
  - Sign up: `/doctor/signup`
  - Sign in: `/doctor/signin`
  - Profile: `/doctor/profile`
  - Consultations + prescriptions: `/doctor/prescriptions`

## Basic Flow to Test
1. Create a **doctor** account.
2. Create a **patient** account.
3. Patient dashboard → **Consult** a doctor → complete the 3‑step form → submit.
4. Log in as the same doctor → open **Consultations** → write prescription → download PDF → send to patient.
5. Patient → **My Prescriptions** page shows prescriptions after doctor sends them.

## Common Issues
### “npm.ps1 cannot be loaded… running scripts is disabled”
Use `npm.cmd` instead of `npm`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Backend error: `SyntaxError: Unexpected token '.'` (mongoose)
Your terminal is using an old Node version. Check:

```powershell
node -v
where node
```

Use Node 18+ and reinstall backend dependencies (`node_modules`) if needed.

# MediCare - Online Prescription Platform

## Project Overview
MediCare is a comprehensive web-based platform connecting patients with healthcare professionals for online consultations and digital prescriptions.

## Features
- **Patient Features**  
  - User registration and authentication  
  - Browse available doctors  
  - Book consultations  
  - View prescriptions  
  - Manage profile  

- **Doctor Features**  
  - Professional registration  
  - Manage consultations  
  - Issue prescriptions  
  - Update profile  
  - View patient consultations

## Tech Stack
- **Frontend**: React, TypeScript, React Router, Vite  
- **Styling**: CSS with CSS Variables for consistency  
- **Architecture**: Component-based with context API for state management  
- **Responsive Design**: Mobile-first approach

## Project Structure
- **styles/**  
  - Global CSS with variables and utilities  
- **components/**  
  - Reusable UI components  
  - **Navigation/**  
    - Header, Footer, Navigation  
  - **Patient/**  
    - Patient pages and components  
  - **Doctor/**  
    - Doctor pages and components  
- **context/**  
  - React Context for authentication

## CSS Architecture
The project uses a scalable CSS architecture:
- **variables.css**: Theme colors, spacing, typography  
- **globals.css**: Global resets and base styles  
- **components.css**: Component base styles  
- **layout.css**: Layout and utility classes  
- **responsive.css**: Media queries and responsive utilities

## Getting Started
1. Install dependencies: `npm install`  
2. Start development server: `npm run dev`  
3. Build for production: `npm run build`

## Navigation System
- **Header**: Persistent navigation with role-based menu  
- **Mobile Support**: Hamburger menu on mobile devices  
- **Active States**: Current page highlighted  
- **Protected Routes**: Authentication checks for secure pages

## Styling Guidelines
- No inline classNames in component JSX  
- Use CSS variables for all colors and spacing  
- Apply styles in CSS files, not components  
- Mobile-first responsive approach  
- Accessibility-first HTML structure