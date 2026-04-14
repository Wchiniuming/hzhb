This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Backend API server running (see `apps/api/README.md`)

## Getting Started

1. **Install dependencies:**
```bash
cd apps/web
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env if needed (default API URL is http://localhost:3001)
```

3. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

The database is managed by the API server (Prisma + SQLite). To initialize or reset the database:

```bash
cd apps/api
# Push schema to database
npx prisma db push --force-reset

# Run seed script to create initial data
npx ts-node prisma/seed.ts
```

**Default login credentials:** `admin` / `admin123`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Check out our [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
