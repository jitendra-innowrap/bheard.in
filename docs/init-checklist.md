# BHEARD Init Checklist (Blogs, Careers, Admin)

Use this after pulling the latest code, or when setting up a fresh environment.

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

1. Copy `.env.example` to `.env`.
2. Fill these values:
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`

Notes:
- `DATABASE_URL` must point to a reachable MySQL database.
- Use strong credentials for admin and session secret.

## 3) Generate Prisma client

```bash
npm run prisma:generate
```

## 4) Apply database migrations

For local/dev:

```bash
npm run prisma:migrate
```

For production deploys, prefer:

```bash
npx prisma migrate deploy
```

## 5) Seed initial content (blogs + careers)

```bash
npm run prisma:seed
```

## 6) Start app

Development:

```bash
npm run dev
```

Production smoke test:

```bash
npm run build
npm run start
```

## 7) Verify key routes

Public:
- `/blog`
- `/blog/[slug]` (open any seeded post slug)
- `/careers`
- `/careers/[slug]` (open any seeded role slug)

Admin:
- `/admin/login`
- `/admin`
- `/admin/blog`
- `/admin/careers`

## 8) Admin authentication check

1. Login at `/admin/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
2. Confirm protected pages load.
3. Logout and verify protected routes redirect back to `/admin/login`.

## 9) CRUD sanity checks

Blog:
- Create post
- Edit post
- Publish/unpublish post

Careers:
- Create role
- Edit role
- Toggle active status

## 10) Deployment checklist (cPanel/PM2)

- Set all env vars in hosting panel (do not commit `.env`).
- Run `npm ci` (or `npm install`) on server.
- Run `npx prisma migrate deploy`.
- Run `npm run prisma:generate`.
- Optional first-time data: `npm run prisma:seed`.
- Build app: `npm run build`.
- Restart process manager (PM2) with updated env.

