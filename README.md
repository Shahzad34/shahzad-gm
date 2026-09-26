# Shahzad GM — Developer Portfolio (MERN)

A premium, mobile-first, dark "hacker/cyberpunk" developer portfolio built on the MERN stack.

```
portfolio/
├── frontend/   React + Vite + React Router + Anime.js + GSAP
└── backend/    Node + Express + MongoDB + Mongoose
```

## Design

- **Palette**: near-black backgrounds (`#05070D` / `#080B12` / `#0D111C`), gold accents
  (`#FFD700` / `#D4AF37`), off-white text, muted slate for secondary copy, a small cyan
  accent for terminal/hacker moments.
- **Type**: Space Grotesk (display), JetBrains Mono (terminal/code/data), Inter (body).
- **Motion**: Anime.js drives entrances, the terminal typing effect, and the mobile menu
  stagger; scroll reveals use `IntersectionObserver` so nothing animates off-screen.
  Everything respects `prefers-reduced-motion`.

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env      # then set MONGO_URI to your MongoDB connection string
npm install
npm run seed              # load the existing projects + skills into MongoDB
npm run dev                # starts on http://localhost:5000
```

Requires a MongoDB instance — either local (`mongodb://127.0.0.1:27017/shahzad-portfolio`)
or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

#### Admin credentials

There is exactly **one** admin account — no signup, no user collection.
Set all three values in `backend/.env` (never commit them):

```env
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=generate-a-long-random-password
ADMIN_JWT_SECRET=generate-a-long-random-string
```

Generate both secrets locally with:

```bash
node -e "const c=require('crypto');console.log('ADMIN_PASSWORD='+c.randomBytes(18).toString('base64url'));console.log('ADMIN_JWT_SECRET='+c.randomBytes(48).toString('hex'))"
```

`POST /api/admin/login` checks that email + password pair and returns a JWT signed
with `ADMIN_JWT_SECRET` (12h expiry). Every admin call then sends it back as
`Authorization: Bearer <token>`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL defaults to http://localhost:5000/api
npm install
npm run dev                 # starts on http://localhost:5173
```

The Projects and Skills sections call `GET /api/projects` and `GET /api/skills` and
fall back to curated sample data (`frontend/src/data/*.js`) if the API isn't
reachable yet, so the frontend looks complete even before the backend or database
is connected.

## Admin panel

`/admin` is a small dashboard for managing the content that the public site reads
from MongoDB. Sign in at **`/admin/login`**, then use the sidebar:

| Page                | What it does                                                      |
|---------------------|-------------------------------------------------------------------|
| `/admin`            | Overview — live counts and the latest contact message             |
| `/admin/messages`   | List, filter, mark read/unread, reply to, and delete submissions   |
| `/admin/projects`   | Add, edit and delete projects                                      |
| `/admin/skills`     | Add, edit and delete skills, grouped by category, with an icon picker |

The token is kept in `localStorage` and attached to every request by the axios
interceptor in `frontend/src/lib/api.js`. If it is missing, expired or rejected,
the interceptor clears it and the layout redirects you back to `/admin/login`.

The panel deliberately skips the public site's decorative chrome (boot splash,
custom cursor, CRT overlay, navbar, footer) — it's a plain dashboard — but it is
built entirely from the same tokens as the rest of the site: the same `:root`
CSS variables, the same display/mono/body fonts, and the same `.glass`, `.btn`,
`.btn-primary`, `.btn-ghost`, `.section-title` and `.eyebrow` utility classes.

### Seeding content

The projects and skills that used to live as hardcoded frontend arrays are seeded
into MongoDB so the database is the real source of truth:

```bash
cd backend
npm run seed                # inserts only into empty collections (safe default)
npm run seed -- --reset     # wipe projects + skills, then reinsert
```

Contact messages are never touched by the seed. The source data lives in
`backend/config/seedData.js`; the frontend keeps its static copies as an offline
fallback, so mirror any edit into both.

## API reference

| Method | Route                   | Auth  | Description                        |
|--------|-------------------------|-------|------------------------------------|
| GET    | `/api/health`           | —     | Health check                       |
| POST   | `/api/contact`          | —     | Submit the contact form (rate-limited) |
| GET    | `/api/contact`          | Admin | List submitted messages           |
| PATCH  | `/api/contact/:id/read` | Admin | Mark a message read/unread        |
| DELETE | `/api/contact/:id`      | Admin | Delete a message                   |
| GET    | `/api/projects`         | —     | List all projects                  |
| GET    | `/api/projects/:id`     | —     | Get one project                    |
| POST   | `/api/projects`         | Admin | Create a project                   |
| PUT    | `/api/projects/:id`     | Admin | Update a project                   |
| DELETE | `/api/projects/:id`     | Admin | Delete a project                   |
| GET    | `/api/skills`           | —     | List all skills                    |
| GET    | `/api/skills/:id`       | —     | Get one skill                      |
| POST   | `/api/skills`           | Admin | Create a skill                     |
| PUT    | `/api/skills/:id`       | Admin | Update a skill                     |
| DELETE | `/api/skills/:id`       | Admin | Delete a skill                     |
| POST   | `/api/admin/login`      | —     | Exchange admin email + password for a JWT |

`GET /api/contact` used to be public; it is admin-only now, since those records
hold visitors' email addresses.

## Customizing content

- **Projects / Skills (database)**: manage them from the admin panel
- **Projects / Skills (offline fallback)**: `frontend/src/data/projects.js`, `frontend/src/data/skills.js`
- **Seed data**: `backend/config/seedData.js`
- **Skill icons**: `frontend/src/lib/skills.js` (the lucide-react set both the
  public section and the admin icon picker render)
- **Journey / Services**: `frontend/src/data/journey.js`
- **Social links / email**: `Contact.jsx`, `Footer.jsx`, `MobileMenu.jsx`
- **Colors / type / spacing tokens**: `frontend/src/index.css` (`:root` variables)

## Production build

```bash
cd frontend
npm run build      # outputs frontend/dist
```

## Deploying to production

Target shape: **Vercel** serves the React SPA, **Render** serves the Express API,
**MongoDB Atlas** holds the data. The SPA talks to the API directly over HTTPS, so
CORS on the backend must list the exact Vercel origin.

```
browser ──▶ vercel (static SPA) ──HTTPS──▶ render (Express /api) ──SRV──▶ atlas (M0)
```

### 1. MongoDB Atlas

1. Create a **FREE/M0** cluster (any region near you).
2. **Database Access** → *Add New Database User*: username + a long random password
   (Atlas generates one — copy it now, it is shown only once).
3. **Network Access** → *Add IP Address*:
   - your current IP (used by `npm run seed` from this machine), and
   - `0.0.0.0/0` — Render's outbound IPs are dynamic and rotate on every deploy, so
     an IP allow-list alone cannot work. This is standard for M0 + Render; it means the
     **database username/password is the only gate**, so make it strong.
4. **Data API / Connect** → *Drivers* → copy the string and append the database name:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/shahzad-portfolio?retryWrites=true&w=majority`

The `/shahzad-portfolio` path matters — without it the seed writes to a database
named `test`.

### 2. Render (API)

**New + → Web Service → connect the repo.** Then:

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Environment variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | the Atlas SRV string above |
| `CLIENT_URL` | `http://localhost:5173` for now — update in step 4 |
| `ADMIN_JWT_SECRET` | long random string |
| `ADMIN_EMAIL` | your login email |
| `ADMIN_PASSWORD` | long random password |

`PORT` is provided by Render automatically, and the server already reads it
(`process.env.PORT`). Never set `PORT=5000` there — it will fail to bind.

Free instances sleep after 15 minutes without traffic; the first request then takes
~30–60 s while cold-starts run. That is normal, not a bug.

### 3. Vercel (frontend)

**Add New → Project → connect the repo**, set **Root Directory** to `frontend`. The
committed `frontend/vercel.json` already supplies framework `vite`, build command
`npm run build`, output `dist`, and the SPA rewrite that keeps `/admin/login`
refreshes from 404ing.

Add one **Environment Variable**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://<your-service>.onrender.com/api` |

`VITE_*` values are inlined **at build time**, so changing one requires a redeploy —
editing it and refreshing the page does nothing.

### 4. Close the CORS loop

Copy the live Vercel URL (e.g. `https://shahzad-portfolio.vercel.app`) back into
Render as `CLIENT_URL`, then **Manual Deploy → Clear build cache & deploy**.
`CLIENT_URL` accepts a comma-separated list while you migrate domains.

### 5. Seed the production database

From this machine, with the Atlas SRV string in hand:

```bash
cd backend
set MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/shahzad-portfolio?retryWrites=true&w=majority
npm run seed
```

The seed only inserts into empty collections, so it is safe to re-run; add
`-- --reset` to wipe and reinsert projects + skills. Contact messages are never touched.

### Post-deploy checklist

- [ ] `https://<render>/api/health` returns `{"success":true}`
- [ ] `https://<vercel>` renders, and **refreshing `/admin/login` does not 404**
- [ ] Logging in at `/admin/login` reaches the dashboard (no console CORS error)
- [ ] Submitting the contact form stores a message visible under `/admin/messages`
- [ ] `GET /api/contact` without a token returns **401**

### Troubleshooting

| Symptom | Cause |
|---------|-------|
| `CORS policy` error in the browser console | `CLIENT_URL` on Render is not the exact Vercel origin (scheme + host, no trailing slash) |
| `MongoNetworkError` / connection timeout | This machine's IP is not in the Atlas allow-list |
| `429 Too many requests` on the first try | Rate limiter (10 per 15 min per IP) — see the `trust proxy` note in `server.js`; if *everyone* gets 429, `trust proxy` is not set |
| Public site looks fine but admin panel fails | Projects/Skills silently fall back to `frontend/src/data/*.js` when the API is unreachable — a wrong `VITE_API_URL` is invisible on the public site |
| 404 on `/admin/*` refresh | Missing SPA rewrite (`vercel.json` / `_redirects`) |
