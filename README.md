# 💰 Expense Tracker (MERN Stack)

A secure and user-friendly full-stack application designed to help users track daily expenses and manage monthly budgets effectively.

---

## 🚀 Key Features

- **🔐 Secure Authentication**: JWT-based authentication using **HttpOnly Cookies** (Protection against XSS attacks).
- **🛡️ Protected Routes**: React logic that verifies login state with the backend via the `check-auth` endpoint.
- **📉 Budget Management**: Users can set and dynamically update their monthly budget.
- **💸 Expense CRUD**: Full Create, Read, Update, and Delete operations for expenses with category tags.
- **⚡ Advanced Queries**: Supports searching by title, filtering by category, and sorting by date.
- **✅ Robust Validation**: Backend data integrity ensured using Joi and custom validation middlewares.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: Bcrypt (Password Hashing), JWT (Auth), Cookie-parser.

---

## 📁 API Endpoints

### 👤 User & Auth
- `POST /api/users/register` - Register a new user.
- `POST /api/users/login` - Authenticate user and set secure cookie.
- `GET /api/users/check-auth` - Verify login status (Protected).
- `GET /api/users/logout` - Logout and clear authentication cookie.
- `PATCH /api/users/update-budget` - Update user's monthly budget (Protected).

### 💸 Expenses (All Protected)
- `POST /api/expenses/add` - Create a new expense.
- `GET /api/expenses/get` - Fetch all expenses (Supports `search`, `category`, `sortBy`).
- `GET /api/expenses/summary` - View budget vs. spending summary.
- `PATCH /api/expenses/update/:id` - Update a specific expense record.
- `DELETE /api/expenses/delete/:id` - Remove an expense record.

---

## ⚙️ Setup & Installation

1. **Clone the project** and run `npm install` in both `frontend` and `backend` folders.
2. **Create a `.env` file** in the `backend` folder with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   SECRET_KEY=your_jwt_secret
   NODE_ENV=development