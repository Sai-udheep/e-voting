## VoteSecure – E‑Voting Frontend

Modern e‑voting dashboard built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui**.  
It provides role‑based interfaces for **voters**, **candidates**, and **admin** users using mock data (no real backend).

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI & Styling**: Tailwind CSS, shadcn/ui, Radix UI, lucide-react icons
- **Routing**: react-router-dom (SPA with protected routes)
- **State / Data**:
  - React Context for auth (`AuthContext`) and elections (`ElectionContext`)
  - Mock data for users, elections, candidates (`mockData.ts`)
- **Utils**: @tanstack/react-query (ready for server integration), zod, react-hook-form, date-fns, sonner toasts

---

## Project Structure (Relevant Parts)

- `frontend/`
  - `src/main.tsx` – React entry point
  - `src/App.tsx` – App shell, routes, providers
  - `src/pages/`
    - `Landing.tsx` – Marketing/landing page + test credentials
    - `Login.tsx`, `Register.tsx`, `NotFound.tsx`
    - `voter/` – voter dashboard, cast vote, view results, nomination
    - `candidate/` – candidate dashboard, cast vote, view results
    - `admin/` – admin dashboard, manage elections, candidates, voters, results
  - `src/contexts/AuthContext.tsx` – auth state, mock login/register, localStorage
  - `src/contexts/ElectionContext.tsx` – election list + selected election, localStorage
  - `src/lib/mockData.ts` – mock users, elections, candidates, pending voters
  - `src/components/` – layout components (`DashboardLayout`, `Navbar`, `Sidebar`) and reusable shadcn/ui components under `ui/`

---

## Getting Started

### 1. Prerequisites

- **Node.js** ≥ 18
- **npm** (or another Node package manager like pnpm/yarn, if you prefer)

### 2. Install Dependencies

From the project root, install frontend dependencies:

```bash
cd frontend
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`). Open it in your browser.

---

## Usage Overview

### Roles

The app supports three roles:

- **Voter** – cast votes and view results
- **Candidate** – manage candidacy and view election results
- **Admin** – manage elections, candidates, and voter validations

Routes for each role are **protected** using `ProtectedRoute` in `App.tsx`.  
If a user is not logged in, they are redirected to `/login`. If their role does not match the allowed role for a route, they are redirected to the dashboard for their own role.

### Test Credentials

For quick testing, use the credentials shown on the landing page (`Landing.tsx`), backed by `MOCK_USERS`:

- **Voter**
  - Phone: `9876543210`
  - Password: `voter123`
- **Candidate**
  - Phone: `9876543211`
  - Password: `candidate123`
- **Admin**
  - Phone: `9876543212`
  - Password: `admin123`

After login, you will be redirected to:

- `/voter` for voter
- `/candidate` for candidate
- `/admin` for admin

---

## Data & State Management

- **Auth**
  - Implemented in `src/contexts/AuthContext.tsx`
  - Logs in using `MOCK_USERS` and stores the current user (without password) in `localStorage` as `currentUser`
  - Exposes `login`, `logout`, and `register` (mock) functions

- **Elections**
  - Implemented in `src/contexts/ElectionContext.tsx`
  - Loads `MOCK_ELECTIONS` into state
  - Stores selected election ID in `localStorage` as `selectedElectionId`

- **Mock Data**
  - Defined in `src/lib/mockData.ts`:
    - `MOCK_USERS`, `MOCK_ELECTIONS`, `MOCK_CANDIDATES`, `PENDING_VOTERS`
  - Useful for demoing flows without a backend

---

## Styling & Components

- **Tailwind CSS**:
  - Global styles: `src/index.css`, `src/App.css`
  - Config: `tailwind.config.ts`, `postcss.config.js`
- **shadcn/ui & Radix**:
  - Shared UI primitives live under `src/components/ui/` (buttons, cards, dialogs, tables, etc.)
  - Layout components (`DashboardLayout`, `Navbar`, `Sidebar`) live under `src/components/layout/`

You can reuse these components to build additional pages or extend role dashboards.

---

## Development Scripts

From within `frontend/`:

- **`npm run dev`** – Start Vite dev server
- **`npm run build`** – Production build
- **`npm run build:dev`** – Development mode build
- **`npm run preview`** – Preview the production build
- **`npm run lint`** – Run ESLint

---

## Extending the Project

This project is currently **frontend-only** with mock data. To turn it into a full e‑voting system, you can:

- Connect to a real backend (REST or GraphQL) and replace `mockData.ts` with API calls (React Query is already installed).
- Implement proper authentication/authorization (JWT, OAuth, or custom auth).
- Add real-time updates for live results (WebSockets, SSE).
- Integrate stronger security and audit logging around voting actions.


