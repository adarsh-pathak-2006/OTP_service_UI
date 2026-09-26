<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

# 🎨 OTP Service — Frontend

> **A sleek, dark-themed dashboard for the OTP-as-a-Service API.**  
> Manage projects, view OTP delivery history, and test the public API — all from a premium, responsive interface.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Register, login, auto-refresh tokens, and secure session management |
| 📂 **Project Dashboard** | Create projects, copy reference IDs, search & filter, paginated listing |
| 📜 **OTP History** | View every OTP sent per project — responsive table + mobile card layout |
| ⚡ **API Playground** | Test OTP delivery in real-time — no auth required, just a reference ID |
| 🌙 **Dark Glassmorphism UI** | Premium dark theme with glowing accents, smooth animations, and blur effects |
| 📱 **Fully Responsive** | Looks great on desktop, tablet, and mobile — with hamburger nav on small screens |
| 🔔 **Toast Notifications** | Animated success/error/info toasts for every action |

---

## 🖼️ Pages

```
/                   →  Landing page with hero, features, code preview
/login              →  Sign in with username + password
/register           →  Create a new account
/dashboard          →  View & manage your projects (JWT protected)
/dashboard/[id]     →  OTP history for a specific project (JWT protected)
/playground         →  Public OTP testing tool — no login required
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Vanilla CSS (CSS Modules) |
| **Icons** | Lucide React |
| **Auth** | JWT (access + refresh tokens via localStorage) |
| **API Client** | Custom fetch wrapper with auto token refresh |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend running on `http://127.0.0.1:8000` (see [backend README](../otp/README.md))

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different URL:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 3. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout (providers, navbar, bg)
│   │   ├── page.tsx                # Landing page
│   │   ├── page.module.css
│   │   ├── globals.css             # Design system & tokens
│   │   ├── login/
│   │   │   ├── page.tsx            # Login form
│   │   │   └── login.module.css
│   │   ├── register/
│   │   │   └── page.tsx            # Registration form
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Project list + create modal
│   │   │   ├── dashboard.module.css
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # OTP history table
│   │   │       └── history.module.css
│   │   └── playground/
│   │       ├── page.tsx            # Public OTP tester
│   │       └── playground.module.css
│   ├── components/
│   │   ├── Navbar.tsx              # Responsive navbar
│   │   └── Navbar.module.css
│   ├── context/
│   │   ├── AuthContext.tsx          # JWT auth state provider
│   │   └── ToastContext.tsx         # Toast notification system
│   └── lib/
│       └── api.ts                  # API client + types + token management
├── .env.example                    # Environment template
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🎨 Design System

The UI is built on a custom design system defined in `globals.css` with:

- **CSS Custom Properties** for all colors, spacing, radii, shadows, and transitions
- **Glassmorphism** cards with `backdrop-filter: blur()` and subtle borders
- **Gradient accents** from indigo → purple (`#6366f1` → `#a855f7`)
- **JetBrains Mono** for code, **Inter** for UI text
- **Stagger animations** for list items, scale/fade transitions for modals
- **Responsive breakpoints** at 768px (mobile nav) and 640px (single-column grids)

---

## 🔌 API Integration

The frontend communicates with the Django backend through a centralized API client (`src/lib/api.ts`):

- **Auto token refresh** — if a request returns 401, the client silently refreshes the access token using the refresh token and retries
- **Type-safe** — all API responses are typed with TypeScript interfaces
- **Error handling** — `ApiError` class with status code and structured error data

### Endpoints Used

| Frontend Page | API Endpoint | Method |
|---|---|---|
| Login | `/authentication/token/` | POST |
| Register | `/authentication/register/` | POST |
| Dashboard | `/core/projects/` | GET, POST |
| OTP History | `/core/projects/<id>/` | GET |
| Playground | `/getotp/<ref_id>/` | POST |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>Built with Next.js, React & TypeScript — by Adarsh Pathak</b>
</p>
