const userModel=require('../models/user.model')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const registerUser=async(req,res)=>{
  try {
      const {username,email,password}=req.body;
   const existingUser=await userModel.findOne({email:email});
   if(existingUser){
    return res.status(400).json({
        message:"User already exists"
    })
   }
    const hashedPassword=await bcrypt.hash(password,10);
   const user=new userModel({
    username,
    email,
    password:hashedPassword
   })
   await user.save();
    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
}

const loginUser=async(req,res)=>{
  try {
      const {email,password}=req.body;
    const user=await userModel.findOne({email:email});
    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }
     const jwt_token=jwt.sign(
        {id:user._id, email:user.email},
        process.env.SECRET_KEY,
        {expiresIn:'1h'}
    )
    
  res.cookie('token', jwt_token, {
    httpOnly: true,
    secure: true, 
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000 
});
    res.status(200).json({
        message:'User Login Successfully',
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }
    })
  } catch (error) {
    res.status(500).json({ err: error.message });
  } 
}

const checkAuth=async(req,res)=>{
    res.status(200).json({ 
        authenticated: true, 
        user: req.user 
    });
}
const logoutUser=(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({
        message:"User logged out successfully"
    })
}


const updateBudget = async (req, res) => {
    try {
        const { budget } = req.body;
        const userId = req.user.id; 

        if (budget === undefined || isNaN(budget)) {
            return res.status(400).json({ message: "Valid budget is required" });
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { monthlyBudget: Number(budget) },
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Budget updated successfully",
            monthlyBudget: user.monthlyBudget
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    checkAuth,
    logoutUser,
    updateBudget
};

