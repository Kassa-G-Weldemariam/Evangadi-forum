# Evangadi Forum

Evangadi Forum is a full-stack question-and-answer application. Users can
register, sign in, ask questions, view question details, and post answers.

## Technology

- Frontend: React, Vite, React Router, JavaScript
- Backend: Node.js, Express, JWT authentication
- Database: MySQL
- API client: Fetch through the Vite `/api` proxy

## Project structure

```text
Evangadi-backend/    Express API and MySQL connection
Evangadi-frontend/   React application
```

## Requirements

- Node.js 20 or newer
- npm
- MySQL Server

## Database setup

The reproducible schema is in
[`Evangadi-backend/db/schema.sql`](Evangadi-backend/db/schema.sql).
It creates the `evangadi_forum` database and the `users`, `questions`, and
`answer` tables.

Apply it with the MySQL client:

```bash
mysql -u <mysql_user> -p < Evangadi-backend/db/schema.sql
```

Do not commit local credentials or secrets.

## Backend setup

Install dependencies:

```bash
cd Evangadi-backend
npm install
```

Create `Evangadi-backend/.env` from `.env.example` and provide local values:

```env
DB_USER=your_mysql_username
DATABASE=evangadi_forum
PASSWORD=your_mysql_password
JWT_SECRET=replace_with_a_long_random_secret
```

Start the API:

```bash
node app.js
```

The backend runs on `http://localhost:3000`.

## Frontend setup

Install dependencies:

```bash
cd Evangadi-frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend uses `/api` requests, which Vite proxies to
`http://localhost:3000`.

Additional commands:

```bash
npm run lint
npm run build
```

## Application routes

- `/login` - sign in
- `/register` - create an account
- `/` - authenticated question list
- `/ask` - create a question
- `/questions/:questionid` - view a question and its answers

Question, answer, and list endpoints require authentication in the current
backend implementation.

## Authentication

Successful login stores the JWT in browser local storage. The frontend
restores the session through `/api/users/check`, protects application routes,
and clears the token on logout or invalid authentication.

## API endpoints

### Users

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/check`

### Questions and answers

- `GET /api/questions`
- `POST /api/questions`
- `GET /api/questions/:questionid`
- `POST /api/questions/:questionid/answers`
