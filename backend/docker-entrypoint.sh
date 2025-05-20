#!/bin/sh

echo "Waiting for PostgreSQL to start..."
sleep 5

echo "Running database migrations safely..."
# This will apply any pending migrations without wiping existing data
npx prisma migrate deploy

echo "Starting application..."
npm run start:dev 