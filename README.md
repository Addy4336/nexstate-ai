# HOPO Homes CMS - Turborepo Monorepo

Turborepo monorepo containing HOPO Homes CMS (Next.js) and frontend (Vite React).

## 📁 Project Structure

```
hopohomes_cms/
├── hopohomes-cms/        # Next.js CMS (Backend + Admin) - Port 3001
├── hopohomes-frontend/   # Vite React (User Frontend) - Port 3000
├── package.json          # Root workspace config
└── turbo.json           # Turborepo configuration
```

## 🚀 Quick Start

### Install Dependencies

```bash
bun install
```

### Run Both Apps

```bash
bun run dev
```

- **CMS**: http://localhost:3001
- **Frontend**: http://localhost:3000

### Run Individual Apps

**CMS:**
```bash
cd hopohomes-cms && bun run dev
```

**Frontend:**
```bash
cd hopohomes-frontend && bun run dev
```

## 🏗️ Build

```bash
# Build all
bun run build

# Build individual
cd hopohomes-cms && bun run build
cd hopohomes-frontend && bun run build
```

## 🔧 Tech Stack

### CMS (hopohomes-cms)
- Next.js 16 + App Router
- Supabase (PostgreSQL)
- Better Auth
- Tailwind CSS + shadcn/ui
- Zoho Creator & Google Drive integrations

### Frontend (hopohomes-frontend)
- Vite + React 18
- React Router
- React Query
- Tailwind CSS + shadcn/ui

## 📝 Environment Variables

Create `.env.local` in `hopohomes-cms/`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3001
```

## 🚢 Deployment

- **CMS**: Deploy to Vercel (point to `hopohomes-cms/`)
- **Frontend**: Deploy to Vercel/Netlify (point to `hopohomes-frontend/`)

## 📄 License

Proprietary - HOPO Homes
