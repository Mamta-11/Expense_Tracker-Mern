const jwt=require('jsonwebtoken');

const isLoggedIn=(req,res,next)=>{
    try {
        const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Unauthorized"  
        })
    }
    const decoded=jwt.verify(token,process.env.SECRET_KEY);
    req.user=decoded; 
    next();
    } catch (error) {
        res.status(401).json({
            message:"Invalid token"
        })
    }

}
module.exports=isLoggedIn;