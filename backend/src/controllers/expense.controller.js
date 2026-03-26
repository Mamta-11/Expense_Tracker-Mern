const expenseModel=require('../models/expense.model');
const userModel=require('../models/user.model');

const createExpense=async(req,res)=>{
    try {
        const {title,amount,category,description,date}=req.body;
        const userId=req.user.id;
        const expense=new expenseModel({
            title,
            amount,
            category,
            description,        
            date,
            user:userId 
        })
        await expense.save();
        res.status(201).json({
            message:"Expense created successfully",
            expense
        })      

    } catch (error) {
        res.status(500).json({  
            message:"Server error", 
            error: error.message
        })
    }
}
const getExpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category, search, sortBy } = req.query;
        let query = { user: userId };
        if (category) {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        let result = expenseModel.find(query).populate('user', 'username email').sort(sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 });

        const expenses = await result;
        res.status(200).json({
            count: expenses.length,
            expenses
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching expenses", error: error.message });
    }
};

const getSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        
        if (!user) return res.status(404).json({ message: "User not found" });

        const expenses = await expenseModel.find({ user: userId });
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const budget = user.monthlyBudget || 0; 
        const balance = budget - totalExpenses;
        const status = balance < 0 ? "Over Budget" : "Within Budget";

        res.status(200).json({
            message: "Summary fetched successfully",
            totalExpenses,
            remainingBalance: balance,
            status,
            monthlyBudget: budget 
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateExpense = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    try {
        const expense = await expenseModel.findOneAndUpdate(
            { _id: id, user: userId }, 
            { $set: updateData },
            { new: true } 
        );
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }   
        res.status(200).json({
            message: "Expense updated successfully",
            expense
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;


        const expense = await expenseModel.findOneAndDelete({ _id: id, user: userId });

        if (!expense) {
            return res.status(404).json({
                message: "Expense nahi mila ya aap ise delete nahi kar sakte"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            deletedExpense: expense 
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports={createExpense, getExpenses, getSummary, updateExpense, deleteExpense};