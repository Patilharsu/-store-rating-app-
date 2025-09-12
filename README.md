# Store Rating App (Express + Prisma + React)

Implements the **FullStack Intern Coding Challenge - V1.1**.

## Stack
- **Backend:** Express.js, Prisma ORM
- **Database:** PostgreSQL (switchable to MySQL =LAPTOP-A0RRH8QK\SQLEXPRESS`)
- **Frontend:** React (Vite), Axios, React Router

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL running locally ( `store_rating`)

### 1) Backend
```bash
cd server
 
# edit .env with your DB credentials + JWT_SECRET
npm i
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### 2) Frontend
```bash
cd ../client
npm i
npm run dev
# open http://localhost:5173
```

### Demo Accounts (after seeding)
- Admin: `admin@example.com` / `Admin@123`
- Owner: `owner@example.com` / `Owner@123`
- User: `user@example.com` / `User@1234`

## Features
- Roles: Admin, User, Owner
- Signup/login, change password (API)
- Admin: stats, list users/stores with filtering
- User: browse/search stores, submit or update rating (1–5)
- Owner: see own store ratings, average rating

 
```

