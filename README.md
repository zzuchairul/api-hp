# Project Setup (Quick & Simple)
## Prerequisites

- Docker + Docker Compose
- Node.js (for setup & migrations)

### 1. Install Dependencies
```bash
  npm install
```

### 2. Environment Setup
Create .env file based on .env.example.
```
  cp .env.example .env
```
Customize if needed

### 3. Start Containers
```bash
  docker compose up -d
```
Wait all containers ready

### 4. Run Migrations
```bash
  npm run migration:run
```

### Access

- API: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Stop
```bash
  docker compose down
```