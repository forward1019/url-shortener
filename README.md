# URL Shortener Application

A full-stack URL shortener application built with Next.js, NestJS, and Supabase, designed with scalability in mind.

![URL Shortener Homepage](assets/images/homepage-screenshot.png)

## Technology Stack

- **Frontend**: TypeScript, Next.js, shadcn UI components with Tailwind CSS
- **Backend**: TypeScript, NestJS, Node.js
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Deployment**: Vercel (Frontend) and Render (Backend)

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

### Docker Setup

```bash
# Clone the repository
git clone <repository-url>
cd url-shortener

# Build and start the containers
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
# - PostgreSQL: localhost:5432

# To stop the containers
docker-compose down
```

This Docker setup includes:
- PostgreSQL database
- NestJS backend
- Next.js frontend 

The Docker configuration automatically creates the PostgreSQL database and connects all services together. You don't need Supabase credentials when running with Docker as it uses the local PostgreSQL instance instead.

To rebuild containers after making changes:
```bash
docker-compose up -d --build
```

#### Troubleshooting Docker Setup

If you encounter issues:

- **View logs**: `docker-compose logs -f` (all services) or `docker-compose logs -f frontend` (specific service)
- **Container status**: `docker-compose ps`
- **Restart a service**: `docker-compose restart frontend`
- **Access container shell**: `docker exec -it url-shortener-frontend sh`

Common issues:
- Frontend dependency issues can be resolved by rebuilding with the latest dependencies: `docker-compose up -d --build frontend`
- Database connection issues usually indicate that the PostgreSQL container hasn't fully started before the backend attempts to connect. Try `docker-compose restart backend` after PostgreSQL is healthy.

Required environment variables:
- Backend: 
  - `DATABASE_URL`: PostgreSQL connection string for Supabase
  - `APP_DOMAIN`: Domain for your frontend application (e.g., https://your-app.com)
  - `PORT`: (Optional) Port for the backend server (defaults to 3001)
  - `API_PREFIX`: (Optional) Prefix for API routes (defaults to 'api')
  - `NODE_ENV`: Environment ('development', 'production', or 'test')
  - `SUPABASE_URL`: Supabase project URL
  - `SUPABASE_ANON_KEY`: Supabase anonymous API key

- Frontend:
  - `NEXT_PUBLIC_API_URL`: URL of your backend API
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous API key

### Deployment

#### Frontend (Vercel)
1. Import GitHub repository in Vercel
2. Set root directory to `frontend`
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend

#### Backend (Render)
1. Import GitHub repository in Render
2. Create a new Web Service (not serverless function)
3. Configure the service:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:prod`
4. Set environment variables:
   - `DATABASE_URL`: Supabase connection string with connection pooling
   - `APP_DOMAIN`: Your frontend domain
   - `PORT`: 10000 (automatically set by Render)
   - `NODE_ENV`: production

## Future Enhancements

- **Distributed Caching**: Redis implementation for improved read performance
- **Rate Limiting**: Using @nestjs/throttler to prevent API abuse
- **Enhanced Analytics**: More detailed statistics for URL visits
- **Custom Slugs**: Allow users to define their own short URLs