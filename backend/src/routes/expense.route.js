const express=require('express');
const {createExpense,getExpenses,getSummary,updateExpense,deleteExpense}=require('../controllers/expense.controller');
const expenseRouter=express.Router();
const isLoggedIn=require('../middlewares/auth.middleware');
const validate=require('../middlewares/validation.middleware');
const { createExpenseSchema, updateExpenseSchema } = require('../middlewares/expense.validation');

expenseRouter.post('/add', isLoggedIn, validate(createExpenseSchema), createExpense);
expenseRouter.get('/get', isLoggedIn, getExpenses); 
expenseRouter.get('/summary', isLoggedIn, getSummary);
expenseRouter.patch('/update/:id', isLoggedIn, validate(updateExpenseSchema), updateExpense);
expenseRouter.delete('/delete/:id', isLoggedIn, deleteExpense);

module.exports = expenseRouter;