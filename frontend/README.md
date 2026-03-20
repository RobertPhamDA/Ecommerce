## Frontend (Next.js 14 + TypeScript + Tailwind)

### Requirements
- Node.js 18+ (includes npm)

If you don't have Node installed on Windows, install **Node.js LTS**.

### Setup
Copy `env.example` to `.env.local`:

```bash
copy env.example .env.local
```

Install dependencies:

```bash
npm install
```

Run dev:

```bash
npm run dev
```

App runs at `http://localhost:3000`

### Auth
- Register: `/auth/register`
- Login: `/auth/login`
- Admin pages: `/admin/*` (requires an admin JWT stored in localStorage after login)

