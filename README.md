# Sprint UI

A modern Next.js application with PocketBase backend, designed for containerized deployment.

## Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS
- **Backend**: PocketBase (database and filesystem layer)
- **Deployment**: Docker and Docker Compose

## Getting Started

### Using Docker (Recommended)

1. Start the application stack:
```bash
docker-compose up --build
```

This will start:
- Next.js app at http://localhost:3000
- PocketBase at http://localhost:8090

2. Access PocketBase admin UI at http://localhost:8090/_/

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start PocketBase (download from https://pocketbase.io/docs/):
```bash
./pocketbase serve
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Project Structure

```
sprint-ui/
├── app/              # Next.js app directory
├── lib/              # Shared utilities (PocketBase client, etc.)
├── public/           # Static assets
├── pb_data/          # PocketBase data (gitignored)
├── pb_migrations/    # PocketBase migrations
└── docker-compose.yml
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PocketBase Documentation](https://pocketbase.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
