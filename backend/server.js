require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/db');
const expenseRouter = require('./src/routes/expense.route');
const userRouter = require('./src/routes/user.route');    
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"https://expense-tracker-mern-jade.vercel.app" || "http://localhost:5173", 
    credentials: true 
}));

dbConnect();



// Routes
app.use('/api/expenses', expenseRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});