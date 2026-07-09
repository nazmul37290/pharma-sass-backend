# Pharma SaaS API

Express.js API with TypeScript, Prisma (PostgreSQL), Zod validation, ESLint, and Prettier.

## Tech Stack

- **Runtime:** Node.js + Express 5
- **Language:** TypeScript
- **ORM:** Prisma 7 + PostgreSQL
- **Validation:** Zod
- **Linting:** ESLint + Prettier

## Project Structure

```
src/
├── config/          # Environment & app configuration
├── lib/             # Shared libraries (Prisma client)
├── common/          # Shared middleware, errors, utilities
│   ├── errors/
│   └── middleware/
├── modules/         # Feature modules (controller, service, routes, schema)
│   ├── health/
│   └── users/
├── routes/          # Route aggregator
├── app.ts           # Express app setup
└── server.ts        # Entry point
prisma/
└── schema.prisma    # Database schema
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and update your PostgreSQL connection string:

```bash
cp .env.example .env
```

### 3. Set up the database

```bash
npm run db:generate
npm run db:migrate
```

### 4. Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

| Method | Path            | Description        |
|--------|-----------------|--------------------|
| GET    | `/api/health`   | Health check       |
| GET    | `/api/users`    | List all users     |
| GET    | `/api/users/:id`| Get user by ID     |
| POST   | `/api/users`    | Create a new user  |

### Example: Create user

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe"}'
```

## Scripts

| Script            | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start dev server with hot reload |
| `npm run build`   | Compile TypeScript to `dist/`  |
| `npm start`       | Run production build           |
| `npm run lint`    | Run ESLint                     |
| `npm run format`  | Format code with Prettier      |
| `npm run db:generate` | Generate Prisma client     |
| `npm run db:migrate`  | Run database migrations    |
| `npm run db:studio`   | Open Prisma Studio         |

## Adding a New Module

1. Create a folder under `src/modules/<feature>/`
2. Add `*.schema.ts` (Zod), `*.service.ts`, `*.controller.ts`, `*.routes.ts`
3. Register the router in `src/routes/index.ts`
