# Expense Tracker API

A secure REST API for managing personal expenses and monthly budgets, built with **Node.js, Express, and MongoDB**.

##  Key Features
- **Secure Auth:** JWT-based authentication using **HttpOnly Cookies** (XSS Protection).
- **Expense CRUD:** Full Create, Read, Update, and Delete operations.
- **Data Protection:** Users can only access, edit, or delete their own data.
- **Advanced Queries:** Search by title, filter by category, and sort by date.
- **Budget Tracking:** Real-time summary of total expenses vs. monthly budget.
- **Validation:** Robust input validation using **Joi**.

##  Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Security:** Bcrypt (Hashing), JWT (Auth)
- **Validation:** Joi

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login (Sets Cookie)
- `GET /api/users/logout` - Logout user

### Expenses (Protected)
- `POST /api/expenses/add` - Create an expense
- `GET /api/expenses/get` - Fetch expenses (Supports `search`, `category`, `sortBy`)
- `GET /api/expenses/summary` - Get budget vs. spending summary
- `PATCH /api/expenses/update/:id` - Update an expense
- `DELETE /api/expenses/delete/:id` - Delete an expense

## Setup
1. Run `npm install`
2. Create `.env` file with `PORT`, `MONGO_URI`, and `SECRET_KEY`.
3. Run `npm start`