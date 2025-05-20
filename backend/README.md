# URL Shortener Backend

A stateless, scalable backend service built with NestJS and PostgreSQL for URL shortening.

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: NestJS
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Logging**: Pino (structured JSON logging)
- **Security**: Helmet

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **Modules**: Feature-based modules (Links)
- **Controllers**: API endpoints
- **Services**: Business logic
- **DTOs**: Data Transfer Objects for request/response validation
- **Entities**: Domain models
- **Database**: Prisma ORM with PostgreSQL

## Scalability Considerations

This backend is designed with scalability in mind:

1. **Stateless Design**: The backend is completely stateless, allowing for horizontal scaling.
2. **Database Choice**: Supabase (PostgreSQL) is used as a reliable, scalable data store.
3. **Slug Generation Strategy**: Uses nanoid for generating unique, collision-resistant slugs.
4. **Structured Logging**: JSON-based logging for better diagnostics in distributed environments.
5. **Visit Count Tracking**: Atomic updates to the visit count to prevent race conditions.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/shorten | Create a shortened URL |
| GET | /api/r/:shortSlug | Redirect to the original URL |
| GET | /api/urls | Get all shortened URLs |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (or any PostgreSQL database)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create an `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
APP_DOMAIN="http://localhost:3000"
PORT=3001
API_PREFIX="api"
NODE_ENV="development"
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Create database tables:

```bash
npx prisma migrate dev --name init
```

### Running the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Deployment to Vercel

1. Set up environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
   - `APP_DOMAIN`: Your frontend domain (e.g., https://your-app.vercel.app)
   - `NODE_ENV`: Set to "production"

2. Deploy the backend to Vercel:

```bash
vercel --prod
```

## Future Enhancements

- **Caching**: Redis-based distributed caching for improved read performance
- **Rate Limiting**: Prevent abuse of the API
- **Analytics**: Enhanced tracking of URL visits with more metadata
