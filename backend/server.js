require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/db');
const expenseRouter = require('./src/routes/expense.route');
const userRouter = require('./src/routes/user.route');    
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true 
}));

dbConnect();
app.use(express.json());


// Routes
app.use('/api/expenses', expenseRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});