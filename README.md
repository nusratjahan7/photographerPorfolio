# Photography Portfolio

A modern, dark-themed photography portfolio website built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS 4**. It showcases a photographer's work, offers paid photo downloads via Stripe checkout, handles session booking, and includes a full admin dashboard.

## Features

- **Landing page** — hero banner, stats, featured/latest work, about, and client feedback sections.
- **Gallery** — search, category filter, free/paid filter, pagination, and per-photo detail pages.
- **Paid downloads** — premium photos are locked and unlocked via a Stripe checkout session (handled by an external backend).
- **Services & Pricing** — service cards and pricing tiers (Basic / Premium / Luxury) that link to the booking form.
- **Booking form** — public contact/booking page that submits requests to the backend.
- **Authentication** — email/password auth via [Better Auth](https://better-auth.com) with MongoDB adapter; role field for users (user/admin).
- **Admin dashboard** — role-protected area to manage gallery photos, bookings, users, and view analytics.
- **Smooth scroll** — Lenis smooth scrolling; animated UI with Framer Motion and Swiper.

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Motion | Framer Motion, Lenis, Swiper |
| Icons | lucide-react, react-social-icons |
| Auth | Better Auth (email/password + admin plugin) |
| Database | MongoDB (`mongodb` driver) |
| Toasts | Sonner |

## Getting Started

### Prerequisites

- Node.js 20+ (Next.js 16 requirement)
- A MongoDB database
- An external backend API serving `/gallery`, `/users`, `/bookings`, `/analytics/overview`, and Stripe checkout endpoints

### Environment Variables

Create a `.env` file in the project root. All values are secrets — never commit them.

```
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000

NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/
AUTH_DB_NAME=your-db-name

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

> Note: `NEXT_PUBLIC_BACKEND_URL` points at the separate backend service. The frontend proxies gallery/bookings/users/analytics to it via `src/lib/core/server.js`.

### Install & Run

```bash
npm install
npm run dev       # start the dev server at http://localhost:3000
```

### Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                  # App Router pages & routes
│   ├── page.js           # Home (Banner, Stats, Featured, About, Feedback)
│   ├── auth/             # Login & register pages
│   ├── contact/          # Booking form
│   ├── dashboard/admin/  # Admin dashboard (bookings, gallery, upload, users)
│   ├── gallery/[id]/     # Photo detail pages
│   ├── payment-success/  # Post-checkout success page
│   ├── pricing/          # Pricing packages
│   ├── services/         # Services overview
│   └── api/auth/         # Better Auth route handler
├── components/           # Shared UI (Navbar, Footer, Banner, PhotoCard, ...)
│   └── gallery/          # Purchase/checkout + photo detail components
└── lib/
    ├── actions/          # Server actions for admin & bookings
    ├── api/gallery.js    # Gallery API client
    ├── core/             # serverFetch / protectedFetch / serverMutation helpers
    ├── auth.js           # Better Auth server config
    └── auth-client.js    # Better Auth client config
```

## How It Works

1. **Auth** — `src/lib/auth.js` configures Better Auth with MongoDB. The Navbar uses `authClient.useSession()` to show Login/Register buttons or a user dropdown (admins get a Dashboard link).
2. **Data fetching** — the frontend talks to an external backend through `src/lib/core/server.js` (`serverFetch` for public routes, `protectedFetch` for admin routes, `serverMutation` for writes). The user token from Better Auth is sent as a `Bearer` header.
3. **Paid photos** — gallery items have an `isPaid` flag. `PurchaseAccess.jsx` calls the backend to create a Stripe Checkout session, then redirects the buyer. Unlocked photo IDs are persisted client-side so the download button appears.
4. **Admin** — admins manage gallery photos (edit/delete), bookings (status/delete), users (role/delete), and view analytics from `src/lib/actions/admin.js`.
