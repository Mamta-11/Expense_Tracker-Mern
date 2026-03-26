require('dotenv').config();
const express=require('express');
const dbConnect=require('./config/db');
const expenseRouter=require('./src/routes/expense.route');
const userRouter=require('./src/routes/user.route');    
const cookieParser=require('cookie-parser');
const cors=require('cors');
const app=express();
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}));
dbConnect();
app.use(express.json());
app.use(cookieParser());
app.use('/api/expenses',expenseRouter);
app.use('/api/users',userRouter);
app.listen(5000,()=>{
    console.log("server running on port 5000");
})
