# ReleaseCheck – Release Checklist Tool

ReleaseCheck is a full-stack web application for managing software releases through a simple release checklist.

It allows users to create releases, track checklist progress, update release information, and delete releases.

## Features

- Create a new release
- Set release name and due date
- Add optional additional information
- View all releases
- Track 7 fixed release checklist steps
- Check/uncheck checklist steps
- Automatically calculate release status:
  - `planned` – no steps completed
  - `ongoing` – one or more steps completed
  - `done` – all steps completed
- Update additional release information
- Delete releases
- GraphQL API
- PostgreSQL database
- Responsive React SPA
- Docker support
- Automated tests with Vitest

## Tech Stack

### Frontend
- React
- Vite
- Apollo Client
- GraphQL
- CSS

### Backend
- Node.js
- Express
- Apollo Server
- GraphQL
- Prisma ORM
- PostgreSQL

### Testing
- Vitest

### Deployment / Infrastructure
- Neon PostgreSQL
- Docker
- Docker Compose

## Project Structure

```text
Release Check/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── constants/
│   │   ├── graphql/
│   │   ├── generated/
│   │   ├── prisma.js
│   │   └── server.js
│   ├── test/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md