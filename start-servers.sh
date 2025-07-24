#!/bin/bash

echo "Starting Directus server..."
cd mashti-directus && npm run dev &
DIRECTUS_PID=$!

echo "Waiting for Directus to start..."
sleep 10

echo "Starting Next.js server..."
npm run dev &
NEXT_PID=$!

echo "Both servers are starting..."
echo "Directus PID: $DIRECTUS_PID"
echo "Next.js PID: $NEXT_PID"
echo ""
echo "Directus: http://localhost:8055"
echo "Next.js: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $DIRECTUS_PID $NEXT_PID 