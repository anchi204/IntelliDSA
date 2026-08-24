# IntelliDSA

IntelliDSA is a full-stack AI-powered DSA tracking and revision platform designed to help users organize coding problems, track their progress, manage revisions, and get personalized study insights.

## Live Demo

https://intelli-dsa-weld.vercel.app/

## GitHub Repository

https://github.com/anchi204/IntelliDSA

## Overview

IntelliDSA provides a centralized platform for managing DSA preparation. Users can add problems from different coding platforms, organize them by topic and difficulty, mark problems as solved or favorite, schedule revisions, and monitor their overall progress.

The application also includes AI-powered features that provide personalized study insights and help users decide what to focus on during their preparation.

## Features

- User authentication with signup and login
- JWT-based session authentication
- Problem management with CRUD operations
- Add, edit, and delete DSA problems
- Track problem platform, topic, and difficulty
- Mark problems as solved or favorite
- Revision scheduling and revision tracking
- Search and filtering of problems
- Analytics for tracking DSA progress
- Personalized dashboard
- Recent activity tracking
- Daily revision tracking
- Goal tracking
- AI-powered study insights
- AI mentor functionality
- AI-based problem hints
- User profile management
- Application settings
- PostgreSQL database with Prisma ORM
- Responsive user interface

## AI Features

### AI Insights

The application analyzes the user's DSA activity and generates personalized insights based on factors such as:

- Problems solved
- Problem topics
- Revision history
- Problems due for revision
- Areas where the user may need more practice

### AI Mentor

The AI mentor provides personalized guidance based on the user's current preparation and problem-solving activity.

### AI Hints

Users can get hints for DSA problems without immediately revealing the complete solution.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### Backend

- Next.js App Router
- Next.js API Routes
- TypeScript
- Prisma ORM

### Database

- PostgreSQL
- Neon PostgreSQL for production

### Authentication

- JWT-based authentication
- HTTP-only cookies
- Protected API routes

### AI

- OpenAI API

### Deployment

- Vercel
- Neon PostgreSQL

## Application Architecture

The application follows a full-stack Next.js architecture.

```text
Browser
   |
   v
Next.js UI
   |
   v
Next.js API Routes
   |
   v
Authentication / Business Logic
   |
   v
Prisma ORM
   |
   v
PostgreSQL
```

AI-related requests follow:

```text
User
   |
   v
Next.js UI
   |
   v
AI API Route
   |
   v
OpenAI API
   |
   v
AI Response
   |
   v
User Interface
```

## Main Pages

### Dashboard

The dashboard provides a quick overview of the user's current DSA preparation.

It focuses on:

- Problems that need revision today
- Topics that require revision
- Daily and overall goal progress
- Recent activity
- AI-generated insights
- AI mentor access

### Problems

The Problems page is the main problem-management interface.

Users can:

- Add problems
- Edit problems
- Delete problems
- Search problems
- Filter by topic and difficulty
- Mark problems as solved
- Mark problems as favorites
- Track revision information

### Analytics

The Analytics page provides a deeper view of the user's DSA progress, including problem-solving trends, topic-wise progress, and other preparation statistics.

### Profile

The Profile page contains user information and profile-related details.

### Settings

The Settings page contains application and account-related settings.

### AI

The AI section provides access to AI-powered study assistance, including:

- AI Mentor
- AI Insights
- Problem Hints

## Database

The application uses PostgreSQL as its primary database.

Prisma ORM is used to interact with PostgreSQL from the Next.js backend.

The problem data includes information such as:

- Problem title
- Platform
- Difficulty
- Topic
- Solved status
- Favorite status
- Revision date
- Revision count
- Maximum revisions
- Solved timestamp
- Notes
- Problem link
- Creation and update timestamps

User authentication and user-specific problem data are also stored in PostgreSQL.

## API

The application uses Next.js API routes for backend functionality.

Main API areas include:

- Authentication
- User management
- Problem CRUD operations
- AI insights
- AI mentor
- AI revision assistance

API routes validate authentication before allowing access to user-specific data.

## Authentication Flow

The application uses JWT-based authentication.

```text
User
   |
   v
Signup / Login
   |
   v
Authentication API
   |
   v
JWT Session
   |
   v
HTTP-only Cookie
   |
   v
Protected Pages / API Routes
```

Each protected request verifies the logged-in user before accessing their data.

## Database Architecture

Each user has their own set of DSA problems.

```text
User
 |
 | 1
 |
 | N
 v
Problem
```

This ensures that users can only access and modify their own problems.

## Project Structure

```text
IntelliDSA/
│
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── problems/
│   │   ├── analytics/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── ai/
│   │
│   ├── api/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── problems/
│   │   └── user/
│   │
│   ├── login/
│   ├── signup/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   ├── problems/
│   └── ui/
│
├── lib/
│   ├── auth.ts
│   └── prisma.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── types/
│   └── problem.ts
│
├── proxy.ts
├── package.json
└── README.md
```

## Local Development

Clone the repository:

```bash
git clone https://github.com/anchi204/IntelliDSA.git
cd IntelliDSA
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables.

Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Production

The application is deployed using Vercel.

The production PostgreSQL database is hosted on Neon.

Updates pushed to the main branch automatically trigger a new Vercel deployment.

## Environment Variables

The application requires the following environment variables:

```env
DATABASE_URL=
AUTH_SECRET=
OPENAI_API_KEY=
```

## Deployment

The application is deployed on Vercel and uses Neon PostgreSQL for the production database.

Live application:

https://intelli-dsa-weld.vercel.app/