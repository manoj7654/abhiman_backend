const jwt=require("jsonwebtoken");
require("dotenv").config();

const authenticate=async(req,res,next)=>{
    const token=req.headers.authorization;
    try {
        if(token){
            const result = token.split(' ')[1];
            const decode=jwt.verify(result,process.env.secret);
            if(decode){
                // const userId=decode.userId;
                // req.userId=userId;
              req.user = decode
                next();
            }else{
                res.json({message:"Please login again"})
            }
        }else{
            res.json({message:"Please login first"})
        }
    } catch (error) {
        res.json(error.message)
    }
}

module.exports={authenticate}