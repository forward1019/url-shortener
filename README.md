# URL Shortener Application

A full-stack URL shortener application built with Next.js, NestJS, and Supabase, designed with scalability in mind.

## Technology Stack

- **Frontend**: TypeScript, Next.js, shadcn UI components with Tailwind CSS
- **Backend**: TypeScript, NestJS, Node.js
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Deployment**: Vercel (Frontend and Backend as serverless functions)

## Core Features

- Generate shortened URLs from long ones using nanoid for unique slug generation
- Redirect from short URLs to original destinations
- List all shortened URLs
- Track visit counts (implemented/planned)

## Architecture & Scalability Considerations

1. **Stateless Backend**: NestJS application designed without session state, enabling horizontal scaling across multiple instances.

2. **Database Selection**: Supabase (PostgreSQL) chosen for:
   - Reliability and ACID compliance
   - Managed service with automatic scaling
   - Strong support for complex queries and data integrity

3. **Slug Generation Strategy**: 
   - Using nanoid for short, unique identifiers (6-8 alphanumeric characters)
   - Implemented with collision detection and retry mechanism
   - Optimized for distributed environments

4. **Error Handling & Logging**:
   - Centralized error handling with NestJS exception filters
   - Structured JSON logging (via Pino) directed to stdout/stderr
   - Designed for easy diagnosis in distributed environments

5. **Caching Strategy**:
   - In-memory caching for redirection endpoints (implemented/planned)
   - Discussion of Redis as future enhancement for distributed caching

6. **API Design**:
   - RESTful principles with clear endpoint structure
   - DTOs with class-validator for input validation
   - Consistent JSON response format

## API Endpoints

- `POST /api/shorten`: Create shortened URL
- `GET /api/r/{shortSlug}`: Redirect to original URL
- `GET /api/urls`: List all shortened URLs

## Setup & Deployment

### Local Development

```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables (see below)

# Set up database
cd backend
npx prisma generate
npx prisma migrate dev

# Run development server
frontend: npm run dev
backend: npm run start:dev
```

Required environment variables:
- Backend (.env): DATABASE_URL, APP_DOMAIN
- Frontend (.env.local): NEXT_PUBLIC_API_URL

### Vercel Deployment

1. **Frontend**:
   - Import GitHub repository
   - Set root directory to `frontend`
   - Configure NEXT_PUBLIC_API_URL env variable

2. **Backend**:
   - Import same repository
   - Set root directory to `backend`
   - Configure DATABASE_URL and APP_DOMAIN env variables
   - Ensure serverless function configuration in vercel.json

## Future Enhancements

- **Distributed Caching**: Redis implementation for improved read performance
- **Rate Limiting**: Using @nestjs/throttler to prevent API abuse
- **Enhanced Analytics**: More detailed statistics for URL visits
- **Custom Slugs**: Allow users to define their own short URLs
- **Authentication**: User accounts for URL management 