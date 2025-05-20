# URL Shortener Application

A full-stack URL shortener application that allows users to create short, memorable links for any URL.

## Features

- Create shortened URLs
- View a list of all shortened URLs
- Redirect from short URLs to original URLs
- Track visit counts for each shortened URL

## Technology Stack

### Frontend

- **Language**: TypeScript
- **Framework**: Next.js (React)
- **Styling**: shadcn UI components with Tailwind CSS
- **State Management**: React Hooks

### Backend

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: NestJS
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Logging**: Pino (structured JSON logging)
- **Security**: Helmet, CORS, input validation

## Project Structure

```
url-shortener/
├── frontend/              # Next.js frontend application
│   ├── src/               
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # UI components
│   │   ├── lib/           # Utility functions
│   │   └── config/        # Configuration files
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── backend/               # NestJS backend application
│   ├── src/               
│   │   ├── common/        # Common utilities and modules
│   │   ├── modules/       # Feature modules
│   │   ├── app.module.ts  # Root application module
│   │   └── main.ts        # Application entry point
│   ├── prisma/            # Prisma schema and migrations
│   └── package.json       # Backend dependencies
│
└── package.json           # Root package.json for running both services
```

## Database Models

The database models are defined in the Prisma schema file at `backend/prisma/schema.prisma`. The schema defines the following model:

```prisma
model Link {
  id          Int      @id @default(autoincrement())
  originalUrl String
  shortSlug   String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  visitCount  Int      @default(0)
}
```

## Scalability Considerations

This application is designed with scalability in mind:

1. **Stateless Backend**: The NestJS backend is completely stateless, allowing for horizontal scaling.
2. **Database Choice**: Supabase (PostgreSQL) is used as a reliable, scalable data store.
3. **Slug Generation Strategy**: Uses nanoid for generating unique, collision-resistant slugs.
4. **Visit Count Tracking**: Atomic updates to the visit count to prevent race conditions.
5. **Structured Logging**: JSON-based logging for better diagnostics in distributed environments.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (or any PostgreSQL database)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. Install dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. Set up environment variables

Create a `.env` file in the backend directory:

```
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
APP_DOMAIN="http://localhost:3000"
PORT=3001
API_PREFIX="api"
NODE_ENV="development"
```

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Set up the database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### Running the Application

#### Option 1: Node.js

From the root directory:

```bash
# Development mode
npm run dev

# Or individually
npm run dev:frontend
npm run dev:backend
```

The frontend will be available at http://localhost:3000
The backend will be available at http://localhost:3001

#### Option 2: Docker (Recommended for Development)

This project includes Docker configuration for a consistent development environment.

1. Install Docker and Docker Compose on your machine.

2. Run the application using Docker Compose:

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- NestJS backend on port 3001
- Next.js frontend on port 3000

The Docker setup automatically:
- Creates the PostgreSQL database
- Runs Prisma migrations to set up database tables
- Starts the backend and frontend services
- Enables hot reloading for development

If you need to rebuild the containers:

```bash
docker-compose up --build
```

To stop the containers:

```bash
docker-compose down
```

To stop the containers and remove volumes (will delete database data):

```bash
docker-compose down -v
```

## Deployment to Vercel

### Frontend Deployment

1. Push your code to a GitHub repository
2. Create a new project in Vercel and import the repository
3. Set the root directory to `frontend`
4. Add the environment variable `NEXT_PUBLIC_API_URL` to point to your deployed backend

### Backend Deployment

1. Create a new project in Vercel and import the same repository
2. Set the root directory to `backend`
3. Set the following environment variables:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
   - `APP_DOMAIN`: Your frontend domain (e.g., https://your-app.vercel.app)
   - `NODE_ENV`: Set to "production"

## Future Enhancements

- Redis-based caching for improved read performance
- Rate limiting to prevent API abuse
- Enhanced analytics for URL visits
- Custom slug creation
- User authentication for personalized URL management 